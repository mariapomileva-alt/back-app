/** Confirm that expo-audio actually started. Web play() is fire-and-forget and can fail quietly. */
export async function attemptPlayback(player: { play: () => void; paused?: boolean }): Promise<boolean> {
  try {
    player.play();
  } catch {
    return false;
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 150);
  });

  if (typeof player.paused === 'boolean') {
    return !player.paused;
  }

  return true;
}
