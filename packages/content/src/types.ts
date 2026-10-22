export type ShapeKind = 'star' | 'circle' | 'square' | 'tri' | 'diamond' | 'rectangle';

export type Grade = 1 | 2 | 3 | 4 | 5;
export type SubjectId = 'maths' | 'english' | 'science' | 'puzzles' | 'thinking' | 'practice';
export type Difficulty = 1 | 2 | 3;

/** Everything a puzzle record shares. `prompt` is shown on screen and read aloud. */
type Base = {
  id: string;
  grade: Grade;
  subject: SubjectId;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
};

/** "What comes next?" — options and answer are shapes. */
export type PatternPuzzle = Base & {
  type: 'pattern';
  payload: { seq: ShapeKind[] };
  options: ShapeKind[];
  answer: ShapeKind;
};

/** "How many apples?" — shows `count` copies of an emoji. */
export type CountPuzzle = Base & {
  type: 'count-objects';
  payload: { item: string; count: number };
  options: number[];
  answer: number;
};

/** "3 + 2 = ?" with optional emoji pictures for each side. */
export type ArithmeticPuzzle = Base & {
  type: 'arithmetic';
  payload: { a: number; op: '+' | '-'; b: number; item?: string };
  options: number[];
  answer: number;
};

/** "Tap the triangle." */
export type ShapeMatchPuzzle = Base & {
  type: 'shape-match';
  payload: { target: ShapeKind };
  options: ShapeKind[];
  answer: ShapeKind;
};

/** "Which group has more?" — answer is the side. */
export type ComparePuzzle = Base & {
  type: 'compare';
  payload: { ask: 'more' | 'fewer'; left: { item: string; count: number }; right: { item: string; count: number } };
  options: ('left' | 'right')[];
  answer: 'left' | 'right';
};

/** "Find the small letter for B." */
export type LetterMatchPuzzle = Base & {
  type: 'letter-match';
  payload: { upper: string };
  options: string[];
  answer: string;
};

/** "Which letter does dog start with?" — shows the picture and word. */
export type FirstLetterPuzzle = Base & {
  type: 'first-letter';
  payload: { word: string; picture: string };
  options: string[];
  answer: string;
};

/** Pick the word for a picture, or — with `blank` — the missing letter at that index. */
export type PictureWordPuzzle = Base & {
  type: 'picture-word';
  payload: { word: string; picture: string; blank?: number };
  options: string[];
  answer: string;
};

/** "Which word rhymes with cat?" — options are words, each shown with its picture. */
export type RhymePuzzle = Base & {
  type: 'rhyme';
  payload: { word: string; picture: string; pictures: Record<string, string> };
  options: string[];
  answer: string;
};

export type Puzzle =
  | PatternPuzzle
  | CountPuzzle
  | ArithmeticPuzzle
  | ShapeMatchPuzzle
  | ComparePuzzle
  | LetterMatchPuzzle
  | FirstLetterPuzzle
  | PictureWordPuzzle
  | RhymePuzzle;
export type PuzzleType = Puzzle['type'];
export type PuzzleOption = Puzzle['options'][number];

export type Topic = {
  id: string;
  grade: Grade;
  subject: SubjectId;
  title: string;
  blurb: string;
  glyph: string;
  color: string;
};

export type Subject = {
  id: SubjectId;
  name: string;
  desc: string;
  glyph: string;
  color: string;
};
