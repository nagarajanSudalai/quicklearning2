import { SUBJECTS, puzzlesFor, topicsFor, type Grade, type SubjectId } from '@quickstep/content';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TestList } from '../../../components/TestList';
import { Screen, Tile } from '../../../components/ui';
import { useProgress } from '../../../lib/progress';
import { colors, font, text } from '../../../lib/theme';

/** Topic map for one subject: each topic shows how many of its puzzles are solved. */
export default function SubjectTopics() {
  const params = useLocalSearchParams<{ grade: string; subject: SubjectId }>();
  const grade = Number(params.grade) as Grade;
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  const { solved } = useProgress();
  const topics = topicsFor(grade, params.subject);
  if (params.subject === 'practice') return <TestList grade={grade} />;

  return (
    <Screen back title={`Grade ${grade} · ${subject?.name ?? ''}`}>
      <Text style={text.body}>Pick a topic. Each one has 3 levels, from easy to tricky.</Text>
      {topics.map((t) => {
        const all = puzzlesFor(t.id);
        const done = all.filter((p) => solved[p.id]).length;
        const medals = done === all.length ? 3 : done >= (all.length * 2) / 3 ? 2 : done >= all.length / 3 ? 1 : 0;
        return (
          <Pressable
            key={t.id}
            onPress={() => router.push(`/play/${t.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`${t.title}, ${done} of ${all.length} done`}
            style={({ pressed }) => [styles.topic, { transform: [{ translateY: pressed ? 2 : 0 }] }]}
          >
            <Tile glyph={t.glyph} color={t.color} size={60} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={styles.row}>
                <Text style={text.h3}>{t.title}</Text>
                <Text style={styles.medals}>{'★'.repeat(medals)}<Text style={{ color: colors.choiceBorder }}>{'★'.repeat(3 - medals)}</Text></Text>
              </View>
              <Text style={text.small}>{t.blurb}</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${(done / all.length) * 100}%`, backgroundColor: t.color }]} />
              </View>
              <Text style={styles.count}>{done} / {all.length} done</Text>
            </View>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topic: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, boxShadow: '0 4px 0 #eeebfa' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  medals: { fontSize: 18, color: '#ffb800', letterSpacing: 2 },
  track: { height: 10, borderRadius: 999, backgroundColor: colors.panel, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  count: { fontFamily: font.bodyBold, fontSize: 12, color: colors.faint },
});
