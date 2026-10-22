import type { CSSProperties } from 'react';
import type { ShapeKind } from '../data';

const COLORS: Record<ShapeKind, string> = {
  star: '#ffb800',
  circle: '#3b8cff',
  square: '#ff4f8b',
  tri: '#2fbf71',
  diamond: '#9a5cf0',
};

const CLIPS: Partial<Record<ShapeKind, string>> = {
  tri: 'polygon(50% 6%,96% 92%,4% 92%)',
  diamond: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
  star: 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
};

export function Shape({ kind, size = 52, animation }: { kind: ShapeKind; size?: number; animation?: string }) {
  const style: CSSProperties = {
    width: size,
    height: size,
    display: 'inline-block',
    flex: 'none',
    background: COLORS[kind],
    borderRadius: kind === 'circle' ? '50%' : kind === 'square' ? 10 : undefined,
    clipPath: CLIPS[kind],
    animation: animation ?? 'none',
  };
  return <span aria-label={kind} role="img" style={style} />;
}
