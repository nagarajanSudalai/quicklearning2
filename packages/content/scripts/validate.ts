// Checks every puzzle JSON file: required fields, unique ids, answer among options,
// and that the answer is actually correct for the puzzle's payload.
//   npm run validate-content
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, oddCandidates } from '../src/categories.ts';
import { timeLabel } from '../src/time.ts';
import { KNOWN_WORDS, PICTURES, rhymes } from '../src/words.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles');
const SHAPES = ['star', 'circle', 'square', 'tri', 'diamond', 'rectangle'];
const errors: string[] = [];
const ids = new Set<string>();
let total = 0;

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : f.endsWith('.json') ? [join(dir, f)] : []));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function check(p: any): string | null {
  for (const k of ['id', 'grade', 'subject', 'topic', 'difficulty', 'prompt', 'type', 'payload']) if (p[k] === undefined) return `missing "${k}"`;
  if (![1, 2, 3].includes(p.difficulty)) return 'difficulty must be 1, 2 or 3';
  if (INTERACTIVE[p.type]) return INTERACTIVE[p.type](p.payload);
  for (const k of ['options', 'answer']) if (p[k] === undefined) return `missing "${k}"`;
  if (!Array.isArray(p.options) || p.options.length < 2) return 'needs at least 2 options';
  if (new Set(p.options).size !== p.options.length) return 'options must be unique';
  if (!p.options.includes(p.answer)) return 'answer is not one of the options';
  const q = p.payload;
  switch (p.type) {
    case 'count-objects':
      return q.count === p.answer ? null : `count is ${q.count} but answer is ${p.answer}`;
    case 'arithmetic': {
      const v = q.op === '+' ? q.a + q.b : q.op === '-' ? q.a - q.b : q.op === '×' ? q.a * q.b : NaN;
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
    case 'place-value': {
      if (q.tens < 0 || q.tens > 9 || q.ones < 0 || q.ones > 9) return 'digits must be 0–9';
      const want = q.ask === 'tens' ? q.tens : q.ask === 'ones' ? q.ones : q.tens * 10 + q.ones;
      return want === p.answer ? null : `answer should be ${want}`;
    }
    case 'number-pattern': {
      const blanks = q.seq.filter((x: number | null) => x === null).length;
      if (blanks !== 1) return 'needs exactly one blank';
      const i = q.seq.indexOf(null);
      const known = q.seq.map((x: number | null, k: number) => [k, x]).filter(([, x]: [number, number | null]) => x !== null) as [number, number][];
      const step = (known[1][1] - known[0][1]) / (known[1][0] - known[0][0]);
      if (!Number.isInteger(step) || step === 0) return 'no constant step';
      if (!known.every(([k, x]) => x === known[0][1] + step * (k - known[0][0]))) return 'numbers do not go up by the same step';
      const want = known[0][1] + step * (i - known[0][0]);
      return want === p.answer ? null : `missing number is ${want}`;
    }
    case 'clock': {
      const want = timeLabel(q.hour, q.minute);
      if (p.options.some((o: string) => o !== p.answer && o === want)) return 'duplicate right answer';
      return want === p.answer ? null : `the clock shows ${want}`;
    }
    case 'money': {
      const ok = q.coins.every((c: number) => [1, 2, 5, 10].includes(c)) && q.notes.every((n: number) => [10, 20, 50, 100].includes(n));
      if (!ok) return 'unknown coin or note';
      const total = [...q.coins, ...q.notes].reduce((s: number, x: number) => s + x, 0);
      return total === p.answer ? null : `coins and notes add up to ₹${total}`;
    }
    case 'odd-one-out': {
      const group = CATEGORIES.find((c) => c.id === q.group);
      if (!group) return `unknown group ${q.group}`;
      const valid = oddCandidates(p.options);
      if (valid.length !== 1) return `${valid.length} items could be the odd one out (${valid.join(' ')})`;
      return valid[0] === p.answer ? null : `the odd one out is ${valid[0]}`;
    }
    default:
      return `unknown type "${p.type}"`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const INTERACTIVE: Record<string, (q: any) => string | null> = {
  crossword(q) {
    const grid = new Map<string, string>();
    for (const w of q.words) {
      if (PICTURES[w.word] !== w.picture) return `wrong picture for ${w.word}`;
      for (let k = 0; k < w.word.length; k++) {
        const key = w.dir === 'across' ? `${w.row},${w.col + k}` : `${w.row + k},${w.col}`;
        if (grid.has(key) && grid.get(key) !== w.word[k]) return `words clash at ${key}`;
        grid.set(key, w.word[k]);
      }
    }
    if (!q.blanks.length) return 'no blanks';
    for (const [r, c] of q.blanks) {
      const l = grid.get(`${r},${c}`);
      if (!l) return `blank ${r},${c} is not on a word`;
      if (!q.letters.includes(l)) return `letter "${l}" is not offered`;
    }
    return new Set(q.letters).size === q.letters.length ? null : 'letters must be unique';
  },
  'sort-into-groups'(q) {
    const ids = q.groups.map((g: { id: string }) => g.id);
    if (ids.length < 2) return 'needs at least 2 groups';
    for (const it of q.items) {
      if (!ids.includes(it.group)) return `${it.name} has unknown group ${it.group}`;
      const cat = CATEGORIES.find((c) => c.id === it.group);
      if (!cat?.items.some(([e]) => e === it.item)) return `${it.name} is not in ${it.group}`;
      const also = ids.find((g: string) => g !== it.group && CATEGORIES.find((c) => c.id === g)?.items.some(([e]) => e === it.item));
      if (also) return `${it.name} fits ${also} too`;
    }
    return ids.every((g: string) => q.items.some((it: { group: string }) => it.group === g)) ? null : 'a group has no items';
  },
  'memory-match'(q) {
    const counts = new Map<string, number>();
    for (const c of q.cards) counts.set(c, (counts.get(c) ?? 0) + 1);
    if ([...counts.values()].some((n) => n !== 2)) return 'every picture must appear exactly twice';
    return q.cards.length % q.cols === 0 ? null : 'cards must fill the grid';
  },
  maze(q) {
    const { rows, cols, cells, start, goal } = q;
    if (cells.length !== rows * cols) return 'cells must fill the grid';
    const dirs = [[-1, 0, 1, 4], [0, 1, 2, 8], [1, 0, 4, 1], [0, -1, 8, 2]];
    for (let i = 0; i < cells.length; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      for (const [dr, dc, bit, back] of dirs) {
        if (!(cells[i] & bit)) continue;
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return `cell ${r},${c} opens off the grid`;
        if (!(cells[nr * cols + nc] & back)) return `wall between ${r},${c} and ${nr},${nc} is one-sided`;
      }
    }
    // The goal must be reachable from the start.
    const seen = new Set([start[0] * cols + start[1]]);
    const queue = [start[0] * cols + start[1]];
    while (queue.length) {
      const i = queue.shift()!;
      for (const [dr, dc, bit] of dirs) if (cells[i] & bit) {
        const n = (Math.floor(i / cols) + dr) * cols + (i % cols) + dc;
        if (!seen.has(n)) { seen.add(n); queue.push(n); }
      }
    }
    return seen.has(goal[0] * cols + goal[1]) ? null : 'goal cannot be reached';
  },
};

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
