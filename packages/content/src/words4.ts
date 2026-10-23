// Word tables and passages for Grade 4 English. The checker recomputes answers from these.

/** Sentences tagged with pronouns and adverbs (questions only ask for a tag that appears once). */
export const TAGGED4: string[] = [
  'She/pronoun runs quickly/adverb.',
  'He/pronoun sings loudly/adverb.',
  'They/pronoun walked slowly/adverb home.',
  'We/pronoun finished the work early/adverb.',
  'It/pronoun rained heavily/adverb all night.',
  'I/pronoun waited patiently/adverb for the bus.',
  'The cat jumped high/adverb and it/pronoun landed softly/adverb.',
  'Ravi spoke gently/adverb to them/pronoun.',
  'Meena gave her/pronoun pencil to Asha.',
  'The children played happily/adverb in the park.',
  'You/pronoun write neatly/adverb.',
  'The old man walked carefully/adverb across the road.',
  'Grandma told us/pronoun a story.',
  'The dog barked angrily/adverb at the stranger.',
  'Please call me/pronoun tomorrow/adverb.',
  'The baby slept peacefully/adverb.',
  'Arjun answered the question correctly/adverb.',
  'Our/pronoun teacher smiled warmly/adverb.',
  'The bird flew away/adverb from him/pronoun.',
  'The sun shone brightly/adverb.',
];

/** Verb → -ing form (with the spelling changes). */
export const ING: Record<string, string> = {
  play: 'playing', read: 'reading', jump: 'jumping', eat: 'eating', sing: 'singing', cook: 'cooking', walk: 'walking',
  write: 'writing', dance: 'dancing', ride: 'riding', make: 'making', run: 'running', swim: 'swimming', sit: 'sitting',
  cut: 'cutting', shop: 'shopping', drive: 'driving', bake: 'baking', clap: 'clapping', skip: 'skipping',
};

/** Present-tense subjects and the helper verb each takes. */
export const SUBJECTS4: { who: string; be: 'am' | 'is' | 'are' }[] = [
  { who: 'I', be: 'am' }, { who: 'She', be: 'is' }, { who: 'He', be: 'is' }, { who: 'We', be: 'are' },
  { who: 'They', be: 'are' }, { who: 'Ravi', be: 'is' }, { who: 'The children', be: 'are' }, { who: 'My mother', be: 'is' },
];

/** Prefix and suffix words, each with a meaning to ask about. */
export const AFFIXES: { word: string; base: string; affix: string; kind: 'prefix' | 'suffix'; meaning: string }[] = [
  { word: 'unhappy', base: 'happy', affix: 'un', kind: 'prefix', meaning: 'not happy' },
  { word: 'unkind', base: 'kind', affix: 'un', kind: 'prefix', meaning: 'not kind' },
  { word: 'unlock', base: 'lock', affix: 'un', kind: 'prefix', meaning: 'to open a lock' },
  { word: 'redo', base: 'do', affix: 're', kind: 'prefix', meaning: 'to do again' },
  { word: 'rewrite', base: 'write', affix: 're', kind: 'prefix', meaning: 'to write again' },
  { word: 'reread', base: 'read', affix: 're', kind: 'prefix', meaning: 'to read again' },
  { word: 'dislike', base: 'like', affix: 'dis', kind: 'prefix', meaning: 'to not like' },
  { word: 'disagree', base: 'agree', affix: 'dis', kind: 'prefix', meaning: 'to not agree' },
  { word: 'unsafe', base: 'safe', affix: 'un', kind: 'prefix', meaning: 'not safe' },
  { word: 'helpful', base: 'help', affix: 'ful', kind: 'suffix', meaning: 'full of help' },
  { word: 'careful', base: 'care', affix: 'ful', kind: 'suffix', meaning: 'full of care' },
  { word: 'colourful', base: 'colour', affix: 'ful', kind: 'suffix', meaning: 'full of colour' },
  { word: 'careless', base: 'care', affix: 'less', kind: 'suffix', meaning: 'without care' },
  { word: 'homeless', base: 'home', affix: 'less', kind: 'suffix', meaning: 'without a home' },
  { word: 'fearless', base: 'fear', affix: 'less', kind: 'suffix', meaning: 'without fear' },
  { word: 'painless', base: 'pain', affix: 'less', kind: 'suffix', meaning: 'without pain' },
  { word: 'joyful', base: 'joy', affix: 'ful', kind: 'suffix', meaning: 'full of joy' },
  { word: 'teacher', base: 'teach', affix: 'er', kind: 'suffix', meaning: 'a person who teaches' },
  { word: 'painter', base: 'paint', affix: 'er', kind: 'suffix', meaning: 'a person who paints' },
];
/** The affixes a wrong option may use. */
export const PREFIXES = ['un', 're', 'dis'];
export const SUFFIXES = ['ful', 'less', 'er'];

