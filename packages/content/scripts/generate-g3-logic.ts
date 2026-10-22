// Seeds the Grade 3 Puzzles bank (text-clue crosswords, 6×6 sudoku). The JSON it writes is the
// source of truth; re-running overwrites puzzles/g3-puzzles/.
//   node scripts/generate-g3-logic.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLUES } from '../src/thinking3.ts';
import { cellsOf, layoutCrossword } from '../src/crossword.ts';
import { countSolutions, isSolved } from '../src/sudoku.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles');

let seed = 20261203;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = <T>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
const shuffle = <T>(xs: readonly T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const levels = (counts: [number, number, number]) => counts.flatMap((c, i) => Array(c).fill(i + 1) as number[]);
const base = (topic: string, i: number, difficulty: number, prompt: string, subject = 'puzzles') => ({
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 3, subject, topic, difficulty, prompt,
});

function crossword() {
  const pool = Object.keys(CLUES);
  const used = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const n = d === 1 ? 3 : 4;
      const list = shuffle(pool).slice(0, n);
      const key = [...list].sort().join('+');
      if (used.has(key)) continue;
      // Text clues go in `picture`'s place; the app numbers them and lists them under the grid.
      const ws = layoutCrossword(list, CLUES, shuffle);
      if (!ws) continue;
      used.add(key);
      const cells = new Map<string, string>();
      for (const w of ws) for (const [r, c, ch] of cellsOf(w)) cells.set(`${r},${c}`, ch);
      const nBlanks = d === 1 ? 5 : d === 2 ? 6 : 8;
      const chosen = new Set(ws.map((w) => { const [r, c] = pick(cellsOf(w)); return `${r},${c}`; }));
      for (const k of shuffle([...cells.keys()])) if (chosen.size < Math.min(nBlanks, cells.size - 3)) chosen.add(k);
      const blanks = [...chosen].map((k) => k.split(',').map(Number) as [number, number]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const need = [...new Set(blanks.map(([r, c]) => cells.get(`${r},${c}`)!))];
      const extra = shuffle('abcdefghiklmnoprstuwy'.split('').filter((l) => !need.includes(l))).slice(0, Math.max(0, 8 - need.length));
      return {
        ...base('g3-crossword', i, d, 'Read the clues and fill in the missing letters.'), type: 'crossword',
        payload: { words: ws.map(({ picture, ...w }) => ({ ...w, picture: '', clue: picture })), blanks, letters: shuffle([...need, ...extra]) },
      };
    }
  });
}

function sudoku6() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      // A valid 6×6 pattern (boxes 2 rows × 3 columns), then shuffle symbols, rows within bands,
      // bands, columns within stacks and stacks — all of which keep it valid.
      const pattern = (r: number, c: number) => (r * 3 + Math.floor(r / 2) + c) % 6;
      const sym = shuffle([0, 1, 2, 3, 4, 5]);
      const bands = shuffle([0, 1, 2]).flatMap((b) => shuffle([0, 1]).map((r) => b * 2 + r));
      const stacks = shuffle([0, 1]).flatMap((s) => shuffle([0, 1, 2]).map((c) => s * 3 + c));
      const solution = Array.from({ length: 36 }, (_, k) => sym[pattern(bands[Math.floor(k / 6)], stacks[k % 6])]);
      if (!isSolved(solution)) throw new Error('bad 6×6 pattern');
      if (seen.has(solution.join(''))) continue;
      const target = d === 1 ? 8 : d === 2 ? 14 : 20;
      const grid: (number | null)[] = [...solution];
      for (const k of shuffle([...Array(36).keys()])) {
        if (grid.filter((x) => x === null).length >= target) break;
        const keep = grid[k];
        grid[k] = null;
        if (countSolutions(grid) !== 1) grid[k] = keep;
      }
      if (grid.filter((x) => x === null).length !== target) continue;
      seen.add(solution.join(''));
      return { ...base('g3-sudoku', i, d, 'Fill the grid with 1 to 6. Each row, column and box has each number once.'), type: 'sudoku', payload: { symbols: ['1', '2', '3', '4', '5', '6'], grid, solution } };
    }
  });
}

mkdirSync(join(ROOT, 'g3-puzzles'), { recursive: true });
for (const [name, puzzles] of Object.entries({ crossword: crossword(), sudoku: sudoku6() })) {
  writeFileSync(join(ROOT, 'g3-puzzles', `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`g3-puzzles/${name}: ${puzzles.length} puzzles`);
}
