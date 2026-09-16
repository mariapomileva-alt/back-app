import { useCallback, useEffect, useRef } from 'react';
import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
  type AudioPlayer,
  type AudioSource,
} from 'expo-audio';

import { attemptPlayback } from '@/features/audio/playback';

type Options = {
  source: AudioSource;
  volume?: number;
};

async function configureSfxSession() {
  try {
    await setIsAudioActiveAsync(true);
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
      shouldRouteThroughEarpiece: false,
    });
  } catch {
    // Web implements audio mode as a no-op.
  }
}

function applyVolume(player: AudioPlayer, volume: number) {
  try {
    player.volume = Math.min(1, Math.max(0, volume));
  } catch {
    // Some web engines ignore programmatic volume.
  }
}

/** Short bundled cue. Not for looping environment or guided voice. */
export function useOneShotSound({ source, volume = 0.32 }: Options) {
  const player = useAudioPlayer(source, { updateInterval: 500 });
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  useEffect(() => {
    let cancelled = false;
    void configureSfxSession().then(() => {
      if (cancelled) {
        return;
      }
      try {
        player.loop = false;
        applyVolume(player, volumeRef.current);
      } catch {
        // Ignore a released player during unmount.
      }
    });
    return () => {
      cancelled = true;
      try {
        player.pause();
      } catch {
        // Ignore.
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  const play = useCallback(
    async (muted: boolean): Promise<boolean> => {
      if (muted) {
        return false;
      }
      await configureSfxSession();
      try {
        player.loop = false;
        applyVolume(player, volumeRef.current);
        await player.seekTo(0);
        return await attemptPlayback(player);
      } catch {
        return false;
      }
    },
    [player],
  );

  const unlock = useCallback(async (): Promise<boolean> => {
    await configureSfxSession();
    try {
      player.loop = false;
      applyVolume(player, 0.001);
      await player.seekTo(0);
      const started = await attemptPlayback(player);
      applyVolume(player, volumeRef.current);
      try {
        player.pause();
      } catch {
        // Ignore.
      }
      return started;
    } catch {
      applyVolume(player, volumeRef.current);
      return false;
    }
  }, [player]);

  return { play, unlock };
}
