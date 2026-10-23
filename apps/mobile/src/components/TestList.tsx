import { PUZZLES, SUBJECTS, testsFor, type Grade } from '@quickstep/content';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useProgress } from '../lib/progress';
import { colors, font, text } from '../lib/theme';
import { Screen, Tile } from './ui';

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const ago = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`;
};

/** Practice & Tests: one 10-question test per subject that has enough one-tap puzzles, plus a mixed test. */
export function TestList({ grade }: { grade: Grade }) {
  const { tests } = useProgress();
  return (
    <Screen back title={`Grade ${grade} · Practice & Tests`}>
      <Text style={text.body}>10 questions, one try each. Take your time — the clock is just for fun.</Text>
      {testsFor(PUZZLES, grade).map((t) => {
        const subject = SUBJECTS.find((s) => s.id === t.subject);
        const mine = tests.filter((r) => r.id === t.id);
        const best = mine.reduce((b, r) => Math.max(b, r.right), -1);
        return (
          <Pressable
            key={t.id}
            onPress={() => router.push(`/test/${t.id}`)}
            accessibilityRole="button"
            accessibilityLabel={t.title}
            style={({ pressed }) => [styles.card, { transform: [{ translateY: pressed ? 2 : 0 }] }]}
          >
            <Tile glyph={subject?.glyph ?? '✓'} color={subject?.color ?? colors.teal} size={56} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={text.h3}>{t.title}</Text>
              <Text style={text.small}>{mine.length ? `Best ${best}/${mine[0].total} · last ${ago(mine[0].date)}` : t.subject === 'mixed' ? 'Questions from every subject' : 'Not taken yet'}</Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, boxShadow: '0 4px 0 #eeebfa' },
  chev: { fontFamily: font.display, fontSize: 30, color: colors.blank },
});
