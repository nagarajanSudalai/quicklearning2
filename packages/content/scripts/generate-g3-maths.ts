// Seeds the Grade 3 Maths bank (NCERT Class 3 order). The JSON it writes is the source of
// truth; re-running this script overwrites puzzles/g3-maths/.
//   node scripts/generate-g3-maths.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DAYS, MONTHS, calendarAnswer } from '../src/calendar.ts';
import { timeLabel } from '../src/time.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g3-maths');

let seed = 20261201;
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
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 3, subject: 'maths', topic, difficulty, prompt,
});
const near = (answer: number, steps: number[], n = 3, min = 0) => {
  const opts = new Set([answer]);
  for (const d of shuffle(steps)) if (opts.size < n && answer + d >= min) opts.add(answer + d);
  return shuffle([...opts]);
};
function unique<T>(make: () => T, key: (t: T) => string, seen: Set<string>) {
  for (;;) { const t = make(); const k = key(t); if (!seen.has(k)) { seen.add(k); return t; } }
}

function numbers() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 3) {
      // Compare two 3-digit numbers that share a digit or two, so place value matters.
      const [a, b] = unique(() => {
        const a = int(100, 999);
        const b = i % 5 === 0 ? a : pick([a + int(1, 9), a - int(1, 9), a + 10 * int(1, 5), a - 100, Number(String(a).split('').reverse().join(''))]);
        return [a, b];
      }, (x) => x.join('?'), seen);
      if (b < 100 || b > 999) return null;
      const answer = a > b ? '>' : a < b ? '<' : '=';
      return { ...base('g3-numbers', i, d, `Which sign goes between ${a} and ${b}?`), type: 'compare-numbers', payload: { a, b }, options: ['<', '=', '>'], answer };
    }
    const n = unique(() => int(101, 999), String, seen);
    const [h, t, o] = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
    if (d === 2) {
      const ask = pick(['hundreds', 'tens'] as const);
      const answer = ask === 'hundreds' ? h : t;
      const wrong = [...new Set([ask === 'hundreds' ? t : h, o, ...shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])])].filter((x) => x !== answer).slice(0, 2);
      return { ...base('g3-numbers', i, d, `How many ${ask} are in ${n}?`), type: 'place-value', payload: { hundreds: h, tens: t, ones: o, ask }, options: shuffle([answer, ...wrong]), answer };
    }
    const opts = new Set([n]);
    for (const x of shuffle([o * 100 + t * 10 + h, n + 100, n - 100, n + 10, n - 10])) if (opts.size < 3 && x > 100 && x < 1000) opts.add(x);
    return { ...base('g3-numbers', i, d, 'What number is this?'), type: 'place-value', payload: { hundreds: h, tens: t, ones: o, ask: 'number' }, options: shuffle([...opts]), answer: n };
  });
}

function addSub() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const op = i % 2 ? '-' : '+';
    const [a, b] = unique(() => {
      for (;;) {
        const a = int(100, 899), b = int(100, op === '+' ? 999 - a : a - 1);
        if (b < 100) continue;
        const digits = (x: number) => [x % 10, Math.floor(x / 10) % 10];
        const [ao, at] = digits(a), [bo, bt] = digits(b);
        const regroups = op === '+' ? [ao + bo >= 10, at + bt + (ao + bo >= 10 ? 1 : 0) >= 10] : [ao < bo, at - (ao < bo ? 1 : 0) < bt];
        const n = regroups.filter(Boolean).length;
        if (n === d - 1) return [a, b];
      }
    }, (x) => x.join(op), seen);
    const answer = op === '+' ? a + b : a - b;
    const prompt = op === '+' ? `What is ${a} plus ${b}?` : `What is ${a} take away ${b}?`;
    return { ...base('g3-add-sub', i, d, prompt), type: 'arithmetic', payload: { a, op, b }, options: near(answer, [10, -10, 100, -100, 1, -1]), answer };
  });
}

