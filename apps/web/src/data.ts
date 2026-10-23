import bookStackArt from './assets/card-book-stack.svg';
import calendarArt from './assets/card-calendar.svg';
import lightbulbArt from './assets/card-lightbulb.svg';
import parentChildArt from './assets/card-parent-child.svg';
// Grades, subjects and puzzle content are shared with the mobile app.
export { GRADES, GRADE_COLORS, GRADE_NOTES, SUBJECTS, type Grade } from '@quickstep/content';

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
  { cat: 'Exam Updates', title: 'CBSE Class 10 Datesheet Announced', desc: 'Check important dates and official notice here.', when: '2 days ago', img: calendarArt, bg: '#ffecec' },
  { cat: 'Learning Guides', title: '7 Fun Number Puzzles for Primary Students', desc: 'Make maths fun with these simple activities.', when: '3 days ago', img: lightbulbArt, bg: '#fff4dc' },
  { cat: 'Parenting', title: 'How to Build a Daily Learning Habit', desc: 'Practical tips to encourage consistent learning.', when: '5 days ago', img: parentChildArt, bg: '#f2ecff' },
  { cat: 'Study Tips', title: 'Best Books for Grade 1–5 Maths and English', desc: 'A curated list for home practice and concept building.', when: '1 week ago', img: bookStackArt, bg: '#e9f6ff' },
];

export const FLOATERS = [
  { t: '3', l: '6%', tp: '8%', c: '#ff4f8b', r: '-12deg', d: 0 },
  { t: '5', l: '10%', tp: '70%', c: '#3b8cff', r: '10deg', d: 0.8 },
  { t: 'A', l: '26%', tp: '6%', c: '#ff9a2e', r: '8deg', d: 1.4 },
  { t: '★', l: '30%', tp: '82%', c: '#ffb800', r: '0deg', d: 0.4 },
  { t: '+', l: '58%', tp: '62%', c: '#2fbf71', r: '0deg', d: 1.1 },
];
