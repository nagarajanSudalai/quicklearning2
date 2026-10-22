// Seeds the Grade 2 Maths bank (NCERT Class 2 order). The JSON it writes is the source of
// truth; re-running this script overwrites puzzles/g2-maths/.
//   node scripts/generate-g2-maths.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { timeLabel } from '../src/time.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g2-maths');

let seed = 20261101;
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
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 2, subject: 'maths', topic, difficulty, prompt,
});
/** Answer plus nearby wrong numbers ≥ min; `steps` are the offsets tried. */
const near = (answer: number, steps = [-2, -1, 1, 2, 10, -10], n = 3, min = 0) => {
  const opts = new Set([answer]);
  for (const d of shuffle(steps)) if (opts.size < n && answer + d >= min) opts.add(answer + d);
  return shuffle([...opts]);
};
/** Unique by a key, retrying until `make` gives something new. */
function unique<T>(make: () => T, key: (t: T) => string, seen: Set<string>) {
  for (;;) { const t = make(); const k = key(t); if (!seen.has(k)) { seen.add(k); return t; } }
}

function placeValue() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const n = unique(() => (d === 1 ? int(11, 50) : int(21, 99)), String, seen);
    const tens = Math.floor(n / 10), ones = n % 10;
    if (d === 3) {
      const ask = i % 2 ? 'tens' : 'ones';
      const answer = ask === 'tens' ? tens : ones;
      const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== answer));
      // Offer the other digit too — mixing up tens and ones is the mistake to catch.
      const other = ask === 'tens' ? ones : tens;
      const wrong = [...new Set([other, ...digits])].filter((x) => x !== answer).slice(0, 2);
      return { ...base('g2-place-value', i, d, `How many ${ask} are in ${n}?`), type: 'place-value', payload: { tens, ones, ask }, options: shuffle([answer, ...wrong]), answer };
    }
    // Swapped digits (e.g. 34 vs 43) are the classic place-value mistake.
    const swap = ones * 10 + tens;
    const opts = new Set([n]);
    if (swap !== n && ones > 0) opts.add(swap);
    for (const x of shuffle([n + 10, n - 10, n + 1, n - 1])) if (opts.size < 3 && x > 0 && x < 100) opts.add(x);
    return { ...base('g2-place-value', i, d, 'What number is this?'), type: 'place-value', payload: { tens, ones, ask: 'number' }, options: shuffle([...opts]), answer: n };
  });
}

function addSub(op: '+' | '-') {
  const topic = op === '+' ? 'g2-addition' : 'g2-subtraction';
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const [a, b] = unique(() => {
      for (;;) {
        if (op === '+') {
          const a = int(10, 89);
          const b = d === 1 ? int(1, 9) : int(10, 99 - a);
          const carry = (a % 10) + (b % 10) >= 10;
          if (b < 1 || a + b > 99) continue;
          if (d === 3 ? carry : !carry) return [a, b];
        } else {
          const a = int(20, 99);
          const b = d === 1 ? int(1, 9) : int(10, a - 1);
          const borrow = a % 10 < b % 10;
          if (d === 3 ? borrow : !borrow) return [a, b];
        }
      }
    }, (x) => x.join(op), seen);
    const answer = op === '+' ? a + b : a - b;
    const prompt = op === '+' ? `What is ${a} plus ${b}?` : `What is ${a} take away ${b}?`;
    return { ...base(topic, i, d, prompt), type: 'arithmetic', payload: { a, op, b }, options: near(answer, d === 3 ? [10, -10, 1, -1] : [-2, -1, 1, 2, 10]), answer };
  });
}

