import { TOPICS, cheerFor, testId } from '@quickstep/content';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { clock } from '../components/TestList';
import { Button3D, Screen } from '../components/ui';
import { say } from '../lib/feedback';
import { usePop } from '../lib/motion';
import { useProgress } from '../lib/progress';
import { colors, font, text } from '../lib/theme';

/** Report for the test just taken: score, time, and how each topic went. */
export default function TestResult() {
  const { tests, sound } = useProgress();
  const r = tests[0];
  const pop = usePop('test-result');
  useEffect(() => { if (r) say(`${cheerFor(r.right, r.total)} You got ${r.right} out of ${r.total}.`, sound); }, [r, sound]);
  if (!r) return <Screen back title="Report"><Text>No test yet.</Text></Screen>;

  return (
    <Screen title="Test report">
      <View style={styles.card}>
        <Animated.Text style={[styles.big, pop]}>{r.right === r.total ? '🏆' : '📝'}</Animated.Text>
        <Text style={[text.h1, { textAlign: 'center' }]}>{cheerFor(r.right, r.total)}</Text>
        <Text style={styles.score}>{r.right} / {r.total}</Text>
        <Text style={[text.body, { textAlign: 'center' }]}>Time taken: {clock(r.seconds)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={[text.h3, { alignSelf: 'flex-start' }]}>How each topic went</Text>
        {r.byTopic.map((row) => {
          const t = TOPICS.find((x) => x.id === row.topic);
          const weak = r.weak.includes(row.topic);
          return (
            <View key={row.topic} style={styles.row}>
              <Text style={styles.label}>{t?.title ?? row.topic}</Text>
              <Text style={styles.value}>{row.right}/{row.total}</Text>
              {weak ? (
                <Pressable onPress={() => router.push(`/play/${row.topic}`)} accessibilityRole="button" accessibilityLabel={`Practise ${t?.title ?? row.topic}`}>
                  <Text style={styles.practise}>Practise →</Text>
                </Pressable>
              ) : (
                <Text style={styles.ok}>✓</Text>
              )}
            </View>
          );
        })}
      </View>
      <Button3D label="Try another test" size="lg" onPress={() => router.replace(`/grade/${r.grade}/practice`)} />
      <Button3D label="Take this test again" color={colors.ink} shadow="#000" onPress={() => router.replace(`/test/${testId(r.grade, r.subject)}`)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 28, padding: 22, gap: 10, alignItems: 'center', borderWidth: 3, borderColor: colors.ink },
  big: { fontSize: 64 },
  score: { fontFamily: font.display, fontSize: 44, color: colors.brandDeep },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { flex: 1, fontFamily: font.bodyBold, fontSize: 15, color: colors.ink },
  value: { fontFamily: font.display, fontSize: 17, color: colors.ink, width: 42, textAlign: 'right' },
  practise: { fontFamily: font.bodyHeavy, fontSize: 14, color: colors.brand, width: 82, textAlign: 'right' },
  ok: { fontSize: 18, color: colors.right, width: 82, textAlign: 'right' },
});
