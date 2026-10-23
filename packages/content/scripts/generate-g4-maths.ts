// Seeds the Grade 4 Maths bank (NCERT Class 4). The JSON it writes is the source of truth;
// re-running this script overwrites puzzles/g4-maths/.
//   node scripts/generate-g4-maths.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { duration, fits, fracCmp, fracStr, gcd, gridMeasure, rupeesStr, to12, to24 } from '../src/maths4.ts';
import { timeLabel } from '../src/time.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g4-maths');

let seed = 20261301;
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
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 4, subject: 'maths', topic, difficulty, prompt,
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

function largeNumbers() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    const n = unique(() => int(1001, 9999), String, seen);
    const [th, h, t, o] = String(n).split('').map(Number);
    if (d === 1) {
      const ask = pick(['thousands', 'hundreds'] as const);
      const answer = ask === 'thousands' ? th : h;
      const wrong = [...new Set([ask === 'thousands' ? h : th, t, o, ...shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])])].filter((x) => x !== answer).slice(0, 2);
      return { ...base('g4-numbers', i, d, `How many ${ask} are in ${fmt(n)}?`), type: 'place-value', payload: { thousands: th, hundreds: h, tens: t, ones: o, ask }, options: shuffle([answer, ...wrong]), answer };
    }
    if (d === 2) {
      // Swapping two digits is the usual mistake with expanded form.
      const opts = new Set([n]);
      for (const x of shuffle([th * 1000 + t * 100 + h * 10 + o, th * 1000 + h * 100 + o * 10 + t, n + 1000, n - 100])) if (opts.size < 3 && x > 1000 && x < 10000) opts.add(x);
      return { ...base('g4-numbers', i, d, 'Which number is this?'), type: 'place-value', payload: { thousands: th, hundreds: h, tens: t, ones: o, ask: 'expanded' }, options: shuffle([...opts]), answer: n };
    }
    const b = i % 6 === 0 ? n : pick([n + int(1, 9), n - int(1, 9) * 10, Number(String(n).slice(0, 2) + String(n).slice(2).split('').reverse().join('')), n + 1000]);
    if (b < 1000 || b > 9999) return null;
    const answer = n > b ? '>' : n < b ? '<' : '=';
    return { ...base('g4-numbers', i, d, `Which sign goes between ${fmt(n)} and ${fmt(b)}?`), type: 'compare-numbers', payload: { a: n, b }, options: ['<', '=', '>'], answer };
  });
}

function mulDiv() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 2) {
      const [q, b] = unique(() => [int(21, 199), int(2, 9)], (x) => x.join('/'), seen);
      const a = q * b;
      return { ...base('g4-mul-div', i, d, `What is ${a} divided by ${b}?`), type: 'arithmetic', payload: { a, op: '÷', b }, options: near(q, [1, -1, 10, -10], 3, 1), answer: q };
    }
    const [a, b] = unique(() => (d === 1 ? [int(12, 99), int(2, 9)] : [int(11, 49), int(11, 29)]), (x) => x.join('x'), seen);
    const answer = a * b;
    return { ...base('g4-mul-div', i, d, `What is ${a} times ${b}?`), type: 'arithmetic', payload: { a, op: '×', b }, options: near(answer, [a, -a, b, -b, 10, -10]), answer };
  });
}

