// Grade 5 maths helpers, shared by the generator, the checker and the app.
// Kept local (not imported from maths4) so the generator scripts can load this file directly in Node.
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export const angleName = (deg: number) => (deg < 90 ? 'acute' : deg === 90 ? 'right' : deg < 180 ? 'obtuse' : 'straight');

export function percentAnswer(p: { kind: 'grid'; shaded: number } | { kind: 'of'; pct: number; of: number } | { kind: 'sale'; pct: number; price: number }) {
  if (p.kind === 'grid') return `${p.shaded}%`;
  if (p.kind === 'of') return String((p.pct * p.of) / 100);
  return `₹${p.price - (p.pct * p.price) / 100}`;
}

type Bars = { label: string; value: number }[];
export type ChartAsk = { kind: 'value'; label: string } | { kind: 'diff'; a: string; b: string } | { kind: 'total' } | { kind: 'most' } | { kind: 'least' };
export function chartAnswer(bars: Bars, ask: ChartAsk): string {
  const v = (l: string) => bars.find((b) => b.label === l)!.value;
  if (ask.kind === 'value') return String(v(ask.label));
  if (ask.kind === 'diff') return String(Math.abs(v(ask.a) - v(ask.b)));
  if (ask.kind === 'total') return String(bars.reduce((s, b) => s + b.value, 0));
  const sorted = [...bars].sort((a, b) => (ask.kind === 'most' ? b.value - a.value : a.value - b.value));
  return sorted[0].label;
}

export const simplify = ([n, d]: [number, number]): [number, number] => { const g = gcd(n, d); return [n / g, d / g]; };
/** a + b for fractions with different bottoms, in lowest terms. */
export const addFractions = (a: [number, number], b: [number, number]) => simplify([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);

/** Decimal sums done in hundredths so floating point never shows (0.1 + 0.2). */
export function decimalSum(a: string, b: string, op: '+' | '-') {
  const h = (x: string) => Math.round(Number(x) * 100);
  const r = op === '+' ? h(a) + h(b) : h(a) - h(b);
  return (r / 100).toFixed(2);
}
export const roundWhole = (a: string) => String(Math.round(Number(a)));
