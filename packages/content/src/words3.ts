// Word tables and short passages for Grade 3 English. The checker recomputes answers from these.

export type WordClass = 'noun' | 'verb' | 'adjective' | 'pronoun' | 'adverb';

/** Sentences with each word tagged; questions only ask for a class that appears exactly once. */
export const TAGGED: string[] = [
  'The tall/adjective boy/noun runs/verb fast.',
  'A small/adjective cat/noun sleeps/verb.',
  'Meena/noun sings/verb sweetly.',
  'The red/adjective kite/noun flies/verb high.',
  'Birds/noun build/verb nests/noun.',
  'The happy/adjective baby/noun laughs/verb.',
  'Ravi/noun kicks/verb the ball/noun.',
  'The old/adjective man/noun walks/verb slowly.',
  'Monkeys/noun climb/verb tall/adjective trees/noun.',
  'The hot/adjective tea/noun is in the cup/noun.',
  'Asha/noun reads/verb a funny/adjective book/noun.',
  'The dog/noun barks/verb loudly.',
  'We eat/verb sweet/adjective mangoes/noun.',
  'The brave/adjective soldier/noun marches/verb.',
  'Fish/noun swim/verb in the blue/adjective sea/noun.',
  'The busy/adjective bee/noun makes/verb honey/noun.',
  'Grandma/noun tells/verb long/adjective stories/noun.',
  'The cold/adjective wind/noun blows/verb.',
  'Children/noun play/verb in the green/adjective park/noun.',
  'The clever/adjective fox/noun jumps/verb.',
  'Arjun/noun draws/verb a big/adjective elephant/noun.',
  'The bright/adjective sun/noun shines/verb.',
];

/** How each word class is named in a question. */
export const WORDS_FOR: Record<WordClass, string> = {
  noun: 'naming word (noun)', verb: 'doing word (verb)', adjective: 'describing word (adjective)',
  pronoun: 'pronoun (a word used instead of a name)', adverb: 'adverb (a word that tells how, when or where)',
};

/** Split a tagged sentence into words (punctuation kept off) and their classes. */
export function parseTagged(s: string): { word: string; tag?: WordClass }[] {
  return s.replace(/[.,!?]/g, '').split(' ').map((w) => {
    const [word, tag] = w.split('/');
    return { word, tag: tag as WordClass | undefined };
  });
}
export const plainSentence = (s: string) => s.replace(/\/(noun|verb|adjective|pronoun|adverb)/g, '');

/** Present → past. */
export const PAST: Record<string, { past: string; kind: 'ed' | 'spelling' | 'irregular' }> = {
  play: { past: 'played', kind: 'ed' }, jump: { past: 'jumped', kind: 'ed' }, walk: { past: 'walked', kind: 'ed' },
  talk: { past: 'talked', kind: 'ed' }, cook: { past: 'cooked', kind: 'ed' }, help: { past: 'helped', kind: 'ed' },
  paint: { past: 'painted', kind: 'ed' }, climb: { past: 'climbed', kind: 'ed' },
  cry: { past: 'cried', kind: 'spelling' }, carry: { past: 'carried', kind: 'spelling' }, stop: { past: 'stopped', kind: 'spelling' },
  hop: { past: 'hopped', kind: 'spelling' }, clap: { past: 'clapped', kind: 'spelling' }, try: { past: 'tried', kind: 'spelling' },
  dance: { past: 'danced', kind: 'spelling' }, smile: { past: 'smiled', kind: 'spelling' }, hug: { past: 'hugged', kind: 'spelling' },
  go: { past: 'went', kind: 'irregular' }, eat: { past: 'ate', kind: 'irregular' }, see: { past: 'saw', kind: 'irregular' },
  run: { past: 'ran', kind: 'irregular' }, swim: { past: 'swam', kind: 'irregular' }, write: { past: 'wrote', kind: 'irregular' },
  sing: { past: 'sang', kind: 'irregular' }, drink: { past: 'drank', kind: 'irregular' }, come: { past: 'came', kind: 'irregular' },
  take: { past: 'took', kind: 'irregular' }, sit: { past: 'sat', kind: 'irregular' },
};

