import type { Grade, Subject, SubjectId, Topic } from './types';
import { colors } from './tokens';

export const GRADES: Grade[] = [1, 2, 3, 4, 5];

export const GRADE_COLORS: Record<Grade, string> = {
  1: colors.pink,
  2: colors.orange,
  3: colors.green,
  4: colors.blue,
  5: colors.purple,
};

export const GRADE_NOTES: Record<Grade, string> = {
  1: 'Grade 1 · ages 6–7: counting, shapes, simple patterns and picture words.',
  2: 'Grade 2 · ages 7–8: addition & subtraction, number patterns, mini crosswords.',
  3: 'Grade 3 · ages 8–9: times tables, logic grids, spelling crosswords.',
  4: 'Grade 4 · ages 9–10: fractions, sudoku, word ladders, reading puzzles.',
  5: 'Grade 5 · ages 10–11: decimals, brain teasers, science quizzes.',
};

export const SUBJECTS: Subject[] = [
  { id: 'maths', name: 'Maths', desc: 'Numbers, shapes, patterns and more', glyph: '+−', color: colors.pink },
  { id: 'english', name: 'English', desc: 'Reading, vocabulary, writing and grammar', glyph: 'Aa', color: colors.blue },
  { id: 'science', name: 'Science', desc: 'Explore the world around you', glyph: '⚗', color: colors.green },
  { id: 'puzzles', name: 'Puzzles', desc: 'Crosswords, logic, brain games', glyph: '✱', color: colors.orange },
  { id: 'thinking', name: 'Thinking Skills', desc: 'Problem-solving and reasoning', glyph: '?', color: colors.purple },
  { id: 'practice', name: 'Practice & Tests', desc: 'Topic-wise practice and assessments', glyph: '✓', color: colors.teal },
];

/** Grades and subjects that have playable content today. */
export const AVAILABLE: Partial<Record<Grade, SubjectId[]>> = { 1: ['maths', 'english'] };

export const TOPICS: Topic[] = [
  { id: 'g1-counting', grade: 1, subject: 'maths', title: 'Counting', blurb: 'Count up to 20', glyph: '123', color: colors.pink },
  { id: 'g1-addition', grade: 1, subject: 'maths', title: 'Adding', blurb: 'Add within 10', glyph: '+', color: colors.orange },
  { id: 'g1-subtraction', grade: 1, subject: 'maths', title: 'Taking away', blurb: 'Subtract within 10', glyph: '−', color: colors.green },
  { id: 'g1-shapes', grade: 1, subject: 'maths', title: 'Shapes', blurb: 'Know your shapes', glyph: '▲', color: colors.blue },
  { id: 'g1-compare', grade: 1, subject: 'maths', title: 'More or fewer', blurb: 'Compare groups', glyph: '⚖', color: colors.purple },
  { id: 'g1-patterns', grade: 1, subject: 'maths', title: 'Patterns', blurb: 'What comes next?', glyph: '★●', color: colors.teal },
  { id: 'g1-letters', grade: 1, subject: 'english', title: 'Big & small letters', blurb: 'Match A to a', glyph: 'Aa', color: colors.blue },
  { id: 'g1-sounds', grade: 1, subject: 'english', title: 'First letters', blurb: 'How does a word start?', glyph: 'b…', color: colors.pink },
  { id: 'g1-words', grade: 1, subject: 'english', title: 'Picture words', blurb: 'Read short words', glyph: 'cat', color: colors.orange },
  { id: 'g1-rhymes', grade: 1, subject: 'english', title: 'Rhyming words', blurb: 'Cat, hat, bat!', glyph: '♪', color: colors.purple },
];

export const topicsFor = (grade: Grade, subject: SubjectId) => TOPICS.filter((t) => t.grade === grade && t.subject === subject);
export const isAvailable = (grade: Grade, subject?: SubjectId) =>
  subject ? !!AVAILABLE[grade]?.includes(subject) : !!AVAILABLE[grade]?.length;
