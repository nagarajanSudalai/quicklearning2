import { useSyncExternalStore, type ReactNode } from 'react';
import type { Grade } from './data';
import { GradeContext } from './grade-context';

// The chosen grade lives in the browser's storage. On the server (pre-rendering) there is none,
// so the first browser render matches the pre-rendered page and the saved grade appears right after.
const KEY = 'quickstep/web-grade';
const listeners = new Set<() => void>();
let memory: Grade | null = null; // used when storage is blocked (private mode)
const read = (): Grade | null => {
  try { const g = Number(localStorage.getItem(KEY)); return g >= 1 && g <= 5 ? (g as Grade) : memory; } catch { return memory; }
};
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };

export function GradeProvider({ children }: { children: ReactNode }) {
  const grade = useSyncExternalStore(subscribe, read, () => null);
  const setGrade = (g: Grade) => {
    memory = g;
    try { localStorage.setItem(KEY, String(g)); } catch { /* private mode: kept in memory until reload */ }
    listeners.forEach((fn) => fn());
  };
  return <GradeContext.Provider value={{ grade, setGrade }}>{children}</GradeContext.Provider>;
}
