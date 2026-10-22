// Unit tests: the device-voice picker (Indian English first, then quality) and adaptive difficulty.
//   npm test
import assert from 'node:assert/strict';
import { nextLevel, pickNext, startLevel } from '../src/adaptive.ts';
import type { Puzzle } from '../src/types.ts';
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
