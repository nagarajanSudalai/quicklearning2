// Seeds the Grade 4 Puzzles bank (bigger clue crosswords, harder 6×6 sudoku) and Thinking Skills
// bank (4-person logic grids, number patterns, codes). Puzzles are generated first, so adding
// to Thinking Skills never changes the Puzzles bank.
//   node scripts/generate-g4-logic.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cellsOf, layoutCrossword } from '../src/crossword.ts';
import { logicSolutions } from '../src/logic.ts';
import { countSolutions, isSolved } from '../src/sudoku.ts';
import { CLUES, LOGIC_PEOPLE, LOGIC_SETS } from '../src/thinking3.ts';
import { CIPHER_WORDS, CLUES4, LOGIC_SETS4, encode, patternTerms } from '../src/thinking4.ts';
import type { PatternRule } from '../src/types.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles');

let seed = 20261303;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const int = (lo: number, hi: number) => lo + Math.floor(rand() * (hi - lo + 1));
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
const base = (topic: string, i: number, difficulty: number, prompt: string, subject: string) => ({
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 4, subject, topic, difficulty, prompt,
});
const write = (dir: string, banks: Record<string, unknown[]>) => {
  mkdirSync(join(ROOT, dir), { recursive: true });
  for (const [name, puzzles] of Object.entries(banks)) {
    writeFileSync(join(ROOT, dir, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
    console.log(`${dir}/${name}: ${puzzles.length} puzzles`);
  }
};

// ---------- Puzzles ----------

function crossword() {
  const clues = { ...CLUES, ...CLUES4 };
  const pool = Object.keys(clues);
  const used = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const n = d === 1 ? 4 : 5;
      const list = shuffle(pool).slice(0, n);
      const key = [...list].sort().join('+');
      if (used.has(key)) continue;
      const ws = layoutCrossword(list, clues, shuffle);
      if (!ws) continue;
      // Keep the grid small enough for a phone: at most 9 columns.
      if (Math.max(...ws.map((w) => (w.dir === 'across' ? w.col + w.word.length : w.col + 1))) > 9) continue;
      used.add(key);
      const cells = new Map<string, string>();
      for (const w of ws) for (const [r, c, ch] of cellsOf(w)) cells.set(`${r},${c}`, ch);
      const nBlanks = d === 1 ? 7 : d === 2 ? 9 : 11;
      const chosen = new Set(ws.map((w) => { const [r, c] = pick(cellsOf(w)); return `${r},${c}`; }));
      for (const k of shuffle([...cells.keys()])) if (chosen.size < Math.min(nBlanks, cells.size - 4)) chosen.add(k);
      const blanks = [...chosen].map((k) => k.split(',').map(Number) as [number, number]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const need = [...new Set(blanks.map(([r, c]) => cells.get(`${r},${c}`)!))];
      const extra = shuffle('abcdefghiklmnoprstuwy'.split('').filter((l) => !need.includes(l))).slice(0, Math.max(0, 10 - need.length));
      return {
        ...base('g4-crossword', i, d, 'Read the clues and fill in the missing letters.', 'puzzles'), type: 'crossword',
        payload: { words: ws.map(({ picture, ...w }) => ({ ...w, picture: '', clue: picture })), blanks, letters: shuffle([...need, ...extra]) },
      };
    }
  });
}

function sudoku6() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const pattern = (r: number, c: number) => (r * 3 + Math.floor(r / 2) + c) % 6;
      const sym = shuffle([0, 1, 2, 3, 4, 5]);
      const bands = shuffle([0, 1, 2]).flatMap((b) => shuffle([0, 1]).map((r) => b * 2 + r));
      const stacks = shuffle([0, 1]).flatMap((s) => shuffle([0, 1, 2]).map((c) => s * 3 + c));
      const solution = Array.from({ length: 36 }, (_, k) => sym[pattern(bands[Math.floor(k / 6)], stacks[k % 6])]);
      if (!isSolved(solution) || seen.has(solution.join(''))) continue;
      const target = d === 1 ? 18 : d === 2 ? 22 : 24;
      const grid: (number | null)[] = [...solution];
      for (const k of shuffle([...Array(36).keys()])) {
        if (grid.filter((x) => x === null).length >= target) break;
        const keep = grid[k];
        grid[k] = null;
        if (countSolutions(grid) !== 1) grid[k] = keep;
      }
      if (grid.filter((x) => x === null).length !== target) continue;
      seen.add(solution.join(''));
      return { ...base('g4-sudoku', i, d, 'Fill the grid with 1 to 6. Each row, column and box has each number once.', 'puzzles'), type: 'sudoku', payload: { symbols: ['1', '2', '3', '4', '5', '6'], grid, solution } };
    }
  });
}

// ---------- Thinking Skills ----------

