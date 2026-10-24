// Unit tests: the device-voice picker, speech rules, adaptive difficulty, and the puzzle solvers.
//   npm test
import assert from 'node:assert/strict';
import { nextLevel, pickNext, startLevel } from '../src/adaptive.ts';
import { isMagic, logicSolutions, magicSolutions, sumGridSolutions } from '../src/logic.ts';
import { addFractions, angleName, chartAnswer, percentAnswer, roundWhole, simplify } from '../src/maths5.ts';
import { countSolutions, isSolved } from '../src/sudoku.ts';
import { duration, fits, fracCmp, gridMeasure, to12, to24 } from '../src/maths4.ts';
import { encode, patternTerms } from '../src/thinking4.ts';
import { oneLetterApart } from '../src/words4.ts';
import type { Puzzle } from '../src/types.ts';
import { buildTest, scoreTest, testsFor } from '../src/tests.ts';
import { mergeProgress, type SyncedProgress } from '../src/sync.ts';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pickVoice, speakable, type VoiceLike } from '../src/voice.ts';

const V = (identifier: string, language: string, extra: Partial<VoiceLike> = {}): VoiceLike => ({ identifier, name: identifier, quality: 'Default', language, ...extra });
const pick = (vs: VoiceLike[]) => pickVoice(vs)?.identifier;

assert.equal(pick([V('Samantha', 'en-US'), V('Daniel', 'en-GB'), V('Veena', 'en-IN'), V('com.apple.voice.enhanced.en-IN.Isha', 'en-IN', { quality: 'Enhanced' })]), 'com.apple.voice.enhanced.en-IN.Isha', 'iOS: enhanced en-IN');
assert.equal(pick([V('en-us-x-sfg-local', 'en-US'), V('en-in-x-ena-local', 'en-IN'), V('en-in-x-ena-network', 'en-IN')]), 'en-in-x-ena-network', 'Android: network en-IN');
assert.equal(pick([V('Google UK English Female', 'en-GB', { localService: false }), V('Microsoft Heera - English (India)', 'en-IN', { localService: true })]), 'Microsoft Heera - English (India)', 'web: en-IN beats a better en-GB');
assert.equal(pick([V('Samantha', 'en-US'), V('Daniel', 'en-GB')]), 'Daniel', 'falls back to en-GB');
assert.equal(pick([V('Bubbles', 'en-US'), V('Samantha', 'en-US')]), 'Samantha', 'skips novelty voices');
assert.equal(pick([V('en_IN', 'en_IN')]), 'en_IN', 'accepts underscore locales');
assert.equal(pick([V('Amelie', 'fr-FR')]), undefined, 'no English voice → device default');

assert.equal(speakable('What is 4 + 1?'), 'What is 4 plus 1?');
assert.equal(speakable('7 − 3 = ?'), '7 minus 3 equals what?');
assert.equal(speakable('What is 3 × 4?'), 'What is 3 times 4?');
assert.equal(speakable('₹5 and ₹1'), '5 rupees and 1 rupee');
assert.equal(speakable('One cat, two ___.'), 'One cat, two blank .');
assert.equal(speakable('What is 12 ÷ 3?'), 'What is 12 divided by 3?');
assert.equal(speakable('Which picture shows 3/4?'), 'Which picture shows three quarters?');
assert.equal(speakable('1/2'), 'one half');
assert.equal(speakable('₹4.50'), '4 rupees 50 paise');
assert.equal(speakable('0.75'), '0 point 7 5');
console.log('voice tests OK');

// Adaptive difficulty
const L = [1, 2, 3] as const;
assert.equal(nextLevel(1, [true, true], [...L]), 1, 'two right is not enough');
assert.equal(nextLevel(1, [true, true, true], [...L]), 2, 'three right in a row → up');
assert.equal(nextLevel(2, [false, true, true], [...L]), 2, 'run broken → stay');
assert.equal(nextLevel(3, [true, true, true], [...L]), 3, 'no level above 3');
assert.equal(nextLevel(2, [false, false], [...L]), 1, 'two misses → down');
assert.equal(nextLevel(1, [false, false], [...L]), 1, 'no level below 1');

