// Seeds the Grade 1 Maths puzzle bank. The JSON it writes is the source of truth:
// edit or add puzzles there by hand; re-running this script overwrites puzzles/g1-maths/.
//   node scripts/generate-g1-maths.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type Shape = 'star' | 'circle' | 'square' | 'tri' | 'diamond' | 'rectangle';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g1-maths');

let seed = 20261022;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const int = (lo: number, hi: number) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = <T>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
const shuffle = <T>(xs: T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const ITEMS = [
  ['🍎', 'apples'], ['🐟', 'fish'], ['⭐', 'stars'], ['🎈', 'balloons'], ['🐞', 'ladybugs'],
  ['🚗', 'cars'], ['🍓', 'strawberries'], ['🐥', 'chicks'], ['🌸', 'flowers'], ['⚽', 'balls'],
] as const;
const NAME: Record<Shape, string> = { star: 'star', circle: 'circle', square: 'square', tri: 'triangle', diamond: 'diamond', rectangle: 'rectangle' };

/** Answer plus `n - 1` nearby distinct numbers ≥ min, shuffled. */
const numberOptions = (answer: number, n = 3, min = 0) => {
  const opts = new Set([answer]);
  for (const d of shuffle([-2, -1, 1, 2, 3])) {
    if (opts.size >= n) break;
    if (answer + d >= min) opts.add(answer + d);
  }
  return shuffle([...opts]);
};

const base = (topic: string, i: number, difficulty: number, prompt: string) => ({
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 1, subject: 'maths', topic, difficulty, prompt,
});
const levels = (counts: [number, number, number]) => counts.flatMap((c, i) => Array(c).fill(i + 1) as number[]);

function counting() {
  const ranges: Record<number, [number, number]> = { 1: [1, 5], 2: [6, 10], 3: [11, 20] };
  return levels([7, 7, 6]).map((d, i) => {
    const [emoji, name] = pick(ITEMS);
    const count = int(...ranges[d]);
    return { ...base('g1-counting', i, d, `How many ${name}?`), type: 'count-objects', payload: { item: emoji, count }, options: numberOptions(count, 3, 1), answer: count };
  });
}

function arithmetic(op: '+' | '-') {
  const topic = op === '+' ? 'g1-addition' : 'g1-subtraction';
  return levels([7, 7, 6]).map((d, i) => {
    const max = d === 1 ? 5 : 10;
    let a: number, b: number;
    if (op === '+') { a = int(1, max - 1); b = int(1, max - a); } else { a = int(2, max); b = int(1, a - 1); }
    const answer = op === '+' ? a + b : a - b;
    const [emoji] = pick(ITEMS);
    const prompt = op === '+' ? `What is ${a} plus ${b}?` : `What is ${a} take away ${b}?`;
    // Pictures help at levels 1–2; level 3 is numbers only.
    const payload = d < 3 ? { a, op, b, item: emoji } : { a, op, b };
    return { ...base(topic, i, d, prompt), type: 'arithmetic', payload, options: numberOptions(answer), answer };
  });
}

function shapes() {
  const pools: Record<number, Shape[]> = { 1: ['circle', 'square', 'tri'], 2: ['circle', 'square', 'tri', 'star', 'diamond'], 3: ['circle', 'square', 'tri', 'star', 'diamond', 'rectangle'] };
  return levels([7, 7, 6]).map((d, i) => {
    const pool = pools[d];
    const target = d === 3 && i % 2 === 0 ? pick(['square', 'rectangle'] as Shape[]) : pick(pool);
    const others = shuffle(pool.filter((s) => s !== target));
    // Level 3 always puts square and rectangle side by side — the tricky pair.
    const rest = d === 3 ? [...new Set([target === 'square' ? 'rectangle' : 'square', ...others])].filter((s) => s !== target).slice(0, 3) : others.slice(0, 2);
    return { ...base('g1-shapes', i, d, `Tap the ${NAME[target]}.`), type: 'shape-match', payload: { target }, options: shuffle([target, ...rest] as Shape[]), answer: target };
  });
}

function compare() {
  const gap: Record<number, [number, number]> = { 1: [3, 5], 2: [2, 2], 3: [1, 1] };
  return levels([7, 7, 6]).map((d, i) => {
    const ask = i % 2 === 0 ? 'more' : 'fewer';
    const small = int(1, 10 - gap[d][1]);
    const big = small + int(...gap[d]);
    const bigSide = rand() < 0.5 ? 'left' : 'right';
    const [e1, e2] = shuffle([...ITEMS]).slice(0, 2).map((x) => x[0]);
    const left = { item: e1, count: bigSide === 'left' ? big : small };
    const right = { item: e2, count: bigSide === 'right' ? big : small };
    const answer = ask === 'more' ? bigSide : bigSide === 'left' ? 'right' : 'left';
    return { ...base('g1-compare', i, d, `Which group has ${ask}?`), type: 'compare', payload: { ask, left, right }, options: ['left', 'right'], answer };
  });
}

function patterns() {
  const units: Record<number, number[][]> = { 1: [[0, 1]], 2: [[0, 0, 1], [0, 1, 1]], 3: [[0, 1, 2], [0, 1, 1, 2]] };
  const all: Shape[] = ['star', 'circle', 'square', 'tri', 'diamond'];
  return levels([7, 7, 6]).map((d, i) => {
    const unit = pick(units[d]);
    const kinds = shuffle(all).slice(0, 3);
    const len = unit.length === 2 ? 5 : unit.length === 3 ? 5 : 6;
    const at = (k: number) => kinds[unit[k % unit.length]];
    const seq = Array.from({ length: len }, (_, k) => at(k));
    const answer = at(len);
    const distractors = shuffle(all.filter((s) => s !== answer)).slice(0, 2);
    return { ...base('g1-patterns', i, d, 'What comes next?'), type: 'pattern', payload: { seq }, options: shuffle([answer, ...distractors]), answer };
  });
}

mkdirSync(OUT, { recursive: true });
const banks = { counting: counting(), addition: arithmetic('+'), subtraction: arithmetic('-'), shapes: shapes(), compare: compare(), patterns: patterns() };
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
