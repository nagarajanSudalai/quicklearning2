import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { DIAGRAMS } from '@quickstep/content';
import { colors, font } from '../../lib/theme';

const SKIN = '#f2c29b', BROWN = '#8a5a3c', LEAF = '#2fbf71', SKY = '#3b8cff';

/** The drawing behind each diagram, on a 300×240 canvas. Marker positions live in DIAGRAMS. */
const ART: Record<string, () => React.ReactNode> = {
  body: () => (
    <G>
      <Line x1={132} y1={72} x2={70} y2={146} stroke={SKIN} strokeWidth={14} strokeLinecap="round" />
      <Line x1={168} y1={72} x2={230} y2={146} stroke={SKIN} strokeWidth={14} strokeLinecap="round" />
      <Circle cx={70} cy={146} r={11} fill={SKIN} /><Circle cx={230} cy={146} r={11} fill={SKIN} />
      <Line x1={140} y1={150} x2={132} y2={216} stroke={colors.brandDeep} strokeWidth={16} strokeLinecap="round" />
      <Line x1={160} y1={150} x2={168} y2={216} stroke={colors.brandDeep} strokeWidth={16} strokeLinecap="round" />
      <Ellipse cx={124} cy={226} rx={18} ry={9} fill={colors.orange} /><Ellipse cx={176} cy={226} rx={18} ry={9} fill={colors.orange} />
      <Rect x={124} y={60} width={52} height={96} rx={20} fill={colors.orange} />
      <Circle cx={150} cy={34} r={26} fill={SKIN} />
      <Path d="M126 28 Q150 0 174 28 Q150 16 126 28 Z" fill="#3a2418" />
    </G>
  ),
  plant: () => (
    <G>
      <Rect x={0} y={190} width={300} height={50} fill="#d9b48f" />
      <Path d="M150 190 L150 232 M150 200 L128 228 M150 200 L174 226 M150 212 L136 236 M150 212 L166 238" stroke={BROWN} strokeWidth={4} strokeLinecap="round" />
      <Line x1={150} y1={52} x2={150} y2={190} stroke={LEAF} strokeWidth={8} strokeLinecap="round" />
      <Path d="M150 120 Q190 70 236 98 Q196 132 150 120 Z" fill={LEAF} />
      <Line x1={150} y1={110} x2={100} y2={92} stroke={LEAF} strokeWidth={5} strokeLinecap="round" />
      <Circle cx={92} cy={96} r={15} fill="#ff4f4f" />
      {[0, 72, 144, 216, 288].map((a) => <Circle key={a} cx={150 + 14 * Math.cos((a * Math.PI) / 180)} cy={34 + 14 * Math.sin((a * Math.PI) / 180)} r={11} fill={colors.pink} />)}
      <Circle cx={150} cy={34} r={8} fill="#ffc83d" />
    </G>
  ),
  'water-cycle': () => (
    <G>
      <Rect x={0} y={0} width={300} height={190} fill="#eaf4ff" />
      <Path d="M150 190 L230 120 L300 190 Z" fill="#9ec27a" />
      <Rect x={0} y={190} width={300} height={50} fill={SKY} />
      <Circle cx={40} cy={34} r={22} fill="#ffc83d" />
      <G fill="#fff" stroke="#c9d6ea" strokeWidth={2}>
        <Ellipse cx={200} cy={44} rx={44} ry={20} /><Circle cx={186} cy={34} r={18} /><Circle cx={214} cy={30} r={20} />
      </G>
      {[196, 212, 228, 244].map((x) => <Line key={x} x1={x} y1={76} x2={x - 6} y2={96 + (x % 3) * 6} stroke={SKY} strokeWidth={3} strokeLinecap="round" />)}
      {[80, 104].map((x) => <Path key={x} d={`M${x} 182 q8 -12 0 -24 q-8 -12 0 -24 q8 -12 0 -24 q-8 -12 0 -24`} stroke="#9fb4d6" strokeWidth={3} fill="none" strokeDasharray="5 5" />)}
    </G>
  ),
};

/** A labelled science diagram. With `ask: 'name'`, only `part` is marked, with "?"; otherwise every part is numbered. */
export function Diagram({ diagram, part, ask }: { diagram: string; part: string; ask: 'name' | 'find' | 'job' }) {
  const dg = DIAGRAMS[diagram];
  const marks = dg.parts.map((p, k) => ({ ...p, label: String(k + 1) })).filter((p) => ask !== 'name' || p.name === part);
  return (
    <Svg width={300} height={240} viewBox="0 0 300 240" accessibilityLabel={dg.title}>
      {ART[diagram]()}
      {marks.map((m) => (
        <G key={m.name}>
          <Circle cx={m.x} cy={m.y} r={14} fill={ask === 'name' ? colors.pink : colors.brand} stroke="#fff" strokeWidth={3} />
          <SvgText x={m.x} y={m.y + 6} fontSize={17} fontFamily={font.display} fontWeight="700" fill="#fff" textAnchor="middle">{ask === 'name' ? '?' : m.label}</SvgText>
        </G>
      ))}
    </Svg>
  );
}
