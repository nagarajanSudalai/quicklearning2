import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, text } from '../lib/theme';
import { useProgress } from '../lib/progress';

/** Chunky button with a solid bottom "shadow" that presses down, as on the homepage. */
export function Button3D({
  label, onPress, color = colors.brand, shadow = colors.brandDark, size = 'md', style, disabled,
}: {
  label: string; onPress: () => void; color?: string; shadow?: string; size?: 'md' | 'lg'; style?: StyleProp<ViewStyle>; disabled?: boolean;
}) {
  const depth = size === 'lg' ? 6 : 4;
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" style={style}>
      {({ pressed }) => (
        <View
          style={[
            styles.btn,
            size === 'lg' && styles.btnLg,
            { backgroundColor: color, boxShadow: `0 ${pressed ? 1 : depth}px 0 ${shadow}`, transform: [{ translateY: pressed ? depth - 1 : 0 }], opacity: disabled ? 0.5 : 1 },
          ]}
        >
          <Text style={[styles.btnText, size === 'lg' && styles.btnTextLg]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Logo({ small }: { small?: boolean }) {
  return (
    <Text style={[styles.logo, small && { fontSize: 24 }]} accessibilityRole="header">
      Quick<Text style={{ color: colors.logoD }}>S</Text>te<Text style={{ color: colors.pink }}>p</Text>
    </Text>
  );
}

export function StarBadge({ stars }: { stars: number }) {
  return (
    <View style={styles.star} accessibilityLabel={`${stars} stars`}>
      <Text style={styles.starText}>★ {stars}</Text>
    </View>
  );
}

/** Screen shell: safe area, top bar with back + stars, scrollable body. */
export function Screen({ children, back, title, scroll = true }: { children: ReactNode; back?: boolean; title?: string; scroll?: boolean }) {
  const { stars } = useProgress();
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.bar}>
        {back ? (
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} accessibilityRole="button" accessibilityLabel="Back" style={styles.back} hitSlop={10}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
        ) : (
          <Logo small />
        )}
        {title ? <Text style={[text.h3, { flex: 1, textAlign: 'center' }]} numberOfLines={1}>{title}</Text> : <View style={{ flex: 1 }} />}
        <StarBadge stars={stars} />
      </View>
      <Body style={{ flex: 1 }} contentContainerStyle={scroll ? styles.body : undefined}>
        {scroll ? children : <View style={[styles.body, { flex: 1 }]}>{children}</View>}
      </Body>
    </SafeAreaView>
  );
}

/** Coloured rounded tile with a glyph, like the homepage subject tiles. */
export function Tile({ glyph, color, size = 56 }: { glyph: string; color: string; size?: number }) {
  return (
    <View style={[styles.tile, { backgroundColor: color, width: size, height: size, borderRadius: size * 0.29 }]}>
      <Text style={[styles.tileText, { fontSize: glyph.length > 2 ? size * 0.3 : size * 0.46 }]}>{glyph}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  body: { padding: 20, gap: 18, width: '100%', maxWidth: 640, alignSelf: 'center' },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.brandTint, alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: font.bodyHeavy, fontSize: 22, color: colors.brandDeep, marginTop: -2 },
  logo: { fontFamily: font.display, fontSize: 30, color: colors.brandDeep, letterSpacing: -0.5 },
  star: { backgroundColor: colors.starTint, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  starText: { fontFamily: font.bodyHeavy, fontSize: 15, color: colors.starText },
  btn: { borderRadius: 14, paddingVertical: 12, paddingHorizontal: 22, alignItems: 'center' },
  btnLg: { borderRadius: 18, paddingVertical: 16, paddingHorizontal: 34 },
  btnText: { fontFamily: font.bodyHeavy, fontSize: 16, color: '#fff' },
  btnTextLg: { fontFamily: font.displaySemi, fontSize: 22 },
  tile: { alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,.15)' },
  tileText: { fontFamily: font.display, color: '#fff' },
});
