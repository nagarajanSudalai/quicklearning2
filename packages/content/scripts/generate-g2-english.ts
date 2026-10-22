// Seeds the Grade 2 English bank from src/words2.ts and src/words.ts. The JSON it writes is
// the source of truth; re-running this script overwrites puzzles/g2-english/.
//   node scripts/generate-g2-english.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PICTURES } from '../src/words.ts';
import { ARTICLE_NOUNS, IS_ARE, OPPOSITES, PLURALS, SENTENCES, SPARE_WORDS, article } from '../src/words2.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g2-english');

let seed = 20261102;
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
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 2, subject: 'english', topic, difficulty, prompt,
});
/** Cycle through a pool without repeats until it runs out. */
function cycler<T>(pool: readonly T[]) {
  let bag: T[] = [];
  return () => (bag.length ? bag : (bag = shuffle(pool))).pop()!;
}

/** The wrong plurals a child is likely to write: the other ending, or the word unchanged. */
function wrongPlurals(word: string, right: string) {
  const { kind } = PLURALS[word];
  if (kind === 's') return [word.endsWith('e') ? `${word}es`.replace('ees', 'eis') : `${word}es`, word].map((f) => (f.endsWith('eis') ? word : f));
  if (kind === 'es') return [`${word}s`, word];
  if (right === word) return [`${word}s`, `${word}es`.replace('fishes', 'fishs')];
  return [`${word}s`, `${right}s`];
}

function plurals() {
  const byKind = (k: string) => Object.keys(PLURALS).filter((w) => PLURALS[w].kind === k);
  const next = { 1: cycler(byKind('s')), 2: cycler(byKind('es')), 3: cycler(byKind('irregular')) } as Record<number, () => string>;
  return levels([7, 7, 6]).map((d, i) => {
    const w = next[d]();
    const { plural, picture } = PLURALS[w];
    // "stares" is a real word, so it can't be a wrong answer.
    const options = shuffle([...new Set([plural, ...wrongPlurals(w, plural).filter((f) => f !== 'stares')])]);
    return {
      ...base('g2-plurals', i, d, `One ${w}, two ___.`), type: 'fill-blank',
      payload: { sentence: `One ${w}, two ___.`, picture: `${picture} ${picture}`, rule: 'plural', base: w }, options, answer: plural,
    };
  });
}

function opposites() {
  const next = { 1: cycler(OPPOSITES.filter((o) => o[2] === 1)), 2: cycler(OPPOSITES.filter((o) => o[2] === 2)), 3: cycler(OPPOSITES.filter((o) => o[2] === 3)) } as Record<number, () => (typeof OPPOSITES)[number]>;
  const all = OPPOSITES.flatMap(([a, b]) => [a, b]);
  return levels([7, 7, 6]).map((d, i) => {
    const [word, opp] = next[d]();
    // Wrong options: other opposite-pair words, never the word itself.
    const wrong = shuffle(all.filter((w) => w !== word && w !== opp)).slice(0, 2);
    const s = `The opposite of ${word} is ___.`;
    return { ...base('g2-opposites', i, d, s), type: 'fill-blank', payload: { sentence: s, rule: 'opposite', base: word }, options: shuffle([opp, ...wrong]), answer: opp };
  });
}

function grammar() {
  const nouns = cycler(Object.keys(ARTICLE_NOUNS));
  const subjects = cycler(IS_ARE);
  return levels([7, 7, 6]).map((d, i) => {
    const useArticle = d === 1 || (d === 3 && i % 2 === 0);
    if (useArticle) {
      const n = nouns();
      const s = `This is ___ ${n}.`;
      return { ...base('g2-grammar', i, d, s), type: 'fill-blank', payload: { sentence: s, picture: ARTICLE_NOUNS[n], rule: 'article', base: n }, options: ['a', 'an'], answer: article(n) };
    }
    const x = subjects();
    const s = `${x.subject} ___ ${x.rest}`;
    return { ...base('g2-grammar', i, d, s), type: 'fill-blank', payload: { sentence: s, picture: x.picture, rule: 'is-are', base: x.subject }, options: ['is', 'are'], answer: x.plural ? 'are' : 'is' };
  });
}

function spell() {
  const byLen = (n: number) => Object.keys(PICTURES).filter((w) => w.length === n);
  const next = { 1: cycler(byLen(3)), 2: cycler(byLen(4)), 3: cycler(byLen(5)) } as Record<number, () => string>;
  return levels([7, 7, 6]).map((d, i) => {
    const w = next[d]();
    const letters = w.split('');
    const spare = d === 3 ? [pick('abcdefghijklmnoprstuwy'.split('').filter((l) => !letters.includes(l)))] : [];
    // Never show the tiles already in order.
    let tiles = shuffle([...letters, ...spare]);
    while (tiles.join('') === w) tiles = shuffle(tiles);
    return { ...base('g2-spelling', i, d, 'Spell the word.'), type: 'build', payload: { answer: letters, tiles, picture: PICTURES[w], say: w, joiner: '' } };
  });
}

function sentences() {
  const next = { 1: cycler(SENTENCES.filter((s) => s.level === 1)), 2: cycler(SENTENCES.filter((s) => s.level === 2)), 3: cycler(SENTENCES.filter((s) => s.level === 3)) } as Record<number, () => (typeof SENTENCES)[number]>;
  return levels([7, 7, 6]).map((d, i) => {
    const s = next[d]();
    const words = s.text.split(' ');
    const tiles0 = [...words, ...(d === 3 ? [pick(SPARE_WORDS)] : [])];
    let tiles = shuffle(tiles0);
    while (tiles.slice(0, words.length).join(' ') === s.text) tiles = shuffle(tiles0);
    return { ...base('g2-sentences', i, d, 'Put the words in order.'), type: 'build', payload: { answer: words, tiles, picture: s.picture, say: s.text, joiner: ' ' } };
  });
}

mkdirSync(OUT, { recursive: true });
const banks = { plurals: plurals(), opposites: opposites(), grammar: grammar(), spelling: spell(), sentences: sentences() };
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
