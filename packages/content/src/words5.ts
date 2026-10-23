// Content for Grade 5 English. Each item names its answer; the checker reads answers from here.

export type BlankItem = { sentence: string; answer: string; options: string[]; level: 1 | 2 | 3 };

/** Joining words: level 1 and/but/or, level 2 because/so/although, level 3 mixed. */
export const CONJUNCTIONS: BlankItem[] = [
  { sentence: 'I like tea ___ my brother likes coffee.', answer: 'but', options: ['but', 'because', 'so'], level: 1 },
  { sentence: 'Would you like rice ___ chapati?', answer: 'or', options: ['or', 'but', 'because'], level: 1 },
  { sentence: 'Asha ___ Meena went to the market.', answer: 'and', options: ['and', 'but', 'so'], level: 1 },
  { sentence: 'The bag is small ___ heavy.', answer: 'but', options: ['but', 'or', 'because'], level: 1 },
  { sentence: 'Do you want to walk ___ take the bus?', answer: 'or', options: ['or', 'and', 'so'], level: 1 },
  { sentence: 'He opened the door ___ walked in.', answer: 'and', options: ['and', 'or', 'because'], level: 1 },
  { sentence: 'I was tired ___ I went to bed early.', answer: 'so', options: ['so', 'because', 'or'], level: 2 },
  { sentence: 'We stayed inside ___ it was raining.', answer: 'because', options: ['because', 'so', 'but'], level: 2 },
  { sentence: '___ it was late, the shop was still open.', answer: 'Although', options: ['Although', 'Because', 'So'], level: 2 },
  { sentence: 'She practised daily ___ she won the prize.', answer: 'so', options: ['so', 'because', 'although'], level: 2 },
  { sentence: 'The plants died ___ nobody watered them.', answer: 'because', options: ['because', 'so', 'or'], level: 2 },
  { sentence: 'Ravi ran fast ___ he still missed the bus.', answer: 'but', options: ['but', 'so', 'because'], level: 2 },
  { sentence: 'Take an umbrella ___ you will get wet.', answer: 'or', options: ['or', 'because', 'although'], level: 3 },
  { sentence: 'Wait here ___ I come back.', answer: 'until', options: ['until', 'although', 'or'], level: 3 },
  { sentence: 'Wash your hands ___ you eat.', answer: 'before', options: ['before', 'because', 'but'], level: 3 },
  { sentence: 'We will go out ___ the rain stops.', answer: 'when', options: ['when', 'or', 'but'], level: 3 },
];

/** Position words, shown with a picture where one helps. */
export const PREPOSITIONS: BlankItem[] = [
  { sentence: 'The cat is sleeping ___ the bed.', answer: 'under', options: ['under', 'at', 'since'], level: 1 },
  { sentence: 'The books are ___ the shelf.', answer: 'on', options: ['on', 'at', 'for'], level: 1 },
  { sentence: 'The fish swim ___ the pond.', answer: 'in', options: ['in', 'on', 'at'], level: 1 },
  { sentence: 'The ball is ___ the two chairs.', answer: 'between', options: ['between', 'among', 'on'], level: 2 },
  { sentence: 'We have lived here ___ 2019.', answer: 'since', options: ['since', 'for', 'from'], level: 2 },
  { sentence: 'She has been waiting ___ two hours.', answer: 'for', options: ['for', 'since', 'at'], level: 2 },
  { sentence: 'The school starts ___ 8 o’clock.', answer: 'at', options: ['at', 'on', 'in'], level: 2 },
  { sentence: 'My birthday is ___ Monday.', answer: 'on', options: ['on', 'in', 'at'], level: 3 },
  { sentence: 'We go to the hills ___ May.', answer: 'in', options: ['in', 'on', 'at'], level: 3 },
  { sentence: 'The bird flew ___ the window into the room.', answer: 'through', options: ['through', 'between', 'at'], level: 3 },
  { sentence: 'Divide the sweets ___ all the children.', answer: 'among', options: ['among', 'between', 'on'], level: 3 },
];

