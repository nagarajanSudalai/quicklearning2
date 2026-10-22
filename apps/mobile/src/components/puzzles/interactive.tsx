import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { PHRASES, type BuildPuzzle, type CrosswordPuzzle, type SudokuPuzzle, type InteractivePuzzle, type InteractiveType, type MazePuzzle, type MemoryPuzzle, type SortPuzzle } from '@quickstep/content';
import { buzz, say } from '../../lib/feedback';
import { usePop, useWiggle } from '../../lib/motion';
import { colors, font } from '../../lib/theme';

export type PlayerProps<P extends InteractivePuzzle> = {
  puzzle: P;
  sound: boolean;
  /** Finished. `star` says whether the child earned a star. */
  onSolved: (star: boolean) => void;
  /** A wrong move; `message` replaces the default "Almost! Look again." */
  onMistake: (message?: string) => void;
};

type Players = { [T in InteractiveType]: (props: PlayerProps<Extract<InteractivePuzzle, { type: T }>>) => ReactNode };

/** Interactive puzzles: each type owns its play and reports back when it's solved. */
export const PLAYERS: Players = {
  crossword: Crossword,
  'sort-into-groups': Sorting,
  'memory-match': Memory,
  maze: Maze,
  build: Build,
  sudoku: Sudoku,
};

/** A tappable box that wiggles each time `wiggle` increments. */
function Tap({ onPress, wiggle = 0, style, label, disabled, children }: { onPress: () => void; wiggle?: number; style?: object; label: string; disabled?: boolean; children: ReactNode }) {
  const wig = useWiggle(wiggle);
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label}>
      <Animated.View style={[styles.tap, style, wig]}>{children}</Animated.View>
    </Pressable>
  );
}

// ---------- Picture crossword ----------