const P = (id: string, difficulty: 1 | 2 | 3) => ({ id, difficulty }) as Puzzle;
const bank = [P('a', 1), P('b', 1), P('c', 2), P('d', 2), P('e', 3)];
assert.equal(startLevel(bank, {}), 1);
assert.equal(startLevel(bank, { a: true, b: true }), 2, 'level 1 all solved → start at 2');
assert.equal(pickNext(bank, 2, {}, new Set())?.id, 'c');
assert.equal(pickNext(bank, 2, { c: true }, new Set())?.id, 'd', 'unsolved before replays');
assert.equal(pickNext(bank, 3, {}, new Set(['e']))?.id, 'c', 'nothing left at 3 → nearest level');
assert.equal(pickNext(bank, 1, {}, new Set(bank.map((p) => p.id))), undefined);
console.log('adaptive tests OK');

// Solvers
const s4 = [0, 1, 2, 3, 2, 3, 0, 1, 1, 0, 3, 2, 3, 2, 1, 0];
assert.ok(isSolved(s4), '4×4 solved grid');
assert.equal(countSolutions([null, ...s4.slice(1)]), 1, 'one blank → one solution');
assert.equal(countSolutions(Array(16).fill(null)), 2, 'empty 4×4 has many (stops at 2)');
const s6 = Array.from({ length: 36 }, (_, k) => (Math.floor(k / 6) * 3 + Math.floor(Math.floor(k / 6) / 2) + (k % 6)) % 6);
assert.ok(isSolved(s6), '6×6 pattern is valid with 2×3 boxes');
const bad6 = [...s6]; [bad6[0], bad6[1]] = [bad6[1], bad6[0]];
assert.ok(!isSolved(bad6), 'swapping two cells breaks it');
assert.equal(countSolutions([...s6.slice(0, 30), null, null, null, null, null, null]), 1, '6×6 last row blank → one solution');

assert.ok(isMagic([2, 7, 6, 9, 5, 1, 4, 3, 8]), 'Lo Shu is magic');
assert.equal(magicSolutions([2, 7, 6, 9, 5, 1, 4, null, null]), 1);
assert.equal(logicSolutions(3, [{ person: 0, item: 0, has: true }]).length, 2, 'one clue leaves 2 matchings');
assert.equal(logicSolutions(3, [{ person: 0, item: 0, has: true }, { person: 1, item: 2, has: false }]).length, 1);
console.log('solver tests OK');

// Grade 4 helpers
assert.deepEqual([1, 2, 3, 4, 5, 6, 12].filter((x) => fits('factor', 12, x)), [1, 2, 3, 4, 6, 12]);
assert.ok(fits('common-multiple', 2, 30, 5) && !fits('common-multiple', 2, 25, 5));
assert.equal(fracCmp([1, 2], [2, 4]), 0);
assert.equal(fracCmp([3, 4], [2, 3]), 1);
assert.equal(to24(15, 5), '15:05');
assert.equal(to12(0, 30), '12:30 am');
assert.equal(duration([9, 40], [12, 45]), '3 hours 5 minutes');
assert.deepEqual(gridMeasure(2, 2, [true, true, true, false]), { area: 3, perimeter: 8 });
assert.equal(encode('cat', 'number'), '3-1-20');
assert.equal(encode('zoo', 'shift', 1), 'APP');
assert.deepEqual(patternTerms({ kind: 'grow', start: 1, step: 1, growth: 1 }, 5), [1, 2, 4, 7, 11]);
assert.ok(oneLetterApart('cat', 'cot') && !oneLetterApart('cat', 'dog'));
assert.equal(logicSolutions(4, []).length, 24, '4 people, no clues → 24 matchings');
console.log('grade 4 helper tests OK');

