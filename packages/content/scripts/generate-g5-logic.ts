// Seeds the Grade 5 Puzzles bank (6-word clue crosswords, 3×3 sum grids) and Thinking Skills
// bank (brain teasers, series and analogies, logic grids and codes). Puzzles are generated first,
// so adding to Thinking Skills never changes the Puzzles bank.
//   node scripts/generate-g5-logic.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cellsOf, layoutCrossword } from '../src/crossword.ts';
import { logicSolutions, sumGridSolutions } from '../src/logic.ts';
import { CLUES, LOGIC_PEOPLE } from '../src/thinking3.ts';
import { CIPHER_WORDS, CLUES4, LOGIC_SETS4, encode, patternTerms } from '../src/thinking4.ts';
import { ANALOGIES5, CLUES5, TEASERS } from '../src/thinking5.ts';
import type { PatternRule } from '../src/types.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles');

let seed = 20261505;
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
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 5, subject, topic, difficulty, prompt,
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
  const clues = { ...CLUES, ...CLUES4, ...CLUES5 };
  const pool = Object.keys(clues);
  const used = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const n = d === 1 ? 5 : 6;
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
      const nBlanks = d === 1 ? 9 : d === 2 ? 11 : 13;
      const chosen = new Set(ws.map((w) => { const [r, c] = pick(cellsOf(w)); return `${r},${c}`; }));
      for (const k of shuffle([...cells.keys()])) if (chosen.size < Math.min(nBlanks, cells.size - 5)) chosen.add(k);
      const blanks = [...chosen].map((k) => k.split(',').map(Number) as [number, number]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const need = [...new Set(blanks.map(([r, c]) => cells.get(`${r},${c}`)!))];
      const extra = shuffle('abcdefghiklmnoprstuwy'.split('').filter((l) => !need.includes(l))).slice(0, Math.max(0, 12 - need.length));
      return {
        ...base('g5-crossword', i, d, 'Read the clues and fill in the missing letters.', 'puzzles'), type: 'crossword',
        payload: { words: ws.map(({ picture, ...w }) => ({ ...w, picture: '', clue: picture })), blanks, letters: shuffle([...need, ...extra]) },
      };
    }
  });
}

function sumGrid() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const solution = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const rows = [0, 1, 2].map((r) => solution[r * 3] + solution[r * 3 + 1] + solution[r * 3 + 2]);
      const cols = [0, 1, 2].map((c) => solution[c] + solution[c + 3] + solution[c + 6]);
      const n = d === 1 ? 3 : d === 2 ? 5 : 7;
      const hide = new Set(shuffle([...Array(9).keys()]).slice(0, n));
      const grid = solution.map((v, k) => (hide.has(k) ? null : v));
      const key = grid.join(',');
      if (seen.has(key) || sumGridSolutions(grid, rows, cols) !== 1) continue;
      seen.add(key);
      return {
        ...base('g5-sumgrid', i, d, 'Use each number 1 to 9 once. Every row and column must add up to its total.', 'puzzles'),
        type: 'sum-grid', payload: { grid, solution, rows, cols },
      };
    }
  });
}

// ---------- Thinking Skills ----------

function teasers() {
  return levels([7, 7, 6]).map((d, i) => {
    const t = TEASERS.filter((x) => x.level === d)[i - levels([7, 7, 6]).indexOf(d)];
    return {
      ...base('g5-teasers', i, d, t.text, 'thinking'), type: 'teaser',
      payload: { id: t.id, text: t.text }, options: shuffle([t.answer, ...shuffle(t.wrong).slice(0, 2)]), answer: t.answer,
    };
  });
}

