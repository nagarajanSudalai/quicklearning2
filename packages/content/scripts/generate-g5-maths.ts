// Seeds the Grade 5 Maths bank (NCERT Class 5). The JSON it writes is the source of truth;
// re-running this script overwrites puzzles/g5-maths/.
//   node scripts/generate-g5-maths.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fracStr, gcd } from '../src/maths4.ts';
import { addFractions, angleName, chartAnswer, decimalSum, percentAnswer, roundWhole, simplify, type ChartAsk } from '../src/maths5.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g5-maths');

let seed = 20261401;
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
const base = (topic: string, i: number, difficulty: number, prompt: string) => ({
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 5, subject: 'maths', topic, difficulty, prompt,
});
const near = (answer: number, steps: number[], n = 3, min = 0) => {
  const opts = new Set([answer]);
  for (const d of shuffle(steps)) if (opts.size < n && answer + d >= min) opts.add(answer + d);
  return shuffle([...opts]);
};
function unique<T>(make: () => T, key: (t: T) => string, seen: Set<string>) {
  for (;;) { const t = make(); const k = key(t); if (!seen.has(k)) { seen.add(k); return t; } }
}
const fmt = (n: number) => n.toLocaleString('en-IN');
/** Answer plus up to two distinct wrong strings. */
const opts3 = (answer: string, wrong: string[]) => shuffle([answer, ...[...new Set(wrong)].filter((w) => w !== answer).slice(0, 2)]);

function numbers() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const n = unique(() => int(10001, 99999), String, seen);
    const [tt, th, h, t, o] = String(n).split('').map(Number);
    const digits = { tenThousands: tt, thousands: th, hundreds: h, tens: t, ones: o };
    if (d === 1) {
      const ask = pick(['tenThousands', 'thousands'] as const);
      const answer = digits[ask];
      const wrong = [...new Set([ask === 'thousands' ? tt : th, h, ...shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])])].filter((x) => x !== answer).slice(0, 2);
      const word = ask === 'tenThousands' ? 'ten thousands' : 'thousands';
      return { ...base('g5-numbers', i, d, `How many ${word} are in ${fmt(n)}?`), type: 'place-value', payload: { ...digits, ask }, options: shuffle([answer, ...wrong]), answer };
    }
    if (d === 2) {
      const swapped = Number(`${tt}${h}${th}${t}${o}`);
      const opts = new Set([n]);
      for (const x of shuffle([swapped, n + 10000, n - 1000, n + 100])) if (opts.size < 3 && x >= 10000 && x < 100000) opts.add(x);
      return { ...base('g5-numbers', i, d, 'Which number is this?'), type: 'place-value', payload: { ...digits, ask: 'expanded' }, options: shuffle([...opts]), answer: n };
    }
    const b = i % 6 === 0 ? n : pick([n + int(1, 9) * 1000, n - int(1, 9) * 10, Number(String(n).slice(0, 1) + String(n).slice(1).split('').reverse().join(''))]);
    if (b < 10000 || b > 99999) return null;
    const answer = n > b ? '>' : n < b ? '<' : '=';
    return { ...base('g5-numbers', i, d, `Which sign goes between ${fmt(n)} and ${fmt(b)}?`), type: 'compare-numbers', payload: { a: n, b }, options: ['<', '=', '>'], answer };
  });
}

function bigOps() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      const [a, b] = unique(() => [int(101, 999), int(11, 99)], (x) => x.join('x'), seen);
      const ans = a * b;
      return { ...base('g5-big-ops', i, d, `What is ${a} times ${b}?`), type: 'arithmetic', payload: { a, op: '×', b }, options: near(ans, [a, -a, 10 * a, -10, 100]), answer: ans };
    }
    if (d === 2) {
      const [q, b] = unique(() => [int(201, 1999), int(2, 9)], (x) => x.join('/'), seen);
      const a = q * b;
      if (a > 9999) return null;
      return { ...base('g5-big-ops', i, d, `What is ${a} divided by ${b}?`), type: 'arithmetic', payload: { a, op: '÷', b }, options: near(q, [1, -1, 10, -10, 100]), answer: q };
    }
    // Long division with a remainder: the answer is the remainder.
    const [a, b] = unique(() => { for (;;) { const b = int(3, 12), a = int(100, 999); if (a % b) return [a, b]; } }, (x) => x.join('r'), seen);
    const r = a % b;
    return { ...base('g5-big-ops', i, d, `What is the remainder when ${a} is divided by ${b}?`), type: 'arithmetic', payload: { a, op: '÷', b, remainder: true }, options: near(r, [1, -1, 2, b - r - r].filter((x) => x !== 0), 3, 0), answer: r };
  });
}

