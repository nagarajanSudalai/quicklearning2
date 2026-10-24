// The coding interpreter, shared by the app (to run a child's program) and the checker (to prove
// every puzzle can be solved). Two kinds of program: grid programs that move a robot, and short
// text programs (variables, loops, if/else) that children trace by hand.
import type { CodeBlock, CodeGridPuzzle, TraceStmt } from './types';

type Grid = CodeGridPuzzle['payload'];
export type Step = { pos: [number, number]; facing: number };
export type RunResult = { steps: Step[]; ok: boolean; problem: null | 'wall' | 'short' | 'coins' | 'blocks' | 'empty' };

const DELTA: Record<number, [number, number]> = { 0: [-1, 0], 1: [0, 1], 2: [1, 0], 3: [0, -1] };
const ARROW: Record<string, number> = { up: 0, right: 1, down: 2, left: 3 };

/** Number of blocks a program uses (a repeat block counts once; F counts once). */
export const blockCount = (program: CodeBlock[]) => program.length;

/** Every single move the program makes, with loops and the function expanded. */
export function expand(program: CodeBlock[], fn?: CodeBlock[]): CodeBlock['op'][] {
  return program.flatMap((b) => Array.from({ length: Math.max(1, b.times) }, () => (b.op === 'F' ? expand(fn ?? [], undefined) : [b.op])).flat());
}

/** Runs a grid program. The robot stops at the first wall or edge it would hit. */
export function runGrid(g: Grid, program: CodeBlock[]): RunResult {
  const walls = new Set(g.walls.map(([r, c]) => `${r},${c}`));
  let pos: [number, number] = [...g.start];
  let facing: number = g.facing ?? 0;
  const steps: Step[] = [{ pos, facing }];
  if (!program.length) return { steps, ok: false, problem: 'empty' };
  if (program.length > g.maxBlocks) return { steps, ok: false, problem: 'blocks' };
  const coins = new Set(g.coins.map(([r, c]) => `${r},${c}`));
  for (const op of expand(program, g.fn)) {
    if (op === 'turnL' || op === 'turnR') {
      facing = (facing + (op === 'turnL' ? 3 : 1)) % 4;
      steps.push({ pos, facing });
      continue;
    }
    const d = op === 'fwd' ? facing : ARROW[op];
    const next: [number, number] = [pos[0] + DELTA[d][0], pos[1] + DELTA[d][1]];
    if (next[0] < 0 || next[1] < 0 || next[0] >= g.rows || next[1] >= g.cols || walls.has(next.join(','))) return { steps, ok: false, problem: 'wall' };
    pos = next;
    if (op !== 'fwd') facing = d;
    coins.delete(pos.join(','));
    steps.push({ pos, facing });
  }
  const atGoal = pos[0] === g.goal[0] && pos[1] === g.goal[1];
  if (!atGoal) return { steps, ok: false, problem: 'short' };
  if (coins.size) return { steps, ok: false, problem: 'coins' };
  return { steps, ok: true, problem: null };
}

export const PROBLEM_TEXT: Record<Exclude<RunResult['problem'], null>, string> = {
  wall: 'Bump! The robot hit a wall.',
  short: 'The robot stopped before the star.',
  coins: 'Almost! Pick up every coin on the way.',
  blocks: 'Too many blocks — try using fewer.',
  empty: 'Add some blocks first.',
};

/** Runs a text program; returns the final variables and how many times each word was said. */
export function runTrace(program: TraceStmt[]) {
  const vars: Record<string, number> = {};
  const said: Record<string, number> = {};
  const exec = (stmts: TraceStmt[]) => {
    for (const s of stmts) {
      if ('set' in s) vars[s.set] = s.to;
      else if ('add' in s) vars[s.add] = (vars[s.add] ?? 0) + s.by;
      else if ('say' in s) said[s.say] = (said[s.say] ?? 0) + 1;
      else if ('repeat' in s) for (let i = 0; i < s.repeat; i++) exec(s.body);
      else {
        const v = vars[s.if.v] ?? 0;
        const yes = s.if.op === '>' ? v > s.if.n : s.if.op === '<' ? v < s.if.n : v === s.if.n;
        exec(yes ? s.then : s.else ?? []);
      }
    }
  };
  exec(program);
  return { vars, said };
}

/** The program as lines of text, Scratch-style, for showing and reading aloud. */
export function traceLines(program: TraceStmt[], depth = 0): { text: string; depth: number }[] {
  return program.flatMap((s) => {
    if ('set' in s) return [{ text: `set ${s.set} to ${s.to}`, depth }];
    if ('add' in s) return [{ text: s.by >= 0 ? `change ${s.add} by ${s.by}` : `change ${s.add} by ${s.by}`, depth }];
    if ('say' in s) return [{ text: `say "${s.say}"`, depth }];
    if ('repeat' in s) return [{ text: `repeat ${s.repeat} times`, depth }, ...traceLines(s.body, depth + 1)];
    return [
      { text: `if ${s.if.v} ${s.if.op} ${s.if.n} then`, depth },
      ...traceLines(s.then, depth + 1),
      ...(s.else ? [{ text: 'else', depth }, ...traceLines(s.else, depth + 1)] : []),
    ];
  });
}

export const traceAnswer = (program: TraceStmt[], ask: { v: string } | { says: string }) => {
  const r = runTrace(program);
  return 'v' in ask ? r.vars[ask.v] ?? 0 : r.said[ask.says] ?? 0;
};