function series() {
  const seen = new Set<string>();
  const analogies = shuffle(ANALOGIES5);
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      const a = analogies[i];
      return {
        ...base('g5-series', i, d, `${a.a} is to ${a.b} as ${a.c} is to what?`, 'thinking'), type: 'analogy',
        payload: { a: a.a, b: a.b, c: a.c }, options: shuffle([a.d, ...a.wrong]), answer: a.d,
      };
    }
    for (;;) {
      const rule: PatternRule = d === 2
        ? { kind: 'alternate', start: int(1, 20), a: int(2, 6), b: -int(1, 3) }
        : { kind: 'fib', a: int(1, 4), b: int(1, 5) };
      const len = d === 2 ? 6 : 5;
      const full = patternTerms(rule, len);
      if (full.some((x) => x <= 0) || full[len - 1] > 200) continue;
      const blank = int(2, len - 1);
      const seq = full.map((x, k) => (k === blank ? null : x));
      const kn = seq.flatMap((x, k) => (x === null ? [] : [[k, x] as const]));
      const st = (kn[1][1] - kn[0][1]) / (kn[1][0] - kn[0][0]);
      if (kn.every(([k, x]) => x === kn[0][1] + st * (k - kn[0][0]))) continue;
      const key = seq.join(',');
      if (seen.has(key)) continue;
      seen.add(key);
      const answer = full[blank];
      const prev = full[blank - 1], prev2 = full[blank - 2];
      const wrong = [...new Set([prev + (prev - prev2), answer + 1, answer - 1, answer + 2])].filter((x) => x !== answer && x > 0).slice(0, 2);
      return { ...base('g5-series', i, d, 'Which number is missing?', 'thinking'), type: 'number-pattern', payload: { seq, rule }, options: shuffle([answer, ...wrong]), answer };
    }
  });
}

function logicCodes() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      for (;;) {
        const n = 4;
        const set = LOGIC_SETS4[i % LOGIC_SETS4.length];
        const people = shuffle(LOGIC_PEOPLE).slice(0, n);
        const items = shuffle(set.items).slice(0, n).map(([emoji, name]) => ({ emoji, name }));
        const solution = shuffle([...Array(n).keys()]);
        const facts = shuffle(people.flatMap((_, p) => items.map((_, it) => ({ person: p, item: it, has: solution[p] === it }))))
          .filter((c) => !c.has || rand() < 0.15);
        const clues: typeof facts = [];
        for (const f of facts) { if (logicSolutions(n, clues).length === 1) break; clues.push(f); }
        if (logicSolutions(n, clues).length !== 1) continue;
        for (const c of [...clues]) { const without = clues.filter((x) => x !== c); if (logicSolutions(n, without).length === 1) clues.splice(clues.indexOf(c), 1); }
        const key = `${people.join()}|${items.map((x) => x.name).join()}|${solution.join()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        return { ...base('g5-logic-codes', i, d, `${set.question} Read the clues.`, 'thinking'), type: 'logic-grid', payload: { kind: set.kind, people, items, clues, solution } };
      }
    }
    const word = (() => { for (;;) { const w = pick(CIPHER_WORDS); if (!seen.has(`${d}${w}`)) { seen.add(`${d}${w}`); return w; } } })();
    if (d === 2) {
      const code = encode(word, 'reverse');
      const wrong = shuffle(CIPHER_WORDS.filter((w) => w !== word && w.length === word.length)).slice(0, 2);
      return {
        ...base('g5-logic-codes', i, d, `Crack the code: ${code}. In this code the alphabet is turned back to front: A ↔ Z, B ↔ Y, C ↔ X and so on.`, 'thinking'),
        type: 'cipher', payload: { kind: 'reverse', word, ask: 'decode' }, options: shuffle([word, ...wrong]), answer: word,
      };
    }
    const kind = i % 2 ? 'reverse' : 'shift';
    const shift = kind === 'shift' ? pick([2, 3]) : undefined;
    const code = encode(word, kind, shift);
    const how = kind === 'reverse' ? 'turn the alphabet back to front (A ↔ Z, B ↔ Y)' : `move each letter ${shift} places on`;
    const wrong = [encode(word, 'shift', kind === 'reverse' ? 1 : shift! - 1), encode([...word].reverse().join(''), kind, shift)].filter((c) => c !== code);
    return {
      ...base('g5-logic-codes', i, d, `Write "${word.toUpperCase()}" in code: ${how}.`, 'thinking'),
      type: 'cipher', payload: { kind, ...(shift ? { shift } : {}), word, ask: 'encode' }, options: shuffle([...new Set([code, ...wrong])]), answer: code,
    };
  });
}

write('g5-puzzles', { crossword: crossword(), sumgrid: sumGrid() });
write('g5-thinking', { teasers: teasers(), series: series(), 'logic-codes': logicCodes() });
