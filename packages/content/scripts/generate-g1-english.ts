// Seeds the Grade 1 English puzzle bank from the word bank in src/words.ts. The JSON it
// writes is the source of truth: edit or add puzzles there by hand; re-running this
// script overwrites puzzles/g1-english/.
//   node scripts/generate-g1-english.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CVC, IRREGULAR_START, KNOWN_WORDS, LETTER_MATCH_TARGETS, LOOKALIKES, PICTURES, RHYME_FAMILIES, SOUND_ALIKE, rhymes } from '../src/words.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles', 'g1-english');

let seed = 20261023;
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
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 1, subject: 'english', topic, difficulty, prompt,
});

/** Spread picks over the pool so a topic doesn't repeat the same item back to back. */
function cycler<T>(pool: readonly T[]) {
  let bag: T[] = [];
  let last: T | undefined;
  return () => {
    if (!bag.length) bag = shuffle(pool);
    if (bag[bag.length - 1] === last && bag.length > 1) bag.unshift(bag.pop()!);
    return (last = bag.pop()!);
  };
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const groupOf = (l: string) => LOOKALIKES.find((g) => g.includes(l)) ?? [l];
const soundAlike = (a: string, b: string) => SOUND_ALIKE.some((g) => g.includes(a) && g.includes(b));

/** `n - 1` wrong letters for `answer`: far = not look-alikes, near = look-alikes first. */
function letterOptions(answer: string, n: number, mode: 'far' | 'any' | 'near') {
  const ok = (l: string) => l !== answer && !soundAlike(l, answer);
  const near = shuffle(groupOf(answer).filter(ok));
  const far = shuffle(ALPHABET.filter((l) => ok(l) && !groupOf(answer).includes(l)));
  const pool = mode === 'near' ? [...near, ...far] : mode === 'far' ? far : shuffle([...near, ...far]);
  return shuffle([answer, ...pool.slice(0, n - 1)]);
}

function letters() {
  const next = cycler(LETTER_MATCH_TARGETS);
  return levels([7, 7, 6]).map((d, i) => {
    const l = next();
    const options = letterOptions(l, d === 3 ? 4 : 3, d === 1 ? 'far' : d === 2 ? 'any' : 'near');
    return { ...base('g1-letters', i, d, `Find the small letter for capital ${l.toUpperCase()}.`), type: 'letter-match', payload: { upper: l.toUpperCase() }, options, answer: l };
  });
}

function sounds() {
  const words = Object.keys(PICTURES).filter((w) => !IRREGULAR_START.includes(w));
  const next = cycler(words);
  return levels([7, 7, 6]).map((d, i) => {
    const word = next();
    const options = letterOptions(word[0], d === 3 ? 4 : 3, d === 1 ? 'far' : d === 2 ? 'any' : 'near');
    return { ...base('g1-sounds', i, d, `Which letter does ${word} start with?`), type: 'first-letter', payload: { word, picture: PICTURES[word] }, options, answer: word[0] };
  });
}

function words() {
  const all = Object.keys(PICTURES);
  const sameStart = all.filter((w) => all.filter((x) => x[0] === w[0]).length >= 3);
  // Missing-vowel words need two wrong vowels that don't spell another real word.
  const vowelsFor = (w: string) => ['a', 'e', 'i', 'o', 'u'].filter((v) => v !== w[1] && !KNOWN_WORDS.has(w[0] + v + w[2]));
  const blanks = CVC.filter((w) => vowelsFor(w).length >= 2);
  const n1 = cycler(all), n2 = cycler(sameStart), n3 = cycler(blanks);
  return levels([7, 7, 6]).map((d, i) => {
    if (d === 3) {
      const word = n3();
      return {
        ...base('g1-words', i, d, 'Which letter is missing?'), type: 'picture-word',
        payload: { word, picture: PICTURES[word], blank: 1 }, options: shuffle([word[1], ...shuffle(vowelsFor(word)).slice(0, 2)]), answer: word[1],
      };
    }
    const word = d === 1 ? n1() : n2();
    const others = all.filter((w) => w !== word && (d === 1 ? w[0] !== word[0] : w[0] === word[0]));
    const wrong = d === 1 ? shuffle(others).filter((w, k, a) => a.findIndex((x) => x[0] === w[0]) === k).slice(0, 2) : shuffle(others).slice(0, 2);
    return { ...base('g1-words', i, d, 'Which word matches the picture?'), type: 'picture-word', payload: { word, picture: PICTURES[word] }, options: shuffle([word, ...wrong]), answer: word };
  });
}

function rhymeSet() {
  const targets = RHYME_FAMILIES.flat();
  const next = cycler(targets);
  return levels([7, 7, 6]).map((d, i) => {
    const word = next();
    const answer = pick(RHYME_FAMILIES.find((f) => f.includes(word))!.filter((w) => w !== word));
    const nonRhymes = Object.keys(PICTURES).filter((w) => w !== word && !rhymes(w, word));
    // Level 2+: a decoy that starts like the target but doesn't rhyme (cat → cake).
    const decoys = shuffle(nonRhymes.filter((w) => w[0] === word[0]));
    const rest = shuffle(nonRhymes.filter((w) => w[0] !== word[0] && w[0] !== answer[0]));
    const wrong = d === 1 ? rest.slice(0, 2) : [...decoys.slice(0, 1), ...rest].slice(0, d === 3 ? 3 : 2);
    const options = shuffle([answer, ...wrong]);
    return {
      ...base('g1-rhymes', i, d, `Which word rhymes with ${word}?`), type: 'rhyme',
      payload: { word, picture: PICTURES[word], pictures: Object.fromEntries(options.map((w) => [w, PICTURES[w]])) }, options, answer,
    };
  });
}

mkdirSync(OUT, { recursive: true });
const banks = { letters: letters(), sounds: sounds(), words: words(), rhymes: rhymeSet() };
for (const [name, puzzles] of Object.entries(banks)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`${name}: ${puzzles.length} puzzles`);
}
