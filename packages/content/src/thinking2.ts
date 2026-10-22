// Hand-written content for Grade 2 Thinking Skills.

/** Steps in the right order, each a picture and a short name read aloud. */
export const SEQUENCES: { title: string; steps: [emoji: string, name: string][] }[] = [
  { title: 'A chick grows up', steps: [['🥚', 'egg'], ['🐣', 'hatching'], ['🐥', 'chick'], ['🐔', 'hen']] },
  { title: 'A plant grows', steps: [['🌰', 'seed'], ['🌱', 'sprout'], ['🌿', 'plant'], ['🌳', 'tree']] },
  { title: 'A frog grows up', steps: [['🥚', 'eggs'], ['🐟', 'tadpole'], ['🐸', 'frog']] },
  { title: 'A butterfly', steps: [['🥚', 'egg'], ['🐛', 'caterpillar'], ['🦋', 'butterfly']] },
  { title: 'A day', steps: [['🌅', 'morning'], ['☀️', 'afternoon'], ['🌇', 'evening'], ['🌙', 'night']] },
  { title: 'Growing up', steps: [['👶', 'baby'], ['🧒', 'child'], ['🧑', 'grown-up'], ['🧓', 'old person']] },
  { title: 'Making tea', steps: [['💧', 'water'], ['🔥', 'boil'], ['🍵', 'tea']] },
  { title: 'Getting ready for school', steps: [['🛏️', 'wake up'], ['🪥', 'brush teeth'], ['🍳', 'breakfast'], ['🎒', 'go to school']] },
  { title: 'Rain', steps: [['☀️', 'sun'], ['☁️', 'clouds'], ['🌧️', 'rain'], ['🌈', 'rainbow']] },
  { title: 'Fruit grows', steps: [['🌸', 'flower'], ['🍏', 'green apple'], ['🍎', 'red apple']] },
  { title: 'Ice melts', steps: [['🧊', 'ice'], ['💧', 'water']] },
  { title: 'Building a snowman', steps: [['❄️', 'snow'], ['⚪', 'snowball'], ['⛄', 'snowman']] },
  { title: 'A birthday', steps: [['🎂', 'cake'], ['🕯️', 'blow candles'], ['🍰', 'eat cake']] },
  { title: 'Moon in a month', steps: [['🌑', 'new moon'], ['🌓', 'half moon'], ['🌕', 'full moon']] },
  { title: 'Letters', steps: [['✏️', 'write'], ['✉️', 'post'], ['📬', 'letter box'], ['📖', 'read']] },
  { title: 'Seasons in India', steps: [['☀️', 'summer'], ['🌧️', 'monsoon'], ['🍂', 'autumn'], ['❄️', 'winter']] },
];

