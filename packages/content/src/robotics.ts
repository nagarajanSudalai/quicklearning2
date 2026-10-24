// Robotics (Grades 1–5) content: picture quizzes, true/false facts, a sorting group pair and the
// conductors used by circuit puzzles. Robot missions reuse the coding player; robot-part
// diagrams live with the other diagrams in science.ts.

import type { Category } from './categories';
import type { FactItem, QuizItem } from './science';

const q = (grade: number, topic: string, level: 1 | 2 | 3, rows: [string, string, string, string[]][]): QuizItem[] =>
  rows.map(([picture, question, answer, wrong], k) => ({ id: `${topic}-q${level}-${k + 1}`, grade, topic, level, picture, question, answer, wrong }));
const tf = (grade: number, topic: string, level: 1 | 2 | 3, rows: [string, string, boolean][]): FactItem[] =>
  rows.map(([picture, statement, answer], k) => ({ id: `${topic}-tf${level}-${k + 1}`, grade, topic, level, picture, statement, answer }));

export const ROBO_GROUPS: Category[] = [
  { id: 'electric', label: 'Needs electricity', family: 'robotics', picture: '🔌', items: [['📺', 'TV'], ['💡', 'bulb'], ['🔦', 'torch'], ['🖥️', 'computer'], ['📱', 'phone'], ['🤖', 'robot'], ['⌚', 'digital watch'], ['🎧', 'headphones']] },
  { id: 'not-electric', label: 'No electricity', family: 'robotics', picture: '🚫', items: [['🪁', 'kite'], ['📕', 'book'], ['🪑', 'chair'], ['⚽', 'ball'], ['🧸', 'teddy bear'], ['🥄', 'spoon'], ['🚲', 'bicycle'], ['✏️', 'pencil']] },
];

/** Things that can close the gap in a circuit. Metals conduct electricity; the rest do not. */
export const CIRCUIT_ITEMS: { item: string; name: string; conducts: boolean }[] = [
  { item: '🔑', name: 'iron key', conducts: true },
  { item: '🪙', name: 'coin', conducts: true },
  { item: '📎', name: 'steel paper clip', conducts: true },
  { item: '🔩', name: 'iron nail', conducts: true },
  { item: '🥄', name: 'steel spoon', conducts: true },
  { item: '🪵', name: 'wooden stick', conducts: false },
  { item: '🧽', name: 'sponge', conducts: false },
  { item: '📄', name: 'paper', conducts: false },
  { item: '🎈', name: 'rubber balloon', conducts: false },
  { item: '🖍️', name: 'wax crayon', conducts: false },
  { item: '🧶', name: 'wool', conducts: false },
];

