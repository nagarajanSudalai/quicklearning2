import type { CSSProperties } from 'react';
import { SHAPE_COLORS, SHAPE_NAMES, SHAPE_POLYGONS, type ShapeKind } from '@quickstep/content';

const clip = (kind: ShapeKind) => {
  const pts = SHAPE_POLYGONS[kind];
  return pts ? `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(',')})` : undefined;
};

export function Shape({ kind, size = 52, animation }: { kind: ShapeKind; size?: number; animation?: string }) {
  const style: CSSProperties = {
    width: size,
    height: kind === 'rectangle' ? Math.round(size * 0.62) : size,
    display: 'inline-block',
    flex: 'none',
    background: SHAPE_COLORS[kind],
    borderRadius: kind === 'circle' ? '50%' : kind === 'square' || kind === 'rectangle' ? 10 : undefined,
    clipPath: clip(kind),
    animation: animation ?? 'none',
  };
  return <span aria-label={SHAPE_NAMES[kind]} role="img" style={style} />;
}