function factors() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      let kind: 'multiple' | 'factor' | 'common-multiple', n: number, m: number | undefined, items: number[];
      if (d === 1) { kind = 'multiple'; n = pick([2, 3, 4, 5, 10]); const start = int(1, 20); const step = pick([1, 2]); items = Array.from({ length: 9 }, (_, k) => start + k * step); }
      else if (d === 2) { kind = 'factor'; n = pick([12, 16, 18, 20, 24, 28, 30, 36]); items = shuffle([...Array(12).keys()].map((k) => k + 1)).slice(0, 9).sort((a, b) => a - b); }
      else { kind = 'common-multiple'; [n, m] = pick([[2, 3], [3, 4], [2, 5], [4, 6], [3, 5]]); items = shuffle([...Array(40).keys()].map((k) => k + 1)).slice(0, 9).sort((a, b) => a - b); }
      const right = items.filter((x) => fits(kind, n, x, m)).length;
      // Two to five right answers keeps it a real search.
      if (right < 2 || right > 5) continue;
      const key = `${kind}${n}${m}${items.join()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const prompt = kind === 'multiple' ? `Tap all the multiples of ${n}.` : kind === 'factor' ? `Tap all the factors of ${n}.` : `Tap the numbers that are multiples of both ${n} and ${m}.`;
      return { ...base('g4-factors', i, d, prompt), type: 'pick-all', payload: { kind, n, ...(m ? { m } : {}), items } };
    }
  });
}

function fractions() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      const [a, k] = unique(() => [pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]] as [number, number][]), int(2, 4)] as const, (x) => `${x[0]}${x[1]}`, seen);
      const answer = fracStr([a[0] * k, a[1] * k]);
      const wrong = [fracStr([a[0] + k, a[1] + k]), fracStr([a[0] * k, a[1] * k + 1]), fracStr([a[0] * k + 1, a[1] * k])].filter((f) => f !== answer).slice(0, 2);
      return { ...base('g4-fractions', i, d, `Which fraction is equal to ${fracStr(a)}?`), type: 'fraction-op', payload: { op: 'equivalent', a }, options: shuffle([answer, ...wrong]), answer };
    }
    if (d === 2) {
      const [a, b] = unique(() => {
        for (;;) {
          const a: [number, number] = [int(1, 5), int(2, 8)], b: [number, number] = [int(1, 5), int(2, 8)];
          if (a[0] < a[1] && b[0] < b[1] && fracCmp(a, b) !== 0 && gcd(a[0], a[1]) === 1 && gcd(b[0], b[1]) === 1) return [a, b];
        }
      }, (x) => x.flat().join(), seen);
      const answer = fracStr(fracCmp(a, b) > 0 ? a : b);
      return { ...base('g4-fractions', i, d, `Which is bigger, ${fracStr(a)} or ${fracStr(b)}?`), type: 'fraction-op', payload: { op: 'bigger', a, b }, options: [fracStr(a), fracStr(b)], answer };
    }
    const [a, b] = unique(() => { const den = pick([5, 6, 8, 10]); const x = int(1, den - 2); const y = int(1, den - 1 - x); return [[x, den], [y, den]] as [number, number][]; }, (x) => x.flat().join(), seen);
    const answer = fracStr([a[0] + b[0], a[1]]);
    const wrong = [fracStr([a[0] + b[0], a[1] * 2]), fracStr([a[0] + b[0] + 1, a[1]]), fracStr([Math.abs(a[0] - b[0]) || 1, a[1]])].filter((f) => f !== answer);
    return { ...base('g4-fractions', i, d, `What is ${fracStr(a)} + ${fracStr(b)}?`), type: 'fraction-op', payload: { op: 'add', a, b }, options: shuffle([answer, ...[...new Set(wrong)].slice(0, 2)]), answer };
  });
}

function decimals() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      const [r, p] = unique(() => [int(1, 20), pick([5, 10, 25, 50, 75, 90])], (x) => x.join('.'), seen);
      const answer = String(r * 100 + p);
      const wrong = [String(r * 10 + p), String(r + p), String(r * 100 + p * 10)].filter((x) => x !== answer);
      return { ...base('g4-decimals', i, d, `How many paise is ${rupeesStr(r, p)}?`), type: 'decimal', payload: { kind: 'paise', rupees: r, paise: p }, options: shuffle([answer, ...[...new Set(wrong)].slice(0, 2)]), answer };
    }
    if (d === 2) {
      const t = unique(() => int(1, 9), String, seen);
      const answer = `0.${t}`;
      return { ...base('g4-decimals', i, d, 'The bar has 10 equal parts. What decimal is shaded?'), type: 'decimal', payload: { kind: 'tenths', tenths: t }, options: shuffle([answer, `0.0${t}`, `${t}.0`]), answer };
    }
    // Compare decimals where the longer one is smaller — the classic trap (0.5 vs 0.45).
    const [a, b] = unique(() => { const x = int(1, 9); const y = int(10, 99); return [`0.${x}`, `0.${y}`]; }, (x) => x.join(), seen);
    if (Number(a) === Number(b)) return null;
    const answer = Number(a) > Number(b) ? a : b;
    return { ...base('g4-decimals', i, d, `Which is bigger, ${a} or ${b}?`), type: 'decimal', payload: { kind: 'bigger', a, b }, options: [a, b], answer };
  });
}

function time() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1) {
      const [hour, minute] = unique(() => [int(1, 12), int(1, 59)], (x) => x.join(':'), seen);
      if (minute % 5 === 0) return null;
      const answer = timeLabel(hour, minute);
      const wrong = [...new Set([timeLabel(hour, (minute + 5) % 60 || 1), timeLabel((hour % 12) + 1, minute), timeLabel(hour, Math.abs(minute - 10) || 2)])].filter((x) => x !== answer).slice(0, 2);
      return { ...base('g4-time', i, d, 'What time is it?'), type: 'clock', payload: { hour, minute }, options: shuffle([answer, ...wrong]), answer };
    }
    if (d === 2) {
      const [h, m] = unique(() => [int(0, 23), 5 * int(0, 11)] as [number, number], (x) => x.join(':'), seen);
      const kind = i % 2 ? 'to24' : 'to12';
      const answer = kind === 'to24' ? to24(h, m) : to12(h, m);
      const flip = (h + 12) % 24;
      const wrong = kind === 'to24' ? [to24(flip, m), to24(h % 12, m) === answer ? to24((h + 1) % 24, m) : to24(h % 12, m)] : [to12(flip, m), to12((h + 1) % 24, m)];
      const prompt = kind === 'to24' ? `Write ${to12(h, m)} in 24-hour time.` : `What is ${to24(h, m)} in am/pm time?`;
      return { ...base('g4-time', i, d, prompt), type: 'time-calc', payload: { kind, a: [h, m] }, options: shuffle([answer, ...[...new Set(wrong)].filter((x) => x !== answer)]), answer };
    }
    const [a, b] = unique(() => { const h = int(7, 16), m = 5 * int(0, 11); const len = 5 * int(6, 40); const e = h * 60 + m + len; return [[h, m], [Math.floor(e / 60), e % 60]] as [number, number][]; }, (x) => x.flat().join(), seen);
    const answer = duration(a, b);
    const mins = b[0] * 60 + b[1] - a[0] * 60 - a[1];
    const alt = (x: number) => duration([0, 0], [Math.floor(x / 60), x % 60]);
    const wrong = [...new Set([alt(mins + 60), alt(Math.max(5, mins - 10)), alt(mins + 15)])].filter((x) => x !== answer).slice(0, 2);
    return { ...base('g4-time', i, d, `A class starts at ${to12(...a)} and ends at ${to12(...b)}. How long is it?`), type: 'time-calc', payload: { kind: 'duration', a, b }, options: shuffle([answer, ...wrong]), answer };
  });
}

function areaPerimeter() {
  const seen = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const rows = d === 3 ? int(2, 5) : 5, cols = d === 3 ? int(rows + 1, 9) : 6;
      let cells: boolean[];
      if (d === 3) cells = Array(rows * cols).fill(true);
      else {
        // A random connected blob grown from the middle.
        cells = Array(rows * cols).fill(false);
        let r = 2, c = 2; cells[r * cols + c] = true;
        for (let k = 0; k < int(4, 10); k++) {
          const [dr, dc] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
          if (r + dr >= 0 && r + dr < rows && c + dc >= 0 && c + dc < cols) { r += dr; c += dc; cells[r * cols + c] = true; }
        }
      }
      const key = cells.map(Number).join('') + rows + cols + d;
      if (seen.has(key)) continue;
      seen.add(key);
      const { area, perimeter } = gridMeasure(rows, cols, cells);
      const ask = d === 1 ? 'area' : d === 2 ? 'perimeter' : i % 2 ? 'area' : 'perimeter';
      const answer = ask === 'area' ? area : perimeter;
      const prompt = d === 3
        ? (ask === 'area' ? `A rectangle is ${cols} cm long and ${rows} cm wide. What is its area in square cm?` : `A rectangle is ${cols} cm long and ${rows} cm wide. What is its perimeter in cm?`)
        : ask === 'area' ? 'How many squares does the shape cover? (area)' : 'How many square edges go round the outside? (perimeter)';
      // Mixing up area and perimeter is the mistake to catch.
      const other = ask === 'area' ? perimeter : area;
      const options = shuffle([...new Set([answer, other !== answer ? other : answer + 2, answer + (ask === 'area' ? 1 : 2), answer - 2].filter((x) => x > 0))].slice(0, 3));
      if (!options.includes(answer) || options.length < 3) continue;
      return { ...base('g4-area', i, d, prompt), type: 'grid-shape', payload: { rows, cols, cells, ask, ...(d === 3 ? { labels: true } : {}) }, options, answer };
    }
  });
}

function fill<T>(make: () => (T | null)[]): T[] {
  for (;;) { const out = make(); if (out.every((x) => x !== null)) return out as T[]; }
}

mkdirSync(OUT, { recursive: true });
const banks = {
  numbers: fill(largeNumbers), 'mul-div': mulDiv(), factors: factors(), fractions: fractions(),
  decimals: fill(decimals), time: fill(time), area: areaPerimeter(),
};
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
