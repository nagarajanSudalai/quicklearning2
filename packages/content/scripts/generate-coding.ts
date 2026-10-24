// Seeds the Coding banks for Grades 1–5: robot programs (sequences, debugging, loops, turning,
// functions) and code-tracing (loops, if/else, variables). Every grid puzzle stores a working
// program, and the checker runs it.
//   node scripts/generate-coding.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runGrid, traceAnswer } from '../src/coding.ts';
import type { CodeBlock, CodeOp, TraceStmt } from '../src/types.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'puzzles');
let seed = 20261901;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const int = (lo: number, hi: number) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = <T>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
const shuffle = <T>(xs: readonly T[]) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const levels = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3] as const;

type Cell = [number, number];
const DIRS = ['up', 'right', 'down', 'left'] as const;
const D: Record<string, Cell> = { up: [-1, 0], right: [0, 1], down: [1, 0], left: [0, -1] };

/** A path made of straight segments (lengths from `seg`), turning each time, staying on the grid. */
function pathOf(rows: number, cols: number, segs: number[], dirs?: (typeof DIRS)[number][]): { cells: Cell[]; moves: string[] } | null {
  for (let tries = 0; tries < 200; tries++) {
    let pos: Cell = [int(0, rows - 1), int(0, cols - 1)];
    const cells: Cell[] = [pos];
    const moves: string[] = [];
    let last = -1;
    let ok = true;
    for (let s = 0; s < segs.length && ok; s++) {
      const options = dirs ? [DIRS.indexOf(dirs[s])] : shuffle([0, 1, 2, 3]).filter((d) => last < 0 || d % 2 !== last % 2);
      const d = options.find((dd) => {
        for (let k = 1; k <= segs[s]; k++) {
          const r = pos[0] + D[DIRS[dd]][0] * k, c = pos[1] + D[DIRS[dd]][1] * k;
          if (r < 0 || c < 0 || r >= rows || c >= cols || cells.some(([a, b]) => a === r && b === c)) return false;
        }
        return true;
      });
      if (d === undefined) { ok = false; break; }
      for (let k = 0; k < segs[s]; k++) { pos = [pos[0] + D[DIRS[d]][0], pos[1] + D[DIRS[d]][1]]; cells.push(pos); moves.push(DIRS[d]); }
      last = d;
    }
    if (ok) return { cells, moves };
  }
  return null;
}

const arrows = (moves: string[], loops: boolean): CodeBlock[] => {
  const out: CodeBlock[] = [];
  for (const m of moves) {
    const last = out[out.length - 1];
    if (loops && last && last.op === m) last.times++;
    else out.push({ op: m as CodeOp, times: 1 });
  }
  return out;
};

/** Turn-and-move program for a robot that starts facing `facing`. */
function turns(moves: string[], facing: number): CodeBlock[] {
  const out: CodeBlock[] = [];
  let f = facing;
  for (const m of moves) {
    const d = DIRS.indexOf(m as never);
    const diff = (d - f + 4) % 4;
    if (diff === 1) out.push({ op: 'turnR', times: 1 });
    if (diff === 3) out.push({ op: 'turnL', times: 1 });
    if (diff === 2) out.push({ op: 'turnR', times: 2 });
    f = d;
    const last = out[out.length - 1];
    if (last && last.op === 'fwd') last.times++;
    else out.push({ op: 'fwd', times: 1 });
  }
  return out;
}