function fractions() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      const [a, k] = unique(() => { for (;;) { const den = int(2, 9), num = int(1, den - 1); if (gcd(num, den) === 1) return [[num, den], int(2, 5)] as const; } }, (x) => x.flat().join(), seen);
      const big: [number, number] = [a[0] * k, a[1] * k];
      const answer = fracStr(simplify(big));
      // Wrong: half-simplified, or the top and bottom divided by different numbers.
      const wrong = [fracStr([big[0] / k, big[1]]), fracStr([a[0] + 1, a[1]]), fracStr([a[0], a[1] + 1])];
      return { ...base('g5-fractions', i, d, `Write ${fracStr(big)} in its simplest form.`), type: 'fraction-op', payload: { op: 'simplify', a: big }, options: opts3(answer, wrong), answer };
    }
    if (d === 2) {
      const [a, n] = unique(() => { const den = pick([2, 3, 4, 5, 10]); const num = int(1, den - 1); return [[num, den], den * int(2, 10)] as const; }, (x) => x.flat().join(), seen);
      const ans = (a[0] * n) / a[1];
      return { ...base('g5-fractions', i, d, `What is ${fracStr(a as [number, number])} of ${n}?`), type: 'fraction-op', payload: { op: 'of', a, n }, options: near(ans, [n / a[1], -(n / a[1]), 1, -1].map(Math.round).filter((x) => x !== 0), 3, 1).map(String), answer: String(ans) };
    }
    const [a, b] = unique(() => { for (;;) { const d1 = pick([2, 3, 4]), d2 = pick([4, 6, 8]); if (d1 === d2) continue; return [[1, d1], [int(1, d2 - 1), d2]] as [number, number][]; } }, (x) => x.flat().join(), seen);
    const sum = addFractions(a, b);
    const answer = fracStr(sum);
    // The classic mistake: add tops and add bottoms.
    const wrong = [fracStr(simplify([a[0] + b[0], a[1] + b[1]])), fracStr([sum[0] + 1, sum[1]]), fracStr([sum[0], sum[1] * 2])];
    return { ...base('g5-fractions', i, d, `What is ${fracStr(a)} + ${fracStr(b)}? Give it in simplest form.`), type: 'fraction-op', payload: { op: 'add', a, b }, options: opts3(answer, wrong), answer };
  });
}

function decimals() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      // Hundredths: compare where one has more digits but is smaller.
      const [a, b] = unique(() => { const x = (int(10, 99) / 100).toFixed(2); const y = (int(1, 9) / 10).toFixed(1); return [x, y]; }, (x) => x.join(), seen);
      if (Number(a) === Number(b)) return null;
      const answer = Number(a) > Number(b) ? a : b;
      return { ...base('g5-decimals', i, d, `Which is bigger, ${a} or ${b}?`), type: 'decimal', payload: { kind: 'bigger', a, b }, options: [a, b], answer };
    }
    if (d === 2) {
      const [a, b, op] = unique(() => { const x = (int(100, 9999) / 100).toFixed(2); const y = (int(100, 4999) / 100).toFixed(2); const op = pick(['+', '-'] as const); return Number(x) > Number(y) || op === '+' ? [x, y, op] : [y, x, op]; }, (x) => x.join(), seen);
      const answer = decimalSum(a, b, op);
      const prompt = op === '+' ? `A pen costs ₹${a} and a notebook costs ₹${b}. How much do they cost together?` : `You have ₹${a}. You spend ₹${b}. How much is left?`;
      const shift = (x: string, by: number) => (Math.round(Number(x) * 100 + by) / 100).toFixed(2);
      return { ...base('g5-decimals', i, d, prompt), type: 'decimal', payload: { kind: 'add', a, b, op }, options: opts3(answer, [shift(answer, 100), shift(answer, -10), shift(answer, 1)]), answer };
    }
    const a = unique(() => (int(101, 999) / 10).toFixed(1), String, seen);
    if (a.endsWith('.5')) return null;
    const answer = roundWhole(a);
    return { ...base('g5-decimals', i, d, `Round ${a} to the nearest whole number.`), type: 'decimal', payload: { kind: 'round', a }, options: opts3(answer, [String(Math.floor(Number(a))) === answer ? String(Math.ceil(Number(a))) : String(Math.floor(Number(a))), String(Number(answer) + 1), String(Number(answer) - 1)]), answer };
  });
}

function percentages() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      const shaded = unique(() => int(5, 95), String, seen);
      const answer = `${shaded}%`;
      return { ...base('g5-percent', i, d, 'The grid has 100 squares. What percent is shaded?'), type: 'percent', payload: { kind: 'grid', shaded }, options: opts3(answer, [`${100 - shaded}%`, `${shaded + 10}%`, `${Math.max(1, shaded - 5)}%`]), answer };
    }
    if (d === 2) {
      const [pct, of] = unique(() => [pick([10, 20, 25, 50, 75]), pick([20, 40, 60, 80, 100, 120, 200, 400])], (x) => x.join(), seen);
      const payload = { kind: 'of' as const, pct, of };
      const answer = percentAnswer(payload);
      if (!Number.isInteger(Number(answer))) return null;
      return { ...base('g5-percent', i, d, `What is ${pct}% of ${of}?`), type: 'percent', payload, options: opts3(answer, [String(of - Number(answer)), String(pct), String(Number(answer) * 2)]), answer };
    }
    const [pct, price] = unique(() => [pick([10, 20, 25, 50]), pick([100, 200, 240, 300, 400, 500, 800, 1000])], (x) => x.join(), seen);
    const payload = { kind: 'sale' as const, pct, price };
    const answer = percentAnswer(payload);
    const off = (pct * price) / 100;
    return { ...base('g5-percent', i, d, `A toy costs ₹${price}. In a sale it is ${pct}% off. What is the sale price?`), type: 'percent', payload, options: opts3(answer, [`₹${off}`, `₹${price - pct}`, `₹${price + off}`]), answer };
  });
}

