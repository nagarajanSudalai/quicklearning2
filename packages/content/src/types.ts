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
  payload: { a: number; op: '+' | '-' | '×' | '÷'; b: number; item?: string; missing?: 'a' | 'b' };
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
  payload: { hundreds?: number; tens: number; ones: number; ask: 'number' | 'hundreds' | 'tens' | 'ones' };
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
  payload: { hour: number; minute: number };
  options: string[];
  answer: string;
};

/** Rupee coins and notes to add up. */
export type MoneyPuzzle = Base & {
  type: 'money';
  payload: { coins: number[]; notes: number[]; price?: number };
  options: number[];
  answer: number;
};

/** A sentence with a blank (___) to fill; `rule` and `base` let the checker work out the answer. */
export type FillBlankPuzzle = Base & {
  type: 'fill-blank';
  payload: { sentence: string; picture?: string; rule: 'plural' | 'opposite' | 'article' | 'is-are' | 'past' | 'synonym' | 'homophone'; base: string };
  options: string[];
  answer: string;
};

/** "Who am I?" — clues are read aloud; options are pictures. */
export type RiddlePuzzle = Base & {
  type: 'riddle';
  payload: { clues: string[]; names: Record<string, string> };
  options: string[];
  answer: string;
};

/** Compare two numbers with <, > or =. */
export type CompareNumbersPuzzle = Base & {
  type: 'compare-numbers';
  payload: { a: number; b: number };
  options: string[];
  answer: string;
};

/** A shape cut into equal parts, some shaded. `ask: 'name'` → pick the fraction; `'picture'` → pick the picture of `answer`. */
export type FractionPuzzle = Base & {
  type: 'fraction';
  payload: { shape: 'circle' | 'bar'; ask: 'name' | 'picture'; parts: number; shaded: number };
  options: string[];
  answer: string;
};

/** Days of the week and months: what comes `offset` after (or before) `base`, or days in a month. */
export type CalendarPuzzle = Base & {
  type: 'calendar';
  payload: { kind: 'day' | 'month' | 'days-in'; base: string; offset: number };
  options: string[];
  answer: string;
};

/** Read the length of an object on a centimetre ruler. */
export type MeasurePuzzle = Base & {
  type: 'measure';
  payload: { item: string; start: number; length: number };
  options: number[];
  answer: number;
};

/** Tap the naming (noun), doing (verb) or describing (adjective) word in a sentence. Options are its words. */
export type WordClassPuzzle = Base & {
  type: 'word-class';
  payload: { tagged: string; ask: 'noun' | 'verb' | 'adjective' };
  options: string[];
  answer: string;
};

/** A short passage and a question about it. */
export type PassagePuzzle = Base & {
  type: 'passage';
  payload: { text: string; question: string };
  options: string[];
  answer: string;
};

// ---- Interactive puzzles: several taps per puzzle, no single options/answer. ----

/** A crossword word; the clue is a `picture` (emoji) or, from Grade 3, a text `clue`. */
export type CrosswordWord = { word: string; picture: string; clue?: string; row: number; col: number; dir: 'across' | 'down' };

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

/** 4×4 picture or 6×6 number sudoku (size = symbols.length). `grid` holds symbol indexes, `null` for blanks; `solution` is the full grid. */
export type SudokuPuzzle = Base & {
  type: 'sudoku';
  payload: { symbols: string[]; grid: (number | null)[]; solution: number[] };
};

/** Tap pictures in the order they happen. `steps` is the right order; `shown` is the shuffled order. */
export type OrderStepsPuzzle = Base & {
  type: 'order-steps';
  payload: { title: string; steps: { item: string; name: string }[]; shown: number[] };
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
  | FillBlankPuzzle
  | RiddlePuzzle
  | CompareNumbersPuzzle
  | FractionPuzzle
  | CalendarPuzzle
  | MeasurePuzzle
  | WordClassPuzzle
  | PassagePuzzle;

/** Puzzles with their own multi-step play. */
export type InteractivePuzzle = CrosswordPuzzle | SortPuzzle | MemoryPuzzle | MazePuzzle | BuildPuzzle | SudokuPuzzle | OrderStepsPuzzle;

export type Puzzle = ChoicePuzzle | InteractivePuzzle;
export type PuzzleType = Puzzle['type'];
export type ChoiceType = ChoicePuzzle['type'];
export type InteractiveType = InteractivePuzzle['type'];
export type PuzzleOption = ChoicePuzzle['options'][number];

export const INTERACTIVE_TYPES: InteractiveType[] = ['crossword', 'sort-into-groups', 'memory-match', 'maze', 'build', 'sudoku', 'order-steps'];
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