/** Same-meaning words; each word asked about has one synonym among the options. */
export const SYNONYMS: [string, string][] = [
  ['big', 'large'], ['small', 'tiny'], ['happy', 'glad'], ['fast', 'quick'], ['begin', 'start'], ['shut', 'close'],
  ['angry', 'cross'], ['look', 'see'], ['gift', 'present'], ['near', 'close'], ['end', 'finish'], ['silent', 'quiet'],
  ['shout', 'yell'], ['smart', 'clever'], ['scared', 'afraid'], ['pretty', 'beautiful'],
];

/** Homophones in a sentence; `answer` is the right spelling and `set` the words that sound the same. */
export const HOMOPHONES: { sentence: string; answer: string; set: string[] }[] = [
  { sentence: 'I can ___ the moon.', answer: 'see', set: ['see', 'sea'] },
  { sentence: 'We swim in the ___.', answer: 'sea', set: ['see', 'sea'] },
  { sentence: 'The children took ___ bags.', answer: 'their', set: ['their', 'there'] },
  { sentence: 'Put the box over ___.', answer: 'there', set: ['their', 'there'] },
  { sentence: 'I have ___ hands.', answer: 'two', set: ['to', 'two', 'too'] },
  { sentence: 'We go ___ school.', answer: 'to', set: ['to', 'two', 'too'] },
  { sentence: 'Can I come ___?', answer: 'too', set: ['to', 'two', 'too'] },
  { sentence: 'The ___ is red and pretty.', answer: 'flower', set: ['flower', 'flour'] },
  { sentence: 'Mummy uses ___ to make rotis.', answer: 'flour', set: ['flower', 'flour'] },
  { sentence: 'I ___ the answer.', answer: 'know', set: ['know', 'no'] },
  { sentence: 'There is ___ milk left.', answer: 'no', set: ['know', 'no'] },
  { sentence: 'The ___ is shining.', answer: 'sun', set: ['sun', 'son'] },
  { sentence: 'Ravi is my ___.', answer: 'son', set: ['sun', 'son'] },
  { sentence: 'I ___ a letter.', answer: 'write', set: ['write', 'right'] },
  { sentence: 'Turn ___ at the shop.', answer: 'right', set: ['write', 'right'] },
  { sentence: 'The wind ___ hard.', answer: 'blew', set: ['blew', 'blue'] },
  { sentence: 'The sky is ___.', answer: 'blue', set: ['blew', 'blue'] },
  { sentence: 'I have ___ apple.', answer: 'one', set: ['one', 'won'] },
  { sentence: 'Our team ___ the match.', answer: 'won', set: ['one', 'won'] },
];

/** Longer words with pictures, for the spelling bee. */
export const SPELLING_WORDS: Record<string, string> = {
  monkey: '🐒', carrot: '🥕', rabbit: '🐰', pencil: '✏️', flower: '🌸', orange: '🍊', banana: '🍌', turtle: '🐢', school: '🏫',
  giraffe: '🦒', dolphin: '🐬', octopus: '🐙', chicken: '🐔', rainbow: '🌈', penguin: '🐧', peacock: '🦚', pumpkin: '🎃',
  elephant: '🐘', scissors: '✂️', umbrella: '☂️', dinosaur: '🦕', sandwich: '🥪', mushroom: '🍄', computer: '💻', broccoli: '🥦',
};

