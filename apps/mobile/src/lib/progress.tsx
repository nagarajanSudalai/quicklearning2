import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Grade } from '@quickstep/content';

const KEY = 'quickstep/progress/v1';

export type Progress = {
  grade: Grade | null;
  stars: number;
  /** Puzzle ids answered correctly at least once. */
  solved: Record<string, true>;
  sound: boolean;
  streak: number;
  /** Local date (YYYY-MM-DD) of the last correct answer, for the daily streak. */
  lastPlayed: string | null;
};

const EMPTY: Progress = { grade: null, stars: 0, solved: {}, sound: true, streak: 0, lastPlayed: null };

type Ctx = Progress & {
  ready: boolean;
  setGrade: (g: Grade) => void;
  setSound: (on: boolean) => void;
  /** Record a correct answer; a star is earned only on the first try. */
  recordSolved: (puzzleId: string, firstTry: boolean) => void;
  reset: () => void;
};

const ProgressContext = createContext<Ctx | null>(null);

const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const yesterday = () => today(new Date(Date.now() - 86_400_000));

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setState({ ...EMPTY, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const recordSolved = useCallback((puzzleId: string, firstTry: boolean) => {
    setState((s) => {
      const d = today();
      const streak = s.lastPlayed === d ? s.streak : s.lastPlayed === yesterday() ? s.streak + 1 : 1;
      return { ...s, stars: s.stars + (firstTry ? 1 : 0), solved: { ...s.solved, [puzzleId]: true }, streak, lastPlayed: d };
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      ready,
      recordSolved,
      setGrade: (grade) => setState((s) => ({ ...s, grade })),
      setSound: (sound) => setState((s) => ({ ...s, sound })),
      reset: () => setState((s) => ({ ...EMPTY, sound: s.sound })),
    }),
    [state, ready, recordSolved],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
