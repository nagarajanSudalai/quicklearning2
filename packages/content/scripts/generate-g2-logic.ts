// Seeds the Grade 2 Puzzles bank (mini crosswords, 4×4 picture sudoku) and Thinking Skills bank
// (ordering steps, riddles, bigger mazes). The JSON it writes is the source of truth;
// re-running overwrites puzzles/g2-puzzles/ and puzzles/g2-thinking/.
//   node scripts/generate-g2-logic.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { countSolutions } from '../src/sudoku.ts';
import { RIDDLES, SEQUENCES } from '../src/thinking2.ts';
import { PICTURES } from '../src/words.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles');

let seed = 20261103;
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
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 2, subject, topic, difficulty, prompt,
});

type Word = { word: string; picture: string; row: number; col: number; dir: 'across' | 'down' };
const cellsOf = (w: Word) => [...w.word].map((ch, k) => [w.dir === 'across' ? w.row : w.row + k, w.dir === 'across' ? w.col + k : w.col, ch] as const);
const clueOf = (w: Word) => (w.dir === 'across' ? `${w.row},${w.col - 1}` : `${w.row - 1},${w.col}`);

/**
 * Lay out `words` as across / down / across. Each later word crosses the previous one.
 * Returns null if letters clash, words touch where they shouldn't, or a clue square is taken.
 */
function layout(list: string[]): Word[] | null {
  const ws: Word[] = [{ word: list[0], picture: PICTURES[list[0]], row: 0, col: 0, dir: 'across' }];
  for (let n = 1; n < list.length; n++) {
    const prev = ws[n - 1], w = list[n], dir = prev.dir === 'across' ? 'down' : 'across';
    const options: Word[] = [];
    for (let a = 0; a < prev.word.length; a++) for (let b = 0; b < w.length; b++) {
      if (prev.word[a] !== w[b]) continue;
      const [r, c] = prev.dir === 'across' ? [prev.row, prev.col + a] : [prev.row + a, prev.col];
      options.push(dir === 'down' ? { word: w, picture: PICTURES[w], row: r - b, col: c, dir } : { word: w, picture: PICTURES[w], row: r, col: c - b, dir });
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

function crossword() {
  const pool = Object.keys(PICTURES).filter((w) => w.length >= 3 && w.length <= 5);
  const used = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const n = d === 1 ? 2 : 3;
      const list = shuffle(pool).slice(0, n);
      const key = [...list].sort().join('+');
      if (used.has(key)) continue;
      const ws = layout(list);
      if (!ws) continue;
      used.add(key);
      const cells = new Map<string, string>();
      for (const w of ws) for (const [r, c, ch] of cellsOf(w)) cells.set(`${r},${c}`, ch);
      const nBlanks = d === 1 ? 3 : d === 2 ? 4 : 6;
      const chosen = new Set(ws.map((w) => { const [r, c] = pick(cellsOf(w)); return `${r},${c}`; }));
      for (const k of shuffle([...cells.keys()])) if (chosen.size < Math.min(nBlanks, cells.size - 2)) chosen.add(k);
      const blanks = [...chosen].map((k) => k.split(',').map(Number) as [number, number]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const need = [...new Set(blanks.map(([r, c]) => cells.get(`${r},${c}`)!))];
      const extra = shuffle('abcdefghiklmnoprstuwy'.split('').filter((l) => !need.includes(l))).slice(0, Math.max(0, 7 - need.length));
      return { ...base('g2-crossword', i, d, 'Fill in the missing letters.'), type: 'crossword', payload: { words: ws, blanks, letters: shuffle([...need, ...extra]) } };
    }
  });
}

const FRUIT_SETS = [['🍎', '🍌', '🍇', '🍊'], ['🍓', '🍐', '🍉', '🥭'], ['🐶', '🐱', '🐰', '🐻'], ['⭐', '🌙', '☀️', '☁️'], ['🚗', '🚌', '🚲', '✈️']];

function sudoku() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      // Shuffle a known-good 4×4 grid: swap symbols, rows within bands, columns within stacks.
      const baseGrid = [0, 1, 2, 3, 2, 3, 0, 1, 1, 0, 3, 2, 3, 2, 1, 0];
      const sym = shuffle([0, 1, 2, 3]);
      const rows = [...shuffle([0, 1]), ...shuffle([2, 3])];
      const cols = [...shuffle([0, 1]), ...shuffle([2, 3])];
      const [bandsSwap, stacksSwap] = [rand() < 0.5, rand() < 0.5];
      const R = bandsSwap ? [rows[2], rows[3], rows[0], rows[1]] : rows;
      const C = stacksSwap ? [cols[2], cols[3], cols[0], cols[1]] : cols;
      const solution = Array.from({ length: 16 }, (_, k) => sym[baseGrid[R[Math.floor(k / 4)] * 4 + C[k % 4]]]);
      if (seen.has(solution.join(''))) continue;
      // Remove cells one at a time while the puzzle keeps exactly one solution.
      const target = d === 1 ? 3 : d === 2 ? 6 : 9;
      const grid: (number | null)[] = [...solution];
      for (const k of shuffle([...Array(16).keys()])) {
        if (grid.filter((x) => x === null).length >= target) break;
        const keep = grid[k];
        grid[k] = null;
        if (countSolutions(grid) !== 1) grid[k] = keep;
      }
      if (grid.filter((x) => x === null).length !== target) continue;
      seen.add(solution.join(''));
      return { ...base('g2-sudoku', i, d, 'Fill the grid. Each row, column and box has one of each.'), type: 'sudoku', payload: { symbols: FRUIT_SETS[i % FRUIT_SETS.length], grid, solution } };
    }
  });
}

