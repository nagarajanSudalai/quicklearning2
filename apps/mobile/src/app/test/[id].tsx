import { PUZZLES, buildTest, parseTestId, scoreTest, testsFor } from '@quickstep/content';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PuzzlePlayer } from '../../components/puzzles/PuzzlePlayer';
import { clock } from '../../components/TestList';
import { Button3D, Screen } from '../../components/ui';
import { useProgress } from '../../lib/progress';
import { colors, font } from '../../lib/theme';

/** A practice test: one try per question, a count-up clock, and a report at the end. */
export default function Test() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const parsed = parseTestId(id);
  const info = parsed && testsFor(PUZZLES, parsed.grade).find((t) => t.id === id);
  const { sound, recordTest } = useProgress();
  const [questions] = useState(() => (parsed && info ? buildTest(PUZZLES, parsed.grade, parsed.subject) : []));
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [i, setI] = useState(0);
  const [started] = useState(() => Date.now());
  const [seconds, setSeconds] = useState(0);
  const answered = answers.length > i;

  useEffect(() => {
    const t = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(t);
  }, [started]);

  if (!parsed || !info || !questions.length) {
    return (
      <Screen back title="Oops">
        <Text>That test isn't ready yet.</Text>
      </Screen>
    );
  }

  const last = i === questions.length - 1;
  const next = () => {
    if (!last) return setI(i + 1);
    const score = scoreTest(questions, answers);
    recordTest({ id: info.id, grade: info.grade, subject: info.subject, date: new Date().toISOString(), seconds: Math.floor((Date.now() - started) / 1000), ...score });
    router.replace('/test-result');
  };

  return (
    <Screen back title={info.title}>
      <View style={styles.head}>
        <Text style={styles.count}>Question {i + 1} of {questions.length}</Text>
        <Text style={styles.clock} accessibilityLabel={`Time ${clock(seconds)}`}>⏱ {clock(seconds)}</Text>
      </View>
      <View style={styles.progress}>
        {questions.map((q, k) => (
          <View key={q.id} style={[styles.dot, { backgroundColor: k < answers.length ? (answers[k] ? colors.right : colors.wrong) : colors.choiceBorder }]} />
        ))}
      </View>
      <PuzzlePlayer key={questions[i].id} puzzle={questions[i]} sound={sound} test onSolved={(right) => setAnswers((a) => [...a, right])} />
      <Button3D label={last ? 'See my report' : 'Next →'} onPress={next} disabled={!answered} size="lg" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { fontFamily: font.bodyHeavy, fontSize: 13, color: colors.muted, letterSpacing: 0.6, textTransform: 'uppercase' },
  clock: { fontFamily: font.display, fontSize: 18, color: colors.brandDeep },
  progress: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 10, borderRadius: 999 },
});
