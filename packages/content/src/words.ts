// Word bank for Grade 1 English. Each word has an emoji a 6-year-old will recognise;
// emoji newer than 2019 are avoided so older phones show them.

export const PICTURES: Record<string, string> = {
  ant: '🐜', bat: '🦇', bed: '🛏️', bee: '🐝', bus: '🚌', box: '📦', bug: '🐛', cat: '🐱', cow: '🐮', cup: '☕',
  dog: '🐶', egg: '🥚', fox: '🦊', hat: '🎩', hen: '🐔', leg: '🦵', pen: '🖊️', pig: '🐷', sun: '☀️', ten: '🔟', van: '🚐', web: '🕸️',
  ball: '⚽', bear: '🐻', bell: '🔔', bird: '🐦', boat: '⛵', book: '📖', cake: '🎂', car: '🚗', chair: '🪑', coat: '🧥',
  duck: '🦆', fish: '🐟', frog: '🐸', goat: '🐐', house: '🏠', key: '🔑', lion: '🦁', milk: '🥛', moon: '🌙', mouse: '🐭',
  nose: '👃', pear: '🍐', rose: '🌹', shell: '🐚', snake: '🐍', sock: '🧦', spoon: '🥄', star: '⭐', three: '3️⃣', tree: '🌳',
};

/** Three-letter consonant–vowel–consonant words, used for "missing letter" puzzles. */
export const CVC = ['bat', 'bed', 'bug', 'bus', 'cat', 'cup', 'dog', 'fox', 'hat', 'hen', 'leg', 'pen', 'pig', 'sun', 'ten', 'van', 'web'];

/** Words whose first letter doesn't make its usual sound (ch, sh, th, or the vowel in "owl"). Not used for first-letter puzzles. */
export const IRREGULAR_START = ['chair', 'shell', 'three'];

/** Groups of words that rhyme by sound (bear/chair rhyme even though they're spelled differently). */
export const RHYME_FAMILIES: string[][] = [
  ['cat', 'hat', 'bat'],
  ['dog', 'frog'],
  ['hen', 'pen', 'ten'],
  ['fox', 'box'],
  ['car', 'star'],
  ['bee', 'tree', 'key', 'three'],
  ['moon', 'spoon'],
  ['goat', 'coat', 'boat'],
  ['bear', 'pear', 'chair'],
  ['mouse', 'house'],
  ['cake', 'snake'],
  ['bell', 'shell'],
  ['nose', 'rose'],
];

export const rhymes = (a: string, b: string) => a !== b && RHYME_FAMILIES.some((f) => f.includes(a) && f.includes(b));

/**
 * Real short words a child might know. A "missing letter" option must not spell one of these,
 * or the puzzle would have two right answers (c_t: "cot" is a word, so "o" can't be a wrong option).
 */
export const KNOWN_WORDS = new Set([
  ...CVC,
  'bad', 'bag', 'ban', 'bet', 'bid', 'big', 'bin', 'bit', 'bog', 'bud', 'bun', 'but', 'cap', 'cop', 'cot', 'cut', 'dig', 'dug',
  'fax', 'fix', 'gas', 'had', 'has', 'him', 'hip', 'hit', 'hot', 'hut', 'lag', 'log', 'lug', 'pan', 'peg', 'pet', 'pin', 'pit',
  'pot', 'pug', 'pun', 'sin', 'son', 'tan', 'tin', 'ton', 'vet', 'wag', 'wet', 'van', 'vat', 'lab', 'lap', 'leg', 'lot', 'pup', 'sat', 'set', 'sit',
]);

/** Lowercase letters that look alike — used as tricky distractors. */
export const LOOKALIKES: string[][] = [
  ['b', 'd', 'p', 'q'],
  ['m', 'n', 'h', 'r'],
  ['i', 'l', 'j', 't'],
  ['a', 'e', 'o'],
  ['f', 't'],
  ['g', 'y', 'j', 'q'],
];

/** Capitals whose small letter looks the same are left out of letter-match (Cc, Oo, Ss…). */
export const LETTER_MATCH_TARGETS = 'abdefghijklmnpqrty'.split('');

/** Letters that sound the same at the start of a word; never offer one as the wrong answer for the other. */
export const SOUND_ALIKE: string[][] = [['c', 'k'], ['c', 's']];
