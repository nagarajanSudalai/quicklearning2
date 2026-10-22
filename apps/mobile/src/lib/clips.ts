import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { clipKey } from '@quickstep/content';
import { CLIPS } from './voice-manifest';

let player: AudioPlayer | null = null;
let modeSet = false;

export const hasClip = (text: string) => clipKey(text) in CLIPS;

/** Play the pre-recorded clip for `text`. Returns false if there is none, so the caller can fall back to TTS. */
export function playClip(text: string): boolean {
  const source = CLIPS[clipKey(text)];
  if (source === undefined) return false;
  if (!modeSet) {
    modeSet = true;
    // Play even with the iPhone's silent switch on — the voice is the instructions.
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }
  if (player) player.replace(source);
  else player = createAudioPlayer(source);
  player.play();
  return true;
}

export function stopClip() {
  player?.pause();
}
