import '../lib/polyfills';
import { Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProgressProvider, useProgress } from '../lib/progress';
import { colors } from '../lib/theme';

function Navigator() {
  const { ready } = useProgress();
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}

export default function RootLayout() {
  const [loaded, fontError] = useFonts({ Fredoka_600SemiBold, Fredoka_700Bold, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });
  // A font that fails or times out (slow mobile data) must not leave the page blank: carry on with system fonts.
  if (!loaded && !fontError) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <StatusBar style="dark" />
        <Navigator />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}

/** Shown instead of a blank screen if something throws while rendering. */
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => Promise<void> }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.ink }}>Oops, something went wrong.</Text>
      <Text style={{ fontSize: 14, color: colors.muted, textAlign: 'center' }}>{error.message}</Text>
      <Pressable onPress={retry} accessibilityRole="button" style={{ backgroundColor: colors.brand, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Try again</Text>
      </Pressable>
    </View>
  );
}
