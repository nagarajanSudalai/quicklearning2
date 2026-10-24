// Practice tests: 10 one-tap questions drawn from a grade's existing banks (3 easy, 4 medium,
// 3 tricky), spread across topics, played with one try each. Functions take the puzzle list as
// an argument so the content checks can run them on the JSON directly.
import type { Grade, Puzzle, SubjectId } from './types';

export const TEST_LENGTH = 10;
const MIX: [1 | 2 | 3, number][] = [[1, 3], [2, 4], [3, 3]];
const TESTED: SubjectId[] = ['maths', 'english', 'science', 'coding', 'robotics', 'thinking'];
const NAMES: Partial<Record<SubjectId, string>> = { maths: 'Maths test', english: 'English test', science: 'Science test', coding: 'Coding test', robotics: 'Robotics test', thinking: 'Thinking Skills test' };

export type TestSubject = SubjectId | 'mixed';
export type TestInfo = { id: string; grade: Grade; subject: TestSubject; title: string };

/** One-tap puzzles only: interactive ones (crosswords, sorting…) have no `options`. */
const pool = (all: Puzzle[], grade: Grade, subject: TestSubject) =>
  all.filter((p) => p.grade === grade && 'options' in p && (subject === 'mixed' ? TESTED.includes(p.subject) : p.subject === subject));

export const testId = (grade: Grade, subject: TestSubject) => `g${grade}-${subject}`;
export function parseTestId(id: string): { grade: Grade; subject: TestSubject } | null {
  const m = /^g([1-5])-(\w+)$/.exec(id);
  return m ? { grade: Number(m[1]) as Grade, subject: m[2] as TestSubject } : null;
}

export function testsFor(all: Puzzle[], grade: Grade): TestInfo[] {
  // A subject test needs enough one-tap puzzles from at least two topics.
  const fits = (s: SubjectId) => { const p = pool(all, grade, s); return p.length >= TEST_LENGTH * 2 && new Set(p.map((x) => x.topic)).size >= 2; };
  const subjects: TestSubject[] = [...TESTED.filter(fits), 'mixed'];
  return subjects.map((subject) => ({ id: testId(grade, subject), grade, subject, title: subject === 'mixed' ? 'Mixed test' : NAMES[subject]! }));
}

/** Picks the questions: the level mix, round-robin over topics (or subjects, for a mixed test), then shuffled. */
export function buildTest(all: Puzzle[], grade: Grade, subject: TestSubject, rand: () => number = Math.random): Puzzle[] {
  const shuffle = <T>(xs: T[]) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const items = pool(all, grade, subject);
  const chosen: Puzzle[] = [];
  const spread = (level: number, n: number) => {
    const by = new Map<string, Puzzle[]>();
    for (const p of shuffle(items.filter((x) => x.difficulty === level && !chosen.includes(x)))) {
      const k = subject === 'mixed' ? p.subject : p.topic;
      by.set(k, [...(by.get(k) ?? []), p]);
    }
    // Start with the groups used least so far, so topics stay balanced across levels.
    const used = (k: string) => chosen.filter((p) => (subject === 'mixed' ? p.subject : p.topic) === k).length;
    const keys = shuffle([...by.keys()]).sort((a, b) => used(a) - used(b));
    let got = 0;
    for (let round = 0; got < n && keys.some((k) => by.get(k)!.length); round++)
      for (const k of keys) { const p = by.get(k)!.shift(); if (p && got < n) { chosen.push(p); got++; } }
    return got;
  };
  for (const [level, n] of MIX) {
    const short = n - spread(level, n);
    // Not enough at this level: borrow from the nearest one.
    if (short) spread(level === 3 ? 2 : level + 1, short) < short && spread(level === 1 ? 2 : level - 1, short);
  }
  return shuffle(chosen.slice(0, TEST_LENGTH));
}

export type TestScore = { right: number; total: number; byTopic: { topic: string; right: number; total: number }[]; weak: string[] };

/** `answers[k]` is whether question k was answered right. Weak = under two-thirds right in a topic. */
export function scoreTest(puzzles: Puzzle[], answers: boolean[]): TestScore {
  const byTopic: TestScore['byTopic'] = [];
  puzzles.forEach((p, k) => {
    let row = byTopic.find((r) => r.topic === p.topic);
    if (!row) byTopic.push((row = { topic: p.topic, right: 0, total: 0 }));
    row.total++;
    if (answers[k]) row.right++;
  });
  return { right: answers.filter(Boolean).length, total: puzzles.length, byTopic, weak: byTopic.filter((r) => r.right * 3 < r.total * 2).map((r) => r.topic) };
}