/** Walls on some of the free cells (never on the path), so the grid looks like a little world. */
const wallsFor = (rows: number, cols: number, path: Cell[], density: number): Cell[] => {
  const on = new Set(path.map((c) => c.join(',')));
  const free: Cell[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (!on.has(`${r},${c}`)) free.push([r, c]);
  return shuffle(free).slice(0, Math.round(free.length * density));
};

type Spec = { rows: number; segs: () => number[]; coins: number; walls: number; mode: 'build' | 'fix'; style: 'arrows' | 'loops' | 'turns' | 'fn'; extra: number };

function grid(topic: string, grade: number, i: number, d: number, spec: Spec, seen: Set<string>) {
  for (;;) {
    const { rows } = spec;
    let fn: CodeBlock[] | undefined;
    let p: ReturnType<typeof pathOf>;
    if (spec.style === 'fn') {
      const pat = pick([['right', 'up'], ['right', 'down'], ['down', 'right'], ['up', 'right'], ['right', 'right', 'down'], ['down', 'down', 'right'], ['left', 'down'], ['down', 'left']] as const);
      const k = d === 1 ? 2 : 3;
      if (d < 3 && pat.length === 3) continue;
      const seq = Array.from({ length: k }, () => pat).flat();
      // A path that repeats the pattern k times.
      const start: Cell = [int(0, rows - 1), int(0, rows - 1)];
      const cells: Cell[] = [start];
      let ok = true;
      for (const m of seq) { const [r, c] = cells[cells.length - 1]; const n: Cell = [r + D[m][0], c + D[m][1]]; if (n[0] < 0 || n[1] < 0 || n[0] >= rows || n[1] >= rows) { ok = false; break; } cells.push(n); }
      if (!ok) continue;
      p = { cells, moves: seq };
      fn = pat.map((op) => ({ op: op as CodeOp, times: 1 }));
    } else p = pathOf(rows, rows, spec.segs());
    if (!p) continue;
    const facing = spec.style === 'turns' ? (int(0, 3) as 0 | 1 | 2 | 3) : undefined;
    const solution: CodeBlock[] = spec.style === 'fn' ? [{ op: 'F', times: p.moves.length / fn!.length }]
      : spec.style === 'turns' ? turns(p.moves, facing!) : arrows(p.moves, spec.style === 'loops');
    if (spec.style === 'turns' && solution[0].op === 'fwd' && d > 1) continue;
    const inner = p.cells.slice(1, -1);
    if (inner.length < spec.coins) continue;
    const coins = shuffle(inner).slice(0, spec.coins);
    const walls = wallsFor(rows, rows, p.cells, spec.walls);
    const palette: CodeOp[] = spec.style === 'turns' ? ['fwd', 'turnL', 'turnR'] : spec.style === 'fn' ? ['up', 'down', 'left', 'right', 'F'] : ['up', 'down', 'left', 'right'];
    const payload = {
      rows, cols: rows, walls, start: p.cells[0], ...(facing !== undefined ? { facing } : {}), goal: p.cells[p.cells.length - 1], coins, palette,
      loops: spec.style !== 'arrows', ...(fn ? { fn } : {}), maxBlocks: solution.length + spec.extra, mode: spec.mode,
      solution,
    } as const;
    let program: CodeBlock[] | undefined;
    if (spec.mode === 'fix') {
      // Swap one block for a different arrow that makes the program fail.
      const k = int(0, solution.length - 1);
      const wrong = shuffle(['up', 'down', 'left', 'right'].filter((o) => o !== solution[k].op)).map((op) => solution.map((b, j) => (j === k ? { ...b, op: op as CodeOp } : b))).find((prog) => !runGrid({ ...payload, solution }, prog).ok);
      if (!wrong) continue;
      program = wrong;
    }
    const full = { ...payload, ...(program ? { program } : {}) };
    if (!runGrid(full, solution).ok) continue;
    const key = JSON.stringify([full.start, full.goal, p.moves]);
    if (seen.has(key)) continue;
    seen.add(key);
    const prompt = spec.mode === 'fix' ? 'One block is wrong. Tap it, pick the right arrow, then press Run.'
      : spec.style === 'fn' ? 'Use the F block to get the robot to the star.'
      : spec.style === 'loops' ? `Get the robot to the star using ${full.maxBlocks} blocks or fewer.`
      : spec.style === 'turns' ? 'Turn and move the robot to the star.'
      : full.coins.length ? 'Collect the coins and reach the star.' : 'Help the robot reach the star.';
    return { id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade, subject: 'coding', topic, difficulty: d, prompt, type: 'code-grid', payload: full };
  }
}

function trace(topic: string, grade: number, i: number, d: number, make: (d: number) => { program: TraceStmt[]; ask: { v: string } | { says: string }; prompt: string }, seen: Set<string>) {
  for (;;) {
    const { program, ask, prompt } = make(d);
    const answer = traceAnswer(program, ask);
    const key = JSON.stringify(program);
    if (seen.has(key) || answer < 0 || answer > 200) continue;
    seen.add(key);
    const wrong = shuffle([answer + 1, answer - 1, answer + 2, answer * 2, answer + 10].filter((x) => x >= 0 && x !== answer));
    const options = shuffle([answer, ...[...new Set(wrong)].slice(0, 2)]);
    return { id: `${topic}-${String(i + 1).padStart(2, '0')}`, grade, subject: 'coding', topic, difficulty: d, prompt, type: 'code-trace', payload: { program, ask }, options, answer };
  }
}

const WORDS = ['hello', 'jump', 'clap', 'beep', 'hop'];
type Made = { program: TraceStmt[]; ask: { v: string } | { says: string }; prompt: string };
const loopsTrace = (d: number): Made => {
  const w = pick(WORDS);
  if (d === 1) { const n = int(2, 6); return { program: [{ repeat: n, body: [{ say: w }] }], ask: { says: w }, prompt: `How many times does the robot say "${w}"?` }; }
  if (d === 2) { const a = int(2, 4), b = int(2, 4); return { program: [{ say: w }, { repeat: a, body: [{ say: w }] }, { repeat: b, body: [{ say: w }] }], ask: { says: w }, prompt: `How many times does the robot say "${w}"?` }; }
  const a = int(2, 4), b = int(2, 3); return { program: [{ repeat: a, body: [{ say: w }, { repeat: b, body: [{ say: w }] }] }], ask: { says: w }, prompt: `How many times does the robot say "${w}"?` };
};
const ifTrace = (d: number): Made => {
  const v = pick(['score', 'points', 'stars']);
  if (d === 1) {
    const s = int(1, 10), n = int(3, 8), a = int(1, 5), b = int(1, 5);
    return { program: [{ set: v, to: s }, { if: { v, op: pick(['>', '<'] as const), n }, then: [{ add: v, by: a }], else: [{ add: v, by: -b }] }], ask: { v }, prompt: `What is ${v} at the end?` };
  }
  if (d === 2) {
    const n = int(3, 6);
    return { program: [{ set: v, to: 0 }, { repeat: n, body: [{ add: v, by: int(2, 3) }] }, { if: { v, op: '>', n: int(6, 14) }, then: [{ say: 'yay' }], else: [{ say: 'hmm' }] }], ask: { says: pick(['yay', 'hmm']) }, prompt: 'How many times does the robot say the word in the question?' };
  }
  const n = int(3, 5), lim = int(3, 8);
  return { program: [{ set: v, to: 0 }, { repeat: n, body: [{ add: v, by: int(2, 4) }, { if: { v, op: '>', n: lim }, then: [{ add: v, by: -1 }] }] }], ask: { v }, prompt: `What is ${v} at the end?` };
};
const varTrace = (d: number): Made => {
  const v = pick(['coins', 'apples', 'steps', 'total']);
  if (d === 1) { const s = int(2, 9); return { program: [{ set: v, to: s }, { add: v, by: int(2, 6) }, { add: v, by: -int(1, s) }], ask: { v }, prompt: `What is ${v} at the end?` }; }
  if (d === 2) { return { program: [{ set: v, to: int(0, 5) }, { repeat: int(3, 6), body: [{ add: v, by: int(2, 5) }] }], ask: { v }, prompt: `What is ${v} at the end?` }; }
  const w = v === 'total' ? 'count' : 'total';
  return { program: [{ set: v, to: 0 }, { set: w, to: 1 }, { repeat: int(3, 4), body: [{ add: v, by: int(1, 3) }, { add: w, by: int(1, 2) }] }, { add: v, by: int(1, 5) }], ask: pick([{ v }, { v: w }]), prompt: 'What is the value asked for at the end?' };
};

const TOPICS: { grade: number; id: string; file: string; make: (i: number, d: number, seen: Set<string>) => object }[] = [
  { grade: 1, id: 'g1-code-steps', file: 'steps', make: (i, d, s) => grid('g1-code-steps', 1, i, d, { rows: 4, segs: () => (d === 1 ? [int(2, 3)] : d === 2 ? [int(1, 3), int(1, 2)] : [int(2, 3), int(1, 2), int(1, 2)]), coins: 0, walls: d === 1 ? 0 : 0.3, mode: 'build', style: 'arrows', extra: 2 }, s) },
  { grade: 1, id: 'g1-code-fix', file: 'fix', make: (i, d, s) => grid('g1-code-fix', 1, i, d, { rows: 4, segs: () => (d === 1 ? [int(2, 3)] : d === 2 ? [int(2, 3), int(1, 2)] : [int(2, 3), int(1, 2), int(1, 2)]), coins: 0, walls: 0.25, mode: 'fix', style: 'arrows', extra: 0 }, s) },
  { grade: 2, id: 'g2-code-coins', file: 'coins', make: (i, d, s) => grid('g2-code-coins', 2, i, d, { rows: 5, segs: () => (d === 1 ? [int(2, 3), int(1, 3)] : d === 2 ? [int(2, 3), int(2, 3), int(1, 2)] : [int(2, 3), int(2, 3), int(1, 3), int(1, 2)]), coins: d, walls: 0.3, mode: 'build', style: 'arrows', extra: 2 }, s) },
  { grade: 2, id: 'g2-code-fix', file: 'fix', make: (i, d, s) => grid('g2-code-fix', 2, i, d, { rows: 5, segs: () => (d === 1 ? [int(2, 3), int(1, 3)] : [int(2, 3), int(2, 3), int(1, 3)]), coins: d - 1, walls: 0.3, mode: 'fix', style: 'arrows', extra: 0 }, s) },
  { grade: 3, id: 'g3-code-loops', file: 'loops', make: (i, d, s) => grid('g3-code-loops', 3, i, d, { rows: 6, segs: () => (d === 1 ? [int(3, 5)] : d === 2 ? [int(3, 4), int(2, 4)] : [int(2, 4), int(2, 4), int(2, 3)]), coins: d === 3 ? 1 : 0, walls: 0.25, mode: 'build', style: 'loops', extra: 0 }, s) },
  { grade: 3, id: 'g3-code-trace', file: 'trace', make: (i, d, s) => trace('g3-code-trace', 3, i, d, loopsTrace, s) },
  { grade: 4, id: 'g4-code-turns', file: 'turns', make: (i, d, s) => grid('g4-code-turns', 4, i, d, { rows: 5, segs: () => (d === 1 ? [int(2, 4)] : d === 2 ? [int(2, 3), int(2, 3)] : [int(2, 3), int(2, 3), int(1, 3)]), coins: d === 3 ? 1 : 0, walls: 0.25, mode: 'build', style: 'turns', extra: 1 }, s) },
  { grade: 4, id: 'g4-code-if', file: 'if', make: (i, d, s) => trace('g4-code-if', 4, i, d, ifTrace, s) },
  { grade: 5, id: 'g5-code-functions', file: 'functions', make: (i, d, s) => grid('g5-code-functions', 5, i, d, { rows: 6, segs: () => [], coins: d === 3 ? 1 : 0, walls: 0.2, mode: 'build', style: 'fn', extra: 0 }, s) },
  { grade: 5, id: 'g5-code-variables', file: 'variables', make: (i, d, s) => trace('g5-code-variables', 5, i, d, varTrace, s) },
];

for (const t of TOPICS) {
  const seen = new Set<string>();
  const puzzles = levels.map((d, i) => t.make(i, d, seen));
  const dir = join(ROOT, `g${t.grade}-coding`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${t.file}.json`), JSON.stringify(puzzles, null, 2) + '\n');
  console.log(`g${t.grade}-coding/${t.file}: ${puzzles.length} puzzles`);
}
