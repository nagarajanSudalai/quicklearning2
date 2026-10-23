// Seeds the Grade 5 English bank from src/words5.ts. The JSON it writes is the source of truth;
// re-running this script overwrites puzzles/g5-english/.
//   node scripts/generate-g5-english.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONJUNCTIONS, IDIOMS, PASSAGES5, PREPOSITIONS, SPELLINGS, VOICE, type BlankItem } from '../src/words5.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g5-english');

let seed = 20261402;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const shuffle = <T>(xs: readonly T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const levels = (counts: [number, number, number]) => counts.flatMap((c, i) => Array(c).fill(i + 1) as number[]);
const base = (topic: string, i: number, difficulty: number, prompt: string) => ({
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 5, subject: 'english', topic, difficulty, prompt,
});
function cycler<T>(pool: readonly T[]) {
  let bag: T[] = [];
  return () => (bag.length ? bag : (bag = shuffle(pool))).pop()!;
}
const byLevel = <T extends { level: number }>(xs: T[]) => ({ 1: cycler(xs.filter((x) => x.level === 1)), 2: cycler(xs.filter((x) => x.level === 2)), 3: cycler(xs.filter((x) => x.level === 3)) }) as Record<number, () => T>;

const blank = (topic: string, rule: string, item: BlankItem, i: number, d: number) => ({
  ...base(topic, i, d, item.sentence), type: 'fill-blank',
  payload: { sentence: item.sentence, rule, base: item.sentence }, options: shuffle(item.options), answer: item.answer,
});

function joining() {
  const conj = byLevel(CONJUNCTIONS), prep = byLevel(PREPOSITIONS);
  // Levels 1–2 are joining words; level 3 mixes in position words.
  return levels([7, 7, 6]).map((d, i) => (d === 3 && i % 2 ? blank('g5-joining', 'preposition', prep[3](), i, d) : d === 2 && i % 3 === 0 ? blank('g5-joining', 'preposition', prep[2](), i, d) : blank('g5-joining', 'conjunction', conj[d](), i, d)));
}

function voice() {
  const v = byLevel(VOICE);
  return levels([7, 7, 6]).map((d, i) => blank('g5-voice', 'voice', v[d](), i, d));
}

function idioms() {
  const next = byLevel(IDIOMS);
  return levels([7, 7, 6]).map((d, i) => {
    const x = next[d]();
    return {
      ...base('g5-idioms', i, d, x.sentence ? `${x.sentence} What does "${x.phrase}" mean?` : `What does "${x.phrase}" mean?`), type: 'idiom',
      payload: { phrase: x.phrase, ...(x.sentence ? { sentence: x.sentence } : {}) }, options: shuffle([x.meaning, ...shuffle(x.wrong).slice(0, 2)]), answer: x.meaning,
    };
  });
}

function spelling() {
  const next = byLevel(SPELLINGS);
  return levels([7, 7, 6]).map((d, i) => {
    const s = next[d]();
    const sentence = `${s.hint} Which spelling is right? ___`;
    return {
      ...base('g5-spelling', i, d, `${s.hint} Which spelling is right?`), type: 'fill-blank',
      payload: { sentence, rule: 'spelling', base: s.word }, options: shuffle([s.word, ...s.wrong]), answer: s.word,
    };
  });
}

function reading() {
  const next = byLevel(PASSAGES5);
  return levels([7, 7, 6]).map((d, i) => {
    const p = next[d]();
    return {
      ...base('g5-reading', i, d, `${p.text} ${p.question}`), type: 'passage',
      payload: { text: p.text, question: p.question }, options: shuffle([p.answer, ...shuffle(p.wrong).slice(0, 2)]), answer: p.answer,
    };
  });
}

mkdirSync(OUT, { recursive: true });
const banks = { joining: joining(), voice: voice(), idioms: idioms(), spelling: spelling(), reading: reading() };
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
