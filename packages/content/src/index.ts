import type { Puzzle } from './types';
import counting from '../puzzles/g1-maths/counting.json';
import addition from '../puzzles/g1-maths/addition.json';
import subtraction from '../puzzles/g1-maths/subtraction.json';
import shapes from '../puzzles/g1-maths/shapes.json';
import compare from '../puzzles/g1-maths/compare.json';
import patterns from '../puzzles/g1-maths/patterns.json';

export * from './types';
export * from './tokens';
export * from './curriculum';
export * from './voice';

// JSON is checked by `npm run validate-content`, so the cast is safe.
export const PUZZLES = [...counting, ...addition, ...subtraction, ...shapes, ...compare, ...patterns] as Puzzle[];

/** A topic's puzzles, easiest first (stable within a difficulty). */
export const puzzlesFor = (topic: string) =>
  PUZZLES.filter((p) => p.topic === topic).sort((a, b) => a.difficulty - b.difficulty);
