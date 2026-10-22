import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Puzzle, PuzzleOption } from '@quickstep/content';
import { buzz, say } from '../../lib/feedback';
import { usePop, useWiggle } from '../../lib/motion';
import { colors, font, text } from '../../lib/theme';
import { RENDERERS } from './renderers';

type Props = {
  puzzle: Puzzle;
  sound: boolean;
  /** Called once, when the child finds the right answer. */
  onSolved: (firstTry: boolean) => void;
};

/**
 * Plays one puzzle of any type. A wrong pick wiggles and can be retried;
 * a star is only earned when the first pick is right.
 */
export function PuzzlePlayer({ puzzle, sound, onSolved }: Props) {
  // Parent keys this component by puzzle id, so state starts fresh per puzzle.
  const [wrong, setWrong] = useState<PuzzleOption[]>([]);
  const [solved, setSolved] = useState(false);
  const [wiggles, setWiggles] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = RENDERERS[puzzle.type] as any;
  const Stimulus = r.Stimulus;
  const cols: number = r.columns(puzzle);

  useEffect(() => say(puzzle.prompt, sound), [puzzle, sound]);

  const pick = (opt: PuzzleOption) => {
    if (solved || wrong.includes(opt)) return;
    if (opt === puzzle.answer) {
      setSolved(true);
      buzz('right');
      say(wrong.length ? 'You got it!' : 'Great job!', sound);
      onSolved(wrong.length === 0);
    } else {
      setWrong((w) => [...w, opt]);
      setWiggles((n) => n + 1);
      buzz('wrong');
      say('Almost! Try again.', sound);
    }
  };

  const message = solved ? (wrong.length ? 'You got it!' : 'Great job! +1 star') : wrong.length ? 'Almost! Look again.' : null;

  return (
    <View style={styles.card}>
      <View style={styles.promptRow}>
        <Text style={[text.h2, { flex: 1 }]}>{puzzle.prompt}</Text>
        <Pressable onPress={() => say(puzzle.prompt, true)} style={styles.speak} accessibilityRole="button" accessibilityLabel="Read the question aloud" hitSlop={8}>
          <Text style={{ fontSize: 22 }}>🔊</Text>
        </Pressable>
      </View>

      {Stimulus && <Stimulus puzzle={puzzle} />}

      <View style={styles.options}>
        {puzzle.options.map((opt) => {
          const state = solved && opt === puzzle.answer ? 'right' : wrong.includes(opt) ? 'wrong' : 'idle';
          return (
            <Option
              key={String(opt)}
              state={state}
              wiggle={state === 'wrong' && opt === wrong[wrong.length - 1] ? wiggles : 0}
              width={`${(100 - (cols - 1) * 3) / cols}%`}
              height={r.optionHeight ?? 84}
              onPress={() => pick(opt)}
              disabled={solved}
              label={String(opt)}
            >
              {r.option(opt, puzzle)}
            </Option>
          );
        })}
      </View>

      <View style={styles.feedbackRow}>{message && <Feedback key={`${wrong.length}-${solved}`} text={message} good={solved} />}</View>
    </View>
  );
}

function Option({
  state, wiggle, width, height, onPress, disabled, label, children,
}: {
  state: 'idle' | 'right' | 'wrong'; wiggle: number; width: `${number}%`; height: number; onPress: () => void; disabled: boolean; label: string; children: React.ReactNode;
}) {
  const wig = useWiggle(wiggle);
  const pop = usePop(state === 'right' ? 'right' : 'idle');
  const bg = state === 'right' ? colors.rightTint : state === 'wrong' ? colors.wrongTint : colors.surface;
  const border = state === 'right' ? colors.right : state === 'wrong' ? colors.wrong : colors.choiceBorder;
  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ width }} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected: state !== 'idle' }}>
      <Animated.View style={[styles.option, { height, backgroundColor: bg, borderColor: border }, state === 'wrong' ? wig : state === 'right' ? pop : null]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function Feedback({ text: msg, good }: { text: string; good: boolean }) {
  const pop = usePop(msg);
  return <Animated.Text style={[styles.feedback, { color: good ? colors.rightText : colors.wrongText }, pop]}>{msg}</Animated.Text>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 26, padding: 20, gap: 18, borderWidth: 3, borderColor: colors.ink, boxShadow: '0 10px 30px rgba(60,40,160,.10)' },
  promptRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  speak: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.brandTint, alignItems: 'center', justifyContent: 'center' },
  options: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  option: { borderRadius: 18, borderWidth: 3, alignItems: 'center', justifyContent: 'center', padding: 8, boxShadow: `0 4px 0 ${colors.choiceBorder}` },
  feedbackRow: { minHeight: 28, alignItems: 'center', justifyContent: 'center' },
  feedback: { fontFamily: font.bodyHeavy, fontSize: 18 },
});
