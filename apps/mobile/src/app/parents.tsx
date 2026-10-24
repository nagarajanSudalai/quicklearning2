import { PUZZLES, TOPICS, puzzlesFor, testsFor } from '@quickstep/content';
import { clock } from '../components/TestList';
import { AccountCard } from '../components/AccountCard';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Button3D, Screen } from '../components/ui';
import { useProgress } from '../lib/progress';
import { colors, font, text } from '../lib/theme';

// 2-digit × 2-digit: beyond what a Grade 1–3 child can work out in their head.
const rnd = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));

/** Parent gate: a sum a young child can't do, in front of settings. */
export default function Parents() {
  const [q] = useState(() => [rnd(12, 29), rnd(11, 19)] as const);
  const [answer, setAnswer] = useState('');
  const [open, setOpen] = useState(false);
  const p = useProgress();

  if (!open) {
    const check = () => (Number(answer) === q[0] * q[1] ? setOpen(true) : setAnswer(''));
    return (
      <Screen back title="For parents">
        <Text style={text.h2}>Ask a grown-up</Text>
        <Text style={text.body}>To open parent settings, answer this:</Text>
        <Text style={styles.q}>{q[0]} × {q[1]} = ?</Text>
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          onSubmitEditing={check}
          keyboardType="number-pad"
          placeholder="Answer"
          style={styles.input}
          accessibilityLabel="Answer"
          maxLength={3}
        />
        <Button3D label="Open" onPress={check} />
      </Screen>
    );
  }

  const resetProgress = () => {
    const doIt = () => {
      p.reset();
      router.replace('/');
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Reset all stars and progress?')) doIt();
    } else {
      Alert.alert('Reset progress?', 'All stars and solved puzzles will be cleared.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: doIt }]);
    }
  };

  return (
    <Screen back title="Parent settings">
      <AccountCard />
      <View style={styles.card}>
        <Text style={text.h3}>Recent tests</Text>
        {p.tests.length === 0 && <Text style={text.small}>No tests taken yet. Tests are under Practice & Tests.</Text>}
        {p.tests.slice(0, 10).map((r) => (
          <View key={r.date} style={styles.row}>
            <Text style={styles.label}>{new Date(r.date).toLocaleDateString()} · Grade {r.grade} {testsFor(PUZZLES, r.grade).find((t) => t.id === r.id)?.title ?? r.id}</Text>
            <Text style={styles.value}>{r.right}/{r.total} · {clock(r.seconds)}</Text>
          </View>
        ))}
        {p.tests[0]?.weak.length ? (
          <Text style={text.small}>Needs practice: {p.tests[0].weak.map((id) => TOPICS.find((t) => t.id === id)?.title ?? id).join(', ')}</Text>
        ) : null}
      </View>
      <View style={styles.card}>
        <Text style={text.h3}>Progress</Text>
        <Text style={text.body}>★ {p.stars} stars · 🔥 {p.streak}-day streak</Text>
        {TOPICS.filter((t) => t.grade === (p.grade ?? 1)).map((t) => {
          const all = puzzlesFor(t.id);
          const done = all.filter((x) => p.solved[x.id]).length;
          return (
            <View key={t.id} style={styles.row}>
              <Text style={styles.label}>{t.title}</Text>
              <Text style={styles.value}>{done} / {all.length}</Text>
            </View>
          );
        })}
      </View>
      <View style={[styles.card, styles.row]}>
        <Text style={styles.label}>Read questions aloud</Text>
        <Switch value={p.sound} onValueChange={p.setSound} trackColor={{ true: colors.brand, false: colors.choiceBorder }} />
      </View>
      <Button3D label="Change grade" onPress={() => router.replace('/?change=1')} />
      <Button3D label="Reset progress" color={colors.wrongText} shadow="#9e1f4b" onPress={resetProgress} />
      <Text style={[text.small, { textAlign: 'center' }]}>QuickStep has no ads and no tracking. Progress is stored on this device, and in your parent account if you sign in.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  q: { fontFamily: font.display, fontSize: 40, color: colors.ink, textAlign: 'center' },
  input: { fontFamily: font.bodyHeavy, fontSize: 24, textAlign: 'center', borderWidth: 3, borderColor: colors.choiceBorder, borderRadius: 16, padding: 12, backgroundColor: colors.surface, color: colors.ink },
  card: { backgroundColor: colors.surface, borderRadius: 22, padding: 18, gap: 10, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: font.bodyBold, fontSize: 16, color: colors.ink },
  value: { fontFamily: font.bodyHeavy, fontSize: 16, color: colors.muted },
});
