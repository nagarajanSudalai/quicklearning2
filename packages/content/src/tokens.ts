import type { ShapeKind } from './types';

// Design tokens taken from the homepage design, shared by web and mobile.
export const colors = {
  ink: '#1c1a3a',
  inkSoft: '#3d3a5c',
  muted: '#6b6890',
  faint: '#9a97b5',
  brand: '#4b3fe0',
  brandDark: '#2f24a8',
  brandDeep: '#3b2fd0',
  brandTint: '#eeebff',
  bg: '#fbfaff',
  surface: '#ffffff',
  border: '#eeebfa',
  choiceBorder: '#e3dff7',
  panel: '#f7f5ff',
  blank: '#9a92d6',
  right: '#2fbf71',
  rightTint: '#e3f8ec',
  rightText: '#1f8a50',
  wrong: '#ff4f8b',
  wrongTint: '#ffe6ee',
  wrongText: '#d6336c',
  starTint: '#fff3d6',
  starText: '#b06a00',
  pink: '#ff4f8b',
  orange: '#ff9a2e',
  green: '#2fbf71',
  blue: '#3b8cff',
  purple: '#9a5cf0',
  teal: '#1fa3c4',
  logoD: '#ff7a3d',
} as const;

export const fonts = {
  display: 'Fredoka',
  body: 'Nunito',
} as const;

export const SHAPE_COLORS: Record<ShapeKind, string> = {
  star: '#ffb800',
  circle: '#3b8cff',
  square: '#ff4f8b',
  tri: '#2fbf71',
  diamond: '#9a5cf0',
  rectangle: '#ff9a2e',
};

export const SHAPE_NAMES: Record<ShapeKind, string> = {
  star: 'star',
  circle: 'circle',
  square: 'square',
  tri: 'triangle',
  diamond: 'diamond',
  rectangle: 'rectangle',
};

/** Polygon points on a 0–100 box; circle, square and rectangle are drawn natively. */
export const SHAPE_POLYGONS: Partial<Record<ShapeKind, [number, number][]>> = {
  tri: [[50, 6], [96, 92], [4, 92]],
  diamond: [[50, 0], [100, 50], [50, 100], [0, 50]],
  star: [[50, 0], [61, 35], [98, 35], [68, 57], [79, 91], [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]],
};