/** Short passages with one question each: level 1 who, level 2 what, level 3 why. */
export const PASSAGES: { level: 1 | 2 | 3; text: string; question: string; answer: string; wrong: string[] }[] = [
  { level: 1, text: 'Meena has a little puppy. Its name is Moti. Moti likes to play with a red ball.', question: 'Who is Moti?', answer: 'a puppy', wrong: ['a cat', 'a girl', 'a ball'] },
  { level: 1, text: 'Ravi went to the market with his father. They bought apples and bananas.', question: 'Who went to the market with Ravi?', answer: 'his father', wrong: ['his mother', 'his sister', 'his friend'] },
  { level: 1, text: 'A crow was thirsty. It found a pot with a little water. It dropped stones into the pot.', question: 'Who was thirsty?', answer: 'a crow', wrong: ['a fox', 'a dog', 'a child'] },
  { level: 1, text: 'Asha and her grandmother made laddoos for Diwali. Everyone said they were tasty.', question: 'Who made laddoos with Asha?', answer: 'her grandmother', wrong: ['her teacher', 'her brother', 'her friend'] },
  { level: 1, text: 'The farmer gets up early. He gives water to his cows. Then he works in the field.', question: 'Who gets up early?', answer: 'the farmer', wrong: ['the cow', 'the teacher', 'the baby'] },
  { level: 1, text: 'Kabir has a new bicycle. It is blue. He rides it to the park every evening.', question: 'Who has a new bicycle?', answer: 'Kabir', wrong: ['Ravi', 'Meena', 'Asha'] },
  { level: 1, text: 'A little mouse lived in a hole. One day a lion caught it. The mouse said, "Please let me go."', question: 'Who caught the mouse?', answer: 'a lion', wrong: ['a cat', 'a snake', 'an owl'] },
  { level: 2, text: 'It was raining. Priya took her yellow umbrella and walked to school. She did not get wet.', question: 'What did Priya take to school?', answer: 'an umbrella', wrong: ['a ball', 'a coat', 'a kite'] },
  { level: 2, text: 'On Sunday, Arjun and his sister flew kites on the roof. Arjun’s kite was green.', question: 'What colour was Arjun’s kite?', answer: 'green', wrong: ['red', 'blue', 'yellow'] },
  { level: 2, text: 'The ant worked hard all summer. It stored food in its home. In winter, it had plenty to eat.', question: 'What did the ant store?', answer: 'food', wrong: ['water', 'leaves', 'stones'] },
  { level: 2, text: 'Grandpa planted a mango seed. He watered it every day. After many years, it became a big tree.', question: 'What did Grandpa plant?', answer: 'a mango seed', wrong: ['a rose', 'a banana', 'a coconut'] },
  { level: 2, text: 'Riya went to the zoo. She saw a tiger, a peacock and a big elephant. She liked the elephant best.', question: 'Which animal did Riya like best?', answer: 'the elephant', wrong: ['the tiger', 'the peacock', 'the monkey'] },
  { level: 2, text: 'Every morning, Sam drinks a glass of milk. Then he brushes his teeth and gets ready for school.', question: 'What does Sam drink every morning?', answer: 'milk', wrong: ['juice', 'tea', 'water'] },
  { level: 2, text: 'The baker makes bread in a big oven. People come early to buy it while it is still warm.', question: 'What does the baker make?', answer: 'bread', wrong: ['cake', 'rice', 'soup'] },
  { level: 3, text: 'Anu forgot her lunch box at home. Her friend Tara shared her rotis with her. Anu said thank you.', question: 'Why did Tara share her rotis?', answer: 'Anu forgot her lunch', wrong: ['Tara was not hungry', 'Anu was ill', 'the rotis were cold'] },
  { level: 3, text: 'The plant on the window was dry and droopy. Neha gave it water. The next day it stood tall again.', question: 'Why did the plant stand tall again?', answer: 'Neha watered it', wrong: ['it rained', 'it got sun', 'Neha moved it'] },
  { level: 3, text: 'Rohan ran very fast in the race. He did not stop even when he was tired. He came first.', question: 'Why did Rohan come first?', answer: 'he did not stop', wrong: ['he started early', 'the others fell', 'he had new shoes'] },
  { level: 3, text: 'The street was very dark at night. Papa took a torch when he went to buy milk.', question: 'Why did Papa take a torch?', answer: 'the street was dark', wrong: ['it was raining', 'the shop was closed', 'he lost his way'] },
  { level: 3, text: 'Mira woke up late and missed the school bus. Her mother drove her to school in the car.', question: 'Why did Mira miss the bus?', answer: 'she woke up late', wrong: ['the bus was early', 'she was ill', 'it was a holiday'] },
  { level: 3, text: 'The birds flew south when winter came. They went to find warm places and food.', question: 'Why did the birds fly south?', answer: 'to find warm places', wrong: ['to see the sea', 'to build nests', 'to sing songs'] },
];
