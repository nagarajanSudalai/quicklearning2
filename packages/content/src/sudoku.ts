// 4×4 sudoku helpers: rows, columns and 2×2 boxes each hold every symbol once.

const SIZE = 4;
const unitsOf = (i: number) => {
  const r = Math.floor(i / SIZE), c = i % SIZE;
  const br = r - (r % 2), bc = c - (c % 2);
  const row = Array.from({ length: SIZE }, (_, k) => r * SIZE + k);
  const col = Array.from({ length: SIZE }, (_, k) => k * SIZE + c);
  const box = [0, 1, 2, 3].map((k) => (br + Math.floor(k / 2)) * SIZE + bc + (k % 2));
  return [row, col, box];
};

/** A cell may hold `v` if no other cell in its row, column or box already does. */
export const canPlace = (grid: (number | null)[], i: number, v: number) =>
  unitsOf(i).every((u) => u.every((j) => j === i || grid[j] !== v));

export const isSolved = (grid: (number | null)[]) =>
  grid.every((v, i) => v !== null && canPlace(grid, i, v));

/** Number of solutions, stopping once `limit` is reached. */
export function countSolutions(grid: (number | null)[], limit = 2): number {
  const i = grid.indexOf(null);
  if (i === -1) return isSolved(grid) ? 1 : 0;
  let n = 0;
  for (let v = 0; v < SIZE && n < limit; v++) {
    if (!canPlace(grid, i, v)) continue;
    const g = [...grid];
    g[i] = v;
    n += countSolutions(g, limit - n);
  }
  return n;
}
