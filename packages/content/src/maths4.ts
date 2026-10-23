// Grade 4 maths helpers, shared by the generator, the checker and the app.

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
export const fracStr = ([n, d]: [number, number]) => `${n}/${d}`;
export const fracVal = (f: string) => { const [n, d] = f.split('/').map(Number); return n / d; };
/** Compare n1/d1 with n2/d2 exactly (cross-multiplying). */
export const fracCmp = (a: [number, number], b: [number, number]) => Math.sign(a[0] * b[1] - b[0] * a[1]);

/** Which numbers fit a pick-all rule. */
export function fits(kind: 'multiple' | 'factor' | 'common-multiple', n: number, x: number, m?: number) {
  if (kind === 'multiple') return x % n === 0;
  if (kind === 'factor') return n % x === 0;
  return x % n === 0 && x % (m ?? 1) === 0;
}

const pad = (n: number) => String(n).padStart(2, '0');
/** 24-hour time to "3:05 pm" style. */
export const to12 = (h: number, m: number) => `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h < 12 ? 'am' : 'pm'}`;
export const to24 = (h: number, m: number) => `${pad(h)}:${pad(m)}`;
export function duration(a: [number, number], b: [number, number]) {
  const mins = b[0] * 60 + b[1] - (a[0] * 60 + a[1]);
  const h = Math.floor(mins / 60), m = mins % 60;
  const parts = [h ? `${h} ${h === 1 ? 'hour' : 'hours'}` : '', m ? `${m} minutes` : ''].filter(Boolean);
  return parts.join(' ') || '0 minutes';
}
export function timeCalcAnswer(kind: 'to24' | 'to12' | 'duration', a: [number, number], b?: [number, number]) {
  if (kind === 'to24') return to24(a[0], a[1]);
  if (kind === 'to12') return to12(a[0], a[1]);
  return duration(a, b!);
}

/** Area (shaded squares) and perimeter (edges between a shaded square and the outside) of a grid shape. */
export function gridMeasure(rows: number, cols: number, cells: boolean[]) {
  const on = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols && cells[r * cols + c];
  let area = 0, perimeter = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (!on(r, c)) continue;
    area++;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!on(r + dr, c + dc)) perimeter++;
  }
  return { area, perimeter };
}

export const rupeesStr = (rupees: number, paise: number) => `₹${rupees}.${String(paise).padStart(2, '0')}`;
