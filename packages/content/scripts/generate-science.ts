// Seeds the Science banks for Grades 1–5 (NCERT/CBSE EVS order): sorting, labelled diagrams,
// picture quizzes and true/false facts, all drawn from src/science.ts.
//   node scripts/generate-science.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIAGRAMS, SCIENCE_FACTS, SCIENCE_GROUPS, SCIENCE_QUIZ } from '../src/science.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles');

let seed = 20261701;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const shuffle = <T>(xs: readonly T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

type Level = { kind: 'sort'; groups: string[]; per: number } | { kind: 'quiz' } | { kind: 'tf' } | { kind: 'label'; diagram: string; ask: 'name' | 'find' | 'job' };
const sort = (groups: string[], per: number): Level => ({ kind: 'sort', groups, per });
const quiz: Level = { kind: 'quiz' }, tf: Level = { kind: 'tf' };
const label = (diagram: string, ask: 'name' | 'find' | 'job'): Level => ({ kind: 'label', diagram, ask });

const TOPICS: { grade: number; id: string; file: string; levels: [Level, Level, Level] }[] = [
  { grade: 1, id: 'g1-sci-body', file: 'body', levels: [label('body', 'name'), label('body', 'find'), quiz] },
  { grade: 1, id: 'g1-sci-living', file: 'living', levels: [sort(['living', 'non-living'], 2), sort(['living', 'non-living'], 3), tf] },
  { grade: 1, id: 'g1-sci-animals', file: 'animals', levels: [quiz, quiz, sort(['on-land', 'in-water', 'in-air'], 2)] },
  { grade: 2, id: 'g2-sci-plants', file: 'plants', levels: [label('plant', 'name'), label('plant', 'find'), quiz] },
  { grade: 2, id: 'g2-sci-food', file: 'food', levels: [sort(['healthy', 'junk'], 3), tf, quiz] },
  { grade: 2, id: 'g2-sci-weather', file: 'weather', levels: [quiz, sort(['summer', 'winter', 'rainy'], 2), tf] },
  { grade: 3, id: 'g3-sci-animals', file: 'animals', levels: [sort(['herbivore', 'carnivore'], 3), sort(['herbivore', 'carnivore', 'omnivore'], 2), quiz] },
  { grade: 3, id: 'g3-sci-senses', file: 'senses', levels: [quiz, tf, quiz] },
  { grade: 3, id: 'g3-sci-air-water', file: 'air-water', levels: [tf, quiz, sort(['floats', 'sinks'], 3)] },
  { grade: 4, id: 'g4-sci-plants-food', file: 'plants-food', levels: [sort(['eat-leaf', 'eat-fruit', 'eat-seed'], 2), quiz, quiz] },
  { grade: 4, id: 'g4-sci-matter', file: 'matter', levels: [sort(['solid', 'liquid', 'gas'], 2), sort(['magnetic', 'non-magnetic'], 3), tf] },
  { grade: 4, id: 'g4-sci-water-cycle', file: 'water-cycle', levels: [label('water-cycle', 'name'), label('water-cycle', 'job'), quiz] },
  { grade: 5, id: 'g5-sci-body', file: 'body', levels: [quiz, tf, quiz] },
  { grade: 5, id: 'g5-sci-living', file: 'living', levels: [quiz, sort(['desert', 'polar', 'pond'], 2), tf] },
  { grade: 5, id: 'g5-sci-space', file: 'space', levels: [quiz, tf, quiz] },
];
const COUNTS = [7, 7, 6];

function make(t: (typeof TOPICS)[number], d: 1 | 2 | 3, n: number, start: number): object[] {
  const L = t.levels[d - 1];
  const base = (k: number, prompt: string) => ({ id: `${t.id}-${String(start + k + 1).padStart(2, '0')}`, grade: t.grade, subject: 'science', topic: t.id, difficulty: d, prompt });
  if (L.kind === 'quiz') {
    const bank = SCIENCE_QUIZ.filter((x) => x.topic === t.id && x.level === d);
    if (bank.length < n) throw new Error(`${t.id} level ${d}: ${bank.length} quiz items, need ${n}`);
    return bank.slice(0, n).map((x, k) => ({ ...base(k, x.question), type: 'science-quiz', payload: { id: x.id, picture: x.picture, question: x.question }, options: shuffle([x.answer, ...x.wrong]), answer: x.answer }));
  }
  if (L.kind === 'tf') {
    const bank = SCIENCE_FACTS.filter((x) => x.topic === t.id && x.level === d);
    if (bank.length < n) throw new Error(`${t.id} level ${d}: ${bank.length} facts, need ${n}`);
    return bank.slice(0, n).map((x, k) => ({ ...base(k, `True or false? ${x.statement}`), type: 'true-false', payload: { id: x.id, picture: x.picture, statement: x.statement }, options: ['True', 'False'], answer: x.answer ? 'True' : 'False' }));
  }
  if (L.kind === 'label') {
    const dg = DIAGRAMS[L.diagram];
    const parts = L.ask === 'job' ? dg.parts.filter((p) => p.job) : dg.parts;
    const order = Array.from({ length: n }, (_, k) => parts[k % parts.length]);
    return order.map((p, k) => {
      const others = shuffle(dg.parts.filter((x) => x.name !== p.name)).slice(0, 2);
      if (L.ask === 'find') {
        const answer = String(dg.parts.indexOf(p) + 1);
        const wrong = others.map((x) => String(dg.parts.indexOf(x) + 1));
        return { ...base(k, `Which number shows the ${p.name}?`), type: 'label-diagram', payload: { diagram: L.diagram, part: p.name, ask: 'find' }, options: shuffle([answer, ...wrong]).sort(), answer };
      }
      const prompt = L.ask === 'name' ? 'What is the part marked with a question mark?' : `Which part ${p.job}?`;
      return { ...base(k, prompt), type: 'label-diagram', payload: { diagram: L.diagram, part: p.name, ask: L.ask }, options: shuffle([p.name, ...others.map((x) => x.name)]), answer: p.name };
    });
  }
  const groups = L.groups.map((id) => SCIENCE_GROUPS.find((g) => g.id === id)!);
  const seen = new Set<string>();
  return Array.from({ length: n }, (_, k) => {
    for (;;) {
      const items = shuffle(groups.flatMap((g) => shuffle(g.items).slice(0, L.per).map(([item, name]) => ({ item, name, group: g.id }))));
      const key = items.map((x) => x.item).sort().join('');
      if (seen.has(key) || new Set(items.map((x) => x.item)).size !== items.length) continue;
      seen.add(key);
      return { ...base(k, 'Put each one in the right group.'), type: 'sort-into-groups', payload: { groups: groups.map(({ id, label, picture }) => ({ id, label, picture })), items } };
    }
  });
}

for (const t of TOPICS) {
  let start = 0;
  const puzzles = ([1, 2, 3] as const).flatMap((d) => { const ps = make(t, d, COUNTS[d - 1], start); start += ps.length; return ps; });
  const dir = join(ROOT, `g${t.grade}-science`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${t.file}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`g${t.grade}-science/${t.file}: ${puzzles.length} puzzles`);
}
