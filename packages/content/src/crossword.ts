// Crossword layout shared by the generators: words alternate across/down, each crossing the previous one.

export type Word = { word: string; picture: string; row: number; col: number; dir: 'across' | 'down' };
export const cellsOf = (w: Word) => [...w.word].map((ch, k) => [w.dir === 'across' ? w.row : w.row + k, w.dir === 'across' ? w.col + k : w.col, ch] as const);
const clueOf = (w: Word) => (w.dir === 'across' ? `${w.row},${w.col - 1}` : `${w.row - 1},${w.col}`);

/**
 * Lay out `list` alternating across / down; `pictures` gives each word's clue picture (or text).
 * `shuffle` is the generator's seeded shuffle, so layouts are reproducible. Each later word crosses the previous one.
 * Returns null if letters clash, words touch where they shouldn't, or a clue square is taken.
 */
export function layoutCrossword(list: string[], pictures: Record<string, string>, shuffle: <T>(xs: readonly T[]) => T[]): Word[] | null {
  const ws: Word[] = [{ word: list[0], picture: pictures[list[0]], row: 0, col: 0, dir: 'across' }];
  for (let n = 1; n < list.length; n++) {
    const prev = ws[n - 1], w = list[n], dir = prev.dir === 'across' ? 'down' : 'across';
    const options: Word[] = [];
    for (let a = 0; a < prev.word.length; a++) for (let b = 0; b < w.length; b++) {
      if (prev.word[a] !== w[b]) continue;
      const [r, c] = prev.dir === 'across' ? [prev.row, prev.col + a] : [prev.row + a, prev.col];
      options.push(dir === 'down' ? { word: w, picture: pictures[w], row: r - b, col: c, dir } : { word: w, picture: pictures[w], row: r, col: c - b, dir });
    }
    const placed = shuffle(options).find((cand) => fits([...ws, cand]));
    if (!placed) return null;
    ws.push(placed);
  }
  // Shift so every word starts at row/column 0 or more.
  const minR = Math.min(...ws.map((w) => w.row)), minC = Math.min(...ws.map((w) => w.col));
  return ws.map((w) => ({ ...w, row: w.row - minR, col: w.col - minC }));
}

function fits(ws: Word[]): boolean {
  const grid = new Map<string, { ch: string; owners: number }>();
  for (const w of ws) for (const [r, c, ch] of cellsOf(w)) {
    const k = `${r},${c}`, cur = grid.get(k);
    if (cur && cur.ch !== ch) return false;
    grid.set(k, { ch, owners: (cur?.owners ?? 0) + 1 });
  }
  // Words may only meet at shared squares: no side-by-side letters from different words.
  for (const [k] of grid) {
    const [r, c] = k.split(',').map(Number);
    const inWord = (rr: number, cc: number) => ws.filter((w) => cellsOf(w).some(([a, b]) => a === rr && b === cc));
    const mine = inWord(r, c);
    for (const [dr, dc] of [[0, 1], [1, 0]]) {
      const theirs = inWord(r + dr, c + dc);
      if (theirs.length && !theirs.some((t) => mine.includes(t))) return false;
    }
  }
  const clues = ws.map(clueOf);
  return new Set(clues).size === clues.length && clues.every((k) => !grid.has(k));
}

