import * as Speech from 'expo-speech';
import { pickVoice } from '@quickstep/content';

/** Child-friendly delivery: a little slower and brighter than the device default. */
export const SPEECH = { language: 'en-IN', rate: 0.85, pitch: 1.15 } as const;

let chosen: Promise<string | undefined> | null = null;

/** The best available voice id, looked up once. Browsers load voices late, so retry briefly if empty. */
export function bestVoiceId(): Promise<string | undefined> {
  chosen ??= (async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const voices = await Speech.getAvailableVoicesAsync().catch(() => []);
      if (voices.length) return pickVoice(voices)?.identifier;
      await new Promise((r) => setTimeout(r, 300));
    }
    return undefined;
  })();
  return chosen;
}