function orderSteps() {
  const byLen = (lo: number, hi: number) => SEQUENCES.filter((q) => q.steps.length >= lo && q.steps.length <= hi);
  const pools: Record<number, typeof SEQUENCES> = { 1: byLen(2, 3), 2: byLen(4, 4), 3: byLen(4, 5) };
  const counts: Record<string, number> = {};
  return levels([7, 7, 6]).map((d, i) => {
    // Rotate through the pool; repeats get a different shuffle.
    const pool = pools[d];
    const q = pool[(counts[d] = (counts[d] ?? -1) + 1) % pool.length];
    const order = [...q.steps.keys()];
    let shown = shuffle(order);
    while (shown.every((v, k) => v === k)) shown = shuffle(order);
    return {
      ...base('g2-order', i, d, 'Tap the pictures in order. What comes first?', 'thinking'), type: 'order-steps',
      payload: { title: q.title, steps: q.steps.map(([item, name]) => ({ item, name })), shown },
    };
  });
}

function riddles() {
  const order = shuffle(RIDDLES.map((_, k) => k));
  const others = RIDDLES.map((r) => r.answer);
  return levels([7, 7, 6]).map((d, i) => {
    const r = RIDDLES[order[i % order.length]];
    const clues = r.clues.slice(0, d === 1 ? 2 : 3);
    // Level 1: answers from other riddles (very different). Level 2–3: look-alikes.
    const wrong = d === 1 ? shuffle(others.filter(([e]) => e !== r.answer[0] && !r.similar.some(([s]) => s === e))).slice(0, 2) : shuffle(r.similar).slice(0, d === 2 ? 2 : 3);
    const opts = shuffle([r.answer, ...wrong]);
    return {
      ...base('g2-riddles', i, d, `Who am I? ${clues.join(' ')}`, 'thinking'), type: 'riddle',
      payload: { clues, names: Object.fromEntries(opts) }, options: opts.map(([e]) => e), answer: r.answer[0],
    };
  });
}

/** Same depth-first maze carving as Grade 1. */
function carve(rows: number, cols: number) {
  const cells = Array(rows * cols).fill(0);
  const seen = new Set<number>([0]);
  const stack = [0];
  const dirs = [[-1, 0, 1, 4], [0, 1, 2, 8], [1, 0, 4, 1], [0, -1, 8, 2]] as const;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const r = Math.floor(cur / cols), c = cur % cols;
    const next = shuffle(dirs).find(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      return nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen.has(nr * cols + nc);
    });
    if (!next) { stack.pop(); continue; }
    const [dr, dc, bit, back] = next;
    const n = (r + dr) * cols + (c + dc);
    cells[cur] |= bit;
    cells[n] |= back;
    seen.add(n);
    stack.push(n);
  }
  return cells;
}

const HEROES = [
  { hero: '🐘', target: '🍌', prompt: 'Help the elephant get to the bananas.' },
  { hero: '🦜', target: '🌶️', prompt: 'Help the parrot get to the chilli.' },
  { hero: '🐯', target: '🏠', prompt: 'Help the tiger get home.' },
  { hero: '🐢', target: '🌊', prompt: 'Help the turtle get to the sea.' },
  { hero: '🐿️', target: '🌰', prompt: 'Help the squirrel get to the nut.' },
];

function mazes() {
  return levels([7, 7, 6]).map((d, i) => {
    const size = d + 4;
    const h = HEROES[i % HEROES.length];
    const goal: [number, number] = [size - 1, Math.floor(rand() * size)];
    return {
      ...base('g2-mazes', i, d, h.prompt, 'thinking'), type: 'maze',
      payload: { rows: size, cols: size, cells: carve(size, size), start: [0, 0], goal, hero: h.hero, target: h.target },
    };
  });
}

mkdirSync(join(ROOT, 'g2-puzzles'), { recursive: true });
for (const [name, puzzles] of Object.entries({ crossword: crossword(), sudoku: sudoku() })) {
  writeFileSync(join(ROOT, 'g2-puzzles', `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`g2-puzzles/${name}: ${puzzles.length} puzzles`);
}

// Thinking Skills runs after Puzzles so adding it didn't change the Puzzles bank.
mkdirSync(join(ROOT, 'g2-thinking'), { recursive: true });
for (const [name, puzzles] of Object.entries({ order: orderSteps(), riddles: riddles(), mazes: mazes() })) {
  writeFileSync(join(ROOT, 'g2-thinking', `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`g2-thinking/${name}: ${puzzles.length} puzzles`);
}