function tables() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const [a, b] = unique(() => [d === 1 ? int(2, 5) : int(6, 9), int(2, 10)], (x) => x.join('x'), seen);
    if (d === 3) {
      const p = a * b;
      return { ...base('g3-tables', i, d, `What number times ${b} makes ${p}?`), type: 'arithmetic', payload: { a, op: '×', b, missing: 'a' }, options: near(a, [1, -1, 2, -2], 3, 1), answer: a };
    }
    return { ...base('g3-tables', i, d, `What is ${a} times ${b}?`), type: 'arithmetic', payload: { a, op: '×', b }, options: near(a * b, [a, -a, b, -b, 1]), answer: a * b };
  });
}

const ITEMS = [['🍬', 'sweets'], ['🍪', 'biscuits'], ['🥭', 'mangoes'], ['🖍️', 'crayons'], ['🎈', 'balloons'], ['⭐', 'stickers']] as const;
const NAMES = ['Asha', 'Ravi', 'Meena', 'Arjun', 'Priya', 'Kabir'];
function sharing() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const [q, b] = unique(() => (d === 1 ? [int(2, 5), int(2, 3)] : [int(2, 10), int(2, 5)]), (x) => x.join('/'), seen);
    const a = q * b;
    const [emoji, thing] = pick(ITEMS);
    if (d === 3) {
      const who = pick(NAMES);
      return { ...base('g3-sharing', i, d, `${who} shares ${a} ${thing} equally among ${b} friends. How many does each friend get?`), type: 'arithmetic', payload: { a, op: '÷', b }, options: near(q, [1, -1, 2, b - q].filter((x) => x !== 0), 3, 1), answer: q };
    }
    const payload = d === 1 ? { a, op: '÷', b, item: emoji } : { a, op: '÷', b };
    return { ...base('g3-sharing', i, d, `What is ${a} divided by ${b}?`), type: 'arithmetic', payload, options: near(q, [1, -1, 2, -2], 3, 1), answer: q };
  });
}

function fractions() {
  const seen = new Set<string>();
  const pool: Record<number, [number, number][]> = {
    1: [[1, 2], [1, 4], [2, 4], [3, 4]],
    2: [[1, 3], [2, 3], [1, 4], [3, 4], [1, 2]],
    3: [[1, 4], [3, 4], [2, 3], [1, 3], [1, 2], [2, 4], [3, 8], [5, 8]],
  };
  return levels([7, 7, 6]).map((d, i) => {
    const [shaded, parts, shape] = unique(() => [...pick(pool[d]), pick(['circle', 'bar'])] as [number, number, string], (x) => `${d}:${x.join('-')}` + (d === 3 ? `-${i}` : ''), seen);
    const answer = `${shaded}/${parts}`;
    // Wrong options: flipped (4/3 is not shown, so use parts - shaded), and a different denominator.
    const wrong = shuffle([...new Set([`${parts - shaded}/${parts}`, `${shaded}/${parts === 4 ? 3 : 4}`, `${shaded}/${parts + 1}`, `${Math.min(shaded + 1, parts - 1)}/${parts}`])].filter((f) => f !== answer && Number(f.split('/')[0]) > 0)).slice(0, 2);
    const ask = d === 3 ? 'picture' : 'name';
    const prompt = ask === 'name' ? 'What part is shaded?' : `Which picture shows ${answer}?`;
    return { ...base('g3-fractions', i, d, prompt), type: 'fraction', payload: { shape, ask, parts, shaded }, options: shuffle([answer, ...wrong]), answer };
  });
}

