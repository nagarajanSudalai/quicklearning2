import Svg, { Circle, Polygon, Rect } from 'react-native-svg';
import { SHAPE_COLORS, SHAPE_NAMES, SHAPE_POLYGONS, type ShapeKind } from '@quickstep/content';

export function Shape({ kind, size = 52 }: { kind: ShapeKind; size?: number }) {
  const fill = SHAPE_COLORS[kind];
  const pts = SHAPE_POLYGONS[kind];
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityLabel={SHAPE_NAMES[kind]}>
      {kind === 'circle' && <Circle cx={50} cy={50} r={50} fill={fill} />}
      {kind === 'square' && <Rect x={0} y={0} width={100} height={100} rx={19} fill={fill} />}
      {kind === 'rectangle' && <Rect x={0} y={19} width={100} height={62} rx={12} fill={fill} />}
      {pts && <Polygon points={pts.map(([x, y]) => `${x},${y}`).join(' ')} fill={fill} />}
    </Svg>
  );
}
