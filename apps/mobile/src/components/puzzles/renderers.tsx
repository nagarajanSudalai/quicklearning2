import type { ReactNode } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { Puzzle, PuzzleOption, PuzzleType } from '@quickstep/content';
import { colors, font } from '../../lib/theme';
import { usePop } from '../../lib/motion';
import { Shape } from '../Shape';

/**
 * One entry per puzzle type: what to show above the answers, how to draw one
 * answer option, and how many option columns. Adding a puzzle type = adding an entry here.
 */
type Renderer<P extends Puzzle> = {
  Stimulus?: (props: { puzzle: P }) => ReactNode;
  option: (opt: P['options'][number], puzzle: P) => ReactNode;
  columns: (puzzle: P) => number;
  optionHeight?: number;
};
type Renderers = { [T in PuzzleType]: Renderer<Extract<Puzzle, { type: T }>> };

/** Wraps emoji in rows so a child can count them; big counts get smaller emoji. */
export function EmojiGroup({ item, count, size }: { item: string; count: number; size?: number }) {
  const s = size ?? (count > 10 ? 26 : count > 5 ? 32 : 40);
  return (
    <View style={styles.emojiWrap} accessibilityLabel={`${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <Text key={i} style={{ fontSize: s, lineHeight: s * 1.25 }}>{item}</Text>
      ))}
    </View>
  );
}

function PopShape({ kind, index, round, size }: { kind: Parameters<typeof Shape>[0]['kind']; index: number; round: string; size: number }) {
  const pop = usePop(round, index * 70);
  return (
    <Animated.View style={pop}>
      <Shape kind={kind} size={size} />
    </Animated.View>
  );
}

const Number = ({ n }: { n: PuzzleOption }) => <Text style={styles.number}>{String(n)}</Text>;

export const RENDERERS: Renderers = {
  pattern: {
    Stimulus: ({ puzzle }) => {
      // Keep the whole sequence plus the blank on one row on a phone.
      const size = puzzle.payload.seq.length >= 6 ? 34 : 38;
      return (
        <View style={[styles.panel, { gap: 8, flexWrap: 'nowrap' }]}>
          {puzzle.payload.seq.map((k, i) => <PopShape key={i} kind={k} index={i} round={puzzle.id} size={size} />)}
          <View style={[styles.blank, { width: size, height: size }]}><Text style={styles.blankText}>?</Text></View>
        </View>
      );
    },
    option: (k) => <Shape kind={k} size={48} />,
    columns: () => 3,
  },
  'count-objects': {
    Stimulus: ({ puzzle }) => (
      <View style={styles.panel}>
        <EmojiGroup item={puzzle.payload.item} count={puzzle.payload.count} />
      </View>
    ),
    option: (n) => <Number n={n} />,
    columns: () => 3,
  },
  arithmetic: {
    Stimulus: ({ puzzle }) => {
      const { a, b, op, item } = puzzle.payload;
      return (
        <View style={[styles.panel, { flexDirection: 'column', flexWrap: 'nowrap', gap: 12 }]}>
          {item && (
            <View style={styles.sumRow}>
              <View style={styles.sumSide}><EmojiGroup item={item} count={a} size={28} /></View>
              <Text style={styles.op}>{op === '+' ? '+' : '−'}</Text>
              <View style={[styles.sumSide, op === '-' && { opacity: 0.35 }]}><EmojiGroup item={item} count={b} size={28} /></View>
            </View>
          )}
          <Text style={styles.equation}>{a} {op === '+' ? '+' : '−'} {b} = ?</Text>
        </View>
      );
    },
    option: (n) => <Number n={n} />,
    columns: () => 3,
  },
  'shape-match': {
    option: (k) => <Shape kind={k} size={64} />,
    columns: (p) => (p.options.length === 4 ? 2 : 3),
    optionHeight: 110,
  },
  compare: {
    option: (side, p) => <EmojiGroup item={p.payload[side].item} count={p.payload[side].count} size={28} />,
    columns: () => 2,
    optionHeight: 190,
  },
  'letter-match': {
    Stimulus: ({ puzzle }) => (
      <View style={styles.panel}>
        <Text style={styles.bigLetter}>{puzzle.payload.upper}</Text>
      </View>
    ),
    option: (l) => <Text style={styles.letter}>{l}</Text>,
    columns: (p) => (p.options.length === 4 ? 2 : 3),
  },
  'first-letter': {
    Stimulus: ({ puzzle }) => <Picture picture={puzzle.payload.picture} word={puzzle.payload.word} />,
    option: (l) => <Text style={styles.letter}>{l}</Text>,
    columns: (p) => (p.options.length === 4 ? 2 : 3),
  },
  'picture-word': {
    Stimulus: ({ puzzle }) => {
      const { picture, word, blank } = puzzle.payload;
      if (blank === undefined) return <Picture picture={picture} />;
      return (
        <Picture picture={picture}>
          <View style={styles.spelled}>
            {word.split('').map((ch, i) =>
              i === blank ? (
                <View key={i} style={[styles.blank, styles.letterBlank]}><Text style={styles.blankText}>?</Text></View>
              ) : (
                <Text key={i} style={styles.spelledLetter}>{ch}</Text>
              ),
            )}
          </View>
        </Picture>
      );
    },
    option: (w) => <Text style={w.length > 1 ? styles.word : styles.letter} adjustsFontSizeToFit numberOfLines={1}>{w}</Text>,
    columns: () => 3,
  },
  rhyme: {
    Stimulus: ({ puzzle }) => <Picture picture={puzzle.payload.picture} word={puzzle.payload.word} />,
    option: (w, p) => (
      <View style={styles.wordCard}>
        <Text style={styles.optionPicture}>{p.payload.pictures[w]}</Text>
        <Text style={styles.wordSmall} adjustsFontSizeToFit numberOfLines={1}>{w}</Text>
      </View>
    ),
    columns: (p) => (p.options.length === 4 ? 2 : 3),
    optionHeight: 120,
  },
};

/** A big picture, with an optional word or spelled-out word under it. */
function Picture({ picture, word, children }: { picture: string; word?: string; children?: ReactNode }) {
  return (
    <View style={[styles.panel, styles.pictureBox]}>
      <Text style={styles.picture}>{picture}</Text>
      {word && <Text style={styles.pictureWord}>{word}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, backgroundColor: colors.panel, borderRadius: 18, padding: 16, justifyContent: 'center', alignItems: 'center', minHeight: 90 },
  blank: { borderRadius: 12, borderWidth: 3, borderStyle: 'dashed', borderColor: colors.blank, alignItems: 'center', justifyContent: 'center' },
  blankText: { fontFamily: font.displaySemi, fontSize: 24, color: colors.blank },
  emojiWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4, maxWidth: 300 },
  number: { fontFamily: font.display, fontSize: 36, color: colors.ink },
  sumRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' },
  sumSide: { flex: 1, alignItems: 'center' },
  op: { fontFamily: font.display, fontSize: 30, color: colors.brand },
  equation: { fontFamily: font.display, fontSize: 40, color: colors.ink, textAlign: 'center' },
  bigLetter: { fontFamily: font.display, fontSize: 96, lineHeight: 110, color: colors.brand },
  letter: { fontFamily: font.display, fontSize: 48, lineHeight: 58, color: colors.ink },
  pictureBox: { flexDirection: 'column', flexWrap: 'nowrap', gap: 6 },
  picture: { fontSize: 72, lineHeight: 88, textAlign: 'center' },
  pictureWord: { fontFamily: font.display, fontSize: 32, color: colors.ink },
  spelled: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  spelledLetter: { fontFamily: font.display, fontSize: 40, color: colors.ink, width: 34, textAlign: 'center' },
  letterBlank: { width: 38, height: 46 },
  word: { fontFamily: font.display, fontSize: 26, color: colors.ink },
  wordCard: { alignItems: 'center', gap: 2, width: '100%' },
  optionPicture: { fontSize: 44, lineHeight: 54 },
  wordSmall: { fontFamily: font.displaySemi, fontSize: 20, color: colors.ink },
});