/** Active → passive, and direct → reported speech. */
export const VOICE: BlankItem[] = [
  { sentence: 'Ravi kicked the ball. → The ball ___ by Ravi.', answer: 'was kicked', options: ['was kicked', 'kicked', 'is kick'], level: 1 },
  { sentence: 'Meena wrote a letter. → A letter ___ by Meena.', answer: 'was written', options: ['was written', 'was wrote', 'wrote'], level: 1 },
  { sentence: 'The cat drank the milk. → The milk ___ by the cat.', answer: 'was drunk', options: ['was drunk', 'was drank', 'drank'], level: 1 },
  { sentence: 'The cook makes the food. → The food ___ by the cook.', answer: 'is made', options: ['is made', 'was made', 'makes'], level: 1 },
  { sentence: 'The children planted trees. → Trees ___ by the children.', answer: 'were planted', options: ['were planted', 'was planted', 'planted'], level: 1 },
  { sentence: 'Grandpa reads the newspaper. → The newspaper ___ by Grandpa.', answer: 'is read', options: ['is read', 'was read', 'reads'], level: 1 },
  { sentence: 'Asha said, "I am hungry." → Asha said that she ___ hungry.', answer: 'was', options: ['was', 'am', 'is'], level: 2 },
  { sentence: 'Ravi said, "I like mangoes." → Ravi said that he ___ mangoes.', answer: 'liked', options: ['liked', 'like', 'likes'], level: 2 },
  { sentence: 'Mother said, "It is raining." → Mother said that it ___ raining.', answer: 'was', options: ['was', 'is', 'will'], level: 2 },
  { sentence: 'Tara said, "I can swim." → Tara said that she ___ swim.', answer: 'could', options: ['could', 'can', 'will'], level: 2 },
  { sentence: 'Kabir said, "I will come." → Kabir said that he ___ come.', answer: 'would', options: ['would', 'will', 'can'], level: 2 },
  { sentence: 'The teacher said, "Sit down." → The teacher told us ___ sit down.', answer: 'to', options: ['to', 'that', 'for'], level: 3 },
  { sentence: 'Sam said, "I am reading." → Sam said that he ___ reading.', answer: 'was', options: ['was', 'is', 'am'], level: 3 },
  { sentence: 'The police caught the thief. → The thief ___ by the police.', answer: 'was caught', options: ['was caught', 'was catched', 'caught'], level: 3 },
  { sentence: 'Everyone loves Priya. → Priya ___ by everyone.', answer: 'is loved', options: ['is loved', 'was love', 'loves'], level: 3 },
];

/** Idioms and proverbs with their meanings. */
export const IDIOMS: { phrase: string; meaning: string; wrong: string[]; sentence?: string; level: 1 | 2 | 3 }[] = [
  { phrase: 'a piece of cake', meaning: 'very easy', wrong: ['a sweet treat', 'very hard', 'a small part'], level: 1 },
  { phrase: 'break the ice', meaning: 'start talking in a friendly way', wrong: ['break something cold', 'get very angry', 'go swimming'], level: 1 },
  { phrase: 'over the moon', meaning: 'very happy', wrong: ['in space', 'very tired', 'jumping high'], level: 1 },
  { phrase: 'under the weather', meaning: 'feeling ill', wrong: ['standing in the rain', 'feeling happy', 'very cold'], level: 1 },
  { phrase: 'once in a blue moon', meaning: 'very rarely', wrong: ['every night', 'on a cloudy day', 'very quickly'], level: 1 },
  { phrase: 'let the cat out of the bag', meaning: 'tell a secret', wrong: ['set a pet free', 'go shopping', 'lose something'], level: 1 },
  { phrase: 'hit the books', meaning: 'study hard', wrong: ['throw books', 'tidy a shelf', 'buy books'], level: 1 },
  { phrase: 'Practice makes perfect.', meaning: 'doing something again and again makes you good at it', wrong: ['nobody is perfect', 'practice is boring', 'do it only once'], level: 2 },
  { phrase: 'Slow and steady wins the race.', meaning: 'working patiently brings success', wrong: ['slow people always lose', 'running is good', 'hurry to win'], level: 2 },
  { phrase: 'Look before you leap.', meaning: 'think before you act', wrong: ['jump very high', 'always look down', 'act quickly'], level: 2 },
  { phrase: 'Two heads are better than one.', meaning: 'working together helps', wrong: ['two people argue more', 'one person is enough', 'heads are heavy'], level: 2 },
  { phrase: 'Don’t judge a book by its cover.', meaning: 'don’t judge by how something looks', wrong: ['covers are important', 'read every book', 'books are boring'], level: 2 },
  { phrase: 'Where there’s a will, there’s a way.', meaning: 'if you really want something, you will find a way', wrong: ['always ask for directions', 'roads are long', 'never give up your toys'], level: 2 },
  { phrase: 'cost an arm and a leg', meaning: 'be very expensive', sentence: 'That new bicycle cost an arm and a leg.', wrong: ['hurt badly', 'be very cheap', 'be broken'], level: 3 },
  { phrase: 'in hot water', meaning: 'in trouble', sentence: 'Ravi was in hot water for breaking the window.', wrong: ['having a bath', 'very warm', 'cooking'], level: 3 },
  { phrase: 'see eye to eye', meaning: 'agree', sentence: 'The two friends don’t always see eye to eye.', wrong: ['look at each other', 'wear glasses', 'stand close'], level: 3 },
  { phrase: 'keep an eye on', meaning: 'watch carefully', sentence: 'Please keep an eye on your little brother.', wrong: ['close one eye', 'stare rudely', 'forget about'], level: 3 },
  { phrase: 'on cloud nine', meaning: 'extremely happy', sentence: 'Meena was on cloud nine after winning the race.', wrong: ['flying a plane', 'very sleepy', 'confused'], level: 3 },
];

