// Checks the device-voice picker prefers Indian English, then quality.
//   npm run test -w packages/content
import assert from 'node:assert/strict';
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
console.log('voice tests OK');