/** "Who am I?" riddles: clues in order of help, the answer and some look-alike options. */
export const RIDDLES: { clues: string[]; answer: [string, string]; similar: [string, string][] }[] = [
  { clues: ['I have a long trunk.', 'I am big and grey.', 'I like bananas and sugarcane.'], answer: ['🐘', 'elephant'], similar: [['🦏', 'rhino'], ['🐄', 'cow'], ['🦒', 'giraffe']] },
  { clues: ['I say moo.', 'I give milk.', 'I eat grass.'], answer: ['🐄', 'cow'], similar: [['🐐', 'goat'], ['🐑', 'sheep'], ['🐴', 'horse']] },
  { clues: ['I have a very long neck.', 'I eat leaves from tall trees.', 'I have brown spots.'], answer: ['🦒', 'giraffe'], similar: [['🦓', 'zebra'], ['🐪', 'camel'], ['🐘', 'elephant']] },
  { clues: ['I can fly.', 'I make honey.', 'I buzz.'], answer: ['🐝', 'bee'], similar: [['🦋', 'butterfly'], ['🐞', 'ladybird'], ['🐦', 'bird']] },
  { clues: ['I am yellow.', 'I am a fruit.', 'Monkeys love me.'], answer: ['🍌', 'banana'], similar: [['🥭', 'mango'], ['🍋', 'lemon'], ['🍍', 'pineapple']] },
  { clues: ['I am the king of fruits.', 'I am sweet and yellow inside.', 'I grow in summer.'], answer: ['🥭', 'mango'], similar: [['🍌', 'banana'], ['🍊', 'orange'], ['🍑', 'peach']] },
  { clues: ['I shine in the sky at night.', 'I change shape.', 'I am not the sun.'], answer: ['🌙', 'moon'], similar: [['⭐', 'star'], ['☀️', 'sun'], ['☁️', 'cloud']] },
  { clues: ['I have four wheels.', 'I carry many people.', 'Children ride me to school.'], answer: ['🚌', 'bus'], similar: [['🚗', 'car'], ['🚲', 'bicycle'], ['🚂', 'train']] },
  { clues: ['I run on tracks.', 'I have many coaches.', 'I say choo choo.'], answer: ['🚂', 'train'], similar: [['🚌', 'bus'], ['✈️', 'aeroplane'], ['⛵', 'boat']] },
  { clues: ['I fly in the sky.', 'I carry people far away.', 'I land at the airport.'], answer: ['✈️', 'aeroplane'], similar: [['🚁', 'helicopter'], ['🐦', 'bird'], ['🚂', 'train']] },
  { clues: ['I have hands but no fingers.', 'I tell the time.', 'I go tick tock.'], answer: ['⏰', 'clock'], similar: [['📱', 'phone'], ['📺', 'television'], ['🔔', 'bell']] },
  { clues: ['You wear me on your feet.', 'I have laces.', 'I come in pairs.'], answer: ['👟', 'shoe'], similar: [['🧦', 'socks'], ['🧤', 'gloves'], ['🎩', 'hat']] },
  { clues: ['I keep you dry.', 'You open me in the rain.', 'I fold up small.'], answer: ['☂️', 'umbrella'], similar: [['🧥', 'coat'], ['🎩', 'hat'], ['⛱️', 'beach umbrella']] },
  { clues: ['I live in water.', 'I have fins.', 'I can swim but not walk.'], answer: ['🐟', 'fish'], similar: [['🦆', 'duck'], ['🐢', 'turtle'], ['🐸', 'frog']] },
  { clues: ['I have eight arms.', 'I live in the sea.', 'I can squirt ink.'], answer: ['🐙', 'octopus'], similar: [['🦀', 'crab'], ['🐟', 'fish'], ['🐬', 'dolphin']] },
  { clues: ['I am green.', 'I can talk like you.', 'I love red chillies.'], answer: ['🦜', 'parrot'], similar: [['🐦', 'bird'], ['🐸', 'frog'], ['🦆', 'duck']] },
  { clues: ['I am cold.', 'I melt in the sun.', 'You eat me on a stick or in a cone.'], answer: ['🍦', 'ice cream'], similar: [['🧊', 'ice'], ['🥛', 'milk'], ['🍰', 'cake']] },
  { clues: ['I am a bird.', 'I cannot fly.', 'I dance when it rains. I am India’s national bird.'], answer: ['🦚', 'peacock'], similar: [['🦜', 'parrot'], ['🐔', 'hen'], ['🦆', 'duck']] },
  { clues: ['I have black and orange stripes.', 'I am a big cat.', 'I am India’s national animal.'], answer: ['🐯', 'tiger'], similar: [['🦁', 'lion'], ['🐆', 'leopard'], ['🦓', 'zebra']] },
  { clues: ['I have pages.', 'You read me.', 'I live on a shelf.'], answer: ['📖', 'book'], similar: [['✏️', 'pencil'], ['📏', 'ruler'], ['🎒', 'school bag']] },
  { clues: ['I am hot.', 'I give light in the day.', 'I rise in the morning.'], answer: ['☀️', 'sun'], similar: [['🌙', 'moon'], ['⭐', 'star'], ['🔥', 'fire']] },
  { clues: ['You write with me.', 'I have a rubber at one end.', 'You sharpen me.'], answer: ['✏️', 'pencil'], similar: [['🖊️', 'pen'], ['🖍️', 'crayon'], ['📏', 'ruler']] },
  { clues: ['I am round.', 'You kick me.', 'Footballers love me.'], answer: ['⚽', 'football'], similar: [['🏀', 'basketball'], ['🏏', 'cricket bat'], ['🎾', 'tennis ball']] },
  { clues: ['I have a shell on my back.', 'I am very slow.', 'I can live a long time.'], answer: ['🐢', 'turtle'], similar: [['🐌', 'snail'], ['🦀', 'crab'], ['🐸', 'frog']] },
];
