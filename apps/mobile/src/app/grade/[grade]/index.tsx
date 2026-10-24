import { GRADE_NOTES, SUBJECTS, isAvailable, type Grade } from '@quickstep/content';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen, Tile } from '../../../components/ui';
import { useProgress } from '../../../lib/progress';
import { colors, font, text } from '../../../lib/theme';

export default function GradeHome() {
  const grade = Number(useLocalSearchParams<{ grade: string }>().grade) as Grade;
  const { account } = useProgress();
  return (
    <Screen>
      <View style={styles.head}>
        <Text style={text.h1}>Grade {grade}</Text>
        <Link href="/?change=1" style={styles.link}>Change grade</Link>
      </View>
      {account.active && (
        <Link href="/who" style={styles.link}>
          Playing as {account.active.name}{account.children.length > 1 ? ' · Switch' : ''}
        </Link>
      )}
      <Text style={text.body}>{GRADE_NOTES[grade]}</Text>
      <View style={styles.list}>
        {SUBJECTS.map((s) => {
          const open = isAvailable(grade, s.id);
          return (
            <Pressable
              key={s.id}
              disabled={!open}
              onPress={() => router.push(`/grade/${grade}/${s.id}`)}
              style={({ pressed }) => [styles.subject, pressed && { backgroundColor: colors.panel }, !open && { opacity: 0.5 }]}
              accessibilityRole="button"
              accessibilityLabel={`${s.name}${open ? '' : ', coming soon'}`}
            >
              <Tile glyph={s.glyph} color={s.color} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={text.h3}>{s.name}</Text>
                <Text style={text.small}>{open ? s.desc : 'Coming soon'}</Text>
              </View>
              {open && <Text style={styles.chev}>›</Text>}
            </Pressable>
          );
        })}
      </View>
      <Link href="/parents" style={[styles.link, { textAlign: 'center' }]}>For parents</Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  link: { fontFamily: font.bodyBold, fontSize: 15, color: colors.brand, paddingVertical: 6 },
  list: { backgroundColor: colors.surface, borderRadius: 28, padding: 10, gap: 4, boxShadow: '0 12px 40px rgba(60,40,160,.10)' },
  subject: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: 18 },
  chev: { fontFamily: font.display, fontSize: 30, color: colors.blank },
});
