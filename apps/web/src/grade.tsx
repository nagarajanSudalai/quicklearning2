import { useState, type ReactNode } from 'react';
import type { Grade } from './data';
import { GradeContext } from './grade-context';

const KEY = 'quickstep/web-grade';
const read = (): Grade | null => {
  try { const g = Number(localStorage.getItem(KEY)); return g >= 1 && g <= 5 ? (g as Grade) : null; } catch { return null; }
};

export function GradeProvider({ children }: { children: ReactNode }) {
  const [grade, set] = useState<Grade | null>(read);
  const setGrade = (g: Grade) => { set(g); try { localStorage.setItem(KEY, String(g)); } catch { /* private mode */ } };
  return <GradeContext.Provider value={{ grade, setGrade }}>{children}</GradeContext.Provider>;
}
