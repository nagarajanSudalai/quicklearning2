// Adaptive difficulty v1: a session moves up a level after a run of first-try answers
// and back down after a run of misses.
import type { Difficulty, Puzzle } from './types';

export const UP_AFTER = 3;
export const DOWN_AFTER = 2;

/**
 * The level for the next puzzle. `run` is the results since the level last changed
 * (true = right on the first try); the caller starts a fresh run when the level changes.
 */
export function nextLevel(level: Difficulty, run: boolean[], levels: Difficulty[]): Difficulty {
  const max = Math.max(...levels) as Difficulty, min = Math.min(...levels) as Difficulty;
  if (run.length >= UP_AFTER && run.slice(-UP_AFTER).every(Boolean) && level < max) return (level + 1) as Difficulty;
  if (run.length >= DOWN_AFTER && run.slice(-DOWN_AFTER).every((r) => !r) && level > min) return (level - 1) as Difficulty;
  return level;
}

/** Where a session starts: the easiest level that still has unsolved puzzles. */
export function startLevel(all: Puzzle[], solved: Record<string, true>): Difficulty {
  const open = all.filter((p) => !solved[p.id]);
  return (Math.min(...(open.length ? open : all).map((p) => p.difficulty)) as Difficulty) || 1;
}

/**
 * The next puzzle at (or nearest to) `level`, never repeating one from this session.
 * Unsolved puzzles come first, then replays; within those, the bank's order.
 */
export function pickNext(all: Puzzle[], level: Difficulty, solved: Record<string, true>, played: Set<string>): Puzzle | undefined {
  const left = all.filter((p) => !played.has(p.id));
  const rank = (p: Puzzle) => Math.abs(p.difficulty - level) * 2 + (solved[p.id] ? 1 : 0);
  return left.reduce<Puzzle | undefined>((best, p) => (!best || rank(p) < rank(best) ? p : best), undefined);
}
