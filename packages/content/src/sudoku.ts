// Sudoku helpers for 4×4 (2×2 boxes) and 6×6 (boxes 2 rows × 3 columns) grids:
// rows, columns and boxes each hold every symbol once. The size comes from the grid length.

const shapeOf = (cells: number) => {
  const size = Math.round(Math.sqrt(cells));
  return { size, boxR: 2, boxC: size === 6 ? 3 : 2 };
};

const unitsOf = (i: number, cells: number) => {
  const { size, boxR, boxC } = shapeOf(cells);
  const r = Math.floor(i / size), c = i % size;
  const br = r - (r % boxR), bc = c - (c % boxC);
  const row = Array.from({ length: size }, (_, k) => r * size + k);
  const col = Array.from({ length: size }, (_, k) => k * size + c);
  const box = Array.from({ length: size }, (_, k) => (br + Math.floor(k / boxC)) * size + bc + (k % boxC));
  return [row, col, box];
};

/** A cell may hold `v` if no other cell in its row, column or box already does. */
export const canPlace = (grid: (number | null)[], i: number, v: number) =>
  unitsOf(i, grid.length).every((u) => u.every((j) => j === i || grid[j] !== v));

export const isSolved = (grid: (number | null)[]) =>
  grid.every((v, i) => v !== null && canPlace(grid, i, v));

/** Number of solutions, stopping once `limit` is reached. */
export function countSolutions(grid: (number | null)[], limit = 2): number {
  const i = grid.indexOf(null);
  if (i === -1) return isSolved(grid) ? 1 : 0;
  const { size } = shapeOf(grid.length);
  let n = 0;
  for (let v = 0; v < size && n < limit; v++) {
    if (!canPlace(grid, i, v)) continue;
    const g = [...grid];
    g[i] = v;
    n += countSolutions(g, limit - n);
  }
  return n;
}

/** Box shape for drawing: thick lines after every `boxC` columns and `boxR` rows. */
export const sudokuShape = shapeOf;