function Crossword({ puzzle, onSolved, onMistake }: PlayerProps<CrosswordPuzzle>) {
  const { words, blanks, letters } = puzzle.payload;
  const [filled, setFilled] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wiggle, setWiggle] = useState<{ letter: string; n: number }>({ letter: '', n: 0 });

  const { grid, rows, cols } = useMemo(() => {
    const g = new Map<string, string>();
    for (const w of words) for (let k = 0; k < w.word.length; k++) g.set(w.dir === 'across' ? `${w.row},${w.col + k}` : `${w.row + k},${w.col}`, w.word[k]);
    const keys = [...g.keys()].map((k) => k.split(',').map(Number));
    return { grid: g, rows: Math.max(...keys.map(([r]) => r)) + 1, cols: Math.max(...keys.map(([, c]) => c)) + 1 };
  }, [words]);

  const blankIndex = (r: number, c: number) => blanks.findIndex(([br, bc]) => br === r && bc === c);
  const done = filled >= blanks.length;

  const tapLetter = (l: string) => {
    if (done) return;
    const [r, c] = blanks[filled];
    if (grid.get(`${r},${c}`) === l) {
      buzz('right');
      setFilled(filled + 1);
      if (filled + 1 === blanks.length) onSolved(mistakes === 0);
    } else {
      buzz('wrong');
      setMistakes((m) => m + 1);
      setWiggle((w) => ({ letter: l, n: w.n + 1 }));
      onMistake();
    }
  };

  // One extra row and column for the picture clues (across clue on the left, down clue on top).
  const size = Math.min(48, Math.floor(290 / (cols + 1)));
  const clueAt = (r: number, c: number) => words.find((w) => (w.dir === 'across' ? w.row === r && w.col - 1 === c : w.col === c && w.row - 1 === r));

  return (
    <View style={{ gap: 16 }}>
      <View style={[styles.panel, { alignItems: 'center' }]}>
        {Array.from({ length: rows + 1 }, (_, ri) => (
          <View key={ri} style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
            {Array.from({ length: cols + 1 }, (_, ci) => {
              const r = ri - 1, c = ci - 1;
              const clue = clueAt(r, c);
              if (clue) {
                return (
                  <Pressable key={ci} onPress={() => say(clue.word, true)} accessibilityRole="button" accessibilityLabel={`Clue: ${clue.word}, ${clue.dir}`}
                    style={[styles.clue, { width: size, height: size }]}>
                    <Text style={{ fontSize: size * 0.55 }}>{clue.picture}</Text>
                    <Text style={styles.clueArrow}>{clue.dir === 'across' ? '→' : '↓'}</Text>
                  </Pressable>
                );
              }
              const letter = grid.get(`${r},${c}`);
              if (!letter) return <View key={ci} style={{ width: size, height: size }} />;
              const b = blankIndex(r, c);
              const shown = b === -1 || b < filled;
              const active = b === filled && !done;
              return (
                <View key={ci} style={[styles.cell, { width: size, height: size }, b !== -1 && styles.cellBlank, active && styles.cellActive, b !== -1 && b < filled && styles.cellDone]}>
                  {shown ? <Text style={[styles.cellText, { fontSize: size * 0.55 }]}>{letter}</Text> : null}
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.letterRow}>
        {letters.map((l) => (
          <Tap key={l} onPress={() => tapLetter(l)} wiggle={wiggle.letter === l ? wiggle.n : 0} label={l} disabled={done} style={styles.letterKey}>
            <Text style={styles.letterKeyText}>{l}</Text>
          </Tap>
        ))}
      </View>
    </View>
  );
}

// ---------- Sorting ----------

function Sorting({ puzzle, sound, onSolved, onMistake }: PlayerProps<SortPuzzle>) {
  const { groups, items } = puzzle.payload;
  const [i, setI] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wiggle, setWiggle] = useState<{ group: string; n: number }>({ group: '', n: 0 });
  const current = items[i];
  const pop = usePop(i);

  const drop = (group: string) => {
    if (!current) return;
    if (group === current.group) {
      buzz('right');
      setI(i + 1);
      if (i + 1 === items.length) onSolved(mistakes === 0);
    } else {
      buzz('wrong');
      setMistakes((m) => m + 1);
      setWiggle((w) => ({ group, n: w.n + 1 }));
      onMistake();
    }
  };

  return (
    <View style={{ gap: 14 }}>
      <View style={[styles.panel, { minHeight: 120 }]}>
        {current ? (
          <Pressable onPress={() => say(current.name, sound)} accessibilityRole="button" accessibilityLabel={`Item: ${current.name}`}>
            <Animated.View style={[{ alignItems: 'center' }, pop]}>
              <Text style={{ fontSize: 64, lineHeight: 78 }}>{current.item}</Text>
              <Text style={styles.itemName}>{current.name}</Text>
            </Animated.View>
          </Pressable>
        ) : (
          <Text style={styles.itemName}>All sorted! 🎉</Text>
        )}
      </View>
      <View style={styles.groupRow}>
        {groups.map((g) => (
          <View key={g.id} style={{ flex: 1 }}>
            <Tap onPress={() => drop(g.id)} wiggle={wiggle.group === g.id ? wiggle.n : 0} label={g.label} disabled={!current} style={styles.group}>
              <Text style={{ fontSize: 30 }}>{g.picture}</Text>
              <Text style={styles.groupLabel} numberOfLines={2}>{g.label}</Text>
              <View style={styles.groupItems}>
                {items.slice(0, i).filter((it) => it.group === g.id).map((it) => (
                  <Text key={it.item} style={{ fontSize: 22 }}>{it.item}</Text>
                ))}
              </View>
            </Tap>
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------- Memory pairs ----------

function Memory({ puzzle, sound, onSolved }: PlayerProps<MemoryPuzzle>) {
  const { cards, cols } = puzzle.payload;
  const pairs = cards.length / 2;
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [misses, setMisses] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const flip = (k: number) => {
    if (open.length === 2 || open.includes(k) || matched.has(k)) return;
    const next = [...open, k];
    setOpen(next);
    if (next.length < 2) return;
    const [a, b] = next;
    if (cards[a] === cards[b]) {
      buzz('right');
      const m = new Set(matched).add(a).add(b);
      setMatched(m);
      setOpen([]);
      if (m.size === cards.length) {
        // A star for finishing without many wrong guesses.
        onSolved(misses <= pairs);
      } else say(PHRASES.pair, sound);
    } else {
      setMisses((n) => n + 1);
      timer.current = setTimeout(() => setOpen([]), 900);
    }
  };

  const width = `${(100 - (cols - 1) * 3) / cols}%` as const;
  return (
    <View style={styles.memoryGrid}>
      {cards.map((c, k) => (
        <MemoryCard key={k} face={c} up={open.includes(k) || matched.has(k)} matched={matched.has(k)} onPress={() => flip(k)} width={width} index={k} />
      ))}
    </View>
  );
}

function MemoryCard({ face, up, matched, onPress, width, index }: { face: string; up: boolean; matched: boolean; onPress: () => void; width: `${number}%`; index: number }) {
  const pop = usePop(up ? 'up' : 'down');
  return (
    <Pressable onPress={onPress} style={{ width }} testID={`card-${index}`} accessibilityRole="button" accessibilityLabel={up ? face : `Card ${index + 1}`} disabled={matched}>
      <Animated.View style={[styles.card, up ? styles.cardUp : styles.cardDown, matched && styles.cardMatched, pop]}>
        <Text style={up ? { fontSize: 36 } : styles.cardBack}>{up ? face : '?'}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ---------- Spell it / Make a sentence ----------

function Build({ puzzle, sound, onSolved, onMistake }: PlayerProps<BuildPuzzle>) {
  const { answer, tiles, picture, say: line, joiner } = puzzle.payload;
  const [used, setUsed] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wiggle, setWiggle] = useState<{ k: number; n: number }>({ k: -1, n: 0 });
  const done = used.length === answer.length;
  const words = joiner === ' ';

  const tap = (k: number) => {
    if (done || used.includes(k)) return;
    if (tiles[k] === answer[used.length]) {
      buzz('right');
      const next = [...used, k];
      setUsed(next);
      if (next.length === answer.length) {
        say(line, sound);
        onSolved(mistakes === 0);
      }
    } else {
      buzz('wrong');
      setMistakes((m) => m + 1);
      setWiggle((w) => ({ k, n: w.n + 1 }));
      onMistake();
    }
  };

  return (
    <View style={{ gap: 14 }}>
      <Pressable onPress={() => say(line, true)} accessibilityRole="button" accessibilityLabel={words ? 'Hear the sentence' : `Hear the word ${line}`}>
        <View style={styles.panel}>
          <Text style={{ fontSize: 60, lineHeight: 74 }}>{picture}</Text>
          <Text style={styles.hint}>🔈 tap to hear</Text>
        </View>
      </Pressable>
      <View style={styles.slots}>
        {answer.map((_, s) => (
          <View key={s} style={[words ? styles.wordSlot : styles.letterSlot, s < used.length && styles.slotDone, s === used.length && !done && styles.slotActive]}>
            <Text style={words ? styles.wordSlotText : styles.letterKeyText}>{s < used.length ? tiles[used[s]] : ''}</Text>
          </View>
        ))}
      </View>
      <View style={styles.letterRow}>
        {tiles.map((t, k) =>
          used.includes(k) ? (
            <View key={k} style={[words ? styles.wordTile : styles.letterKey, styles.tileGone]} />
          ) : (
            <Tap key={k} onPress={() => tap(k)} wiggle={wiggle.k === k ? wiggle.n : 0} label={t} disabled={done} style={words ? styles.wordTile : styles.letterKey}>
              <Text style={words ? styles.wordSlotText : styles.letterKeyText}>{t}</Text>
            </Tap>
          ),
        )}
      </View>
    </View>
  );
}

// ---------- Picture sudoku ----------

function Sudoku({ puzzle, onSolved, onMistake }: PlayerProps<SudokuPuzzle>) {
  const { symbols, grid: start, solution } = puzzle.payload;
  const [grid, setGrid] = useState(start);
  const [sel, setSel] = useState(() => start.indexOf(null));
  const [mistakes, setMistakes] = useState(0);
  const [wiggle, setWiggle] = useState<{ v: number; n: number }>({ v: -1, n: 0 });
  const done = !grid.includes(null);

  const place = (v: number) => {
    if (done || sel === -1) return;
    if (solution[sel] !== v) {
      buzz('wrong');
      setMistakes((m) => m + 1);
      setWiggle((w) => ({ v, n: w.n + 1 }));
      onMistake();
      return;
    }
    buzz('right');
    const g = [...grid];
    g[sel] = v;
    setGrid(g);
    // Move to the next empty square, wrapping round.
    const next = [...g.keys()].map((k) => (sel + 1 + k) % 16).find((k) => g[k] === null) ?? -1;
    setSel(next);
    if (next === -1) onSolved(mistakes === 0);
  };

  const size = 62;
  return (
    <View style={{ gap: 14, alignItems: 'center' }}>
      <View style={styles.sudoku}>
        {Array.from({ length: 4 }, (_, r) => (
          <View key={r} style={{ flexDirection: 'row' }}>
            {Array.from({ length: 4 }, (_, c) => {
              const k = r * 4 + c, v = grid[k], given = start[k] !== null;
              return (
                <Pressable key={c} onPress={() => !given && v === null && setSel(k)} accessibilityRole="button"
                  accessibilityLabel={v !== null ? symbols[v] : `Empty square, row ${r + 1}, column ${c + 1}`}
                  style={[styles.sCell, { width: size, height: size, borderRightWidth: c === 1 ? 3 : c === 3 ? 0 : 1, borderBottomWidth: r === 1 ? 3 : r === 3 ? 0 : 1 },
                    given && styles.sGiven, !given && v !== null && styles.cellDone, sel === k && styles.cellActive]}>
                  <Text style={{ fontSize: 32 }}>{v !== null ? symbols[v] : ''}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.letterRow}>
        {symbols.map((s, v) => (
          <Tap key={v} onPress={() => place(v)} wiggle={wiggle.v === v ? wiggle.n : 0} label={`Place ${s}`} disabled={done} style={styles.letterKey}>
            <Text style={{ fontSize: 30 }}>{s}</Text>
          </Tap>
        ))}
      </View>
    </View>
  );
}

// ---------- Maze ----------

const MOVES = { up: [-1, 0, 1], right: [0, 1, 2], down: [1, 0, 4], left: [0, -1, 8] } as const;
type Dir = keyof typeof MOVES;

function Maze({ puzzle, sound, onSolved, onMistake }: PlayerProps<MazePuzzle>) {
  const { rows, cols, cells, start, goal, hero, target } = puzzle.payload;
  const [pos, setPos] = useState<[number, number]>(start);
  const [trail, setTrail] = useState<Set<string>>(new Set([start.join(',')]));
  const [bumps, setBumps] = useState(0);
  const [wiggle, setWiggle] = useState(0);
  const [done, setDone] = useState(false);
  const wig = useWiggle(wiggle);

  const move = (d: Dir) => {
    if (done) return;
    const [dr, dc, bit] = MOVES[d];
    if (!(cells[pos[0] * cols + pos[1]] & bit)) {
      buzz('wrong');
      setBumps((b) => b + 1);
      setWiggle((w) => w + 1);
      say(PHRASES.wall, sound);
      onMistake('Oops, a wall!');
      return;
    }
    const next: [number, number] = [pos[0] + dr, pos[1] + dc];
    setPos(next);
    setTrail((t) => new Set(t).add(next.join(',')));
    if (next[0] === goal[0] && next[1] === goal[1]) {
      setDone(true);
      buzz('right');
      // Allow a couple of bumps — small hands miss.
      onSolved(bumps <= 2);
    }
  };

  // Arrow keys on web and hardware keyboards.
  const moveRef = useRef(move);
  moveRef.current = move;
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      const d = ({ ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left' } as Record<string, Dir>)[e.key];
      if (d) { e.preventDefault(); moveRef.current(d); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /** Tap a neighbouring cell to step into it. */
  const tapCell = (r: number, c: number) => {
    const d = (Object.keys(MOVES) as Dir[]).find((k) => pos[0] + MOVES[k][0] === r && pos[1] + MOVES[k][1] === c);
    if (d) move(d);
  };

  const size = Math.floor(296 / cols);
  const wall = 3;
  return (
    <View style={{ gap: 14, alignItems: 'center' }}>
      <View style={[styles.maze, { width: size * cols, height: size * rows }]} accessibilityLabel={`Maze, ${rows} by ${cols}`}>
        {Array.from({ length: rows }, (_, r) => (
          <View key={r} style={{ flexDirection: 'row' }}>
            {Array.from({ length: cols }, (_, c) => {
              const open = cells[r * cols + c];
              const here = pos[0] === r && pos[1] === c;
              const isGoal = goal[0] === r && goal[1] === c;
              return (
                <Pressable key={c} onPress={() => tapCell(r, c)} accessibilityLabel={here ? hero : isGoal ? target : undefined}
                  style={{
                    width: size, height: size, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: trail.has(`${r},${c}`) ? colors.brandTint : colors.surface,
                    borderTopWidth: open & 1 ? 0 : wall, borderLeftWidth: open & 8 ? 0 : wall,
                    borderRightWidth: c === cols - 1 && !(open & 2) ? wall : 0, borderBottomWidth: r === rows - 1 && !(open & 4) ? wall : 0,
                    borderColor: colors.ink,
                  }}>
                  {here ? <Animated.Text style={[{ fontSize: size * 0.6 }, wig]}>{hero}</Animated.Text> : isGoal ? <Text style={{ fontSize: size * 0.55 }}>{target}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.pad}>
        <Arrow dir="up" onPress={move} />
        <View style={{ flexDirection: 'row', gap: 56 }}>
          <Arrow dir="left" onPress={move} />
          <Arrow dir="right" onPress={move} />
        </View>
        <Arrow dir="down" onPress={move} />
      </View>
    </View>
  );
}

function Arrow({ dir, onPress }: { dir: Dir; onPress: (d: Dir) => void }) {
  const glyph = { up: '↑', right: '→', down: '↓', left: '←' }[dir];
  return (
    <Pressable onPress={() => onPress(dir)} accessibilityRole="button" accessibilityLabel={`Move ${dir}`} hitSlop={6}>
      {({ pressed }) => (
        <View style={[styles.arrow, { transform: [{ translateY: pressed ? 3 : 0 }], boxShadow: `0 ${pressed ? 1 : 4}px 0 ${colors.brandDark}` }]}>
          <Text style={styles.arrowText}>{glyph}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: colors.panel, borderRadius: 18, padding: 14, alignItems: 'center', justifyContent: 'center' },
  tap: { borderRadius: 16, borderWidth: 3, borderColor: colors.choiceBorder, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 0 ${colors.choiceBorder}` },
  clue: { alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: colors.surface },
  clueArrow: { position: 'absolute', right: 2, bottom: 0, fontFamily: font.bodyHeavy, fontSize: 12, color: colors.brand },
  cell: { borderRadius: 8, borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  cellBlank: { borderStyle: 'dashed', borderColor: colors.blank, backgroundColor: '#fff' },
  cellActive: { borderStyle: 'solid', borderColor: colors.brand, borderWidth: 3, backgroundColor: colors.brandTint },
  cellDone: { borderStyle: 'solid', borderColor: colors.right, backgroundColor: colors.rightTint },
  cellText: { fontFamily: font.display, color: colors.ink },
  letterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  letterKey: { width: 56, height: 60 },
  letterKeyText: { fontFamily: font.display, fontSize: 30, color: colors.ink },
  sudoku: { borderWidth: 3, borderColor: colors.ink, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.surface },
  sCell: { alignItems: 'center', justifyContent: 'center', borderColor: colors.ink },
  sGiven: { backgroundColor: colors.panel },
  hint: { fontFamily: font.bodyBold, fontSize: 12, color: colors.muted },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  letterSlot: { width: 46, height: 52, borderRadius: 10, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.blank, alignItems: 'center', justifyContent: 'center' },
  wordSlot: { minWidth: 56, height: 44, paddingHorizontal: 8, borderRadius: 10, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.blank, alignItems: 'center', justifyContent: 'center' },
  slotActive: { borderStyle: 'solid', borderColor: colors.brand, backgroundColor: colors.brandTint },
  slotDone: { borderStyle: 'solid', borderColor: colors.right, backgroundColor: colors.rightTint },
  wordTile: { minWidth: 64, height: 50, paddingHorizontal: 10 },
  wordSlotText: { fontFamily: font.displaySemi, fontSize: 20, color: colors.ink },
  tileGone: { opacity: 0.25, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.choiceBorder, borderRadius: 16 },
  itemName: { fontFamily: font.displaySemi, fontSize: 20, color: colors.ink, textAlign: 'center' },
  groupRow: { flexDirection: 'row', gap: 10 },
  group: { padding: 8, minHeight: 130, justifyContent: 'flex-start', gap: 2 },
  groupLabel: { fontFamily: font.bodyHeavy, fontSize: 14, color: colors.inkSoft, textAlign: 'center' },
  groupItems: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 2, marginTop: 4 },
  memoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  card: { aspectRatio: 0.85, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  cardDown: { backgroundColor: colors.brand, borderColor: colors.brandDark, boxShadow: `0 4px 0 ${colors.brandDark}` },
  cardUp: { backgroundColor: colors.surface, borderColor: colors.choiceBorder },
  cardMatched: { backgroundColor: colors.rightTint, borderColor: colors.right },
  cardBack: { fontFamily: font.display, fontSize: 28, color: 'rgba(255,255,255,.85)' },
  maze: { backgroundColor: colors.surface, borderRadius: 6, overflow: 'hidden' },
  pad: { alignItems: 'center', gap: 6 },
  arrow: { width: 60, height: 52, borderRadius: 14, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  arrowText: { fontFamily: font.bodyHeavy, fontSize: 26, color: '#fff' },
});