export const ROBO_QUIZ: QuizItem[] = [
  ...q(1, 'g1-robo-world', 1, [
    ['🤖', 'A robot is a machine that…', 'follows instructions to do jobs', ['eats food to grow', 'grows from a seed']],
    ['🧹', 'Which robot helps clean the floor at home?', 'robot vacuum cleaner', ['robot arm', 'Mars rover']],
    ['🏭', 'In a car factory, which robot joins and paints car parts?', 'robot arm', ['robot vacuum cleaner', 'toy robot']],
    ['🚁', 'A flying robot that can take photos from the sky is a…', 'drone', ['submarine', 'tractor']],
    ['🔋', 'What gives most robots their energy?', 'a battery or electricity', ['food', 'sunlight on their skin']],
    ['🧑‍💻', 'Who tells a robot what to do?', 'a program written by people', ['the weather', 'nobody, ever']],
    ['🧸', 'Which of these is a toy that can be a robot?', 'a toy that moves when you press a button', ['a teddy bear', 'a wooden block']],
  ]),
  ...q(1, 'g1-robo-world', 2, [
    ['🌑', 'A robot that drives on the Moon or Mars to explore is called a…', 'rover', ['rocket', 'satellite']],
    ['🏥', 'Robots in hospitals can help doctors with…', 'very careful operations', ['cooking dinner', 'painting houses']],
    ['🌊', 'Underwater robots help scientists to…', 'explore deep oceans', ['bake bread', 'grow trees']],
    ['🔥', 'Why do firefighters sometimes send a robot first?', 'it is too dangerous for people', ['robots like fire', 'robots are cheaper than water']],
    ['📦', 'In big warehouses, robots help to…', 'carry and sort boxes', ['write stories', 'sing songs']],
    ['🌾', 'Some farm robots can…', 'pick fruit and water plants', ['lay eggs', 'give milk']],
    ['🚗', 'A car that can drive itself using cameras and a computer is called…', 'a self-driving car', ['a bullock cart', 'a bicycle']],
  ]),
  ...q(1, 'g1-robo-parts', 3, [
    ['📷', 'What does a robot use to see?', 'a camera', ['a battery', 'wheels']],
    ['🦾', 'Which part lets a robot pick things up?', 'an arm with a gripper', ['an antenna', 'a battery']],
    ['🛞', 'What helps a robot move around?', 'wheels or legs', ['a camera', 'a speaker']],
    ['🔋', 'Where does a robot get its power?', 'the battery', ['the wheels', 'the gripper']],
    ['🧠', 'The robot’s computer is like its…', 'brain', ['feet', 'hair']],
    ['📡', 'What does a robot use to send and receive signals?', 'an antenna', ['a gripper', 'a wheel']],
  ]),
  ...q(2, 'g2-robo-senses', 1, [
    ['👀', 'People see with eyes. A robot “sees” with a…', 'camera', ['speaker', 'motor']],
    ['👂', 'People hear with ears. A robot “hears” with a…', 'microphone', ['light', 'wheel']],
    ['✋', 'A robot knows it has bumped into something with a…', 'touch sensor', ['microphone', 'speaker']],
    ['🗣️', 'A robot talks to us using a…', 'speaker', ['camera', 'battery']],
    ['💡', 'A robot can tell if a room is dark using a…', 'light sensor', ['touch sensor', 'speaker']],
    ['🌡️', 'A robot measures how hot something is with a…', 'temperature sensor', ['camera', 'microphone']],
    ['🦇', 'Some robots use sound echoes to find walls, like a bat. This is a…', 'distance sensor', ['light bulb', 'speaker']],
  ]),
  ...q(2, 'g2-robo-senses', 3, [
    ['🚪', 'A shop door opens by itself when you walk near. Which sensor does it use?', 'a motion sensor', ['a temperature sensor', 'a microphone']],
    ['🌃', 'Street lights switch on by themselves at night. Which sensor helps?', 'a light sensor', ['a touch sensor', 'a sound sensor']],
    ['🚗', 'A car beeps when it is about to hit a wall while parking. Which sensor is it?', 'a distance sensor', ['a light sensor', 'a temperature sensor']],
    ['📱', 'Your phone screen knows where your finger is. That is a…', 'touch screen', ['microphone', 'thermometer']],
    ['🧹', 'A robot vacuum stops at the top of the stairs. What does it sense?', 'the floor ending below it', ['the colour of the walls', 'the time of day']],
    ['❄️', 'An air conditioner turns off when the room is cool enough. Which sensor helps?', 'a temperature sensor', ['a camera', 'a touch sensor']],
  ]),
  ...q(3, 'g3-robo-power', 2, [
    ['🔋', 'A battery stores energy as…', 'chemical energy', ['sound', 'water']],
    ['⚙️', 'Which part turns electricity into movement in a robot?', 'a motor', ['a bulb', 'a speaker']],
    ['☀️', 'Solar panels turn sunlight into…', 'electricity', ['water', 'wind']],
    ['🔌', 'Who should put a plug into a socket?', 'a grown-up, with dry hands', ['a child, with wet hands', 'anyone, with a metal spoon']],
    ['💨', 'Wind turbines make electricity from…', 'moving air', ['moving cars', 'sunlight at night']],
    ['♻️', 'What should we do with old batteries?', 'give them to a battery recycling point', ['throw them in a fire', 'bury them in the garden']],
    ['💡', 'A bulb turns electricity into…', 'light (and some heat)', ['sound', 'water']],
  ]),
  ...q(5, 'g5-robo-real', 1, [
    ['🌕', 'Which Indian rover explored the Moon’s south pole region in 2023?', 'Pragyan (Chandrayaan-3)', ['Mangalyaan', 'Aryabhata']],
    ['👩‍🚀', 'What is the name of ISRO’s humanoid robot built for the Gaganyaan mission?', 'Vyommitra', ['Pragyan', 'Vikram']],
    ['🔴', 'NASA rovers such as Curiosity and Perseverance explore which planet?', 'Mars', ['Venus', 'Jupiter']],
    ['📖', 'The word “robot” first appeared in a play by Karel Čapek. It comes from a Czech word meaning…', 'hard work', ['metal man', 'computer']],
    ['🦿', 'A robot shaped like a human, with a head, arms and legs, is called a…', 'humanoid', ['drone', 'rover']],
    ['🏭', 'Why are robot arms used to paint cars?', 'they work fast and the same way every time', ['they enjoy colours', 'they never need electricity']],
    ['🛰️', 'A drone that delivers medicines to faraway villages is useful because…', 'it can fly over roads and rivers', ['it never needs charging', 'it can carry a whole hospital']],
  ]),
  ...q(5, 'g5-robo-real', 3, [
    ['🧠', 'When a robot learns to recognise cats from thousands of photos, this is called…', 'machine learning', ['photosynthesis', 'evaporation']],
    ['🧭', 'A robot that plans its own path around obstacles is using…', 'sensors and a program that makes decisions', ['magic', 'only its wheels']],
    ['📶', 'Why does a Mars rover need to make some decisions by itself?', 'signals take minutes to travel between Earth and Mars', ['Mars has no sunlight', 'it has no camera']],
    ['🦾', 'A prosthetic robotic hand helps a person by…', 'moving fingers using signals from the arm’s muscles', ['growing new skin', 'painting pictures by itself']],
    ['⚠️', 'Which is the most important rule when building robots?', 'they must be safe for people', ['they must be as big as possible', 'they must never be switched off']],
    ['🔁', 'A robot sorting red and blue balls repeats: look, decide, move. This is a…', 'loop', ['battery', 'sensor']],
  ]),
];

