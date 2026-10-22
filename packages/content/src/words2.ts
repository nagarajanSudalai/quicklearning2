// Word tables for Grade 2 English. The content checker recomputes every answer from these.

/** Singular → plural, with a picture for the singular. */
export const PLURALS: Record<string, { plural: string; picture: string; kind: 's' | 'es' | 'irregular' }> = {
  cat: { plural: 'cats', picture: '🐱', kind: 's' }, dog: { plural: 'dogs', picture: '🐶', kind: 's' },
  pen: { plural: 'pens', picture: '🖊️', kind: 's' }, cup: { plural: 'cups', picture: '☕', kind: 's' },
  book: { plural: 'books', picture: '📖', kind: 's' }, tree: { plural: 'trees', picture: '🌳', kind: 's' },
  car: { plural: 'cars', picture: '🚗', kind: 's' }, ball: { plural: 'balls', picture: '⚽', kind: 's' },
  star: { plural: 'stars', picture: '⭐', kind: 's' }, kite: { plural: 'kites', picture: '🪁', kind: 's' },
  box: { plural: 'boxes', picture: '📦', kind: 'es' }, bus: { plural: 'buses', picture: '🚌', kind: 'es' },
  fox: { plural: 'foxes', picture: '🦊', kind: 'es' }, watch: { plural: 'watches', picture: '⌚', kind: 'es' },
  bench: { plural: 'benches', picture: '🪑', kind: 'es' }, glass: { plural: 'glasses', picture: '🥛', kind: 'es' },
  dress: { plural: 'dresses', picture: '👗', kind: 'es' }, peach: { plural: 'peaches', picture: '🍑', kind: 'es' },
  mouse: { plural: 'mice', picture: '🐭', kind: 'irregular' }, foot: { plural: 'feet', picture: '🦶', kind: 'irregular' },
  man: { plural: 'men', picture: '👨', kind: 'irregular' }, woman: { plural: 'women', picture: '👩', kind: 'irregular' },
  tooth: { plural: 'teeth', picture: '🦷', kind: 'irregular' }, child: { plural: 'children', picture: '🧒', kind: 'irregular' },
  sheep: { plural: 'sheep', picture: '🐑', kind: 'irregular' }, fish: { plural: 'fish', picture: '🐟', kind: 'irregular' },
};

/** Opposites; only the left word is ever asked about, so each question has one answer. */
export const OPPOSITES: [word: string, opposite: string, level: 1 | 2 | 3][] = [
  ['big', 'small', 1], ['hot', 'cold', 1], ['happy', 'sad', 1], ['tall', 'short', 1], ['fast', 'slow', 1],
  ['day', 'night', 1], ['wet', 'dry', 1], ['full', 'empty', 1],
  ['old', 'new', 2], ['hard', 'soft', 2], ['clean', 'dirty', 2], ['heavy', 'light', 2], ['thick', 'thin', 2],
  ['rich', 'poor', 2], ['near', 'far', 2], ['early', 'late', 2],
  ['open', 'close', 3], ['up', 'down', 3], ['in', 'out', 3], ['push', 'pull', 3], ['come', 'go', 3],
  ['inside', 'outside', 3], ['give', 'take', 3], ['laugh', 'cry', 3],
];

/** Nouns for "a" / "an". Words with a silent h or a "you" sound (hour, uniform) are left out on purpose. */
export const ARTICLE_NOUNS: Record<string, string> = {
  apple: '🍎', egg: '🥚', owl: '🦉', ant: '🐜', umbrella: '☂️', orange: '🍊', elephant: '🐘', 'ice cream': '🍦', onion: '🧅', octopus: '🐙',
  cat: '🐱', dog: '🐶', ball: '⚽', banana: '🍌', book: '📖', tree: '🌳', fish: '🐟', kite: '🪁', mango: '🥭', parrot: '🦜',
};
export const article = (noun: string) => ('aeiou'.includes(noun[0]) ? 'an' : 'a');

/** Subjects for "is" / "are", each with a picture and the rest of the sentence. */
export const IS_ARE: { subject: string; plural: boolean; rest: string; picture: string }[] = [
  { subject: 'The cat', plural: false, rest: 'sleeping.', picture: '🐱' },
  { subject: 'The cats', plural: true, rest: 'sleeping.', picture: '🐱🐱' },
  { subject: 'The dog', plural: false, rest: 'barking.', picture: '🐶' },
  { subject: 'The dogs', plural: true, rest: 'barking.', picture: '🐶🐶' },
  { subject: 'The mango', plural: false, rest: 'sweet.', picture: '🥭' },
  { subject: 'The mangoes', plural: true, rest: 'sweet.', picture: '🥭🥭' },
  { subject: 'The birds', plural: true, rest: 'flying.', picture: '🐦🐦' },
  { subject: 'The bird', plural: false, rest: 'flying.', picture: '🐦' },
  { subject: 'The children', plural: true, rest: 'playing.', picture: '🧒🧒' },
  { subject: 'The baby', plural: false, rest: 'crying.', picture: '👶' },
  { subject: 'The flowers', plural: true, rest: 'red.', picture: '🌹🌹' },
  { subject: 'The sun', plural: false, rest: 'hot.', picture: '☀️' },
  { subject: 'The mice', plural: true, rest: 'small.', picture: '🐭🐭' },
  { subject: 'The bus', plural: false, rest: 'yellow.', picture: '🚌' },
  { subject: 'The fish', plural: false, rest: 'swimming.', picture: '🐟' },
  { subject: 'My feet', plural: true, rest: 'cold.', picture: '🦶' },
];

/** Short sentences for "Make a sentence", grouped by level (3 words → 4–5 → 5–6). */
export const SENTENCES: { text: string; picture: string; level: 1 | 2 | 3 }[] = [
  { text: 'Birds can fly.', picture: '🐦', level: 1 }, { text: 'Fish can swim.', picture: '🐟', level: 1 },
  { text: 'Dogs can bark.', picture: '🐶', level: 1 }, { text: 'We play cricket.', picture: '🏏', level: 1 },
  { text: 'I like mangoes.', picture: '🥭', level: 1 }, { text: 'The sun shines.', picture: '☀️', level: 1 },
  { text: 'Ravi reads books.', picture: '📚', level: 1 },
  { text: 'The cat is sleeping.', picture: '🐱', level: 2 }, { text: 'My kite is red.', picture: '🪁', level: 2 },
  { text: 'The baby is crying.', picture: '👶', level: 2 }, { text: 'Meena has a teddy.', picture: '🧸', level: 2 },
  { text: 'We go to school.', picture: '🏫', level: 2 }, { text: 'The bus is yellow.', picture: '🚌', level: 2 },
  { text: 'I drink warm milk.', picture: '🥛', level: 2 },
  { text: 'The cat is on the mat.', picture: '🐈', level: 3 }, { text: 'I eat rice and dal.', picture: '🍛', level: 3 },
  { text: 'The boy is flying a kite.', picture: '🪁', level: 3 }, { text: 'We go to the park.', picture: '🌳', level: 3 },
  { text: 'The parrot is in the tree.', picture: '🦜', level: 3 }, { text: 'My mother cooks tasty food.', picture: '🍲', level: 3 },
];

/** Words that never fit the sentences above, used as the spare tile at level 3. */
export const SPARE_WORDS = ['blue', 'jump', 'under', 'sing', 'green', 'quickly'];
