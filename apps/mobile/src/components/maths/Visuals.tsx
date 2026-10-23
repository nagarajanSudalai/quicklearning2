import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font } from '../../lib/theme';

/** Tens as rods of 10 cubes, ones as single cubes (NCERT-style place-value blocks). */
export function Blocks({ hundreds = 0, tens, ones }: { hundreds?: number; tens: number; ones: number }) {
  return (
    <View style={styles.blocks} accessibilityLabel={`${hundreds ? `${hundreds} hundreds, ` : ''}${tens} tens and ${ones} ones`}>
      {hundreds > 0 && (
        <View style={styles.flats}>
          {Array.from({ length: hundreds }, (_, i) => <View key={i} style={styles.flat} />)}
        </View>
      )}
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

/** A circle or bar cut into `parts` equal pieces with `shaded` filled in. */
export function Fraction({ shape, parts, shaded, size = 120 }: { shape: 'circle' | 'bar'; parts: number; shaded: number; size?: number }) {
  if (shape === 'bar') {
    const w = 100 / parts;
    return (
      <Svg width={size * 1.4} height={size * 0.45} viewBox="0 0 100 30" accessibilityLabel={`${shaded} of ${parts} parts shaded`}>
        {Array.from({ length: parts }, (_, k) => (
          <Rect key={k} x={k * w + 0.5} y={1} width={w - 1} height={28} rx={2} fill={k < shaded ? colors.purple : '#fff'} stroke={colors.ink} strokeWidth={1.5} />
        ))}
      </Svg>
    );
  }
  const slice = (k: number) => {
    const a0 = (k / parts) * 2 * Math.PI - Math.PI / 2, a1 = ((k + 1) / parts) * 2 * Math.PI - Math.PI / 2;
    const p = (a: number) => `${50 + 46 * Math.cos(a)} ${50 + 46 * Math.sin(a)}`;
    return `M50 50 L${p(a0)} A46 46 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`;
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityLabel={`${shaded} of ${parts} parts shaded`}>
      {Array.from({ length: parts }, (_, k) => (
        <Path key={k} d={slice(k)} fill={k < shaded ? colors.purple : '#fff'} stroke={colors.ink} strokeWidth={2} />
      ))}
    </Svg>
  );
}

/** A 15 cm ruler with an object lying from `start` to `start + length`. */
export function Ruler({ item, start, length }: { item: string; start: number; length: number }) {
  // The SVG is drawn at `cm` units per centimetre and shown at scale `k`, so the object above uses the same scale.
  const cm = 20, w = 15 * cm + 20, k = 0.85;
  return (
    <View style={{ alignItems: 'flex-start', width: w * k }}>
      <View style={{ flexDirection: 'row', marginLeft: (10 + start * cm) * k, width: length * cm * k, height: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brandTint, borderRadius: 8 }}>
        <Text style={{ fontSize: 24 }} numberOfLines={1}>{item}</Text>
      </View>
      <Svg width={w * k} height={46 * k} viewBox={`0 0 ${w} 46`} accessibilityLabel="ruler">
        <Rect x={0} y={0} width={w} height={46} rx={6} fill="#ffe9a8" stroke={colors.ink} strokeWidth={1.5} />
        {Array.from({ length: 16 }, (_, k) => (
          <Line key={k} x1={10 + k * cm} y1={0} x2={10 + k * cm} y2={k % 5 === 0 ? 20 : 14} stroke={colors.ink} strokeWidth={1.5} />
        ))}
        {Array.from({ length: 16 }, (_, k) => (
          <SvgText key={`t${k}`} x={10 + k * cm} y={36} fontSize={11} fontWeight="700" fill={colors.ink} textAnchor="middle">{k}</SvgText>
        ))}
        {/* Line up the object's ends with the ruler marks. */}
        <Line x1={10 + start * cm} y1={0} x2={10 + start * cm} y2={46} stroke={colors.brand} strokeWidth={2} strokeDasharray="3 3" />
        <Line x1={10 + (start + length) * cm} y1={0} x2={10 + (start + length) * cm} y2={46} stroke={colors.brand} strokeWidth={2} strokeDasharray="3 3" />
      </Svg>
    </View>
  );
}

/** A shape on squared paper; with `labels`, a plain rectangle with its side lengths written on. */
export function GridShape({ rows, cols, cells, labels }: { rows: number; cols: number; cells: boolean[]; labels?: boolean }) {
  const cell = Math.min(36, Math.floor(260 / cols));
  if (labels) {
    const w = cols * 24, h = rows * 24;
    return (
      <Svg width={w + 70} height={h + 50} accessibilityLabel={`rectangle ${cols} by ${rows}`}>
        <Rect x={60} y={10} width={w} height={h} fill={colors.brandTint} stroke={colors.brand} strokeWidth={3} />
        <SvgText x={60 + w / 2} y={h + 36} fontSize={16} fontWeight="700" fill={colors.ink} textAnchor="middle">{cols} cm</SvgText>
        <SvgText x={52} y={10 + h / 2 + 5} fontSize={16} fontWeight="700" fill={colors.ink} textAnchor="end">{rows} cm</SvgText>
      </Svg>
    );
  }
  return (
    <Svg width={cols * cell + 2} height={rows * cell + 2} accessibilityLabel="shape on squared paper">
      {cells.map((on, k) => (
        <Rect key={k} x={1 + (k % cols) * cell} y={1 + Math.floor(k / cols) * cell} width={cell} height={cell}
          fill={on ? colors.purple : '#fff'} stroke={on ? colors.brandDark : colors.choiceBorder} strokeWidth={on ? 1.5 : 1} />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  flats: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, maxWidth: 170 },
  flat: { width: 50, height: 50, backgroundColor: colors.green, borderRadius: 4, borderWidth: 2, borderColor: '#1f8a50' },
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
