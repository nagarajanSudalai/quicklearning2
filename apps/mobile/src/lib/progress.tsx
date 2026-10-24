import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { mergeProgress, type Grade, type TestSubject } from '@quickstep/content';
import { supabase, type Child } from './supabase';

const KEY = 'quickstep/progress/v1';
const ACTIVE = 'quickstep/active-child';
const childKey = (id: string) => `${KEY}/child/${id}`;

export type Progress = {
  grade: Grade | null;
  stars: number;
  /** Puzzle ids answered correctly at least once. */
  solved: Record<string, true>;
  sound: boolean;
  streak: number;
  /** Local date (YYYY-MM-DD) of the last correct answer, for the daily streak. */
  lastPlayed: string | null;
  /** Practice test reports, newest first. */
  tests: TestRecord[];
};

export type TestRecord = { id: string; grade: Grade; subject: TestSubject; date: string; right: number; total: number; seconds: number; byTopic: { topic: string; right: number; total: number }[]; weak: string[] };

const EMPTY: Progress = { grade: null, stars: 0, solved: {}, sound: true, streak: 0, lastPlayed: null, tests: [] };

/** Parent account state. `enabled` is false when no Supabase project is configured. */
export type Account = {
  enabled: boolean;
  email: string | null;
  children: Child[];
  /** The child whose progress is on screen; null means "this device" (no account profile). */
  active: Child | null;
  syncing: boolean;
  sendCode: (email: string) => Promise<string | null>;
  verifyCode: (email: string, code: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<string | null>;
  addChild: (name: string, grade: Grade) => Promise<string | null>;
  selectChild: (child: Child | null) => Promise<void>;
};

type Ctx = Progress & {
  ready: boolean;
  setGrade: (g: Grade) => void;
  setSound: (on: boolean) => void;
  /** Record a correct answer; a star is earned only on the first try. */
  recordSolved: (puzzleId: string, firstTry: boolean) => void;
  reset: () => void;
  /** Save a practice test report (keeps the latest 30). */
  recordTest: (r: TestRecord) => void;
  account: Account;
};

const ProgressContext = createContext<Ctx | null>(null);

const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const yesterday = () => today(new Date(Date.now() - 86_400_000));
const load = async (key: string): Promise<Progress | null> => {
  try { const raw = await AsyncStorage.getItem(key); return raw ? { ...EMPTY, ...JSON.parse(raw) } : null; } catch { return null; }
};
/** What goes to the account: everything except device settings. */
const synced = ({ stars, solved, streak, lastPlayed, tests }: Progress) => ({ stars, solved, streak, lastPlayed, tests });
const message = (e: unknown) => (e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) : 'Something went wrong. Please try again.');

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [kids, setKids] = useState<Child[]>([]);
  const [active, setActive] = useState<Child | null>(null);
  const [syncing, setSyncing] = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storageKey = active ? childKey(active.id) : KEY;

  // Pull the child's saved progress, merge it with what this device has, and show it.
  const openChild = useCallback(async (child: Child | null, base?: Progress) => {
    if (!child) {
      setActive(null);
      setState((await load(KEY)) ?? EMPTY);
      await AsyncStorage.setItem(ACTIVE, '').catch(() => {});
      return;
    }
    setSyncing(true);
    let p = mergeProgress((await load(childKey(child.id))) ?? { ...EMPTY, sound: base?.sound ?? true }, base ? synced(base) : null);
    if (supabase) {
      const { data } = await supabase.from('progress').select('data').eq('child_id', child.id).maybeSingle();
      p = mergeProgress(p, data?.data as Partial<Progress> | undefined);
    }
    setActive(child);
    setState({ ...p, grade: child.grade as Grade });
    await AsyncStorage.setItem(ACTIVE, child.id).catch(() => {});
    setSyncing(false);
  }, []);

  const refreshChildren = useCallback(async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('children').select('id, name, grade').order('created_at');
    setKids(data ?? []);
    return (data ?? []) as Child[];
  }, []);

  useEffect(() => {
    (async () => {
      const device = await load(KEY);
      const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
      setSession(data.session);
      const activeId = data.session ? await AsyncStorage.getItem(ACTIVE).catch(() => null) : null;
      if (activeId) {
        // Show the cached copy at once; the account copy is merged in the background.
        const cached = await load(childKey(activeId));
        if (cached) setState(cached);
        setReady(true);
        const list = await refreshChildren();
        const child = list.find((c) => c.id === activeId);
        await openChild(child ?? null);
      } else {
        if (device) setState(device);
        setReady(true);
        if (data.session) refreshChildren();
      }
    })().catch(() => setReady(true));
    const sub = supabase?.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub?.data.subscription.unsubscribe();
  }, [openChild, refreshChildren]);

  // Save locally on every change; push to the account a moment later.
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(storageKey, JSON.stringify(state)).catch(() => {});
    if (!supabase || !session || !active) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    const childId = active.id;
    pushTimer.current = setTimeout(() => {
      supabase!.from('progress').upsert({ child_id: childId, data: synced(state), updated_at: new Date().toISOString() }).then(() => {});
    }, 1500);
  }, [state, ready, storageKey, session, active]);

  const recordSolved = useCallback((puzzleId: string, firstTry: boolean) => {
    setState((s) => {
      const d = today();
      const streak = s.lastPlayed === d ? s.streak : s.lastPlayed === yesterday() ? s.streak + 1 : 1;
      return { ...s, stars: s.stars + (firstTry ? 1 : 0), solved: { ...s.solved, [puzzleId]: true }, streak, lastPlayed: d };
    });
  }, []);

  const account = useMemo<Account>(() => ({
    enabled: !!supabase,
    email: session?.user.email ?? null,
    children: kids,
    active,
    syncing,
    sendCode: async (email) => {
      const { error } = await supabase!.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
      return error ? message(error) : null;
    },
    verifyCode: async (email, code) => {
      const { error } = await supabase!.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
      if (error) return message(error);
      const list = await refreshChildren();
      if (list.length === 1) await openChild(list[0]);
      return null;
    },
    signOut: async () => {
      await supabase!.auth.signOut();
      setKids([]);
      await openChild(null);
    },
    deleteAccount: async () => {
      const { error } = await supabase!.rpc('delete_my_account');
      if (error) return message(error);
      await Promise.all(kids.map((c) => AsyncStorage.removeItem(childKey(c.id)).catch(() => {})));
      await supabase!.auth.signOut();
      setKids([]);
      await openChild(null);
      return null;
    },
    addChild: async (name, grade) => {
      const { data, error } = await supabase!.from('children').insert({ name: name.trim(), grade }).select('id, name, grade').single();
      if (error) return message(error);
      // The first child takes over what was played on this device before signing in.
      const first = kids.length === 0;
      await refreshChildren();
      await openChild(data as Child, first ? state : undefined);
      return null;
    },
    selectChild: (child) => openChild(child),
  }), [session, kids, active, syncing, state, openChild, refreshChildren]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      ready,
      recordSolved,
      account,
      setGrade: (grade) => {
        setState((s) => ({ ...s, grade }));
        if (supabase && active && active.grade !== grade) {
          setActive({ ...active, grade });
          supabase.from('children').update({ grade }).eq('id', active.id).then(() => refreshChildren());
        }
      },
      setSound: (sound) => setState((s) => ({ ...s, sound })),
      recordTest: (r) => setState((s) => ({ ...s, tests: [r, ...s.tests].slice(0, 30) })),
      reset: () => setState((s) => ({ ...EMPTY, sound: s.sound, grade: active ? s.grade : null })),
    }),
    [state, ready, recordSolved, account, active, refreshChildren],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
