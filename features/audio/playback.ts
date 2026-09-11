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

/** Confirm that expo-audio actually started. Web play() is fire-and-forget and can fail quietly. */
export async function attemptPlayback(player: PlaybackProbe): Promise<boolean> {
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

  return isAudiblePlayback(player) ?? true;
}