function geometry() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d < 3) {
      const degrees = unique(() => (d === 1 ? pick([30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 180, 90]) : 10 * int(2, 17)), (x) => `${d}-${x}`, seen);
      if (d === 1) {
        const answer = angleName(degrees);
        return { ...base('g5-geometry', i, d, 'What kind of angle is this?'), type: 'angle', payload: { degrees, ask: 'name' }, options: answer === 'straight' ? ['right', 'obtuse', 'straight'] : ['acute', 'right', 'obtuse'], answer };
      }
      const answer = `${degrees}°`;
      // Reading the wrong scale on a protractor gives 180 − x.
      return { ...base('g5-geometry', i, d, 'How big is this angle?'), type: 'angle', payload: { degrees, ask: 'measure' }, options: opts3(answer, [`${180 - degrees}°`, `${degrees + 10}°`, `${degrees - 10}°`]), answer };
    }
    // Right triangle with base w and height h: half of the w × h rectangle around it.
    const [w, h] = unique(() => [2 * int(1, 4), int(2, 5)], (x) => x.join(), seen);
    const cells = Array(h * w).fill(true);
    const area = (w * h) / 2;
    return { ...base('g5-geometry', i, d, `A triangle has a base of ${w} cm and a height of ${h} cm. What is its area in square cm?`), type: 'grid-shape', payload: { rows: h, cols: w, cells, ask: 'area', labels: true, triangle: true }, options: near(area, [area, -1, 1, 2].filter((x) => x !== 0), 3, 1), answer: area };
  });
}

const CHARTS = [
  { title: 'Favourite fruits in class 5', unit: 'children', labels: ['Mango', 'Banana', 'Apple', 'Grapes'] },
  { title: 'Books read in a month', unit: 'books', labels: ['Asha', 'Ravi', 'Meena', 'Kabir'] },
  { title: 'Rainy days', unit: 'days', labels: ['June', 'July', 'August', 'September'] },
  { title: 'Runs scored', unit: 'runs', labels: ['Arjun', 'Priya', 'Sam', 'Tara'] },
  { title: 'Trees planted', unit: 'trees', labels: ['Class A', 'Class B', 'Class C', 'Class D'] },
];
function charts() {
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const c = CHARTS[i % CHARTS.length];
      const bars = c.labels.map((label) => ({ label, value: 2 * int(2, 15) }));
      if (new Set(bars.map((b) => b.value)).size !== bars.length) continue;
      const [x, y] = shuffle(c.labels);
      const ask: ChartAsk = d === 1 ? { kind: 'value', label: x } : d === 2 ? { kind: 'diff', a: x, b: y } : pick([{ kind: 'total' }, { kind: 'most' }, { kind: 'least' }] as ChartAsk[]);
      const answer = chartAnswer(bars, ask);
      const prompt = ask.kind === 'value' ? `How many ${c.unit} for ${ask.label}?` : ask.kind === 'diff' ? `How many more ${c.unit} does ${bars.find((b) => b.label === ask.a)!.value > bars.find((b) => b.label === ask.b)!.value ? `${ask.a} have than ${ask.b}` : `${ask.b} have than ${ask.a}`}?` : ask.kind === 'total' ? `How many ${c.unit} in total?` : ask.kind === 'most' ? 'Which bar is the biggest?' : 'Which bar is the smallest?';
      const wrong = ask.kind === 'most' || ask.kind === 'least' ? shuffle(c.labels.filter((l) => l !== answer)) : [String(Number(answer) + 2), String(Number(answer) - 2), String(Number(answer) + 4)];
      return { ...base('g5-charts', i, d, prompt), type: 'chart', payload: { title: c.title, unit: c.unit, bars, ask }, options: opts3(answer, wrong), answer };
    }
  });
}

function fill<T>(make: () => (T | null)[]): T[] {
  for (;;) { const out = make(); if (out.every((x) => x !== null)) return out as T[]; }
}

mkdirSync(OUT, { recursive: true });
const banks = {
  numbers: fill(numbers), 'big-ops': fill(bigOps), fractions: fractions(), decimals: fill(decimals),
  percent: fill(percentages), geometry: geometry(), charts: charts(),
};
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
