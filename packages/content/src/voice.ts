// Every fixed line the app speaks, besides puzzle prompts. scripts/generate-voice.ts
// records a clip for each, so keep the app's spoken text coming from here.
export const PHRASES = {
  great: 'Great job!',
  gotIt: 'You got it!',
  tryAgain: 'Almost! Try again.',
  wall: 'Oops, that is a wall!',
  pair: 'A pair!',
} as const;

export const CHEERS = ['Perfect!', 'Well done!', 'Good try!'] as const;
export type Cheer = (typeof CHEERS)[number];

export const SESSION_LENGTH = 10;

export const cheerFor = (stars: number, total: number): Cheer => (stars === total ? 'Perfect!' : stars >= total / 2 ? 'Well done!' : 'Good try!');

export const resultLine = (stars: number, total: number) =>
  `${cheerFor(stars, total)} You earned ${stars} ${stars === 1 ? 'star' : 'stars'}.`;

/** All fixed lines, for clip generation. */
export function fixedLines(): string[] {
  const lines: string[] = Object.values(PHRASES);
  for (let total = 1; total <= SESSION_LENGTH; total++) for (let s = 0; s <= total; s++) lines.push(resultLine(s, total));
  return [...new Set(lines)];
}

/** Key a spoken line by its text with whitespace normalised (shared by the app and the clip generator). */
export const clipKey = (text: string) => text.trim().replace(/\s+/g, ' ');

/** Turn symbols into words so "3 + 2 = ?" is read naturally. */
export function speakable(text: string) {
  return text
    .replace(/\s*\+\s*/g, ' plus ')
    .replace(/\s*[−-]\s*(?=\d)/g, ' minus ')
    .replace(/\s*×\s*/g, ' times ')
    .replace(/\s*÷\s*/g, ' divided by ')
    .replace(/(\d+)\/(\d+)/g, (_, a, b) => fractionWords(Number(a), Number(b)))
    .replace(/₹\s?(\d+)/g, (_, n) => `${n} ${n === '1' ? 'rupee' : 'rupees'}`)
    .replace(/\s*=\s*\?/g, ' equals what?')
    .replace(/★/g, ' stars')
    .replace(/_{2,}/g, ' blank ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The fields of an expo-speech Voice that matter for choosing one. */
export type VoiceLike = { identifier: string; name: string; quality: string; language: string; localService?: boolean };

const lang = (v: VoiceLike) => v.language.toLowerCase().replace('_', '-');

/**
 * Score a voice: Indian English first, then British, then any English.
 * Within a language, prefer higher-quality voices — iOS "Enhanced"/"Premium",
 * Android "network" voices, and browser cloud voices (localService: false, e.g. Google).
 */
export function scoreVoice(v: VoiceLike): number {
  const l = lang(v);
  const base = l === 'en-in' ? 300 : l === 'en-gb' ? 200 : l.startsWith('en') ? 100 : 0;
  if (!base) return 0;
  const id = `${v.identifier} ${v.name}`.toLowerCase();
  let q = 0;
  if (v.quality === 'Enhanced' || id.includes('premium') || id.includes('enhanced')) q += 40;
  if (id.includes('network') || v.localService === false) q += 30;
  if (id.includes('google') || id.includes('natural') || id.includes('neural')) q += 20;
  // Novelty voices on iOS/macOS sound odd to children.
  if (/(bad news|bells|boing|bubbles|cellos|whisper|zarvox|trinoids|albert|jester|organ|superstar|wobble)/.test(id)) q -= 200;
  return base + q;
}

export function pickVoice<V extends VoiceLike>(voices: V[]): V | undefined {
  let best: V | undefined;
  let bestScore = 0;
  for (const v of voices) {
    const s = scoreVoice(v);
    if (s > bestScore) [best, bestScore] = [v, s];
  }
  return best;
}

const DENOM: Record<number, [string, string]> = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['quarter', 'quarters'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'] };
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
/** "3/4" → "three quarters". */
function fractionWords(a: number, b: number) {
  const d = DENOM[b];
  return d ? `${NUM[a] ?? a} ${a === 1 ? d[0] : d[1]}` : `${a} out of ${b}`;
}
