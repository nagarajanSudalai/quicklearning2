import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

/** Read text aloud — Grade 1 children can't rely on reading the prompt. */
export function say(text: string, enabled: boolean) {
  if (!enabled) return;
  Speech.stop();
  Speech.speak(text, { rate: 0.9, pitch: 1.1 });
}

export function buzz(kind: 'right' | 'wrong') {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(kind === 'right' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => {});
}