export const ROBO_FACTS: FactItem[] = [
  ...tf(1, 'g1-robo-world', 3, [
    ['🤖', 'Robots need a program to know what to do.', true],
    ['🍎', 'Robots need to eat food to get energy.', false],
    ['🧹', 'Some robots can clean floors.', true],
    ['😴', 'Robots get tired and fall asleep like us.', false],
    ['🚁', 'A drone is a flying robot.', true],
    ['🌱', 'Robots grow bigger every year like children.', false],
  ]),
  ...tf(2, 'g2-robo-senses', 2, [
    ['📷', 'A camera can be a robot’s “eyes”.', true],
    ['🎤', 'A microphone helps a robot hear sounds.', true],
    ['👃', 'Every robot can smell flowers.', false],
    ['✋', 'A touch sensor tells a robot when it bumps into something.', true],
    ['🔊', 'A speaker helps a robot see in the dark.', false],
    ['💡', 'A light sensor can tell if it is day or night.', true],
    ['🧠', 'Sensors send information to the robot’s computer.', true],
  ]),
  ...tf(3, 'g3-robo-power', 3, [
    ['🔋', 'A battery stores energy that a robot can use later.', true],
    ['💧', 'It is safe to touch switches with wet hands.', false],
    ['⚙️', 'A motor makes a robot’s wheels turn.', true],
    ['☀️', 'Solar panels can charge batteries using sunlight.', true],
    ['🔌', 'Playing with plug sockets is safe for children.', false],
    ['♻️', 'Old batteries should go in the normal rubbish bin.', false],
  ]),
  ...tf(5, 'g5-robo-real', 2, [
    ['🌕', 'Chandrayaan-3’s lander was called Vikram and its rover was called Pragyan.', true],
    ['🤖', 'All robots look like humans.', false],
    ['🔴', 'People drive Mars rovers live with a joystick, with no delay.', false],
    ['🏭', 'Robots in factories can work for many hours without needing rest.', true],
    ['🧑‍🔬', 'Robots can explore places too dangerous for people, like volcanoes.', true],
    ['🧠', 'A robot understands everything just like a person does.', false],
    ['📷', 'Self-driving cars use cameras and other sensors to see the road.', true],
  ]),
];

/** The bulb lights only when the loop is complete: a battery, no broken wire, the switch closed, and anything in the gap conducts. */
export function bulbLights(p: { battery: boolean; broken: boolean; switch?: 'open' | 'closed'; gap?: { name: string } }) {
  const gapOk = !p.gap || !!CIRCUIT_ITEMS.find((c) => c.name === p.gap!.name)?.conducts;
  return p.battery && !p.broken && p.switch !== 'open' && gapOk;
}