function logicGrids() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const n = d === 3 ? 4 : 3;
      const set = d === 3 ? LOGIC_SETS4[i % LOGIC_SETS4.length] : LOGIC_SETS[i % LOGIC_SETS.length];
      const people = shuffle(LOGIC_PEOPLE).slice(0, n);
      const items = shuffle(set.items).slice(0, n).map(([emoji, name]) => ({ emoji, name }));
      const solution = shuffle([...Array(n).keys()]);
      // Level 1 leans on "has" clues; levels 2–3 mostly on "does not have".
      const facts = shuffle(people.flatMap((_, p) => items.map((_, it) => ({ person: p, item: it, has: solution[p] === it }))))
        .filter((c) => (d === 1 ? c.has || rand() < 0.3 : !c.has || rand() < 0.2));
      const clues: typeof facts = [];
      for (const f of facts) { if (logicSolutions(n, clues).length === 1) break; clues.push(f); }
      if (logicSolutions(n, clues).length !== 1) continue;
      for (const c of [...clues]) { const without = clues.filter((x) => x !== c); if (logicSolutions(n, without).length === 1) clues.splice(clues.indexOf(c), 1); }
      if (d > 1 && clues.filter((c) => !c.has).length < 2) continue;
      const key = `${people.join()}|${items.map((x) => x.name).join()}|${solution.join()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      return { ...base('g4-logic', i, d, `${set.question} Read the clues.`, 'thinking'), type: 'logic-grid', payload: { kind: set.kind, people, items, clues, solution } };
    }
  });
}

function patterns() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const rule: PatternRule = d === 1 ? { kind: 'multiply', start: pick([1, 2, 3, 5]), by: pick([2, 3]) }
        : d === 2 ? { kind: 'grow', start: int(1, 10), step: int(1, 3), growth: pick([1, 2]) }
        : i % 2 ? { kind: 'square', from: int(1, 4) } : { kind: 'grow', start: int(2, 20), step: int(2, 5), growth: pick([2, 3]) };
      const len = 5;
      const full = patternTerms(rule, len);
      if (full[len - 1] > 400) continue;
      const blank = d === 1 ? len - 1 : int(2, len - 1);
      const seq = full.map((x, k) => (k === blank ? null : x));
      // A constant step must not also explain the shown numbers.
      const kn = seq.flatMap((x, k) => (x === null ? [] : [[k, x] as const]));
      const st = (kn[1][1] - kn[0][1]) / (kn[1][0] - kn[0][0]);
      if (kn.every(([k, x]) => x === kn[0][1] + st * (k - kn[0][0]))) continue;
      const key = seq.join(',');
      if (seen.has(key)) continue;
      seen.add(key);
      const answer = full[blank];
      // Wrong options: what a constant step from the last two numbers would give, and a near miss.
      const prev = full[blank - 1], prev2 = full[blank - 2];
      const wrong = [...new Set([prev + (prev - prev2), answer + 1, answer - 2, answer + 2])].filter((x) => x !== answer && x > 0).slice(0, 2);
      return { ...base('g4-patterns', i, d, 'Which number is missing?', 'thinking'), type: 'number-pattern', payload: { seq, rule }, options: shuffle([answer, ...wrong]), answer };
    }
  });
}

function ciphers() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const word = (() => { for (;;) { const w = pick(CIPHER_WORDS); if (!seen.has(`${d}${w}`)) { seen.add(`${d}${w}`); return w; } } })();
    const kind = d === 1 ? 'number' : 'shift';
    const shift = kind === 'shift' ? (d === 2 ? 1 : pick([1, 2])) : undefined;
    const ask = d === 3 ? 'encode' : 'decode';
    const code = encode(word, kind, shift);
    if (ask === 'decode') {
      // Wrong answers: other words of the same length, so the child has to decode, not guess the length.
      const wrong = shuffle(CIPHER_WORDS.filter((w) => w !== word && w.length === word.length)).slice(0, 2);
      const how = kind === 'number' ? 'A = 1, B = 2, C = 3 and so on' : `each letter is moved ${shift} place${shift === 1 ? '' : 's'} on (A → ${encode('a', 'shift', shift)})`;
      return { ...base('g4-codes', i, d, `Crack the code: ${code}. In this code, ${how}.`, 'thinking'), type: 'cipher', payload: { kind, ...(shift ? { shift } : {}), word, ask }, options: shuffle([word, ...wrong]), answer: word };
    }
    const wrong = [encode(word, 'shift', shift === 1 ? 2 : 1), encode([...word].reverse().join(''), 'shift', shift)].filter((c) => c !== code);
    return { ...base('g4-codes', i, d, `Write "${word.toUpperCase()}" in code: move each letter ${shift} place${shift === 1 ? '' : 's'} on.`, 'thinking'), type: 'cipher', payload: { kind, shift, word, ask }, options: shuffle([...new Set([code, ...wrong])]), answer: code };
  });
}

write('g4-puzzles', { crossword: crossword(), sudoku: sudoku6() });
write('g4-thinking', { logic: logicGrids(), patterns: patterns(), codes: ciphers() });