// Grade 5 helpers
assert.equal(percentAnswer({ kind: 'of', pct: 25, of: 80 }), '20');
assert.equal(percentAnswer({ kind: 'sale', pct: 10, price: 250 }), '₹225');
assert.deepEqual([45, 90, 120].map(angleName), ['acute', 'right', 'obtuse']);
const bars = [{ label: 'Mon', value: 4 }, { label: 'Tue', value: 9 }];
assert.equal(chartAnswer(bars, { kind: 'diff', a: 'Mon', b: 'Tue' }), '5');
assert.equal(chartAnswer(bars, { kind: 'most' }), 'Tue');
assert.deepEqual(simplify([6, 8]), [3, 4]);
assert.deepEqual(addFractions([1, 2], [1, 4]), [3, 4]);
assert.equal(roundWhole('7.5'), '8');
assert.equal(encode('az', 'reverse'), 'ZA');
assert.deepEqual(patternTerms({ kind: 'fib', a: 1, b: 1 }, 5), [1, 1, 2, 3, 5]);
const full = [8, 1, 6, 3, 5, 7, 4, 9, 2];
assert.equal(sumGridSolutions([null, 1, 6, 3, 5, 7, 4, 9, null], [15, 15, 15], [15, 15, 15]), 1);
assert.equal(sumGridSolutions(full.map(() => null), [15, 15, 15], [15, 15, 15]) > 1, true, 'empty grid is not unique');
console.log('grade 5 helper tests OK');

// Practice tests
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : f.endsWith('.json') ? [join(d, f)] : []));
const ALL: Puzzle[] = walk(new URL('../puzzles', import.meta.url).pathname).flatMap((f) => JSON.parse(readFileSync(f, 'utf8')));
let r = 7; const seeded = () => ((r = (r * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
for (const g of [1, 2, 3, 4, 5] as const) {
  const tests = testsFor(ALL, g);
  assert.ok(tests.some((t) => t.subject === 'mixed'));
  for (const t of tests) {
    const qs = buildTest(ALL, g, t.subject, seeded);
    assert.equal(qs.length, 10, `${t.id} has 10 questions`);
    assert.equal(new Set(qs.map((q) => q.id)).size, 10, `${t.id} has no repeats`);
    assert.ok(qs.every((q) => q.grade === g && 'options' in q && (t.subject === 'mixed' || q.subject === t.subject)), `${t.id} draws from the right bank`);
    assert.deepEqual([1, 2, 3].map((d) => qs.filter((q) => q.difficulty === d).length), [3, 4, 3], `${t.id} level mix`);
    if (t.subject === 'mixed') assert.ok(new Set(qs.map((q) => q.subject)).size >= 3, `${t.id} mixes subjects`);
    else assert.ok(new Set(qs.map((q) => q.topic)).size >= 2, `${t.id} covers topics`);
  }
}
assert.ok(!testsFor(ALL, 1).some((t) => t.subject === 'thinking'), 'Grade 1 Thinking is all interactive');
const sc = scoreTest([{ topic: 'a' }, { topic: 'a' }, { topic: 'a' }, { topic: 'b' }] as Puzzle[], [true, true, false, false]);
assert.deepEqual([sc.right, sc.total, sc.weak], [2, 4, ['b']]);
console.log('practice test tests OK');

// Progress sync merge
const dev: SyncedProgress = { stars: 5, solved: { a: true, b: true }, streak: 2, lastPlayed: '2026-10-20', tests: [{ date: '2026-10-19' }] };
const cloud: SyncedProgress = { stars: 8, solved: { b: true, c: true }, streak: 4, lastPlayed: '2026-10-22', tests: [{ date: '2026-10-19' }, { date: '2026-10-21' }] };
const m = mergeProgress(dev, cloud);
assert.deepEqual(Object.keys(m.solved).sort(), ['a', 'b', 'c']);
assert.deepEqual([m.stars, m.streak, m.lastPlayed, m.tests.length], [8, 4, '2026-10-22', 2]);
assert.equal(m.tests[0].date, '2026-10-21', 'newest test first');
assert.deepEqual(mergeProgress(dev, null), dev);
assert.deepEqual(mergeProgress(dev, dev).solved, dev.solved, 'merging twice changes nothing');
console.log('sync merge tests OK');
