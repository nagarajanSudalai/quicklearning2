import { GRADES, GRADE_COLORS, GRADE_NOTES, isAvailable, type Grade } from '@quickstep/content';
import { Link, Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/ui';
import { useProgress } from '../lib/progress';
import { colors, font, text } from '../lib/theme';

/** Pick your grade. Returning players skip straight to their grade unless they came here to switch. */
export default function PickGrade() {
  const { grade, setGrade, streak } = useProgress();
  const { change } = useLocalSearchParams<{ change?: string }>();
  if (grade && !change) return <Redirect href={`/grade/${grade}`} />;

  const choose = (g: Grade) => {
    setGrade(g);
    router.replace(`/grade/${g}`);
  };

  return (
    <Screen>
      <Text style={text.h1}>
        Make Learning an <Text style={{ color: colors.brand }}>Adventure</Text>
      </Text>
      <Text style={text.body}>Puzzles and games for Grades 1 to 5.{streak > 1 ? `  🔥 ${streak}-day streak!` : ''}</Text>
      <Text style={text.eyebrow}>Pick your grade</Text>
      <View style={{ gap: 12 }}>
        {GRADES.map((g) => {
          const open = isAvailable(g);
          return (
            <Pressable key={g} disabled={!open} onPress={() => choose(g)} accessibilityRole="button" accessibilityLabel={`Grade ${g}${open ? '' : ', coming soon'}`}>
              {({ pressed }) => (
                <View style={[styles.grade, { borderColor: GRADE_COLORS[g] }, open && { backgroundColor: GRADE_COLORS[g], boxShadow: `0 ${pressed ? 1 : 4}px 0 rgba(0,0,0,.18)`, transform: [{ translateY: pressed ? 3 : 0 }] }, !open && { opacity: 0.55 }]}>
                  <Text style={[styles.gradeTitle, open && { color: '#fff' }]}>Grade {g}</Text>
                  <Text style={[styles.gradeNote, open && { color: 'rgba(255,255,255,.92)' }]}>{open ? GRADE_NOTES[g].split(': ')[1] : 'Coming soon'}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
      <Link href="/parents" style={styles.parents}>For parents</Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grade: { borderWidth: 2, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 18, backgroundColor: colors.surface, gap: 2 },
  gradeTitle: { fontFamily: font.displaySemi, fontSize: 22, color: colors.ink },
  gradeNote: { fontFamily: font.bodyBold, fontSize: 14, color: colors.muted },
  parents: { fontFamily: font.bodyBold, fontSize: 15, color: colors.brand, textAlign: 'center', paddingVertical: 8 },
});
