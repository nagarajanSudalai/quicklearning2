// Seeds the Grade 3 English bank from src/words3.ts. The JSON it writes is the source of
// truth; re-running this script overwrites puzzles/g3-english/.
//   node scripts/generate-g3-english.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOMOPHONES, PASSAGES, PAST, SPELLING_WORDS, SYNONYMS, TAGGED, parseTagged, WORDS_FOR, type WordClass } from '../src/words3.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g3-english');

let seed = 20261202;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = <T>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
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
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 3, subject: 'english', topic, difficulty, prompt,
});
function cycler<T>(pool: readonly T[]) {
  let bag: T[] = [];
  return () => (bag.length ? bag : (bag = shuffle(pool))).pop()!;
}

const ASK: Record<number, WordClass> = { 1: 'noun', 2: 'verb', 3: 'adjective' };
function wordClass() {
  const pools = Object.fromEntries((['noun', 'verb', 'adjective'] as WordClass[]).map((c) => [c, TAGGED.filter((s) => parseTagged(s).filter((w) => w.tag === c).length === 1)]));
  const next = Object.fromEntries(Object.entries(pools).map(([c, p]) => [c, cycler(p)])) as Record<WordClass, () => string>;
  return levels([7, 7, 6]).map((d, i) => {
    const ask = ASK[d];
    const tagged = next[ask]();
    const words = parseTagged(tagged);
    const answer = words.find((w) => w.tag === ask)!.word;
    return {
      ...base('g3-word-class', i, d, `Tap the ${WORDS_FOR[ask]} in this sentence.`), type: 'word-class',
      payload: { tagged, ask }, options: [...new Set(words.map((w) => w.word))], answer,
    };
  });
}

function past() {
  const byKind = (k: string) => Object.keys(PAST).filter((v) => PAST[v].kind === k);
  const next = { 1: cycler(byKind('ed')), 2: cycler(byKind('spelling')), 3: cycler(byKind('irregular')) } as Record<number, () => string>;
  return levels([7, 7, 6]).map((d, i) => {
    const v = next[d]();
    const right = PAST[v].past;
    // The mistakes children make: plain -ed on every verb, the present form, or -ed on the wrong spelling.
    const wrong = [...new Set([`${v}ed`, `${v}d`, v, `${right}ed`].filter((w) => w !== right && !w.endsWith('eed')))].slice(0, 2);
    const s = `Yesterday I ___ (${v}).`;
    return { ...base('g3-past', i, d, s), type: 'fill-blank', payload: { sentence: s, rule: 'past', base: v }, options: shuffle([right, ...wrong]), answer: right };
  });
}

function synonymsHomophones() {
  const syn = cycler(SYNONYMS);
  const homo = cycler(HOMOPHONES);
  const allSyn = SYNONYMS.flatMap(([a, b]) => [a, b]);
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 1 || (d === 3 && i % 2)) {
      const [w, s] = syn();
      // Wrong options must not mean the same: avoid any word paired with w.
      const same = new Set(SYNONYMS.filter(([a, b]) => a === w || b === w).flatMap(([a, b]) => [a, b]));
      const wrong = shuffle(allSyn.filter((x) => !same.has(x) && x !== s)).slice(0, 2);
      const sentence = `A word that means ${w} is ___.`;
      return { ...base('g3-synonyms', i, d, sentence), type: 'fill-blank', payload: { sentence, rule: 'synonym', base: w }, options: shuffle([s, ...wrong]), answer: s };
    }
    const h = homo();
    return { ...base('g3-synonyms', i, d, h.sentence), type: 'fill-blank', payload: { sentence: h.sentence, rule: 'homophone', base: h.sentence }, options: shuffle(h.set), answer: h.answer };
  });
}

function spellingBee() {
  const byLen = (n: number) => Object.keys(SPELLING_WORDS).filter((w) => w.length === n);
  const next = { 1: cycler(byLen(6)), 2: cycler(byLen(7)), 3: cycler(byLen(8)) } as Record<number, () => string>;
  return levels([7, 7, 6]).map((d, i) => {
    const w = next[d]();
    const letters = w.split('');
    const spare = d === 3 ? [pick('abcdefghiklmnoprstuwy'.split('').filter((l) => !letters.includes(l)))] : [];
    let tiles = shuffle([...letters, ...spare]);
    while (tiles.join('').startsWith(w)) tiles = shuffle(tiles);
    return { ...base('g3-spelling', i, d, 'Listen and spell the word.'), type: 'build', payload: { answer: letters, tiles, picture: SPELLING_WORDS[w], say: w, joiner: '' } };
  });
}

function reading() {
  const next = { 1: cycler(PASSAGES.filter((p) => p.level === 1)), 2: cycler(PASSAGES.filter((p) => p.level === 2)), 3: cycler(PASSAGES.filter((p) => p.level === 3)) } as Record<number, () => (typeof PASSAGES)[number]>;
  return levels([7, 7, 6]).map((d, i) => {
    const p = next[d]();
    return {
      ...base('g3-reading', i, d, `${p.text} ${p.question}`), type: 'passage',
      payload: { text: p.text, question: p.question }, options: shuffle([p.answer, ...shuffle(p.wrong).slice(0, 2)]), answer: p.answer,
    };
  });
}

mkdirSync(OUT, { recursive: true });
const banks = { 'word-class': wordClass(), past: past(), synonyms: synonymsHomophones(), spelling: spellingBee(), reading: reading() };
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