/** Right spellings with common misspellings. */
export const SPELLINGS: { word: string; wrong: string[]; hint: string; level: 1 | 2 | 3 }[] = [
  { word: 'knife', wrong: ['nife', 'knif'], hint: 'You cut with it.', level: 1 },
  { word: 'write', wrong: ['rite', 'wrigt'], hint: 'You do this with a pen.', level: 1 },
  { word: 'knock', wrong: ['nock', 'knok'], hint: 'You do this on a door.', level: 1 },
  { word: 'thumb', wrong: ['thum', 'thumbe'], hint: 'A short, thick finger.', level: 1 },
  { word: 'island', wrong: ['iland', 'islend'], hint: 'Land with water all around.', level: 1 },
  { word: 'listen', wrong: ['lisen', 'lissen'], hint: 'You do this with your ears.', level: 1 },
  { word: 'climb', wrong: ['clim', 'climbe'], hint: 'You do this up a tree.', level: 1 },
  { word: 'station', wrong: ['stasion', 'stashun'], hint: 'Trains stop here.', level: 2 },
  { word: 'nation', wrong: ['nashun', 'nasion'], hint: 'A country.', level: 2 },
  { word: 'television', wrong: ['televition', 'telivision'], hint: 'You watch it.', level: 2 },
  { word: 'famous', wrong: ['famus', 'faimous'], hint: 'Known by many people.', level: 2 },
  { word: 'dangerous', wrong: ['dangerus', 'dangerouse'], hint: 'Not safe.', level: 2 },
  { word: 'question', wrong: ['questoin', 'quesion'], hint: 'You ask it.', level: 2 },
  { word: 'because', wrong: ['becuase', 'becos'], hint: 'It tells why.', level: 3 },
  { word: 'beautiful', wrong: ['beutiful', 'beautifull'], hint: 'Very pretty.', level: 3 },
  { word: 'necessary', wrong: ['neccessary', 'necesary'], hint: 'Needed.', level: 3 },
  { word: 'separate', wrong: ['seperate', 'separete'], hint: 'Apart.', level: 3 },
  { word: 'friend', wrong: ['freind', 'frend'], hint: 'Someone you like and trust.', level: 3 },
  { word: 'Wednesday', wrong: ['Wensday', 'Wednsday'], hint: 'The day after Tuesday.', level: 3 },
];