/** Word ladders: each word changes one letter from the one before. */
export const LADDERS: string[][] = [
  ['cat', 'cot', 'dot', 'dog'], ['pig', 'pin', 'pan', 'man'], ['hot', 'hat', 'cat'], ['sun', 'bun', 'bin', 'bit'],
  ['cold', 'cord', 'card', 'ward', 'warm'], ['fish', 'dish', 'wish'], ['bake', 'cake', 'lake', 'like', 'bike'],
  ['ten', 'tan', 'can', 'cap'], ['rain', 'gain', 'grin'], ['book', 'look', 'lock', 'rock'], ['bell', 'ball', 'tall', 'tale'],
  ['hand', 'band', 'bend', 'bead'], ['milk', 'mill', 'fill', 'fall'], ['mat', 'map', 'mop', 'top'], ['ship', 'shop', 'stop'],
  ['lion', 'loon', 'moon'], ['hen', 'pen', 'pet', 'net'], ['coat', 'boat', 'boot', 'foot'], ['road', 'load', 'loud'],
  ['bed', 'red', 'rod', 'nod'],
];
/** Real words that may appear as wrong choices in ladders (one letter off, but leading nowhere). */
export const LADDER_WORDS = new Set([
  ...LADDERS.flat(),
  'cut', 'cog', 'bat', 'hut', 'pit', 'pen', 'fan', 'can', 'bag', 'hop', 'fun', 'sit', 'cord', 'word', 'warn', 'dash', 'wash',
  'wise', 'make', 'lane', 'time', 'tin', 'ton', 'cop', 'gap', 'pain', 'grit', 'cook', 'hook', 'sock', 'rack', 'well', 'bill',
  'tell', 'tail', 'sand', 'bond', 'band', 'mild', 'silk', 'will', 'fell', 'mad', 'cap', 'tip', 'chip', 'step', 'shot', 'lean',
  'moan', 'loot', 'hen', 'get', 'not', 'cost', 'goat', 'boom', 'fool', 'toad', 'lord', 'roam', 'bad', 'rid', 'nod', 'sun',
  'fog', 'bin', 'lit', 'dig', 'cap', 'hit', 'bun', 'pan', 'pet', 'pot', 'bit', 'beg', 'red', 'rod', 'card', 'cold',
]);
export const oneLetterApart = (a: string, b: string) => a.length === b.length && [...a].filter((ch, i) => ch !== b[i]).length === 1;

