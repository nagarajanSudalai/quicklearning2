import { SESSION_LENGTH, TOPICS, nextLevel, pickNext, puzzlesFor, startLevel, type Difficulty, type Puzzle } from '@quickstep/content';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PuzzlePlayer } from '../../components/puzzles/PuzzlePlayer';
import { Button3D, Screen } from '../../components/ui';
import { useProgress } from '../../lib/progress';
import { colors, font } from '../../lib/theme';

export default function Play() {
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = TOPICS.find((t) => t.id === topicId);
  const { solved, sound, recordSolved } = useProgress();

  // Adaptive session: start at the easiest level with unsolved puzzles, then move up after
  // 3 first-try answers in a row and down after 2 misses in a row (src/adaptive.ts).
  const [all] = useState(() => puzzlesFor(topicId));
  const total = Math.min(SESSION_LENGTH, all.length);
  const [played, setPlayed] = useState<Puzzle[]>(() => {
    const first = pickNext(all, startLevel(all, solved), solved, new Set());
    return first ? [first] : [];
  });
  const [level, setLevel] = useState<Difficulty>(() => played[0]?.difficulty ?? 1);
  const [run, setRun] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  const i = played.length - 1;

  if (!topic || !played.length) {
    return (
      <Screen back title="Oops">
        <Text>That topic isn't ready yet.</Text>
      </Screen>
    );
  }

  const puzzle = played[i];
  const last = played.length === total;

  const next = () => {
    if (last) {
      router.replace({ pathname: '/result', params: { topic: topic.id, stars: String(firstTry), total: String(total) } });
      return;
    }
    const p = pickNext(all, level, solved, new Set(played.map((x) => x.id)));
    if (p) setPlayed([...played, p]);
    setDone(false);
  };

  const finished = (first: boolean) => {
    recordSolved(puzzle.id, first);
    if (first) setFirstTry((n) => n + 1);
    const r = [...run, first];
    const lv = nextLevel(level, r, [...new Set(all.map((p) => p.difficulty))]);
    setLevel(lv);
    setRun(lv === level ? r : []);
    setDone(true);
  };

  return (
    <Screen back title={topic.title}>
      <View style={styles.progress} accessibilityLabel={`Puzzle ${i + 1} of ${total}`}>
        {Array.from({ length: total }, (_, k) => (
          <View key={k} style={[styles.dot, { backgroundColor: k < i || (k === i && done) ? topic.color : colors.choiceBorder }]} />
        ))}
      </View>
      <Text style={styles.level}>Level {puzzle.difficulty} · {i + 1} of {total}</Text>
      <PuzzlePlayer
        key={puzzle.id}
        puzzle={puzzle}
        sound={sound}
        onSolved={finished}
      />
      <Button3D label={last ? 'Finish ★' : 'Next puzzle →'} onPress={next} disabled={!done} size="lg" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 10, borderRadius: 999 },
  level: { fontFamily: font.bodyHeavy, fontSize: 13, color: colors.muted, letterSpacing: 0.6, textTransform: 'uppercase' },
});
