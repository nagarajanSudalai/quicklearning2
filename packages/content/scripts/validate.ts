// Checks every puzzle JSON file: required fields, unique ids, answer among options,
// and that the answer is actually correct for the puzzle's payload.
//   npm run validate-content
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KNOWN_WORDS, rhymes } from '../src/words.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles');
const SHAPES = ['star', 'circle', 'square', 'tri', 'diamond', 'rectangle'];
const errors: string[] = [];
const ids = new Set<string>();
let total = 0;

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : f.endsWith('.json') ? [join(dir, f)] : []));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function check(p: any): string | null {
  for (const k of ['id', 'grade', 'subject', 'topic', 'difficulty', 'prompt', 'type', 'payload', 'options', 'answer']) if (p[k] === undefined) return `missing "${k}"`;
  if (![1, 2, 3].includes(p.difficulty)) return 'difficulty must be 1, 2 or 3';
  if (!Array.isArray(p.options) || p.options.length < 2) return 'needs at least 2 options';
  if (new Set(p.options).size !== p.options.length) return 'options must be unique';
  if (!p.options.includes(p.answer)) return 'answer is not one of the options';
  const q = p.payload;
  switch (p.type) {
    case 'count-objects':
      return q.count === p.answer ? null : `count is ${q.count} but answer is ${p.answer}`;
    case 'arithmetic': {
      const v = q.op === '+' ? q.a + q.b : q.op === '-' ? q.a - q.b : NaN;
      return v === p.answer ? null : `${q.a} ${q.op} ${q.b} is ${v}, not ${p.answer}`;
    }
    case 'shape-match':
      if (![...p.options, q.target].every((s: string) => SHAPES.includes(s))) return 'unknown shape';
      return q.target === p.answer ? null : 'target and answer differ';
    case 'compare': {
      const { left, right, ask } = q;
      if (left.count === right.count) return 'groups are equal';
      const more = left.count > right.count ? 'left' : 'right';
      const want = ask === 'more' ? more : more === 'left' ? 'right' : 'left';
      return want === p.answer ? null : `answer should be ${want}`;
    }
    case 'pattern': {
      const seq: string[] = q.seq;
      if (![...seq, ...p.options].every((s) => SHAPES.includes(s))) return 'unknown shape';
      // Smallest repeating unit that explains the sequence must predict the answer.
      for (let n = 1; n < seq.length; n++) {
        if (seq.every((s, i) => s === seq[i % n])) return seq[seq.length % n] === p.answer ? null : `pattern continues with ${seq[seq.length % n]}`;
      }
      return 'sequence has no repeating unit';
    }
    case 'letter-match':
      return q.upper.toLowerCase() === p.answer ? null : `small ${q.upper} is ${q.upper.toLowerCase()}`;
    case 'first-letter':
      if (!q.picture) return 'missing picture';
      return q.word[0] === p.answer ? null : `${q.word} starts with ${q.word[0]}`;
    case 'picture-word': {
      if (!q.picture) return 'missing picture';
      if (q.blank === undefined) return q.word === p.answer ? null : `answer should be ${q.word}`;
      if (q.word[q.blank] !== p.answer) return `missing letter is ${q.word[q.blank]}`;
      // A wrong letter must not spell another real word, or there'd be two right answers.
      const fill = (l: string) => q.word.slice(0, q.blank) + l + q.word.slice(q.blank + 1);
      const clash = p.options.find((o: string) => o !== p.answer && KNOWN_WORDS.has(fill(o)));
      return clash ? `"${fill(clash)}" is also a word` : null;
    }
    case 'rhyme': {
      if (!rhymes(q.word, p.answer)) return `${p.answer} doesn't rhyme with ${q.word}`;
      const extra = p.options.find((o: string) => o !== p.answer && rhymes(q.word, o));
      if (extra) return `${extra} also rhymes with ${q.word}`;
      const noPic = p.options.find((o: string) => !q.pictures?.[o]);
      return noPic ? `no picture for ${noPic}` : null;
    }
    default:
      return `unknown type "${p.type}"`;
  }
}

for (const file of files(ROOT)) {
  const name = relative(ROOT, file);
  let list: unknown;
  try {
    list = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${name}: invalid JSON (${(e as Error).message})`);
    continue;
  }
  if (!Array.isArray(list)) { errors.push(`${name}: must be an array`); continue; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const p of list as any[]) {
    total++;
    if (ids.has(p.id)) errors.push(`${name}: duplicate id ${p.id}`);
    ids.add(p.id);
    const err = check(p);
    if (err) errors.push(`${name}: ${p.id ?? '(no id)'}: ${err}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s) in ${total} puzzles.`);
  process.exit(1);
}
console.log(`OK — ${total} puzzles valid.`);
