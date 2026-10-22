// Helpers for logic grids and magic squares, shared by the generator, checker and app.
import type { LogicClue } from './types';

/** All orderings of 0..n-1. */
export function permutations(n: number): number[][] {
  if (n === 1) return [[0]];
  return permutations(n - 1).flatMap((p) => Array.from({ length: n }, (_, i) => [...p.slice(0, i), n - 1, ...p.slice(i)]));
}

export const satisfies = (assign: number[], clues: LogicClue[]) => clues.every((c) => (assign[c.person] === c.item) === c.has);

/** Every person–item matching that fits the clues. A good puzzle has exactly one. */
export const logicSolutions = (n: number, clues: LogicClue[]) => permutations(n).filter((p) => satisfies(p, clues));

export const clueText = (c: LogicClue, people: string[], items: { name: string }[]) =>
  `${people[c.person]} ${c.has ? 'has' : 'does not have'} the ${items[c.item].name}.`;

const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
export const isMagic = (g: number[], target = 15) => new Set(g).size === 9 && g.every((v) => v >= 1 && v <= 9) && LINES.every((l) => l.reduce((s, i) => s + g[i], 0) === target);

/** Number of ways to fill the blanks with the unused numbers 1–9 to make a magic square. */
export function magicSolutions(grid: (number | null)[]): number {
  const blanks = grid.flatMap((v, i) => (v === null ? [i] : []));
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !grid.includes(n));
  if (missing.length !== blanks.length) return 0;
  return permutations(missing.length).filter((p) => {
    const g = [...grid] as number[];
    p.forEach((m, k) => (g[blanks[k]] = missing[m]));
    return isMagic(g);
  }).length;
}
