export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** Days in each month (February in a normal year). */
export const MONTH_DAYS: Record<string, number> = Object.fromEntries(MONTHS.map((m, i) => [m, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i]]));

const shift = (list: string[], base: string, offset: number) => list[(((list.indexOf(base) + offset) % list.length) + list.length) % list.length];

/** The answer to a calendar question. */
export function calendarAnswer(kind: 'day' | 'month' | 'days-in', base: string, offset: number): string {
  if (kind === 'day') return shift(DAYS, base, offset);
  if (kind === 'month') return shift(MONTHS, base, offset);
  return String(MONTH_DAYS[base]);
}
