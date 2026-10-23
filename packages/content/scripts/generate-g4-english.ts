// Seeds the Grade 4 English bank from src/words4.ts. The JSON it writes is the source of truth;
// re-running this script overwrites puzzles/g4-english/.
//   node scripts/generate-g4-english.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORDS_FOR, parseTagged, type WordClass } from '../src/words3.ts';
import { AFFIXES, ING, LADDERS, LADDER_WORDS, PASSAGES4, PREFIXES, SUBJECTS4, SUFFIXES, TAGGED4, oneLetterApart } from '../src/words4.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g4-english');

let seed = 20261302;
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
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 4, subject: 'english', topic, difficulty, prompt,
});
function cycler<T>(pool: readonly T[]) {
  let bag: T[] = [];
  return () => (bag.length ? bag : (bag = shuffle(pool))).pop()!;
}

function pronounsAdverbs() {
  const pool = (c: WordClass) => TAGGED4.filter((s) => parseTagged(s).filter((w) => w.tag === c).length === 1);
  const next = { pronoun: cycler(pool('pronoun')), adverb: cycler(pool('adverb')) };
  return levels([7, 7, 6]).map((d, i) => {
    const ask: WordClass = d === 1 ? 'pronoun' : d === 2 ? 'adverb' : i % 2 ? 'pronoun' : 'adverb';
    const tagged = next[ask as 'pronoun' | 'adverb']();
    const words = parseTagged(tagged);
    return {
      ...base('g4-pronouns', i, d, `Tap the ${WORDS_FOR[ask]}.`), type: 'word-class',
      payload: { tagged, ask }, options: [...new Set(words.map((w) => w.word))], answer: words.find((w) => w.tag === ask)!.word,
    };
  });
}

function tenses() {
  const verbs = cycler(Object.keys(ING));
  const subjects = cycler(SUBJECTS4);
  return levels([7, 7, 6]).map((d, i) => {
    const v = verbs();
    const s = subjects();
    // Mid-sentence, "She" becomes "she"; "I" and names keep their capital.
    const who = s.who === 'I' || s.who === 'Ravi' ? s.who : s.who[0].toLowerCase() + s.who.slice(1);
    const rule = d === 1 ? 'future' : d === 2 ? 'continuous' : i % 2 ? 'future' : 'continuous';
    if (rule === 'future') {
      const sentence = `Tomorrow ${who} ___ (${v}).`;
      const answer = `will ${v}`;
      const wrong = [`will ${ING[v]}`, `${s.be} ${v}`, `willed ${v}`].slice(0, 2);
      return { ...base('g4-tenses', i, d, sentence), type: 'fill-blank', payload: { sentence, rule, base: v, who: s.who }, options: shuffle([answer, ...wrong]), answer };
    }
    const sentence = `Right now ${who} ___ (${v}).`;
    const answer = `${s.be} ${ING[v]}`;
    const others = (['am', 'is', 'are'] as const).filter((b) => b !== s.be);
    const wrong = [`${pick(others)} ${ING[v]}`, `${s.be} ${v}`];
    return { ...base('g4-tenses', i, d, sentence), type: 'fill-blank', payload: { sentence, rule, base: v, who: s.who }, options: shuffle([answer, ...wrong]), answer };
  });
}

// Words made by a wrong affix that happen to be real (care + er = career) can't be wrong options.
const REAL_WORDS = new Set(['career', 'helper', 'reader', 'unlike', 'unless', 'relock', 'homer', 'redid', 'reagree', 'dishelp']);

function affixes() {
  const pre = cycler(AFFIXES.filter((a) => a.kind === 'prefix'));
  const suf = cycler(AFFIXES.filter((a) => a.kind === 'suffix'));
  return levels([7, 7, 6]).map((d, i) => {
    const a = d === 1 ? pre() : d === 2 ? suf() : i % 2 ? pre() : suf();
    // Wrong options: the same base with the other affixes of its kind.
    const others = (a.kind === 'prefix' ? PREFIXES : SUFFIXES).filter((x) => x !== a.affix);
    const wrong = others.map((x) => (a.kind === 'prefix' ? x + a.base : a.base + x)).filter((w) => !AFFIXES.some((b) => b.word === w) && !REAL_WORDS.has(w));
    const opts = [...new Set([a.word, ...shuffle(wrong).slice(0, 2)])];
    // If every other affix makes a real word (care → careful, careless), fall back to a misspelling.
    if (opts.length < 3) opts.push(a.kind === 'prefix' ? `${a.affix}${a.base}s` : `${a.base}${a.affix}l`);
    const sentence = `A word that means "${a.meaning}" is ___.`;
    return { ...base('g4-affixes', i, d, sentence), type: 'fill-blank', payload: { sentence, rule: 'affix', base: a.word }, options: shuffle(opts.slice(0, 3)), answer: a.word };
  });
}

function ladders() {
  const byLen = (n: number) => LADDERS.filter((l) => l.length === n);
  const next = { 1: cycler(byLen(3)), 2: cycler(byLen(4)), 3: cycler([...byLen(5), ...byLen(4)]) } as Record<number, () => string[]>;
  const words = [...LADDER_WORDS];
  return levels([7, 7, 6]).map((d, i) => {
    const ladder = next[d]();
    // Each step offers the right word plus real words of the same length that are NOT one letter away.
    const choices = ladder.slice(1).map((right, k) => {
      const cur = ladder[k];
      const wrong = shuffle(words.filter((w) => w.length === cur.length && w !== right && !oneLetterApart(cur, w) && w !== cur)).slice(0, 2);
      return shuffle([right, ...wrong]);
    });
    return {
      ...base('g4-ladders', i, d, `Change one letter at a time to turn ${ladder[0]} into ${ladder[ladder.length - 1]}.`), type: 'word-ladder',
      payload: { ladder, choices },
    };
  });
}

function reading() {
  const next = { 1: cycler(PASSAGES4.filter((p) => p.level === 1)), 2: cycler(PASSAGES4.filter((p) => p.level === 2)), 3: cycler(PASSAGES4.filter((p) => p.level === 3)) } as Record<number, () => (typeof PASSAGES4)[number]>;
  return levels([7, 7, 6]).map((d, i) => {
    const p = next[d]();
    return {
      ...base('g4-reading', i, d, `${p.text} ${p.question}`), type: 'passage',
      payload: { text: p.text, question: p.question }, options: shuffle([p.answer, ...shuffle(p.wrong).slice(0, 2)]), answer: p.answer,
    };
  });
}

mkdirSync(OUT, { recursive: true });
const banks = { pronouns: pronounsAdverbs(), tenses: tenses(), affixes: affixes(), ladders: ladders(), reading: reading() };
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
