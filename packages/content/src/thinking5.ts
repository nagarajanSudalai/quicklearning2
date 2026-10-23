// Grade 5 Thinking Skills content: brain teasers (answers worked out in code where possible),
// number and letter analogies, and extra crossword clues.

/** Brain teasers. `solve` recomputes the answer so a typo in `answer` can't slip through. */
export const TEASERS: { id: string; text: string; answer: string; wrong: string[]; level: 1 | 2 | 3; solve?: () => string }[] = [
  { id: 'legs1', level: 1, text: 'A farmer has 3 hens and 2 cows. How many legs are there in all?', answer: '14', wrong: ['10', '12', '20'], solve: () => String(3 * 2 + 2 * 4) },
  { id: 'coins1', level: 1, text: 'Asha has 4 coins of ₹5 and 3 coins of ₹2. How much money does she have?', answer: '₹26', wrong: ['₹20', '₹7', '₹23'], solve: () => `₹${4 * 5 + 3 * 2}` },
  { id: 'age1', level: 1, text: 'Ravi is 10 years old. His sister is 4 years younger. How old will she be in 3 years?', answer: '9', wrong: ['6', '13', '7'], solve: () => String(10 - 4 + 3) },
  { id: 'week1', level: 1, text: 'Today is Monday. What day will it be 10 days from now?', answer: 'Thursday', wrong: ['Wednesday', 'Friday', 'Monday'], solve: () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][10 % 7] },
  { id: 'pages1', level: 1, text: 'A book has 120 pages. Meena reads 15 pages a day. How many days will she take?', answer: '8', wrong: ['6', '10', '12'], solve: () => String(120 / 15) },
  { id: 'wheels1', level: 1, text: 'In a parking lot there are 5 cars and 4 bicycles. How many wheels are there?', answer: '28', wrong: ['18', '20', '36'], solve: () => String(5 * 4 + 4 * 2) },
  { id: 'eggs1', level: 1, text: 'A box holds 6 eggs. How many boxes are needed for 45 eggs?', answer: '8', wrong: ['7', '6', '9'], solve: () => String(Math.ceil(45 / 6)) },
  { id: 'sum2', level: 2, text: 'Two numbers add up to 20. One number is 4 more than the other. What is the bigger number?', answer: '12', wrong: ['8', '10', '16'], solve: () => String((20 + 4) / 2) },
  { id: 'legs2', level: 2, text: 'In a field there are cows and hens. There are 10 heads and 28 legs. How many cows are there?', answer: '4', wrong: ['6', '5', '3'], solve: () => { for (let c = 0; c <= 10; c++) if (c * 4 + (10 - c) * 2 === 28) return String(c); return '?'; } },
  { id: 'age2', level: 2, text: 'A father is 30 years older than his son. Together their ages add up to 50. How old is the son?', answer: '10', wrong: ['20', '15', '5'], solve: () => String((50 - 30) / 2) },
  { id: 'handshake2', level: 2, text: '5 friends meet and each shakes hands once with every other friend. How many handshakes are there?', answer: '10', wrong: ['20', '25', '5'], solve: () => String((5 * 4) / 2) },
  { id: 'queue2', level: 2, text: 'In a queue, Tara is 4th from the front and 6th from the back. How many people are in the queue?', answer: '9', wrong: ['10', '8', '11'], solve: () => String(4 + 6 - 1) },
  { id: 'fence2', level: 2, text: 'A straight fence is 20 metres long with a post every 5 metres, including both ends. How many posts are there?', answer: '5', wrong: ['4', '6', '20'], solve: () => String(20 / 5 + 1) },
  { id: 'clock2', level: 2, text: 'A clock strikes once at 1 o’clock, twice at 2 o’clock, and so on. How many times does it strike from 1 to 4 o’clock?', answer: '10', wrong: ['4', '8', '12'], solve: () => String(1 + 2 + 3 + 4) },
  { id: 'cut3', level: 3, text: 'It takes 3 minutes to cut a log into 2 pieces. How long does it take to cut it into 4 pieces?', answer: '9 minutes', wrong: ['12 minutes', '6 minutes', '8 minutes'], solve: () => `${3 * (4 - 1)} minutes` },
  { id: 'snail3', level: 3, text: 'A snail climbs a 10-metre wall. Each day it climbs 3 metres and each night slides back 2 metres. On which day does it reach the top?', answer: 'day 8', wrong: ['day 10', 'day 5', 'day 7'], solve: () => { let h = 0; for (let d = 1; ; d++) { h += 3; if (h >= 10) return `day ${d}`; h -= 2; } } },
  { id: 'socks3', level: 3, text: 'A drawer has red and blue socks mixed up. In the dark, how many socks must you take to be sure of a matching pair?', answer: '3', wrong: ['2', '4', '5'], solve: () => String(2 + 1) },
  { id: 'brothers3', level: 3, text: 'Meera has 3 brothers. Each brother has 1 sister. How many sisters are there in the family?', answer: '1', wrong: ['3', '4', '2'] },
  { id: 'heavy3', level: 3, text: 'Which is heavier: a kilogram of cotton or a kilogram of iron?', answer: 'they weigh the same', wrong: ['cotton', 'iron', 'it depends'] },
  { id: 'month3', level: 3, text: 'Some months have 31 days and some have 30. How many months have 28 days?', answer: '12', wrong: ['1', '2', '0'] },
  { id: 'pills3', level: 3, text: 'A doctor gives you 3 tablets and says take one every half hour. How many minutes will they last?', answer: '60 minutes', wrong: ['90 minutes', '30 minutes', '120 minutes'], solve: () => `${(3 - 1) * 30} minutes` },
];

/** Number and letter analogies ("2 is to 4 as 5 is to ?"). */
export const ANALOGIES5: { a: string; b: string; c: string; d: string; wrong: string[] }[] = [
  { a: '2', b: '4', c: '5', d: '10', wrong: ['7', '25'] },
  { a: '3', b: '9', c: '4', d: '16', wrong: ['12', '8'] },
  { a: '10', b: '5', c: '30', d: '15', wrong: ['25', '10'] },
  { a: '7', b: '14', c: '9', d: '18', wrong: ['16', '81'] },
  { a: 'A', b: 'C', c: 'E', d: 'G', wrong: ['F', 'H'] },
  { a: 'B', b: 'D', c: 'M', d: 'O', wrong: ['N', 'P'] },
  { a: 'A', b: 'Z', c: 'B', d: 'Y', wrong: ['C', 'X'] },
  { a: '6', b: '36', c: '7', d: '49', wrong: ['42', '14'] },
  { a: '100', b: '10', c: '400', d: '40', wrong: ['20', '4'] },
  { a: 'Monday', b: 'Wednesday', c: 'Friday', d: 'Sunday', wrong: ['Saturday', 'Monday'] },
];

/** Extra crossword clues for Grade 5. */
export const CLUES5: Record<string, string> = {
  volcano: 'A mountain that can erupt', compass: 'It shows north', journey: 'A long trip', library: 'You borrow books here',
  harvest: 'Gathering the crops', capital: 'The main city of a country', village: 'A small place in the country',
  diamond: 'A very hard, shiny stone', science: 'The study of how the world works', pyramid: 'An Egyptian tomb with a point',
  thunder: 'The noise after lightning', festival: 'A time of celebration', triangle: 'A shape with three sides',
  equator: 'An imaginary line around Earth’s middle', mountain: 'Much higher than a hill', oxygen: 'The gas we breathe in',
  planet: 'Earth is one', hockey: 'A game played with sticks', cricket: 'A game with bats and wickets', puzzle: 'A problem to solve for fun',
};
