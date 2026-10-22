import type { Puzzle } from './types';
import counting from '../puzzles/g1-maths/counting.json';
import addition from '../puzzles/g1-maths/addition.json';
import subtraction from '../puzzles/g1-maths/subtraction.json';
import shapes from '../puzzles/g1-maths/shapes.json';
import compare from '../puzzles/g1-maths/compare.json';
import patterns from '../puzzles/g1-maths/patterns.json';
import letters from '../puzzles/g1-english/letters.json';
import sounds from '../puzzles/g1-english/sounds.json';
import words from '../puzzles/g1-english/words.json';
import rhymes from '../puzzles/g1-english/rhymes.json';

export * from './types';
export * from './tokens';
export * from './curriculum';
export * from './voice';
export * from './words';

// JSON is checked by `npm run validate-content`, so the cast is safe.
export const PUZZLES = [
  ...counting, ...addition, ...subtraction, ...shapes, ...compare, ...patterns,
  ...letters, ...sounds, ...words, ...rhymes,
] as Puzzle[];

/** A topic's puzzles, easiest first (stable within a difficulty). */
export const puzzlesFor = (topic: string) =>
  PUZZLES.filter((p) => p.topic === topic).sort((a, b) => a.difficulty - b.difficulty);
