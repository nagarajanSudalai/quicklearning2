export type ShapeKind = 'star' | 'circle' | 'square' | 'tri' | 'diamond';

export type Puzzle = { seq: ShapeKind[]; ans: ShapeKind; opts: ShapeKind[] };

export const GRADES = [1, 2, 3, 4, 5] as const;
export type Grade = (typeof GRADES)[number];

export const GRADE_COLORS: Record<Grade, string> = {
  1: '#ff4f8b',
  2: '#ff9a2e',
  3: '#2fbf71',
  4: '#3b8cff',
  5: '#9a5cf0',
};

export const GRADE_NOTES: Record<Grade, string> = {
  1: 'Grade 1 · ages 6–7: counting, shapes, simple patterns and picture words.',
  2: 'Grade 2 · ages 7–8: addition & subtraction, number patterns, mini crosswords.',
  3: 'Grade 3 · ages 8–9: times tables, logic grids, spelling crosswords.',
  4: 'Grade 4 · ages 9–10: fractions, sudoku, word ladders, reading puzzles.',
  5: 'Grade 5 · ages 10–11: decimals, brain teasers, science quizzes.',
};

export const SUBJECTS = [
  { name: 'Maths', desc: 'Numbers, shapes, patterns and more', glyph: '+−', color: '#ff4f8b' },
  { name: 'English', desc: 'Reading, vocabulary, writing and grammar', glyph: 'Aa', color: '#3b8cff' },
  { name: 'Science', desc: 'Explore the world around you', glyph: '⚗', color: '#2fbf71' },
  { name: 'Puzzles', desc: 'Crosswords, logic, brain games', glyph: '✱', color: '#ff9a2e' },
  { name: 'Thinking Skills', desc: 'Problem-solving and reasoning', glyph: '?', color: '#9a5cf0' },
  { name: 'Practice & Tests', desc: 'Topic-wise practice and assessments', glyph: '✓', color: '#1fa3c4' },
];

export const PUZZLES: Puzzle[] = [
  { seq: ['star', 'circle', 'star', 'circle', 'star'], ans: 'circle', opts: ['square', 'circle', 'star'] },
  { seq: ['square', 'square', 'tri', 'square', 'square'], ans: 'tri', opts: ['tri', 'square', 'circle'] },
  { seq: ['circle', 'tri', 'diamond', 'circle', 'tri'], ans: 'diamond', opts: ['circle', 'star', 'diamond'] },
  { seq: ['star', 'star', 'circle', 'circle', 'star'], ans: 'star', opts: ['diamond', 'star', 'circle'] },
];

export type PostCategory = 'Exam Updates' | 'Learning Guides' | 'Parenting' | 'Study Tips';
export const TABS = ['All', 'Exam Updates', 'Study Tips', 'Parenting', 'Learning Guides'] as const;
export type Tab = (typeof TABS)[number];

// [tag background, tag text colour, tag label]
export const TAGS: Record<PostCategory, [string, string, string]> = {
  'Exam Updates': ['#ffe6e6', '#d63333', 'EXAM UPDATE'],
  'Learning Guides': ['#ffe9df', '#c4521a', 'LEARNING GUIDE'],
  Parenting: ['#e3f8ec', '#1f8a50', 'FOR PARENTS'],
  'Study Tips': ['#f6e6ff', '#8a2fc4', 'STUDY TIPS'],
};

export const POSTS: { cat: PostCategory; title: string; desc: string; when: string; img: string; bg: string }[] = [
  { cat: 'Exam Updates', title: 'CBSE Class 10 Datesheet Announced', desc: 'Check important dates and official notice here.', when: '2 days ago', img: 'calendar art', bg: '#ffecec' },
  { cat: 'Learning Guides', title: '7 Fun Number Puzzles for Primary Students', desc: 'Make maths fun with these simple activities.', when: '3 days ago', img: 'lightbulb art', bg: '#fff4dc' },
  { cat: 'Parenting', title: 'How to Build a Daily Learning Habit', desc: 'Practical tips to encourage consistent learning.', when: '5 days ago', img: 'parent + child', bg: '#f2ecff' },
  { cat: 'Study Tips', title: 'Best Books for Grade 1–5 Maths and English', desc: 'A curated list for home practice and concept building.', when: '1 week ago', img: 'book stack', bg: '#e9f6ff' },
];

export const FLOATERS = [
  { t: '3', l: '6%', tp: '8%', c: '#ff4f8b', r: '-12deg', d: 0 },
  { t: '5', l: '10%', tp: '70%', c: '#3b8cff', r: '10deg', d: 0.8 },
  { t: 'A', l: '48%', tp: '6%', c: '#ff9a2e', r: '8deg', d: 1.4 },
  { t: '★', l: '30%', tp: '82%', c: '#ffb800', r: '0deg', d: 0.4 },
  { t: '+', l: '58%', tp: '62%', c: '#2fbf71', r: '0deg', d: 1.1 },
];