/** Longer passages: level 1 main idea, level 2 inference, level 3 best title. */
export const PASSAGES5: { level: 1 | 2 | 3; text: string; question: string; answer: string; wrong: string[] }[] = [
  { level: 1, text: 'Bees are very important. They carry pollen from flower to flower, which helps plants make fruits and seeds. Without bees, we would have far fewer apples, mangoes and vegetables.', question: 'What is this passage mainly about?', answer: 'why bees are important', wrong: ['how to make honey', 'how to grow mangoes', 'why bees sting'] },
  { level: 1, text: 'Water is precious. We should close the tap while brushing our teeth, fix leaking pipes, and reuse water from washing vegetables to water plants.', question: 'What is this passage mainly about?', answer: 'ways to save water', wrong: ['how to brush teeth', 'growing vegetables', 'fixing pipes'] },
  { level: 1, text: 'The Indian flag has three colours: saffron, white and green. In the centre is a blue wheel with 24 spokes, called the Ashoka Chakra.', question: 'What is this passage mainly about?', answer: 'the Indian flag', wrong: ['colours of the rainbow', 'wheels', 'Indian festivals'] },
  { level: 1, text: 'Exercise keeps the body strong. Running, cycling and playing games make the heart healthy, and stretching keeps the muscles from getting stiff.', question: 'What is this passage mainly about?', answer: 'how exercise helps the body', wrong: ['types of bicycles', 'how to win a race', 'healthy food'] },
  { level: 1, text: 'Camels can live in hot deserts. They store fat in their humps, can go for days without water, and have thick eyelashes that keep out the sand.', question: 'What is this passage mainly about?', answer: 'how camels live in the desert', wrong: ['how deserts form', 'animals with humps', 'why sand is hot'] },
  { level: 1, text: 'Many birds fly south in winter. They travel thousands of kilometres to find warmer places and more food, and return when spring comes.', question: 'What is this passage mainly about?', answer: 'birds travelling in winter', wrong: ['how birds build nests', 'winter clothes', 'why spring comes'] },
  { level: 1, text: 'Recycling turns old things into new ones. Paper can become new notebooks, and plastic bottles can be made into benches and even clothes.', question: 'What is this passage mainly about?', answer: 'what recycling does', wrong: ['how to make notebooks', 'buying new clothes', 'why plastic is bad'] },
  { level: 2, text: 'Rohan looked at the dark clouds, picked up his umbrella and put on his raincoat before leaving for school.', question: 'What did Rohan think would happen?', answer: 'it would rain', wrong: ['it would be sunny', 'school would close', 'he would be late'] },
  { level: 2, text: 'Priya’s eyes filled with tears when she saw the broken vase. It had belonged to her grandmother.', question: 'How did Priya feel?', answer: 'sad', wrong: ['excited', 'angry at her grandmother', 'bored'] },
  { level: 2, text: 'The shop was full of people buying sweets, lamps and new clothes. Firecrackers could be heard from every street.', question: 'Which festival was it most likely?', answer: 'Diwali', wrong: ['Independence Day', 'a birthday', 'a school sports day'] },
  { level: 2, text: 'Arjun yawned again and again in class. His eyes kept closing, and he rested his head on the desk.', question: 'What can you tell about Arjun?', answer: 'he was sleepy', wrong: ['he was hungry', 'he was excited', 'he was angry'] },
  { level: 2, text: 'The ground was wet, the leaves were dripping and there were puddles on the road, but the sun was now shining.', question: 'What had just happened?', answer: 'it had rained', wrong: ['it had snowed', 'there was a flood', 'someone watered the plants'] },
  { level: 2, text: 'Neha checked her watch, ran to the gate and waved her hand at the bus that was pulling away.', question: 'What most likely happened?', answer: 'Neha missed the bus', wrong: ['Neha caught the bus', 'the bus was early for Neha', 'Neha was driving'] },
  { level: 2, text: 'Grandpa smiled as he opened the box. Inside was a new pair of glasses, and now he could read the newspaper again.', question: 'Why was Grandpa happy?', answer: 'he could read again', wrong: ['he got a new box', 'the newspaper was free', 'it was his birthday'] },
  { level: 3, text: 'A small seed fell into a crack in the rock. Rain came, and the sun shone. Slowly a tiny plant pushed its way up, and years later a strong tree stood where the seed had been.', question: 'Which is the best title?', answer: 'The Seed That Never Gave Up', wrong: ['The Broken Rock', 'Rainy Days', 'How to Plant a Garden'] },
  { level: 3, text: 'The fox could not reach the grapes hanging high on the vine. After many jumps he walked away, saying, "They must be sour anyway."', question: 'Which is the best title?', answer: 'The Fox and the Sour Grapes', wrong: ['A Good Jump', 'How Grapes Grow', 'The Hungry Bird'] },
  { level: 3, text: 'Every evening, Meera taught the children of her street to read under the streetlight. Within a year, all of them could read storybooks on their own.', question: 'Which is the best title?', answer: 'The Streetlight School', wrong: ['A Dark Night', 'Meera’s New Book', 'Playing in the Street'] },
  { level: 3, text: 'The villagers had no bridge across the river. Together they collected bamboo and rope, and in two weeks they built one. Now the children walk to school safely.', question: 'Which is the best title?', answer: 'A Bridge Built Together', wrong: ['The Deep River', 'Bamboo Houses', 'A Long Walk'] },
  { level: 3, text: 'Kiran found a wallet on the road with money inside. He took it to the police station, and the owner thanked him with a big smile.', question: 'Which is the best title?', answer: 'An Honest Boy', wrong: ['A Lost Road', 'Money for Kiran', 'The Police Station'] },
];