function timeCalendar() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      const [hour, minute] = unique(() => [int(1, 12), 5 * int(1, 11)], (x) => x.join(':'), seen);
      const answer = timeLabel(hour, minute);
      const wrong = shuffle([...new Set([timeLabel(hour, (minute + 5) % 60 || 5), timeLabel(hour, minute >= 10 ? minute - 5 : minute + 10), timeLabel((hour % 12) + 1, minute), timeLabel(Math.floor(minute / 5) || 12, hour * 5 % 60 || 5)])].filter((t) => t !== answer)).slice(0, 2);
      return { ...base('g3-time', i, d, 'What time is it?'), type: 'clock', payload: { hour, minute }, options: shuffle([answer, ...wrong]), answer };
    }
    if (d === 2) {
      const [day, offset] = unique(() => [pick(DAYS), pick([1, -1, 2, 3])] as [string, number], (x) => x.join(), seen);
      const answer = calendarAnswer('day', day, offset);
      const q = offset === 1 ? `What day comes after ${day}?` : offset === -1 ? `What day comes before ${day}?` : `Today is ${day}. What day will it be in ${offset} days?`;
      const wrong = shuffle(DAYS.filter((x) => x !== answer && x !== day)).slice(0, 2);
      return { ...base('g3-time', i, d, q), type: 'calendar', payload: { kind: 'day', base: day, offset }, options: shuffle([answer, ...wrong]), answer };
    }
    if (i % 2) {
      const m = unique(() => pick(MONTHS), (x) => `days-${x}`, seen);
      const answer = calendarAnswer('days-in', m, 0);
      return { ...base('g3-time', i, d, `How many days are there in ${m}?`), type: 'calendar', payload: { kind: 'days-in', base: m, offset: 0 }, options: ['28', '30', '31'], answer };
    }
    const m = unique(() => pick(MONTHS), (x) => `after-${x}`, seen);
    const answer = calendarAnswer('month', m, 1);
    return { ...base('g3-time', i, d, `Which month comes after ${m}?`), type: 'calendar', payload: { kind: 'month', base: m, offset: 1 }, options: shuffle([answer, ...shuffle(MONTHS.filter((x) => x !== answer && x !== m)).slice(0, 2)]), answer };
  });
}

const OBJECTS = ['✏️', '🖍️', '🔑', '🥄', '🍌', '🐛'];
function moneyMeasure() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 3) {
      const [item, start, length] = unique(() => [pick(OBJECTS), i % 2 ? 0 : int(1, 3), int(3, 12)] as [string, number, number], (x) => x.join(), seen);
      return { ...base('g3-money-measure', i, d, 'How long is it in centimetres?'), type: 'measure', payload: { item, start, length }, options: near(length, start ? [start, -1, 1] : [1, -1, 2]), answer: length };
    }
    const { coins, notes, price } = unique(() => {
      const notes = Array.from({ length: int(1, 3) }, () => pick([10, 20, 50, 100, 200])).sort((a, b) => b - a);
      const coins = Array.from({ length: int(0, 3) }, () => pick([1, 2, 5, 10])).sort((a, b) => b - a);
      const total = [...notes, ...coins].reduce((s, x) => s + x, 0);
      const price = d === 2 ? total - pick([1, 2, 5, 10, 15, 20, 25, 50].filter((c) => c < total)) : undefined;
      return { coins, notes, price };
    }, (x) => [...x.notes, ...x.coins, x.price].join('+'), seen);
    const total = [...notes, ...coins].reduce((s, x) => s + x, 0);
    if (price === undefined) {
      return { ...base('g3-money-measure', i, d, 'How much money is there?'), type: 'money', payload: { coins, notes }, options: near(total, [10, -10, 5, -5, 100]), answer: total };
    }
    const change = total - price;
    return { ...base('g3-money-measure', i, d, `A toy costs ₹${price}. You pay with this money. How much change do you get?`), type: 'money', payload: { coins, notes, price }, options: near(change, [5, -5, 10, -10, 1, -1], 3, 1), answer: change };
  });
}

/** Some generators return null for a rejected random pick; regenerate those slots. */
function fill<T>(make: () => (T | null)[]): T[] {
  for (;;) { const out = make(); if (out.every((x) => x !== null)) return out as T[]; }
}

mkdirSync(OUT, { recursive: true });
const banks = {
  numbers: fill(numbers), 'add-sub': addSub(), tables: tables(), sharing: sharing(),
  fractions: fractions(), time: timeCalendar(), 'money-measure': moneyMeasure(),
};
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
