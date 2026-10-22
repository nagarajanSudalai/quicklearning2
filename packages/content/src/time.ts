/** How a Grade 2 child says a clock time: "3 o'clock", "half past 3", "quarter past 3", "quarter to 4". */
export function timeLabel(hour: number, minute: number): string {
  const next = (hour % 12) + 1;
  if (minute === 0) return `${hour} o'clock`;
  if (minute === 30) return `half past ${hour}`;
  if (minute === 15) return `quarter past ${hour}`;
  if (minute === 45) return `quarter to ${next}`;
  return `${hour}:${String(minute).padStart(2, '0')}`;
}
