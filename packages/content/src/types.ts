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
  payload: { a: number; op: '+' | '-' | '×'; b: number; item?: string };
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

/** "Which one does not belong?" — `group` names the category the other items share. */
export type OddOneOutPuzzle = Base & {
  type: 'odd-one-out';
  payload: { group: string };
  options: string[];
  answer: string;
};

/** Tens rods and ones cubes. `ask`: the whole number, or just the tens or ones digit. */
export type PlaceValuePuzzle = Base & {
  type: 'place-value';
  payload: { tens: number; ones: number; ask: 'number' | 'tens' | 'ones' };
  options: number[];
  answer: number;
};

/** A counting sequence with one blank (`null`). */
export type NumberPatternPuzzle = Base & {
  type: 'number-pattern';
  payload: { seq: (number | null)[] };
  options: number[];
  answer: number;
};

/** An analogue clock; options are time labels like "half past 3". */
export type ClockPuzzle = Base & {
  type: 'clock';
  payload: { hour: number; minute: 0 | 15 | 30 | 45 };
  options: string[];
  answer: string;
};

/** Rupee coins and notes to add up. */
export type MoneyPuzzle = Base & {
  type: 'money';
  payload: { coins: number[]; notes: number[] };
  options: number[];
  answer: number;
};

/** A sentence with a blank (___) to fill; `rule` and `base` let the checker work out the answer. */
export type FillBlankPuzzle = Base & {
  type: 'fill-blank';
  payload: { sentence: string; picture?: string; rule: 'plural' | 'opposite' | 'article' | 'is-are'; base: string };
  options: string[];
  answer: string;
};

// ---- Interactive puzzles: several taps per puzzle, no single options/answer. ----

export type CrosswordWord = { word: string; picture: string; row: number; col: number; dir: 'across' | 'down' };

/** Picture crossword: fill the `blanks` cells (in order) by tapping letters from `letters`. */
export type CrosswordPuzzle = Base & {
  type: 'crossword';
  payload: { words: CrosswordWord[]; blanks: [number, number][]; letters: string[] };
};

export type SortItem = { item: string; name: string; group: string };

/** Tap each item, then the group it belongs in. */
export type SortPuzzle = Base & {
  type: 'sort-into-groups';
  payload: { groups: { id: string; label: string; picture: string }[]; items: SortItem[] };
};

/** Flip cards to find pairs. `cards` holds each emoji twice, already shuffled. */
export type MemoryPuzzle = Base & {
  type: 'memory-match';
  payload: { cards: string[]; cols: number };
};

/**
 * Grid maze. `cells[r * cols + c]` is a bitmask of open sides: 1 = up, 2 = right, 4 = down, 8 = left.
 * Move the hero from `start` to `goal`.
 */
export type MazePuzzle = Base & {
  type: 'maze';
  payload: { rows: number; cols: number; cells: number[]; start: [number, number]; goal: [number, number]; hero: string; target: string };
};

/** Tap tiles in order to spell a word (`joiner` '') or build a sentence (`joiner` ' '). */
export type BuildPuzzle = Base & {
  type: 'build';
  payload: { answer: string[]; tiles: string[]; picture: string; say: string; joiner: '' | ' ' };
};

/** Puzzles answered with one tap from a list of options. */
export type ChoicePuzzle =
  | PatternPuzzle
  | CountPuzzle
  | ArithmeticPuzzle
  | ShapeMatchPuzzle
  | ComparePuzzle
  | LetterMatchPuzzle
  | FirstLetterPuzzle
  | PictureWordPuzzle
  | RhymePuzzle
  | OddOneOutPuzzle
  | PlaceValuePuzzle
  | NumberPatternPuzzle
  | ClockPuzzle
  | MoneyPuzzle
  | FillBlankPuzzle;

/** Puzzles with their own multi-step play. */
export type InteractivePuzzle = CrosswordPuzzle | SortPuzzle | MemoryPuzzle | MazePuzzle | BuildPuzzle;

export type Puzzle = ChoicePuzzle | InteractivePuzzle;
export type PuzzleType = Puzzle['type'];
export type ChoiceType = ChoicePuzzle['type'];
export type InteractiveType = InteractivePuzzle['type'];
export type PuzzleOption = ChoicePuzzle['options'][number];

export const INTERACTIVE_TYPES: InteractiveType[] = ['crossword', 'sort-into-groups', 'memory-match', 'maze', 'build'];
export const isInteractive = (p: Puzzle): p is InteractivePuzzle => (INTERACTIVE_TYPES as string[]).includes(p.type);

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
