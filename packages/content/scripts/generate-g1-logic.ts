// Seeds the Grade 1 Puzzles (odd one out, crosswords) and Thinking Skills (sorting,
// memory, mazes) banks. The JSON it writes is the source of truth: edit or add puzzles
// there by hand; re-running this script overwrites puzzles/g1-puzzles/ and puzzles/g1-thinking/.
//   node scripts/generate-g1-logic.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, oddCandidates, type Category } from '../src/categories.ts';
import { PICTURES } from '../src/words.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles');

let seed = 20261024;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const int = (lo: number, hi: number) => lo + Math.floor(rand() * (hi - lo + 1));
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
const base = (subject: string, topic: string, i: number, difficulty: number, prompt: string) => ({
  id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade: 1, subject, topic, difficulty, prompt,
});
const emojis = (c: Category, n: number) => shuffle(c.items).slice(0, n).map(([e]) => e);

function oddOneOut() {
  const multi = CATEGORIES.filter((c) => CATEGORIES.some((d) => d !== c && d.family === c.family));
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const group = pick(d === 1 ? CATEGORIES : multi);
      const others = CATEGORIES.filter((c) => c !== group && (d === 1 ? c.family !== group.family : c.family === group.family));
      const options = shuffle([...emojis(group, d === 3 ? 4 : 3), ...emojis(pick(others), 1)]);
      const answer = options.find((o) => !group.items.some(([e]) => e === o))!;
      // Reject sets where a different item could also be the odd one out.
      const valid = oddCandidates(options);
      if (valid.length === 1 && valid[0] === answer) {
        return { ...base('puzzles', 'g1-odd-one-out', i, d, 'Which one does not belong?'), type: 'odd-one-out', payload: { group: group.id }, options, answer };
      }
    }
  });
}

