import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { PHRASES, isInteractive, type ChoicePuzzle, type InteractivePuzzle, type Puzzle, type PuzzleOption } from '@quickstep/content';
import { buzz, say } from '../../lib/feedback';
import { usePop, useWiggle } from '../../lib/motion';
import { colors, font, text } from '../../lib/theme';
import { PLAYERS } from './interactive';
import { RENDERERS } from './renderers';

// Types whose prompt is long or repeated in the panel get a short title; the full prompt is still read aloud.
const TITLES: Partial<Record<Puzzle['type'], string>> = { 'fill-blank': 'Fill in the blank.', riddle: 'Who am I?', passage: 'Read and answer.', analogy: 'Complete the pair.', idiom: 'What does it mean?', teaser: 'Brain teaser', 'true-false': 'True or false?', 'code-trace': 'Read the code.' };

type Props = {
  puzzle: Puzzle;
  sound: boolean;
  /** Called once, when the child finds the right answer. */
  onSolved: (firstTry: boolean) => void;
  /** Test mode (one-tap puzzles only): the first pick is final; `onSolved` gets whether it was right. */
  test?: boolean;
};

/** Plays one puzzle of any type, with the prompt, read-aloud button and feedback line. */
export function PuzzlePlayer(props: Props) {
  const { puzzle, sound } = props;
  useEffect(() => say(puzzle.prompt, sound), [puzzle, sound]);
  return (
    <View style={styles.card}>
      <View style={styles.promptRow}>
        {/* Fill-blank shows its sentence in the panel, so the title stays short; the full sentence is still read aloud. */}
        <Text style={[text.h2, { flex: 1 }]}>{TITLES[puzzle.type] ?? puzzle.prompt}</Text>
        <Pressable onPress={() => say(puzzle.prompt, true)} style={styles.speak} accessibilityRole="button" accessibilityLabel="Read the question aloud" hitSlop={8}>
          <Text style={{ fontSize: 22 }}>🔊</Text>
        </Pressable>
      </View>
      {isInteractive(puzzle) ? <InteractiveBody {...props} puzzle={puzzle} /> : <ChoiceBody {...props} puzzle={puzzle} />}
    </View>
  );
}

/** Multi-step puzzles (crossword, sorting, memory, maze); the type's player decides when it's solved. */
function InteractiveBody({ puzzle, sound, onSolved }: Props & { puzzle: InteractivePuzzle }) {
  const [message, setMessage] = useState<{ text: string; good: boolean; n: number } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Player = PLAYERS[puzzle.type] as any;
  return (
    <>
      <Player
        puzzle={puzzle}
        sound={sound}
        onMistake={(m?: string) => {
          setMessage((prev) => ({ text: m ?? 'Almost! Look again.', good: false, n: (prev?.n ?? 0) + 1 }));
          if (!m) say(PHRASES.tryAgain, sound);
        }}
        onSolved={(star: boolean) => {
          setMessage({ text: star ? 'Great job! +1 star' : 'You got it!', good: true, n: -1 });
          say(star ? PHRASES.great : PHRASES.gotIt, sound);
          onSolved(star);
        }}
      />
      <View style={styles.feedbackRow}>{message && <Feedback key={message.n} text={message.text} good={message.good} />}</View>
    </>
  );
}

/** One-tap puzzles. A wrong pick wiggles and can be retried; a star is only earned when the first pick is right. */
function ChoiceBody({ puzzle, sound, onSolved, test }: Props & { puzzle: ChoicePuzzle }) {
  // Parent keys this component by puzzle id, so state starts fresh per puzzle.
  const [wrong, setWrong] = useState<PuzzleOption[]>([]);
  const [solved, setSolved] = useState(false);
  const [wiggles, setWiggles] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = RENDERERS[puzzle.type] as any;
  const Stimulus = r.Stimulus;
  const cols: number = r.columns(puzzle);

  const pick = (opt: PuzzleOption) => {
    if (solved || wrong.includes(opt)) return;
    if (test) {
      // One try: show the right answer either way and move on.
      const right = opt === puzzle.answer;
      if (!right) setWrong([opt]);
      setSolved(true);
      buzz(right ? 'right' : 'wrong');
      if (right) say(PHRASES.great, sound);
      onSolved(right);
      return;
    }
    if (opt === puzzle.answer) {
      setSolved(true);
      buzz('right');
      say(wrong.length ? PHRASES.gotIt : PHRASES.great, sound);
      onSolved(wrong.length === 0);
    } else {
      setWrong((w) => [...w, opt]);
      setWiggles((n) => n + 1);
      buzz('wrong');
      say(PHRASES.tryAgain, sound);
    }
  };

  const answerName = r.label ? r.label(puzzle.answer) : String(puzzle.answer);
  const message = test
    ? solved ? (wrong.length ? `The answer is ${answerName}.` : 'Correct!') : null
    : solved ? (wrong.length ? 'You got it!' : 'Great job! +1 star') : wrong.length ? 'Almost! Look again.' : null;

  return (
    <>
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
              label={r.label ? r.label(opt) : String(opt)}
            >
              {r.option(opt, puzzle)}
            </Option>
          );
        })}
      </View>

      <View style={styles.feedbackRow}>{message && <Feedback key={`${wrong.length}-${solved}`} text={message} good={solved && !(test && wrong.length)} />}</View>
    </>
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