/** Longer passages: level 1 what, level 2 why, level 3 word meaning in context. */
export const PASSAGES4: { level: 1 | 2 | 3; text: string; question: string; answer: string; wrong: string[] }[] = [
  { level: 1, text: 'Every summer, Ria visits her grandparents in their village. She helps her grandfather feed the cows and pick mangoes from the orchard. In the evening, her grandmother tells her stories of the old days.', question: 'What does Ria pick in the orchard?', answer: 'mangoes', wrong: ['apples', 'flowers', 'leaves'] },
  { level: 1, text: 'The school held a science fair. Aman made a small windmill that turned when he blew on it. His friend Zoya showed how plants drink water through their roots.', question: 'What did Aman make?', answer: 'a windmill', wrong: ['a plant', 'a kite', 'a robot'] },
  { level: 1, text: 'Lakshmi saved her pocket money for three months. She wanted to buy a book about stars and planets. When she had enough, her father took her to the bookshop.', question: 'What was the book about?', answer: 'stars and planets', wrong: ['animals', 'cooking', 'cricket'] },
  { level: 1, text: 'The village had no well, so the women walked far every day to fetch water. The people worked together and dug a new well near the school. Now the children can drink clean water.', question: 'Where did the people dig the new well?', answer: 'near the school', wrong: ['near the river', 'in the forest', 'at the market'] },
  { level: 1, text: 'A tortoise and a hare had a race. The hare ran fast and then slept under a tree. The tortoise kept walking slowly and won the race.', question: 'Who won the race?', answer: 'the tortoise', wrong: ['the hare', 'the fox', 'nobody'] },
  { level: 1, text: 'Dev wanted to learn to swim. His uncle took him to the pool every Sunday. At first Dev was scared, but by the end of the year he could swim across the pool.', question: 'Who took Dev to the pool?', answer: 'his uncle', wrong: ['his father', 'his teacher', 'his sister'] },
  { level: 1, text: 'In the monsoon, the dry pond near Sara’s house filled with water. Frogs began to croak at night and ducks came to swim. Sara loved watching them from her window.', question: 'What came to swim in the pond?', answer: 'ducks', wrong: ['fish', 'children', 'cows'] },
  { level: 2, text: 'Kiran forgot to close the gate. The goats walked into the garden and ate all of Mother’s spinach. Kiran said sorry and helped plant new seeds.', question: 'Why did the goats get into the garden?', answer: 'the gate was open', wrong: ['the fence broke', 'they were hungry', 'Mother let them in'] },
  { level: 2, text: 'Neel practised the flute every evening for a month. At the school function, he played without a single mistake, and everyone clapped loudly.', question: 'Why did Neel play without mistakes?', answer: 'he practised every evening', wrong: ['the song was easy', 'his friend helped', 'he played slowly'] },
  { level: 2, text: 'Tara’s plant grew tall but its leaves turned yellow. Her teacher said it was getting too little sunlight. Tara moved the pot to the window, and soon the leaves were green again.', question: 'Why did Tara move the pot?', answer: 'to give it more sunlight', wrong: ['to water it', 'to make room', 'to show her friends'] },
  { level: 2, text: 'The baker started work at four in the morning. He wanted the bread to be fresh and warm when people came to buy it for breakfast.', question: 'Why did the baker start so early?', answer: 'so the bread was fresh for breakfast', wrong: ['he could not sleep', 'the shop was far', 'he liked the dark'] },
  { level: 2, text: 'Aditi wore a raincoat and boots to school. The sky had been dark and cloudy since morning, and the radio said heavy rain was coming.', question: 'Why did Aditi wear a raincoat?', answer: 'heavy rain was coming', wrong: ['it was cold', 'it was new', 'her friend had one'] },
  { level: 2, text: 'The library was very quiet. A sign on the wall said, "Please do not talk." Rohan whispered to his friend so he would not disturb others.', question: 'Why did Rohan whisper?', answer: 'so he would not disturb others', wrong: ['he had a cold', 'it was a secret', 'his friend was asleep'] },
  { level: 2, text: 'The farmer built a scarecrow and put it in the middle of his field. Before that, crows ate the seeds he had planted.', question: 'Why did the farmer build a scarecrow?', answer: 'to keep crows away', wrong: ['to scare children', 'for a festival', 'to mark the field'] },
  { level: 3, text: 'The old fort was enormous. It took the children more than an hour to walk all around its high stone walls.', question: 'What does "enormous" mean here?', answer: 'very big', wrong: ['very old', 'very dark', 'very pretty'] },
  { level: 3, text: 'After running the race, Raj was exhausted. He sat down under a tree and drank two glasses of water before he could talk.', question: 'What does "exhausted" mean here?', answer: 'very tired', wrong: ['very happy', 'very angry', 'very hungry'] },
  { level: 3, text: 'The kitten was timid. It hid under the bed whenever anyone came into the room and only came out when it was quiet.', question: 'What does "timid" mean here?', answer: 'shy and easily scared', wrong: ['very playful', 'very hungry', 'sleepy'] },
  { level: 3, text: 'Meera was delighted when she saw her birthday cake. She clapped her hands and jumped with joy.', question: 'What does "delighted" mean here?', answer: 'very pleased', wrong: ['surprised and sad', 'a little worried', 'very full'] },
  { level: 3, text: 'The path up the hill was narrow, so the children had to walk one behind the other.', question: 'What does "narrow" mean here?', answer: 'not wide', wrong: ['very long', 'very steep', 'muddy'] },
  { level: 3, text: 'The soup was so scalding that Vikram had to wait ten minutes before he could take a sip.', question: 'What does "scalding" mean here?', answer: 'very hot', wrong: ['very salty', 'very thick', 'very cold'] },
];