function crossword() {
  const words = Object.keys(PICTURES);
  const lens: Record<number, [number, number]> = { 1: [3, 3], 2: [3, 4], 3: [4, 5] };
  const used = new Set<string>();
  return levels([7, 7, 6]).map((d, i) => {
    for (;;) {
      const pool = words.filter((w) => w.length >= lens[d][0] && w.length <= lens[d][1]);
      const across = pick(pool);
      const down = pick(pool.filter((w) => w !== across));
      // Cross where a letter of `across` (index ci) equals a letter of `down` (index ri).
      const crossings: [number, number][] = [];
      for (let ci = 0; ci < across.length; ci++) for (let ri = 0; ri < down.length; ri++) if (across[ci] === down[ri]) crossings.push([ci, ri]);
      const key = [across, down].sort().join('+');
      if (!crossings.length || used.has(key)) continue;
      used.add(key);
      const [ci, ri] = pick(crossings);
      const cells = new Map<string, string>();
      for (let c = 0; c < across.length; c++) cells.set(`${ri},${c}`, across[c]);
      for (let r = 0; r < down.length; r++) cells.set(`${r},${ci}`, down[r]);
      const crossKey = `${ri},${ci}`;
      const nBlanks = d + 1;
      // Level 1–2 keep the shared square filled in as a hint.
      const candidates = [...cells.keys()].filter((k) => d === 3 || k !== crossKey);
      // At least one blank in each word.
      const inAcross = candidates.filter((k) => k.startsWith(`${ri},`));
      const inDown = candidates.filter((k) => k.endsWith(`,${ci}`));
      const chosen = new Set([pick(inAcross), pick(inDown)]);
      for (const k of shuffle(candidates)) if (chosen.size < nBlanks) chosen.add(k);
      const blanks = [...chosen].map((k) => k.split(',').map(Number) as [number, number]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const need = [...new Set(blanks.map(([r, c]) => cells.get(`${r},${c}`)!))];
      const extra = shuffle('abcdefghijklmnoprstuvwy'.split('').filter((l) => !need.includes(l))).slice(0, Math.max(0, d + 3 - need.length));
      return {
        ...base('puzzles', 'g1-crossword', i, d, 'Fill in the missing letters.'), type: 'crossword',
        payload: {
          words: [
            { word: across, picture: PICTURES[across], row: ri, col: 0, dir: 'across' },
            { word: down, picture: PICTURES[down], row: 0, col: ci, dir: 'down' },
          ],
          blanks,
          letters: shuffle([...need, ...extra]),
        },
      };
    }
  });
}

function sorting() {
  return levels([7, 7, 6]).map((d, i) => {
    let groups: Category[];
    if (d === 3) {
      const fam = pick(['animals', 'things']);
      groups = shuffle(CATEGORIES.filter((c) => c.family === fam)).slice(0, 3);
    } else {
      const a = pick(CATEGORIES);
      groups = [a, pick(CATEGORIES.filter((c) => (d === 1 ? c.family !== a.family : c !== a)))];
    }
    const per = d === 1 ? 2 : d === 2 ? 3 : 2;
    const items = shuffle(groups.flatMap((g) => shuffle(g.items).slice(0, per).map(([item, name]) => ({ item, name, group: g.id }))));
    return {
      ...base('thinking', 'g1-sorting', i, d, 'Put each one in the right group.'), type: 'sort-into-groups',
      payload: { groups: groups.map((g) => ({ id: g.id, label: g.label, picture: g.picture })), items },
    };
  });
}

function memory() {
  const all = CATEGORIES.flatMap((c) => c.items.map(([e]) => e));
  return levels([7, 7, 6]).map((d, i) => {
    const pairs = d === 1 ? 3 : d === 2 ? 4 : 6;
    const picks = shuffle(all).slice(0, pairs);
    return {
      ...base('thinking', 'g1-memory', i, d, 'Find the matching pairs.'), type: 'memory-match',
      payload: { cards: shuffle([...picks, ...picks]), cols: d === 1 ? 3 : 4 },
    };
  });
}

const HEROES = [
  { hero: '🐰', target: '🥕', prompt: 'Help the bunny get to the carrot.' },
  { hero: '🐶', target: '🦴', prompt: 'Help the puppy get to the bone.' },
  { hero: '🐭', target: '🧀', prompt: 'Help the mouse get to the cheese.' },
  { hero: '🐝', target: '🌸', prompt: 'Help the bee get to the flower.' },
  { hero: '🐵', target: '🍌', prompt: 'Help the monkey get to the banana.' },
];

/** A perfect maze (exactly one path between any two cells) by depth-first carving. */
function carve(rows: number, cols: number) {
  const cells = Array(rows * cols).fill(0);
  const seen = new Set<number>([0]);
  const stack = [0];
  const dirs = [[-1, 0, 1, 4], [0, 1, 2, 8], [1, 0, 4, 1], [0, -1, 8, 2]] as const;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const r = Math.floor(cur / cols), c = cur % cols;
    const next = shuffle(dirs).find(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      return nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen.has(nr * cols + nc);
    });
    if (!next) { stack.pop(); continue; }
    const [dr, dc, bit, back] = next;
    const n = (r + dr) * cols + (c + dc);
    cells[cur] |= bit;
    cells[n] |= back;
    seen.add(n);
    stack.push(n);
  }
  return cells;
}

function mazes() {
  return levels([7, 7, 6]).map((d, i) => {
    const size = d + 2;
    const h = HEROES[i % HEROES.length];
    const goal: [number, number] = d === 1 ? [size - 1, size - 1] : [size - 1, int(0, size - 1)];
    return {
      ...base('thinking', 'g1-mazes', i, d, h.prompt), type: 'maze',
      payload: { rows: size, cols: size, cells: carve(size, size), start: [0, 0], goal, hero: h.hero, target: h.target },
    };
  });
}

const banks: Record<string, Record<string, unknown[]>> = {
  'g1-puzzles': { 'odd-one-out': oddOneOut(), crossword: crossword() },
  'g1-thinking': { sorting: sorting(), memory: memory(), mazes: mazes() },
};
for (const [dir, files] of Object.entries(banks)) {
  mkdirSync(join(ROOT, dir), { recursive: true });
  for (const [name, puzzles] of Object.entries(files)) {
    writeFileSync(join(ROOT, dir, `${name}.json`), JSON.stringify(puzzles, null, 2) + '\n');
    console.log(`${dir}/${name}: ${puzzles.length} puzzles`);
  }
}
