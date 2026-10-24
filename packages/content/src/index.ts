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

import g4Crossword from '../puzzles/g4-puzzles/crossword.json';
import g4Sudoku from '../puzzles/g4-puzzles/sudoku.json';
import g4Logic from '../puzzles/g4-thinking/logic.json';
import g4Patterns from '../puzzles/g4-thinking/patterns.json';
import g4Codes from '../puzzles/g4-thinking/codes.json';

import g5Numbers from '../puzzles/g5-maths/numbers.json';
import g5BigOps from '../puzzles/g5-maths/big-ops.json';
import g5Fractions from '../puzzles/g5-maths/fractions.json';
import g5Decimals from '../puzzles/g5-maths/decimals.json';
import g5Percent from '../puzzles/g5-maths/percent.json';
import g5Geometry from '../puzzles/g5-maths/geometry.json';
import g5Charts from '../puzzles/g5-maths/charts.json';

import g5EJoining from '../puzzles/g5-english/joining.json';
import g5EVoice from '../puzzles/g5-english/voice.json';
import g5EIdioms from '../puzzles/g5-english/idioms.json';
import g5ESpelling from '../puzzles/g5-english/spelling.json';
import g5EReading from '../puzzles/g5-english/reading.json';
import g5Crossword from '../puzzles/g5-puzzles/crossword.json';
import g5SumGrid from '../puzzles/g5-puzzles/sumgrid.json';
import g5Teasers from '../puzzles/g5-thinking/teasers.json';
import g5Series from '../puzzles/g5-thinking/series.json';
import g5LogicCodes from '../puzzles/g5-thinking/logic-codes.json';
import sci1Body from '../puzzles/g1-science/body.json';
import sci1Living from '../puzzles/g1-science/living.json';
import sci1Animals from '../puzzles/g1-science/animals.json';
import sci2Plants from '../puzzles/g2-science/plants.json';
import sci2Food from '../puzzles/g2-science/food.json';
import sci2Weather from '../puzzles/g2-science/weather.json';
import sci3Animals from '../puzzles/g3-science/animals.json';
import sci3Senses from '../puzzles/g3-science/senses.json';
import sci3AirWater from '../puzzles/g3-science/air-water.json';
import sci4PlantsFood from '../puzzles/g4-science/plants-food.json';
import sci4Matter from '../puzzles/g4-science/matter.json';
import sci4WaterCycle from '../puzzles/g4-science/water-cycle.json';
import sci5Body from '../puzzles/g5-science/body.json';
import sci5Living from '../puzzles/g5-science/living.json';
import sci5Space from '../puzzles/g5-science/space.json';
import code1Steps from '../puzzles/g1-coding/steps.json';
import code1Fix from '../puzzles/g1-coding/fix.json';
import code2Coins from '../puzzles/g2-coding/coins.json';
import code2Fix from '../puzzles/g2-coding/fix.json';
import code3Loops from '../puzzles/g3-coding/loops.json';
import code3Trace from '../puzzles/g3-coding/trace.json';
import code4Turns from '../puzzles/g4-coding/turns.json';
import code4If from '../puzzles/g4-coding/if.json';
import code5Functions from '../puzzles/g5-coding/functions.json';
import code5Variables from '../puzzles/g5-coding/variables.json';
import robo1World from '../puzzles/g1-robotics/world.json';
import robo1Parts from '../puzzles/g1-robotics/parts.json';
import robo2Senses from '../puzzles/g2-robotics/senses.json';
import robo2Pickup from '../puzzles/g2-robotics/pickup.json';
import robo3Power from '../puzzles/g3-robotics/power.json';
import robo3Delivery from '../puzzles/g3-robotics/delivery.json';
import robo4Circuits from '../puzzles/g4-robotics/circuits.json';
import robo4Sensors from '../puzzles/g4-robotics/sensors.json';
import robo5Real from '../puzzles/g5-robotics/real.json';
import robo5Mission from '../puzzles/g5-robotics/mission.json';

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
export * from './thinking4';
export * from './maths5';
export * from './words5';
export * from './thinking5';
export * from './science';
export * from './tests';
export * from './sync';
export * from './coding';
export * from './robotics';

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
  ...g4Crossword, ...g4Sudoku, ...g4Logic, ...g4Patterns, ...g4Codes,
  ...g5Numbers, ...g5BigOps, ...g5Fractions, ...g5Decimals, ...g5Percent, ...g5Geometry, ...g5Charts,
  ...g5EJoining, ...g5EVoice, ...g5EIdioms, ...g5ESpelling, ...g5EReading,
  ...g5Crossword, ...g5SumGrid, ...g5Teasers, ...g5Series, ...g5LogicCodes,
  ...sci1Body, ...sci1Living, ...sci1Animals, ...sci2Plants, ...sci2Food, ...sci2Weather, ...sci3Animals, ...sci3Senses, ...sci3AirWater, ...sci4PlantsFood, ...sci4Matter, ...sci4WaterCycle, ...sci5Body, ...sci5Living, ...sci5Space,
  ...code1Steps, ...code1Fix, ...code2Coins, ...code2Fix, ...code3Loops, ...code3Trace, ...code4Turns, ...code4If, ...code5Functions, ...code5Variables,
  ...robo1World, ...robo1Parts, ...robo2Senses, ...robo2Pickup, ...robo3Power, ...robo3Delivery, ...robo4Circuits, ...robo4Sensors, ...robo5Real, ...robo5Mission,
] as unknown as Puzzle[];

/** A topic's puzzles, easiest first (stable within a difficulty). */
export const puzzlesFor = (topic: string) =>
  PUZZLES.filter((p) => p.topic === topic).sort((a, b) => a.difficulty - b.difficulty);
