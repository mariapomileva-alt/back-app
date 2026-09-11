import { Platform } from 'react-native';

type PlaybackProbe = {
  play: () => unknown;
  paused?: boolean;
};

/** HTML media `paused` is the only honest web signal. expo-audio play() can set playing first. */
export function isAudiblePlayback(player: { paused?: boolean }): boolean | null {
  if (typeof player.paused === 'boolean') {
    return !player.paused;
  }
  return null;
}

/** Stop leftover HTML audio so Listen/Ground never stack two players. */
export function pauseOtherWebAudio(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }
  document.querySelectorAll('audio').forEach((node) => {
    try {
      (node as HTMLAudioElement).pause();
    } catch {
      // Ignore a detached element.
    }
  });
}

/** Confirm that expo-audio actually started. Web play() is fire-and-forget and can fail quietly. */
export async function attemptPlayback(player: PlaybackProbe): Promise<boolean> {
  pauseOtherWebAudio();
  try {
    const result = player.play();
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      await (result as Promise<unknown>);
    }
  } catch {
    return false;
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 180);
  });

  const audible = isAudiblePlayback(player);
  if (audible != null) {
    return audible;
  }
  // Web without a paused flag is not proof of sound. Native may omit the flag.
  return Platform.OS !== 'web';
}
