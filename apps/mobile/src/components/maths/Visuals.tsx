import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font } from '../../lib/theme';

/** Tens as rods of 10 cubes, ones as single cubes (NCERT-style place-value blocks). */
export function Blocks({ tens, ones }: { tens: number; ones: number }) {
  return (
    <View style={styles.blocks} accessibilityLabel={`${tens} tens and ${ones} ones`}>
      <View style={styles.rods}>
        {Array.from({ length: tens }, (_, i) => (
          <View key={i} style={styles.rod}>
            {Array.from({ length: 10 }, (_, k) => <View key={k} style={styles.rodCube} />)}
          </View>
        ))}
      </View>
      <View style={styles.ones}>
        {Array.from({ length: ones }, (_, i) => <View key={i} style={styles.cube} />)}
      </View>
    </View>
  );
}

/** Analogue clock face with hour and minute hands. */
export function Clock({ hour, minute, size = 170 }: { hour: number; minute: number; size?: number }) {
  const c = 50;
  const hand = (deg: number, len: number) => {
    const r = ((deg - 90) * Math.PI) / 180;
    return { x2: c + len * Math.cos(r), y2: c + len * Math.sin(r) };
  };
  const hourDeg = ((hour % 12) + minute / 60) * 30;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityLabel="clock">
      <Circle cx={c} cy={c} r={47} fill="#fff" stroke={colors.ink} strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => {
        const r = (((i + 1) * 30 - 90) * Math.PI) / 180;
        return (
          <SvgText key={i} x={c + 37 * Math.cos(r)} y={c + 37 * Math.sin(r) + 4} fontSize={10} fontWeight="700" fill={colors.ink} textAnchor="middle">
            {i + 1}
          </SvgText>
        );
      })}
      <Line x1={c} y1={c} {...hand(hourDeg, 22)} stroke={colors.ink} strokeWidth={5} strokeLinecap="round" />
      <Line x1={c} y1={c} {...hand(minute * 6, 34)} stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={c} cy={c} r={3.5} fill={colors.ink} />
    </Svg>
  );
}

const COIN = { 1: '#c9ccd6', 2: '#d9dbe3', 5: '#e8c26a', 10: '#d8b25a' } as Record<number, string>;
const NOTE = { 10: '#c98a5a', 20: '#e8a87c', 50: '#7fd1c2', 100: '#b8a4e6' } as Record<number, string>;

/** Rupee coins (circles) and notes (rectangles), labelled with their value. */
export function Money({ coins, notes }: { coins: number[]; notes: number[] }) {
  return (
    <View style={styles.money}>
      {notes.map((n, i) => (
        <View key={`n${i}`} style={[styles.note, { backgroundColor: NOTE[n] }]} accessibilityLabel={`${n} rupee note`}>
          <Text style={styles.noteText}>₹{n}</Text>
        </View>
      ))}
      {coins.map((c, i) => {
        const d = 44 + c * 2;
        return (
          <View key={`c${i}`} style={[styles.coin, { width: d, height: d, borderRadius: d / 2, backgroundColor: COIN[c] }]} accessibilityLabel={`${c} rupee coin`}>
            <Text style={styles.coinText}>₹{c}</Text>
          </View>
        );
      })}
    </View>
  );
}

/** a groups of b pictures, each group in its own circle. */
export function Groups({ a, b, item }: { a: number; b: number; item: string }) {
  return (
    <View style={styles.groups}>
      {Array.from({ length: a }, (_, i) => (
        <View key={i} style={styles.group}>
          {Array.from({ length: b }, (_, k) => <Text key={k} style={{ fontSize: 20 }}>{item}</Text>)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  blocks: { flexDirection: 'row', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap', justifyContent: 'center' },
  rods: { flexDirection: 'row', gap: 4 },
  rod: { gap: 1, padding: 1, backgroundColor: colors.brandDark, borderRadius: 3 },
  rodCube: { width: 14, height: 11, backgroundColor: colors.blue, borderRadius: 2 },
  ones: { flexDirection: 'row', flexWrap: 'wrap', width: 64, gap: 3, alignContent: 'flex-end' },
  cube: { width: 14, height: 14, backgroundColor: colors.orange, borderRadius: 3, borderWidth: 1, borderColor: '#c46e14' },
  money: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' },
  note: { width: 84, height: 44, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(0,0,0,.15)' },
  noteText: { fontFamily: font.display, fontSize: 20, color: colors.ink },
  coin: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(0,0,0,.18)' },
  coinText: { fontFamily: font.display, fontSize: 15, color: colors.ink },
  groups: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  group: { flexDirection: 'row', flexWrap: 'wrap', maxWidth: 76, justifyContent: 'center', padding: 6, borderRadius: 999, borderWidth: 2, borderColor: colors.blank, borderStyle: 'dashed' },
});
