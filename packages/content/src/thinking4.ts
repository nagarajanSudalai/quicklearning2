// Grade 4 Puzzles and Thinking Skills content and helpers.
import type { PatternRule } from './types';

/** More crossword words with text clues (added to Grade 3's CLUES). */
export const CLUES4: Record<string, string> = {
  planet: 'Earth is one', island: 'Land with water all around', desert: 'A hot, dry, sandy place', forest: 'A place with many trees',
  rocket: 'It flies into space', bridge: 'You cross a river on it', castle: 'A king lives in it', garden: 'Flowers grow here',
  mirror: 'You see yourself in it', pillow: 'You rest your head on it', candle: 'It gives light when lit', monkey: 'It swings from trees',
  carrot: 'An orange vegetable', silver: 'A shiny grey metal', winter: 'The cold season', spring: 'The season of flowers',
  shadow: 'It follows you in the sun', thirty: 'Three tens', market: 'You buy things here', doctor: 'Helps you get well',
  farmer: 'Grows crops', butter: 'Made from cream', ladder: 'You climb it', button: 'It keeps your shirt closed',
  kettle: 'It boils water', rabbit: 'It has long ears', tomato: 'A red vegetable for salad', camera: 'It takes photos',
};

/** Logic-grid sets with four things, for the 4-person grids. */
export const LOGIC_SETS4: { question: string; kind: string; items: [string, string][] }[] = [
  { question: 'Who has which pet?', kind: 'pet', items: [['🐱', 'cat'], ['🐶', 'dog'], ['🐰', 'rabbit'], ['🐟', 'fish']] },
  { question: 'Who likes which fruit?', kind: 'fruit', items: [['🍎', 'apple'], ['🍌', 'banana'], ['🥭', 'mango'], ['🍇', 'grapes']] },
  { question: 'Who plays which instrument?', kind: 'instrument', items: [['🥁', 'drum'], ['🎸', 'guitar'], ['🎹', 'piano'], ['🎺', 'trumpet']] },
  { question: 'Who plays which game?', kind: 'game', items: [['🏏', 'cricket'], ['⚽', 'football'], ['🏸', 'badminton'], ['♟️', 'chess']] },
];

/** The full sequence a pattern rule makes. */
export function patternTerms(rule: PatternRule, n: number): number[] {
  if (rule.kind === 'multiply') return Array.from({ length: n }, (_, k) => rule.start * rule.by ** k);
  if (rule.kind === 'square') return Array.from({ length: n }, (_, k) => (rule.from + k) ** 2);
  if (rule.kind === 'alternate') { const out = [rule.start]; for (let k = 1; k < n; k++) out.push(out[k - 1] + (k % 2 ? rule.a : rule.b)); return out; }
  if (rule.kind === 'fib') { const out = [rule.a, rule.b]; while (out.length < n) out.push(out[out.length - 1] + out[out.length - 2]); return out.slice(0, n); }
  const out = [rule.start];
  for (let k = 1; k < n; k++) out.push(out[k - 1] + rule.step + rule.growth * (k - 1));
  return out;
}

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
/** Write a word in code: A=1 B=2… as "3-1-20", each letter moved `shift` places on, or the reverse alphabet (A↔Z). */
export function encode(word: string, kind: 'number' | 'shift' | 'reverse', shift = 1) {
  const up = word.toUpperCase();
  if (kind === 'reverse') return [...up].map((ch) => A[25 - A.indexOf(ch)]).join('');
  if (kind === 'number') return [...up].map((ch) => A.indexOf(ch) + 1).join('-');
  return [...up].map((ch) => A[(A.indexOf(ch) + shift) % 26]).join('');
}

export const CIPHER_WORDS = ['cat', 'dog', 'sun', 'book', 'tree', 'fish', 'star', 'moon', 'cake', 'rain', 'milk', 'bird', 'frog', 'kite', 'lamp', 'ship', 'king', 'gold', 'rose', 'nest', 'tiger', 'mango', 'apple', 'chair'];