function skipCounting() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const seq = unique(() => {
      const step = d === 1 ? pick([2, 5, 10]) : d === 2 ? pick([2, 3, 4, 5, 10]) : -pick([2, 5, 10]);
      const len = 5;
      const start = step > 0 ? step * int(0, 4) + (d === 2 ? int(0, 1) * step : 0) : 100 - (-step) * int(0, 5);
      return Array.from({ length: len }, (_, k) => start + step * k);
    }, (s) => s.join(','), seen);
    const blank = d === 1 ? 4 : int(1, 3);
    const answer = seq[blank];
    const step = Math.abs(seq[1] - seq[0]);
    const shown = seq.map((x, k) => (k === blank ? null : x));
    return { ...base('g2-skip-counting', i, d, 'Which number is missing?'), type: 'number-pattern', payload: { seq: shown }, options: near(answer, [1, -1, step + 1, -(step + 1), 10, -10].filter((x) => x !== 0)), answer };
  });
}

const ITEMS = ['🍎', '🍪', '⭐', '🎈', '🍓', '🐟', '🌸', '⚽'];
function groups() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const [a, b] = unique(() => (d === 1 ? [int(2, 5), int(2, 3)] : d === 2 ? [int(2, 5), int(2, 5)] : [int(2, 9), pick([2, 5, 10])]), (x) => x.join('x'), seen);
    const answer = a * b;
    // Level 3 reads as a times-table fact (b × table); levels 1–2 as groups of pictures.
    const prompt = d < 3 ? `${a} groups of ${b}. How many in all?` : `What is ${a} times ${b}?`;
    const payload = d < 3 ? { a, op: '×', b, item: pick(ITEMS) } : { a, op: '×', b };
    return { ...base('g2-groups', i, d, prompt), type: 'arithmetic', payload, options: near(answer, [a, -a, b, -b, 1, -1].filter((x) => x !== 0), 3, 1), answer };
  });
}

function clock() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const [hour, minute] = unique(() => [int(1, 12), d === 1 ? 0 : d === 2 ? pick([0, 30, 30]) : pick([15, 45, 30])] as [number, number], (x) => x.join(':'), seen);
    const answer = timeLabel(hour, minute);
    const prev = hour === 1 ? 12 : hour - 1, next = (hour % 12) + 1;
    // Wrong options: the classic mix-ups (hour off by one, hands swapped, half past vs o'clock).
    const wrong = shuffle([...new Set([
      timeLabel(next, minute), timeLabel(prev, minute),
      timeLabel(hour, minute === 0 ? 30 : 0),
      minute === 15 ? timeLabel(hour, 45) : minute === 45 ? timeLabel(hour, 15) : timeLabel(hour, minute === 30 ? 0 : 30),
    ])].filter((t) => t !== answer));
    return { ...base('g2-time', i, d, 'What time is it?'), type: 'clock', payload: { hour, minute }, options: shuffle([answer, ...wrong.slice(0, 2)]), answer };
  });
}

function money() {
  const seen = new Set<string>();
  const max = { 1: 10, 2: 50, 3: 100 } as Record<number, number>;
  return levels([7, 7, 6]).map((d, i) => {
    const { coins, notes } = unique(() => {
      for (;;) {
        const coins = Array.from({ length: d === 1 ? int(2, 3) : int(2, 4) }, () => pick(d === 1 ? [1, 2, 5] : [1, 2, 5, 10])).sort((a, b) => b - a);
        const notes = d === 1 ? [] : Array.from({ length: d === 2 ? int(1, 2) : int(1, 3) }, () => pick(d === 2 ? [10, 20] : [10, 20, 50])).sort((a, b) => b - a);
        if ([...coins, ...notes].reduce((s, x) => s + x, 0) <= max[d]) return { coins, notes };
      }
    }, (x) => [...x.notes, ...x.coins].join('+'), seen);
    const answer = [...coins, ...notes].reduce((s, x) => s + x, 0);
    return { ...base('g2-money', i, d, 'How much money is there?'), type: 'money', payload: { coins, notes }, options: near(answer, [1, -1, 2, -2, 5, -5, 10], 3, 1), answer };
  });
}

mkdirSync(OUT, { recursive: true });
const banks = {
  'place-value': placeValue(), addition: addSub('+'), subtraction: addSub('-'), 'skip-counting': skipCounting(),
  groups: groups(), time: clock(), money: money(),
};
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
