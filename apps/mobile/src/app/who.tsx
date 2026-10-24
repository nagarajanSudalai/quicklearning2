import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Screen, Tile } from '../components/ui';
import { useProgress } from '../lib/progress';
import { colors, text } from '../lib/theme';

const TINTS = [colors.pink, colors.blue, colors.green, colors.orange];

/** Pick which child is playing. Children can switch here without the parent gate. */
export default function Who() {
  const { account: a } = useProgress();
  const pick = async (i: number) => {
    const c = a.children[i];
    await a.selectChild(c);
    router.replace(`/grade/${c.grade}`);
  };
  return (
    <Screen back title="Who’s playing?">
      {a.children.map((c, i) => (
        <Pressable key={c.id} onPress={() => pick(i)} accessibilityRole="button" accessibilityLabel={c.name} style={[styles.row, a.active?.id === c.id && styles.on]}>
          <Tile glyph={c.name.slice(0, 1).toUpperCase()} color={TINTS[i % 4]} size={56} />
          <Text style={[text.h3, { flex: 1 }]}>{c.name}</Text>
          <Text style={text.small}>Grade {c.grade}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, backgroundColor: colors.surface, borderRadius: 22, borderWidth: 2, borderColor: colors.border },
  on: { borderColor: colors.brand, backgroundColor: colors.brandTint },
});
