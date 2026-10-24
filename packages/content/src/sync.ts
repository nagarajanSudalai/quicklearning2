// Merging a child's progress from two places (this device and the account), so syncing never
// loses work: solved puzzles are combined, stars and streaks keep the higher count, and test
// reports are combined by date.

export type SyncedProgress = {
  stars: number;
  solved: Record<string, true>;
  streak: number;
  lastPlayed: string | null;
  tests: { date: string }[];
};

export function mergeProgress<P extends SyncedProgress>(a: P, b: Partial<P> | null | undefined): P {
  if (!b) return a;
  const tests = [...a.tests];
  for (const t of b.tests ?? []) if (!tests.some((x) => x.date === t.date)) tests.push(t);
  tests.sort((x, y) => (x.date < y.date ? 1 : -1));
  // The streak belongs with the most recent play day.
  const newer = (b.lastPlayed ?? '') > (a.lastPlayed ?? '') ? b : a;
  return {
    ...a,
    stars: Math.max(a.stars, b.stars ?? 0),
    solved: { ...(b.solved ?? {}), ...a.solved },
    streak: newer === a ? (a.lastPlayed === b.lastPlayed ? Math.max(a.streak, b.streak ?? 0) : a.streak) : b.streak ?? 0,
    lastPlayed: newer.lastPlayed ?? null,
    tests: tests.slice(0, 30) as P['tests'],
  };
}
