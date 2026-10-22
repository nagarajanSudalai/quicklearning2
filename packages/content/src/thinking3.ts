// Hand-written content for Grade 3 Puzzles and Thinking Skills.

/** Crossword words with a short text clue. */
export const CLUES: Record<string, string> = {
  kitten: 'A baby cat', puppy: 'A baby dog', river: 'Water that flows to the sea', apple: 'A red or green fruit',
  pencil: 'You write with it', train: 'It runs on tracks', winter: 'The cold season', mango: 'The king of fruits',
  tiger: "India's national animal", lotus: "India's national flower", camel: 'It lives in the desert', ocean: 'A very big sea',
  cloud: 'It brings rain', bread: 'A baker makes it', honey: 'Bees make it', lemon: 'A sour yellow fruit',
  eagle: 'A big bird that hunts', snake: 'It has no legs', chair: 'You sit on it', table: 'You eat at it',
  plate: 'You eat food from it', heart: 'It beats in your chest', tooth: 'You bite with it', night: 'When the moon shines',
  water: 'You drink it', seven: 'Six plus one', eight: 'Two times four', green: 'The colour of leaves',
  queen: 'A king’s wife', zebra: 'A striped horse-like animal', violin: 'You play it with a bow', parrot: 'A green bird that talks',
};

/** Things children can "have" in a logic grid, three of each kind. */
export const LOGIC_SETS: { question: string; kind: string; items: [emoji: string, name: string][] }[] = [
  { question: 'Who has which pet?', kind: 'pet', items: [['🐱', 'cat'], ['🐶', 'dog'], ['🐰', 'rabbit']] },
  { question: 'Who is eating which fruit?', kind: 'fruit', items: [['🍎', 'apple'], ['🍌', 'banana'], ['🥭', 'mango']] },
  { question: 'Who plays which game?', kind: 'game', items: [['🏏', 'cricket'], ['⚽', 'football'], ['🏸', 'badminton']] },
  { question: 'Who has which kite?', kind: 'kite', items: [['🟥', 'red kite'], ['🟦', 'blue kite'], ['🟩', 'green kite']] },
  { question: 'Who rides which vehicle?', kind: 'vehicle', items: [['🚲', 'bicycle'], ['🛺', 'auto'], ['🚌', 'bus']] },
];
export const LOGIC_PEOPLE = ['Asha', 'Ravi', 'Meena', 'Arjun', 'Priya', 'Kabir', 'Tara', 'Sam'];

/** "a is to b as c is to d". Level 1 uses pictures; 2–3 use words. */
export const ANALOGIES: { a: string; b: string; c: string; d: string; wrong: string[]; level: 1 | 2 | 3 }[] = [
  { a: '🌧️', b: '☂️', c: '☀️', d: '🕶️', wrong: ['🌈', '🧥'], level: 1 },
  { a: '🐄', b: '🥛', c: '🐔', d: '🥚', wrong: ['🌽', '🐣'], level: 1 },
  { a: '☀️', b: '🌞', c: '🌙', d: '🌃', wrong: ['⭐', '☁️'], level: 1 },
  { a: '🐟', b: '🌊', c: '🐫', d: '🏜️', wrong: ['🌳', '🏔️'], level: 1 },
  { a: '✏️', b: '📝', c: '🖌️', d: '🎨', wrong: ['📏', '✂️'], level: 1 },
  { a: '🧦', b: '🦶', c: '🧤', d: '✋', wrong: ['🧢', '👕'], level: 1 },
  { a: '🐶', b: '🦴', c: '🐰', d: '🥕', wrong: ['🧀', '🍌'], level: 1 },
  { a: 'hot', b: 'cold', c: 'day', d: 'night', wrong: ['sun', 'warm'], level: 2 },
  { a: 'puppy', b: 'dog', c: 'kitten', d: 'cat', wrong: ['mouse', 'milk'], level: 2 },
  { a: 'eye', b: 'see', c: 'ear', d: 'hear', wrong: ['nose', 'look'], level: 2 },
  { a: 'one', b: 'two', c: 'three', d: 'four', wrong: ['six', 'ten'], level: 2 },
  { a: 'book', b: 'read', c: 'song', d: 'sing', wrong: ['write', 'dance'], level: 2 },
  { a: 'big', b: 'bigger', c: 'small', d: 'smaller', wrong: ['tiny', 'smallest'], level: 2 },
  { a: 'Monday', b: 'Tuesday', c: 'Friday', d: 'Saturday', wrong: ['Thursday', 'Sunday'], level: 2 },
  { a: 'doctor', b: 'hospital', c: 'teacher', d: 'school', wrong: ['book', 'market'], level: 3 },
  { a: 'pen', b: 'write', c: 'knife', d: 'cut', wrong: ['eat', 'cook'], level: 3 },
  { a: 'lion', b: 'roar', c: 'dog', d: 'bark', wrong: ['run', 'tail'], level: 3 },
  { a: 'January', b: 'February', c: 'November', d: 'December', wrong: ['October', 'January'], level: 3 },
  { a: 'finger', b: 'hand', c: 'toe', d: 'foot', wrong: ['leg', 'shoe'], level: 3 },
  { a: 'water', b: 'drink', c: 'food', d: 'eat', wrong: ['cook', 'plate'], level: 3 },
  { a: 'bird', b: 'fly', c: 'fish', d: 'swim', wrong: ['water', 'walk'], level: 3 },
];
