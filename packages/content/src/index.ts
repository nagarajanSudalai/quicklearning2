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
import oddOneOut from '../puzzles/g1-puzzles/odd-one-out.json';
import crossword from '../puzzles/g1-puzzles/crossword.json';
import sorting from '../puzzles/g1-thinking/sorting.json';
import memory from '../puzzles/g1-thinking/memory.json';
import mazes from '../puzzles/g1-thinking/mazes.json';

export * from './types';
export * from './tokens';
export * from './curriculum';
export * from './voice';
export * from './words';
export * from './categories';

// JSON is checked by `npm run validate-content`, so the cast is safe.
export const PUZZLES = [
  ...counting, ...addition, ...subtraction, ...shapes, ...compare, ...patterns,
  ...letters, ...sounds, ...words, ...rhymes,
  ...oddOneOut, ...crossword,
  ...sorting, ...memory, ...mazes,
] as unknown as Puzzle[];

/** A topic's puzzles, easiest first (stable within a difficulty). */
export const puzzlesFor = (topic: string) =>
  PUZZLES.filter((p) => p.topic === topic).sort((a, b) => a.difficulty - b.difficulty);
