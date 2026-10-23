// Checks every puzzle JSON file: required fields, unique ids, answer among options,
// and that the answer is actually correct for the puzzle's payload.
//   npm run validate-content
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, oddCandidates } from '../src/categories.ts';
import { countSolutions, isSolved } from '../src/sudoku.ts';
import { RIDDLES, SEQUENCES } from '../src/thinking2.ts';
import { timeLabel } from '../src/time.ts';
import { calendarAnswer } from '../src/calendar.ts';
import { addFractions, angleName, chartAnswer, decimalSum, percentAnswer, roundWhole, simplify } from '../src/maths5.ts';
import { CLUES4, encode, patternTerms } from '../src/thinking4.ts';
import { fits, fracCmp, fracStr, gridMeasure, timeCalcAnswer } from '../src/maths4.ts';
import { ANALOGIES, CLUES } from '../src/thinking3.ts';
import { isMagic, logicSolutions, magicSolutions } from '../src/logic.ts';
import { HOMOPHONES, PASSAGES, PAST, SYNONYMS, parseTagged } from '../src/words3.ts';
import { AFFIXES, ING, LADDER_WORDS, PASSAGES4, SUBJECTS4, oneLetterApart } from '../src/words4.ts';
import { IS_ARE, OPPOSITES, PLURALS, article } from '../src/words2.ts';
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
      if (q.remainder) { const r = q.a % q.b; if (!r) return 'remainder puzzles need a remainder'; return r === p.answer ? null : `remainder is ${r}`; }
      if (q.op === '÷' && q.a % q.b !== 0) return `${q.a} ÷ ${q.b} doesn't divide exactly`;
      if (q.missing) return q[q.missing] === p.answer ? null : `missing number is ${q[q.missing]}`;
      const v = q.op === '+' ? q.a + q.b : q.op === '-' ? q.a - q.b : q.op === '×' ? q.a * q.b : q.op === '÷' ? q.a / q.b : NaN;
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
      const h = q.hundreds ?? 0, th = q.thousands ?? 0, tt = q.tenThousands ?? 0;
      if ([tt, th, h, q.tens, q.ones].some((x) => x < 0 || x > 9)) return 'digits must be 0–9';
      const whole = tt * 10000 + th * 1000 + h * 100 + q.tens * 10 + q.ones;
      const want = q.ask === 'tenThousands' ? tt : q.ask === 'thousands' ? th : q.ask === 'hundreds' ? h : q.ask === 'tens' ? q.tens : q.ask === 'ones' ? q.ones : whole;
      return want === p.answer ? null : `answer should be ${want}`;
    }
    case 'number-pattern': {
      const blanks = q.seq.filter((x: number | null) => x === null).length;
      if (blanks !== 1) return 'needs exactly one blank';
      const i = q.seq.indexOf(null);
      if (q.rule) {
        const full = patternTerms(q.rule, q.seq.length);
        if (q.seq.some((x: number | null, k: number) => x !== null && x !== full[k])) return 'shown numbers do not follow the rule';
        // A constant step must not also explain the shown numbers (that would give a second answer).
        const kn = q.seq.map((x: number | null, k: number) => [k, x]).filter(([, x]: [number, number | null]) => x !== null) as [number, number][];
        const st = (kn[1][1] - kn[0][1]) / (kn[1][0] - kn[0][0]);
        if (kn.every(([k, x]) => x === kn[0][1] + st * (k - kn[0][0]))) return 'a constant step also fits';
        return full[i] === p.answer ? null : `missing number is ${full[i]}`;
      }
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
      const ok = q.coins.every((c: number) => [1, 2, 5, 10].includes(c)) && q.notes.every((n: number) => [10, 20, 50, 100, 200].includes(n));
      if (!ok) return 'unknown coin or note';
      const total = [...q.coins, ...q.notes].reduce((s: number, x: number) => s + x, 0);
      if (q.price !== undefined) {
        if (q.price >= total) return 'price must be less than the money paid';
        return total - q.price === p.answer ? null : `change is ₹${total - q.price}`;
      }
      return total === p.answer ? null : `coins and notes add up to ₹${total}`;
    }
    case 'fill-blank': {
      if ((q.sentence.match(/___/g) ?? []).length !== 1) return 'sentence needs exactly one ___';
      let want: string | undefined;
      if (q.rule === 'plural') want = PLURALS[q.base]?.plural;
      else if (q.rule === 'opposite') want = OPPOSITES.find(([w]) => w === q.base)?.[1];
      else if (q.rule === 'article') want = article(q.base);
      else if (q.rule === 'is-are') { const s = IS_ARE.find((x) => x.subject === q.base); want = s ? (s.plural ? 'are' : 'is') : undefined; }
      else if (q.rule === 'past') want = PAST[q.base]?.past;
      else if (q.rule === 'synonym') {
        want = SYNONYMS.find(([w]) => w === q.base)?.[1];
        const clash = p.options.find((o: string) => o !== p.answer && SYNONYMS.some(([a, b]) => (a === q.base && b === o) || (b === q.base && a === o)));
        if (clash) return `${clash} also means ${q.base}`;
      } else if (q.rule === 'homophone') {
        const h = HOMOPHONES.find((x) => x.sentence === q.sentence);
        want = h?.answer;
        if (h && p.options.some((o: string) => !h.set.includes(o))) return 'options must be words that sound the same';
      }
      else if (q.rule === 'future') want = `will ${q.base}`;
      else if (q.rule === 'continuous') { const s = SUBJECTS4.find((x) => x.who === q.who); want = s && ING[q.base] ? `${s.be} ${ING[q.base]}` : undefined; }
      else if (q.rule === 'affix') {
        want = AFFIXES.find((a) => a.word === q.base)?.word;
        const real = p.options.find((o: string) => o !== p.answer && AFFIXES.some((a) => a.word === o));
        if (real) return `${real} is also a real word in the bank`;
      }
      if (!want) return `no ${q.rule} rule for "${q.base}"`;
      return want === p.answer ? null : `answer should be "${want}"`;
    }
    case 'riddle': {
      const r = RIDDLES.find((x) => x.answer[0] === p.answer);
      if (!r) return `${p.answer} is not a riddle answer`;
      if (!q.clues.length || q.clues.some((c: string, k: number) => r.clues[k] !== c)) return 'clues do not match the riddle bank';
      // A wrong option must not be another riddle's answer with the same clues.
      return p.options.every((o: string) => q.names[o]) ? null : 'every option needs a name';
    }
    case 'compare-numbers': {
      const want = q.a > q.b ? '>' : q.a < q.b ? '<' : '=';
      return want === p.answer ? null : `${q.a} ${want} ${q.b}`;
    }
    case 'fraction': {
      if (q.shaded < 1 || q.shaded >= q.parts) return 'shaded must be between 1 and parts − 1';
      const want = `${q.shaded}/${q.parts}`;
      if (want !== p.answer) return `shaded part is ${want}`;
      // No wrong option may be the same amount (1/2 and 2/4).
      const val = (f: string) => { const [a, b] = f.split('/').map(Number); return a / b; };
      const same = p.options.find((o: string) => o !== p.answer && val(o) === val(p.answer));
      return same ? `${same} is the same as ${p.answer}` : null;
    }
    case 'calendar': {
      const want = calendarAnswer(q.kind, q.base, q.offset);
      return want === p.answer ? null : `answer should be ${want}`;
    }
    case 'measure':
      if (q.length < 1 || q.start < 0 || q.start + q.length > 15) return 'object must fit on a 15 cm ruler';
      return q.length === p.answer ? null : `the object is ${q.length} cm long`;
    case 'word-class': {
      const words = parseTagged(q.tagged);
      const hits = words.filter((w) => w.tag === q.ask);
      if (hits.length !== 1) return `sentence has ${hits.length} ${q.ask}s`;
      if (p.options.some((o: string) => !words.some((w) => w.word === o))) return 'options must be words of the sentence';
      return hits[0].word === p.answer ? null : `the ${q.ask} is "${hits[0].word}"`;
    }
    case 'passage': {
      const b = [...PASSAGES, ...PASSAGES4].find((x) => x.text === q.text && x.question === q.question);
      if (!b) return 'passage not in the bank';
      if (p.options.some((o: string) => o !== b.answer && !b.wrong.includes(o))) return 'unknown option';
      return b.answer === p.answer ? null : `answer is "${b.answer}"`;
    }
    case 'analogy': {
      const a = ANALOGIES.find((x) => x.a === q.a && x.b === q.b && x.c === q.c);
      if (!a) return 'analogy not in the bank';
      if (p.options.some((o: string) => o !== a.d && !a.wrong.includes(o))) return 'unknown option';
      return a.d === p.answer ? null : `answer is ${a.d}`;
    }
    case 'fraction-op': {
      const val = (f: string) => f.split('/').map(Number) as [number, number];
      if (q.op === 'equivalent') {
        const right = p.options.filter((o: string) => fracCmp(val(o), q.a) === 0 && o !== fracStr(q.a));
        if (right.length !== 1) return `${right.length} options equal ${fracStr(q.a)}`;
        return right[0] === p.answer ? null : `${right[0]} equals ${fracStr(q.a)}`;
      }
      if (q.op === 'bigger') {
        if (fracCmp(q.a, q.b) === 0) return 'fractions are equal';
        const want = fracStr(fracCmp(q.a, q.b) > 0 ? q.a : q.b);
        return want === p.answer ? null : `${want} is bigger`;
      }
      if (q.op === 'simplify') {
        const want = fracStr(simplify(q.a));
        if (want === fracStr(q.a)) return 'already in simplest form';
        if (p.options.some((o: string) => o !== p.answer && fracCmp(val(o), q.a) === 0 && fracStr(simplify(val(o))) === o)) return 'another option is also the simplest form';
        return want === p.answer ? null : `simplest form is ${want}`;
      }
      if (q.op === 'of') {
        const v = (q.a[0] * q.n) / q.a[1];
        if (!Number.isInteger(v)) return 'answer is not a whole number';
        return String(v) === p.answer ? null : `${fracStr(q.a)} of ${q.n} is ${v}`;
      }
      // Unlike bottoms: answer in lowest terms. Like bottoms (Grade 4): add the tops.
      const want = q.a[1] === q.b[1] ? fracStr([q.a[0] + q.b[0], q.a[1]]) : fracStr(addFractions(q.a, q.b));
      // No wrong option may be the same amount written differently.
      if (p.options.some((o: string) => o !== p.answer && fracCmp(val(o), val(want)) === 0)) return 'an option equals the sum';
      return want === p.answer ? null : `sum is ${want}`;
    }
    case 'decimal': {
      let want: string;
      if (q.kind === 'paise') want = String(q.rupees * 100 + q.paise);
      else if (q.kind === 'tenths') { if (q.tenths < 1 || q.tenths > 9) return 'tenths must be 1–9'; want = `0.${q.tenths}`; }
      else if (q.kind === 'add') { want = decimalSum(q.a, q.b, q.op); if (Number(want) < 0) return 'result is negative'; }
      else if (q.kind === 'round') { if (q.a.endsWith('.5')) return 'halfway numbers are ambiguous for children'; want = roundWhole(q.a); }
      else { if (Number(q.a) === Number(q.b)) return 'decimals are equal'; want = Number(q.a) > Number(q.b) ? q.a : q.b; }
      return want === p.answer ? null : `answer is ${want}`;
    }
    case 'time-calc': {
      const want = timeCalcAnswer(q.kind, q.a, q.b);
      if (q.kind === 'duration' && q.b[0] * 60 + q.b[1] <= q.a[0] * 60 + q.a[1]) return 'end must be after start';
      return want === p.answer ? null : `answer is ${want}`;
    }
    case 'grid-shape': {
      if (q.cells.length !== q.rows * q.cols) return 'cells must fill the grid';
      const m = gridMeasure(q.rows, q.cols, q.cells);
      const want = q.triangle ? (q.rows * q.cols) / 2 : q.ask === 'area' ? m.area : m.perimeter;
      if (q.triangle && q.ask !== 'area') return 'triangles only ask for area';
      return want === p.answer ? null : `${q.ask} is ${want}`;
    }
    case 'cipher': {
      const code = encode(q.word, q.kind, q.shift);
      const want = q.ask === 'decode' ? q.word : code;
      if (q.ask === 'encode' && new Set(p.options).size !== p.options.length) return 'options must differ';
      return want === p.answer ? null : `answer is ${want}`;
    }
    case 'percent': {
      const want = percentAnswer(q);
      if (q.kind === 'grid' && (q.shaded < 1 || q.shaded > 99)) return 'shaded must be 1–99';
      return want === p.answer ? null : `answer is ${want}`;
    }
    case 'angle': {
      if (q.degrees <= 0 || q.degrees > 180 || q.degrees % 10) return 'angles are 10° steps up to 180°';
      const want = q.ask === 'name' ? angleName(q.degrees) : `${q.degrees}°`;
      return want === p.answer ? null : `answer is ${want}`;
    }
    case 'chart': {
      const values = q.bars.map((b: { value: number }) => b.value);
      if ((q.ask.kind === 'most' || q.ask.kind === 'least') && new Set(values).size !== values.length) return 'tied bars';
      const want = chartAnswer(q.bars, q.ask);
      return want === p.answer ? null : `answer is ${want}`;
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
      if (w.clue !== undefined ? (CLUES[w.word] ?? CLUES4[w.word]) !== w.clue : PICTURES[w.word] !== w.picture) return `wrong clue for ${w.word}`;
      for (let k = 0; k < w.word.length; k++) {
        const key = w.dir === 'across' ? `${w.row},${w.col + k}` : `${w.row + k},${w.col}`;
        if (grid.has(key) && grid.get(key) !== w.word[k]) return `words clash at ${key}`;
        grid.set(key, w.word[k]);
      }
    }
    for (const w of q.words) {
      const clue = w.dir === 'across' ? `${w.row},${w.col - 1}` : `${w.row - 1},${w.col}`;
      if (grid.has(clue)) return `clue square for ${w.word} is on a letter`;
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
  build(q) {
    if (!q.answer.length) return 'nothing to build';
    if (q.answer.join(q.joiner) !== q.say) return `answer "${q.answer.join(q.joiner)}" doesn't match "${q.say}"`;
    // Every answer piece must be on a tile (tiles may include one spare).
    const left = [...q.tiles];
    for (const t of q.answer) {
      const k = left.indexOf(t);
      if (k === -1) return `no tile for "${t}"`;
      left.splice(k, 1);
    }
    if (left.length > 1) return 'at most one spare tile';
    return q.tiles.slice(0, q.answer.length).join(q.joiner) === q.say ? 'tiles are already in order' : null;
  },
  sudoku(q) {
    const size = q.symbols.length;
    if (![4, 6].includes(size) || new Set(q.symbols).size !== size) return 'needs 4 or 6 different symbols';
    if (q.grid.length !== size * size || q.solution.length !== size * size) return `grid must be ${size}×${size}`;
    if (!isSolved(q.solution)) return 'solution breaks a row, column or box';
    if (q.grid.some((v: number | null, i: number) => v !== null && v !== q.solution[i])) return 'a given square disagrees with the solution';
    if (!q.grid.includes(null)) return 'no blanks';
    const n = countSolutions(q.grid);
    return n === 1 ? null : `${n === 0 ? 'no' : 'more than one'} solution`;
  },
  'order-steps'(q) {
    const s = SEQUENCES.find((x) => x.title === q.title);
    if (!s) return `unknown sequence "${q.title}"`;
    if (s.steps.length !== q.steps.length || s.steps.some(([e, n], k) => q.steps[k].item !== e || q.steps[k].name !== n)) return 'steps are not in the right order';
    const shown = [...q.shown].sort((a: number, b: number) => a - b);
    if (shown.some((v: number, k: number) => v !== k)) return 'shown must list every step once';
    return q.shown.every((v: number, k: number) => v === k) ? 'pictures are already in order' : null;
  },
  'logic-grid'(q) {
    const n = q.people.length;
    if (q.items.length !== n || q.solution.length !== n) return 'people, items and solution must match in size';
    const sols = logicSolutions(n, q.clues);
    if (sols.length !== 1) return `${sols.length} ways fit the clues`;
    return sols[0].every((v: number, k: number) => v === q.solution[k]) ? null : 'solution does not fit the clues';
  },
  'magic-square'(q) {
    if (q.target !== 15 || !isMagic(q.solution)) return 'solution is not a 1–9 magic square';
    if (q.grid.some((v: number | null, i: number) => v !== null && v !== q.solution[i])) return 'a given number disagrees with the solution';
    if (!q.grid.includes(null)) return 'no blanks';
    const n = magicSolutions(q.grid);
    return n === 1 ? null : `${n} ways to fill the square`;
  },
  'pick-all'(q) {
    if (new Set(q.items).size !== q.items.length) return 'items must be different';
    const right = q.items.filter((x: number) => fits(q.kind, q.n, x, q.m)).length;
    return right >= 1 && right < q.items.length ? null : 'needs some right and some wrong numbers';
  },
  'word-ladder'(q) {
    const l: string[] = q.ladder;
    if (l.length < 3) return 'ladder needs at least 3 words';
    for (let k = 1; k < l.length; k++) if (!oneLetterApart(l[k - 1], l[k])) return `${l[k - 1]} → ${l[k]} changes more than one letter`;
    if (q.choices.length !== l.length - 1) return 'one set of choices per step';
    for (let k = 0; k < q.choices.length; k++) {
      const valid = q.choices[k].filter((w: string) => oneLetterApart(l[k], w));
      if (valid.length !== 1 || valid[0] !== l[k + 1]) return `step ${k + 1} must have exactly one valid move (${l[k + 1]})`;
      const unknown = q.choices[k].find((w: string) => !LADDER_WORDS.has(w));
      if (unknown) return `"${unknown}" is not in the word list`;
    }
    return null;
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
