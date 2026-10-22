import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { playClip, stopClip } from './clips';
import { speakable } from '@quickstep/content';
import { SPEECH, bestVoiceId } from './voice';

// Bumped on every call so a slow voice lookup can't speak over a newer line.
let latest = 0;

/**
 * Read text aloud — Grade 1 children can't rely on reading the prompt.
 * Uses a pre-recorded clip when one exists, otherwise the best Indian English device voice.
 */
export function say(text: string, enabled: boolean) {
  if (!enabled) return;
  const id = ++latest;
  Speech.stop();
  stopClip();
  if (playClip(text)) return;
  bestVoiceId().then((voice) => {
    if (id === latest) Speech.speak(speakable(text), { ...SPEECH, voice });
  });
}

export function buzz(kind: 'right' | 'wrong') {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(kind === 'right' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => {});
}
