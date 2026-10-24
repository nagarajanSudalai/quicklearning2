import { PROBLEM_TEXT, runGrid, type CodeBlock, type CodeGridPuzzle, type CodeOp } from '@quickstep/content';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { buzz, say } from '../../lib/feedback';
import { colors, font } from '../../lib/theme';
import type { PlayerProps } from '../puzzles/interactive';

const ICON: Record<CodeOp, string> = { up: '↑', down: '↓', left: '←', right: '→', fwd: '⬆ Go', turnL: '↺ Left', turnR: '↻ Right', F: 'F' };
const NAME: Record<CodeOp, string> = { up: 'up', down: 'down', left: 'left', right: 'right', fwd: 'forward', turnL: 'turn left', turnR: 'turn right', F: 'function F' };
const FACE = ['▲', '▶', '▼', '◀'];

/** Build a program from blocks, press Run, and watch the robot follow it. */
export function CodeGrid({ puzzle, sound, onSolved, onMistake }: PlayerProps<CodeGridPuzzle>) {
  const g = puzzle.payload;
  const [program, setProgram] = useState<CodeBlock[]>(() => (g.program ?? []).map((b) => ({ ...b })));
  const [sel, setSel] = useState<number | null>(null);
  const [robot, setRobot] = useState<{ pos: [number, number]; facing: number }>({ pos: g.start, facing: g.facing ?? 0 });
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [fails, setFails] = useState(0);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const locked = running || done;
  const fix = g.mode === 'fix';

  const tapPalette = (op: CodeOp) => {
    if (locked) return;
    if (sel !== null) { setProgram((p) => p.map((b, k) => (k === sel ? { ...b, op } : b))); setSel(null); return; }
    if (fix || program.length >= g.maxBlocks) { onMistake(fix ? 'Tap the block you want to change first.' : `You can use up to ${g.maxBlocks} blocks.`); return; }
    setProgram((p) => [...p, { op, times: 1 }]);
  };
  const more = () => {
    if (locked || !g.loops) return;
    const k = sel ?? program.length - 1;
    if (k < 0) return;
    setProgram((p) => p.map((b, j) => (j === k ? { ...b, times: b.times >= 6 ? 1 : b.times + 1 } : b)));
  };
  const remove = () => {
    if (locked || fix) return;
    const k = sel ?? program.length - 1;
    if (k < 0) return;
    setProgram((p) => p.filter((_, j) => j !== k));
    setSel(null);
  };

  const run = () => {
    if (locked) return;
    const result = runGrid(g, program);
    setSel(null);
    setVisited(new Set());
    if (result.problem === 'empty' || result.problem === 'blocks') { buzz('wrong'); onMistake(PROBLEM_TEXT[result.problem]); return; }
    setRunning(true);
    let k = 0;
    timer.current = setInterval(() => {
      const s = result.steps[k];
      setRobot({ pos: s.pos, facing: s.facing });
      setVisited((v) => new Set(v).add(s.pos.join(',')));
      k++;
      if (k < result.steps.length) return;
      clearInterval(timer.current!);
      setRunning(false);
      if (result.ok) {
        setDone(true);
        buzz('right');
        onSolved(fails === 0);
      } else {
        setFails((f) => f + 1);
        buzz('wrong');
        say(PROBLEM_TEXT[result.problem!], sound);
        onMistake(PROBLEM_TEXT[result.problem!]);
        // Back to the start for the next try.
        setTimeout(() => { setRobot({ pos: g.start, facing: g.facing ?? 0 }); setVisited(new Set()); }, 900);
      }
    }, 380);
  };

  const size = Math.min(56, Math.floor(300 / g.cols));
  const walls = new Set(g.walls.map((w) => w.join(',')));
  const coins = new Set(g.coins.map((c) => c.join(',')));

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.board} accessibilityLabel={`Grid ${g.rows} by ${g.cols}. Robot at row ${robot.pos[0] + 1}, column ${robot.pos[1] + 1}.`}>
        {Array.from({ length: g.rows }, (_, r) => (
          <View key={r} style={{ flexDirection: 'row' }}>
            {Array.from({ length: g.cols }, (_, c) => {
              const key = `${r},${c}`;
              const here = robot.pos[0] === r && robot.pos[1] === c;
              const isGoal = g.goal[0] === r && g.goal[1] === c;
              return (
                <View key={c} style={[styles.cell, { width: size, height: size }, walls.has(key) && styles.wall, visited.has(key) && !walls.has(key) && styles.trail]}>
                  {here ? (
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: size * 0.5 }}>🤖</Text>
                      {g.facing !== undefined && <Text style={styles.face}>{FACE[robot.facing]}</Text>}
                    </View>
                  ) : isGoal ? <Text style={{ fontSize: size * 0.5 }}>⭐</Text>
                    : coins.has(key) && !visited.has(key) ? <Text style={{ fontSize: size * 0.42 }}>🪙</Text>
                    : walls.has(key) ? <Text style={{ fontSize: size * 0.42 }}>🧱</Text> : null}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {g.fn && (
        <View style={styles.fnRow}>
          <Text style={styles.fnLabel}>F =</Text>
          {g.fn.map((b, k) => <View key={k} style={[styles.block, styles.blockSmall]}><Text style={styles.blockText}>{ICON[b.op]}</Text></View>)}
        </View>
      )}

      <View style={styles.programBox} accessibilityLabel="Your program">
        <Text style={styles.small}>{fix ? 'Program (tap the wrong block)' : `Program · ${program.length}/${g.maxBlocks} blocks`}</Text>
        <View style={styles.program}>
          {program.length === 0 && <Text style={styles.hint}>Tap the blocks below to build your program.</Text>}
          {program.map((b, k) => (
            <Pressable key={k} onPress={() => !locked && setSel(sel === k ? null : k)} accessibilityRole="button" accessibilityLabel={`Block ${k + 1}: ${NAME[b.op]}${b.times > 1 ? ` ${b.times} times` : ''}`}
              style={[styles.block, sel === k && styles.blockSel]}>
              <Text style={styles.blockText}>{ICON[b.op]}{b.times > 1 ? ` ×${b.times}` : ''}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.palette}>
        {g.palette.map((op) => (
          <Pressable key={op} onPress={() => tapPalette(op)} accessibilityRole="button" accessibilityLabel={`Add ${NAME[op]}`} style={[styles.key, op === 'F' && styles.keyF]} disabled={locked}>
            <Text style={styles.keyText}>{ICON[op]}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.palette}>
        {g.loops && <Pressable onPress={more} accessibilityRole="button" accessibilityLabel="Repeat block" style={[styles.key, styles.keyTool]} disabled={locked}><Text style={styles.keyText}>🔁 ×</Text></Pressable>}
        {!fix && <Pressable onPress={remove} accessibilityRole="button" accessibilityLabel="Delete block" style={[styles.key, styles.keyTool]} disabled={locked}><Text style={styles.keyText}>⌫</Text></Pressable>}
        <Pressable onPress={run} accessibilityRole="button" accessibilityLabel="Run" style={[styles.key, styles.run, locked && { opacity: 0.6 }]} disabled={locked}>
          <Text style={[styles.keyText, { color: '#fff' }]}>▶ Run</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: { alignSelf: 'center', borderRadius: 14, overflow: 'hidden', borderWidth: 3, borderColor: colors.ink, backgroundColor: '#fff' },
  cell: { borderWidth: 0.5, borderColor: colors.choiceBorder, alignItems: 'center', justifyContent: 'center' },
  wall: { backgroundColor: '#e9e3d8' },
  trail: { backgroundColor: colors.rightTint },
  face: { position: 'absolute', bottom: -10, fontSize: 11, color: colors.brand },
  fnRow: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center' },
  fnLabel: { fontFamily: font.display, fontSize: 20, color: colors.brandDeep },
  programBox: { backgroundColor: colors.panel, borderRadius: 16, padding: 10, gap: 6 },
  program: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, minHeight: 44 },
  small: { fontFamily: font.bodyHeavy, fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  hint: { fontFamily: font.body, fontSize: 14, color: colors.muted, paddingVertical: 10 },
  block: { minWidth: 44, height: 44, paddingHorizontal: 8, borderRadius: 10, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  blockSmall: { minWidth: 34, height: 34 },
  blockSel: { backgroundColor: colors.orange, transform: [{ scale: 1.08 }] },
  blockText: { fontFamily: font.display, fontSize: 18, color: '#fff' },
  palette: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  key: { minWidth: 56, height: 52, paddingHorizontal: 12, borderRadius: 14, borderWidth: 2, borderColor: colors.choiceBorder, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  keyF: { borderColor: colors.green, backgroundColor: colors.rightTint },
  keyTool: { backgroundColor: colors.panel },
  keyText: { fontFamily: font.display, fontSize: 20, color: colors.ink },
  run: { backgroundColor: colors.green, borderColor: colors.green, minWidth: 110 },
});
