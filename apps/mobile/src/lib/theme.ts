import { StyleSheet } from 'react-native';
import { colors } from '@quickstep/content';

export { colors };

// Loaded in src/app/_layout.tsx; each weight is its own font family on native.
export const font = {
  display: 'Fredoka_700Bold',
  displaySemi: 'Fredoka_600SemiBold',
  body: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
  bodyHeavy: 'Nunito_800ExtraBold',
};

export const text = StyleSheet.create({
  h1: { fontFamily: font.display, fontSize: 34, lineHeight: 38, color: colors.ink, letterSpacing: -0.5 },
  h2: { fontFamily: font.display, fontSize: 26, lineHeight: 30, color: colors.ink },
  h3: { fontFamily: font.displaySemi, fontSize: 20, color: colors.ink },
  body: { fontFamily: font.body, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  small: { fontFamily: font.bodyBold, fontSize: 13, color: colors.muted },
  eyebrow: { fontFamily: font.bodyHeavy, fontSize: 13, color: colors.muted, letterSpacing: 0.6, textTransform: 'uppercase' },
});
