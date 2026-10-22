import { SESSION_LENGTH, TOPICS, puzzlesFor } from '@quickstep/content';
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

  // Fixed for the session: unsolved puzzles first (easiest first), then replays.
  const [queue] = useState(() => {
    const all = puzzlesFor(topicId);
    return [...all.filter((p) => !solved[p.id]), ...all.filter((p) => solved[p.id])].slice(0, SESSION_LENGTH);
  });
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [firstTry, setFirstTry] = useState(0);

  if (!topic || !queue.length) {
    return (
      <Screen back title="Oops">
        <Text>That topic isn't ready yet.</Text>
      </Screen>
    );
  }

  const puzzle = queue[i];
  const last = i === queue.length - 1;

  const next = () => {
    if (last) {
      router.replace({ pathname: '/result', params: { topic: topic.id, stars: String(firstTry), total: String(queue.length) } });
      return;
    }
    setI(i + 1);
    setDone(false);
  };

  return (
    <Screen back title={topic.title}>
      <View style={styles.progress} accessibilityLabel={`Puzzle ${i + 1} of ${queue.length}`}>
        {queue.map((p, k) => (
          <View key={p.id} style={[styles.dot, { backgroundColor: k < i || (k === i && done) ? topic.color : colors.choiceBorder }]} />
        ))}
      </View>
      <Text style={styles.level}>Level {puzzle.difficulty} · {i + 1} of {queue.length}</Text>
      <PuzzlePlayer
        key={puzzle.id}
        puzzle={puzzle}
        sound={sound}
        onSolved={(first) => {
          recordSolved(puzzle.id, first);
          if (first) setFirstTry((n) => n + 1);
          setDone(true);
        }}
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
