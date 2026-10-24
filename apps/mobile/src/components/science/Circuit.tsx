import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../../lib/theme';

/** A loop of wire: battery on the left, bulb(s) on top, maybe a switch, a broken wire or a gap with an object. The bulbs are drawn unlit. */
export function Circuit({ battery, broken, bulbs, switch: sw, gap }: { battery: boolean; broken: boolean; bulbs: 1 | 2; switch?: 'open' | 'closed'; gap?: { item: string; name: string } }) {
  const W = '#3b3a5c';
  const bulb = (x: number) => (
    <G key={x}>
      <Circle cx={x} cy={40} r={18} fill="#fff7d6" stroke={W} strokeWidth={3} />
      <Path d={`M${x - 7} 46 q7 -14 14 0`} stroke={W} strokeWidth={2} fill="none" />
      <Rect x={x - 9} y={56} width={18} height={10} rx={2} fill="#bbb" />
    </G>
  );
  const bx = bulbs === 2 ? [125, 195] : [160];
  return (
    <Svg width={300} height={220} viewBox="0 0 300 220" accessibilityLabel={`Circuit: ${battery ? 'battery' : 'no battery'}, ${bulbs} bulb${bulbs > 1 ? 's' : ''}${sw ? `, switch ${sw}` : ''}${broken ? ', broken wire' : ''}${gap ? `, ${gap.name} in the gap` : ''}`}>
      {/* Top wire with bulb(s) */}
      <Line x1={40} y1={66} x2={260} y2={66} stroke={W} strokeWidth={4} />
      {bx.map(bulb)}
      {/* Left side: battery or an empty holder */}
      <Line x1={40} y1={66} x2={40} y2={86} stroke={W} strokeWidth={4} />
      {battery ? (
        <G>
          <Rect x={22} y={86} width={36} height={60} rx={6} fill={colors.orange} />
          <Rect x={33} y={80} width={14} height={8} rx={2} fill="#888" />
          <SvgText x={40} y={112} fontSize={16} fontWeight="700" fill="#fff" textAnchor="middle">+</SvgText>
          <SvgText x={40} y={136} fontSize={18} fontWeight="700" fill="#fff" textAnchor="middle">−</SvgText>
        </G>
      ) : (
        <Rect x={22} y={86} width={36} height={60} rx={6} fill="none" stroke="#b9b5d6" strokeWidth={3} strokeDasharray="6 5" />
      )}
      <Line x1={40} y1={146} x2={40} y2={180} stroke={W} strokeWidth={4} />
      {/* Right side, with a break if the wire is broken */}
      {broken ? (
        <G>
          <Line x1={260} y1={66} x2={260} y2={104} stroke={W} strokeWidth={4} />
          <Line x1={260} y1={124} x2={260} y2={180} stroke={W} strokeWidth={4} />
          <Path d="M252 104 l16 -6 M252 124 l16 6" stroke={colors.wrong} strokeWidth={3} />
        </G>
      ) : (
        <Line x1={260} y1={66} x2={260} y2={180} stroke={W} strokeWidth={4} />
      )}
      {/* Bottom wire, with a switch and/or a gap */}
      <Line x1={40} y1={180} x2={gap ? 120 : sw ? 135 : 260} y2={180} stroke={W} strokeWidth={4} />
      {sw && !gap && (
        <G>
          <Circle cx={135} cy={180} r={5} fill={W} /><Circle cx={185} cy={180} r={5} fill={W} />
          {sw === 'closed' ? <Line x1={135} y1={180} x2={185} y2={180} stroke={W} strokeWidth={5} /> : <Line x1={135} y1={180} x2={180} y2={152} stroke={W} strokeWidth={5} />}
          <Line x1={185} y1={180} x2={260} y2={180} stroke={W} strokeWidth={4} />
          <SvgText x={160} y={208} fontSize={13} fill={colors.muted} textAnchor="middle">switch {sw}</SvgText>
        </G>
      )}
      {gap && (
        <G>
          <Circle cx={120} cy={180} r={5} fill={W} /><Circle cx={180} cy={180} r={5} fill={W} />
          <SvgText x={150} y={190} fontSize={30} textAnchor="middle">{gap.item}</SvgText>
          <Line x1={180} y1={180} x2={260} y2={180} stroke={W} strokeWidth={4} />
          <SvgText x={150} y={214} fontSize={13} fill={colors.muted} textAnchor="middle">{gap.name}</SvgText>
        </G>
      )}
    </Svg>
  );
}
