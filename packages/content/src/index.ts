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
import g2PlaceValue from '../puzzles/g2-maths/place-value.json';
import g2Addition from '../puzzles/g2-maths/addition.json';
import g2Subtraction from '../puzzles/g2-maths/subtraction.json';
import g2SkipCounting from '../puzzles/g2-maths/skip-counting.json';
import g2Groups from '../puzzles/g2-maths/groups.json';
import g2Time from '../puzzles/g2-maths/time.json';
import g2Money from '../puzzles/g2-maths/money.json';
import g2Plurals from '../puzzles/g2-english/plurals.json';
import g2Opposites from '../puzzles/g2-english/opposites.json';
import g2Grammar from '../puzzles/g2-english/grammar.json';
import g2Spelling from '../puzzles/g2-english/spelling.json';
import g2Sentences from '../puzzles/g2-english/sentences.json';
import g2Crossword from '../puzzles/g2-puzzles/crossword.json';
import g2Sudoku from '../puzzles/g2-puzzles/sudoku.json';
import g2Order from '../puzzles/g2-thinking/order.json';
import g2Riddles from '../puzzles/g2-thinking/riddles.json';
import g2Mazes from '../puzzles/g2-thinking/mazes.json';

import g3Numbers from '../puzzles/g3-maths/numbers.json';
import g3AddSub from '../puzzles/g3-maths/add-sub.json';
import g3Tables from '../puzzles/g3-maths/tables.json';
import g3Sharing from '../puzzles/g3-maths/sharing.json';
import g3Fractions from '../puzzles/g3-maths/fractions.json';
import g3Time from '../puzzles/g3-maths/time.json';
import g3MoneyMeasure from '../puzzles/g3-maths/money-measure.json';

import g3EWordClass from '../puzzles/g3-english/word-class.json';
import g3EPast from '../puzzles/g3-english/past.json';
import g3ESynonyms from '../puzzles/g3-english/synonyms.json';
import g3ESpelling from '../puzzles/g3-english/spelling.json';
import g3EReading from '../puzzles/g3-english/reading.json';

import g3Crossword from '../puzzles/g3-puzzles/crossword.json';
import g3Sudoku from '../puzzles/g3-puzzles/sudoku.json';

import g3Logic from '../puzzles/g3-thinking/logic.json';
import g3Analogies from '../puzzles/g3-thinking/analogies.json';
import g3Magic from '../puzzles/g3-thinking/magic.json';

import g4Numbers from '../puzzles/g4-maths/numbers.json';
import g4MulDiv from '../puzzles/g4-maths/mul-div.json';
import g4Factors from '../puzzles/g4-maths/factors.json';
import g4Fractions from '../puzzles/g4-maths/fractions.json';
import g4Decimals from '../puzzles/g4-maths/decimals.json';
import g4Time from '../puzzles/g4-maths/time.json';
import g4Area from '../puzzles/g4-maths/area.json';

import g4EPronouns from '../puzzles/g4-english/pronouns.json';
import g4ETenses from '../puzzles/g4-english/tenses.json';
import g4EAffixes from '../puzzles/g4-english/affixes.json';
import g4ELadders from '../puzzles/g4-english/ladders.json';
import g4EReading from '../puzzles/g4-english/reading.json';

export * from './types';
export * from './tokens';
export * from './curriculum';
export * from './voice';
export * from './words';
export * from './categories';
export * from './time';
export * from './words2';
export * from './sudoku';
export * from './thinking2';
export * from './adaptive';
export * from './calendar';
export * from './words3';
export * from './crossword';
export * from './thinking3';
export * from './logic';
export * from './maths4';
export * from './words4';

// JSON is checked by `npm run validate-content`, so the cast is safe.
export const PUZZLES = [
  ...counting, ...addition, ...subtraction, ...shapes, ...compare, ...patterns,
  ...letters, ...sounds, ...words, ...rhymes,
  ...oddOneOut, ...crossword,
  ...sorting, ...memory, ...mazes,
  ...g2PlaceValue, ...g2Addition, ...g2Subtraction, ...g2SkipCounting, ...g2Groups, ...g2Time, ...g2Money,
  ...g2Plurals, ...g2Opposites, ...g2Grammar, ...g2Spelling, ...g2Sentences,
  ...g2Crossword, ...g2Sudoku,
  ...g2Order, ...g2Riddles, ...g2Mazes,
  ...g3Numbers, ...g3AddSub, ...g3Tables, ...g3Sharing, ...g3Fractions, ...g3Time, ...g3MoneyMeasure,
  ...g3EWordClass, ...g3EPast, ...g3ESynonyms, ...g3ESpelling, ...g3EReading,
  ...g3Crossword, ...g3Sudoku,
  ...g3Logic, ...g3Analogies, ...g3Magic,
  ...g4Numbers, ...g4MulDiv, ...g4Factors, ...g4Fractions, ...g4Decimals, ...g4Time, ...g4Area,
  ...g4EPronouns, ...g4ETenses, ...g4EAffixes, ...g4ELadders, ...g4EReading,
] as unknown as Puzzle[];

/** A topic's puzzles, easiest first (stable within a difficulty). */
export const puzzlesFor = (topic: string) =>
  PUZZLES.filter((p) => p.topic === topic).sort((a, b) => a.difficulty - b.difficulty);
