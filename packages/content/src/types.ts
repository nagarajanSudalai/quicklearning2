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
  payload: { a: number; op: '+' | '-' | '×' | '÷'; b: number; item?: string; missing?: 'a' | 'b'; remainder?: boolean };
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
  payload: { tenThousands?: number; thousands?: number; hundreds?: number; tens: number; ones: number; ask: 'number' | 'expanded' | 'tenThousands' | 'thousands' | 'hundreds' | 'tens' | 'ones' };
  options: number[];
  answer: number;
};

/** A counting sequence with one blank (`null`). */
export type NumberPatternPuzzle = Base & {
  type: 'number-pattern';
  /** Without `rule` the numbers go up or down by a constant step. */
  payload: { seq: (number | null)[]; rule?: PatternRule };
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
  payload: { sentence: string; picture?: string; rule: 'plural' | 'opposite' | 'article' | 'is-are' | 'past' | 'synonym' | 'homophone' | 'future' | 'continuous' | 'affix' | 'conjunction' | 'preposition' | 'voice' | 'spelling'; base: string; who?: string };
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
  payload: { tagged: string; ask: 'noun' | 'verb' | 'adjective' | 'pronoun' | 'adverb' };
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

/** "a is to b as c is to ___". */
export type AnalogyPuzzle = Base & {
  type: 'analogy';
  payload: { a: string; b: string; c: string };
  options: string[];
  answer: string;
};

/** Fraction work with numbers: an equal fraction, the bigger one, or a sum of like fractions. Fractions are [top, bottom]. */
export type FractionOpPuzzle = Base & {
  type: 'fraction-op';
  payload: { op: 'equivalent' | 'bigger' | 'add' | 'simplify' | 'of'; a: [number, number]; b?: [number, number]; n?: number };
  options: string[];
  answer: string;
};

/** Decimals: rupees ↔ paise, tenths shaded on a bar, or the bigger of two decimals. */
export type DecimalPuzzle = Base & {
  type: 'decimal';
  payload: { kind: 'paise'; rupees: number; paise: number } | { kind: 'tenths'; tenths: number } | { kind: 'bigger'; a: string; b: string } | { kind: 'add'; a: string; b: string; op: '+' | '-' } | { kind: 'round'; a: string };
  options: string[];
  answer: string;
};

/** Time sums: 12-hour → 24-hour, 24-hour → 12-hour, or how long from `a` to `b`. Times are [hour 0–23, minute]. */
export type TimeCalcPuzzle = Base & {
  type: 'time-calc';
  payload: { kind: 'to24' | 'to12' | 'duration'; a: [number, number]; b?: [number, number] };
  options: string[];
  answer: string;
};

/** A shape on squared paper (`cells` row by row); find its area in squares or its perimeter in edges. */
export type GridShapePuzzle = Base & {
  type: 'grid-shape';
  payload: { rows: number; cols: number; cells: boolean[]; ask: 'area' | 'perimeter'; labels?: boolean; triangle?: boolean };
  options: number[];
  answer: number;
};

/** "What comes next?" rules beyond a constant step. */
export type PatternRule = { kind: 'multiply'; start: number; by: number } | { kind: 'grow'; start: number; step: number; growth: number } | { kind: 'square'; from: number } | { kind: 'alternate'; start: number; a: number; b: number } | { kind: 'fib'; a: number; b: number };

/** Decode a word written in a code (A=1, B=2… or each letter shifted), or pick the code for a word. */
export type CipherPuzzle = Base & {
  type: 'cipher';
  payload: { kind: 'number' | 'shift' | 'reverse'; shift?: number; word: string; ask: 'decode' | 'encode' };
  options: string[];
  answer: string;
};

/** Percentages: read a shaded 10×10 grid, find a percent of a number, or a sale price after a discount. */
export type PercentPuzzle = Base & {
  type: 'percent';
  payload: { kind: 'grid'; shaded: number } | { kind: 'of'; pct: number; of: number } | { kind: 'sale'; pct: number; price: number };
  options: string[];
  answer: string;
};

/** An angle drawn with a protractor scale: name it (acute/right/obtuse/straight) or read its size. */
export type AnglePuzzle = Base & {
  type: 'angle';
  payload: { degrees: number; ask: 'name' | 'measure' };
  options: string[];
  answer: string;
};

/** A bar chart; ask for one value, a difference, the total, or which bar is biggest/smallest. */
export type ChartPuzzle = Base & {
  type: 'chart';
  payload: { title: string; unit: string; bars: { label: string; value: number }[]; ask: { kind: 'value'; label: string } | { kind: 'diff'; a: string; b: string } | { kind: 'total' } | { kind: 'most' } | { kind: 'least' } };
  options: string[];
  answer: string;
};

/** What does this idiom or proverb mean? */
export type IdiomPuzzle = Base & {
  type: 'idiom';
  payload: { phrase: string; sentence?: string };
  options: string[];
  answer: string;
};

/** A brain teaser (word problem) from the teaser bank. */
export type TeaserPuzzle = Base & {
  type: 'teaser';
  payload: { id: string; text: string };
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

export type LogicClue = { person: number; item: number; has: boolean };

/** Logic grid: match each person to one item using the clues. `solution[p]` is person p's item. */
export type LogicGridPuzzle = Base & {
  type: 'logic-grid';
  payload: { kind: string; people: string[]; items: { emoji: string; name: string }[]; clues: LogicClue[]; solution: number[] };
};

/** 3×3 magic square with numbers 1–9: every row, column and diagonal adds up to 15. */
export type MagicSquarePuzzle = Base & {
  type: 'magic-square';
  payload: { grid: (number | null)[]; solution: number[]; target: number };
};

/** Tap every number that fits the rule (multiples of n, factors of n, or common multiples of n and m). */
export type PickAllPuzzle = Base & {
  type: 'pick-all';
  payload: { kind: 'multiple' | 'factor' | 'common-multiple'; n: number; m?: number; items: number[] };
};

/** Word ladder: get from the first word to the last, changing one letter at a time. `choices[k]` are the
 * words offered for step k+1; exactly one of them is one letter away from `ladder[k]`. */
export type WordLadderPuzzle = Base & {
  type: 'word-ladder';
  payload: { ladder: string[]; choices: string[][] };
};

/** 3×3 sum grid: fill the blanks with digits 1–9 (each used once) so every row and column adds up to its total. */
export type SumGridPuzzle = Base & {
  type: 'sum-grid';
  payload: { grid: (number | null)[]; solution: number[]; rows: number[]; cols: number[] };
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
  | PassagePuzzle
  | AnalogyPuzzle
  | FractionOpPuzzle
  | DecimalPuzzle
  | TimeCalcPuzzle
  | GridShapePuzzle
  | CipherPuzzle
  | PercentPuzzle
  | AnglePuzzle
  | ChartPuzzle
  | IdiomPuzzle
  | TeaserPuzzle;

/** Puzzles with their own multi-step play. */
export type InteractivePuzzle = CrosswordPuzzle | SortPuzzle | MemoryPuzzle | MazePuzzle | BuildPuzzle | SudokuPuzzle | OrderStepsPuzzle | LogicGridPuzzle | MagicSquarePuzzle | PickAllPuzzle | WordLadderPuzzle | SumGridPuzzle;

export type Puzzle = ChoicePuzzle | InteractivePuzzle;
export type PuzzleType = Puzzle['type'];
export type ChoiceType = ChoicePuzzle['type'];
export type InteractiveType = InteractivePuzzle['type'];
export type PuzzleOption = ChoicePuzzle['options'][number];

export const INTERACTIVE_TYPES: InteractiveType[] = ['crossword', 'sort-into-groups', 'memory-match', 'maze', 'build', 'sudoku', 'order-steps', 'logic-grid', 'magic-square', 'pick-all', 'word-ladder', 'sum-grid'];
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
