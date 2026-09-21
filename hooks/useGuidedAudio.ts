import { useCallback, useEffect, useState } from 'react';
import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
  type AudioSource,
} from 'expo-audio';

import { attemptPlayback } from '@/features/audio/playback';

type Options = {
  source: AudioSource;
  autoPlay?: boolean;
  initialMuted?: boolean;
};

/** One-shot guided voice. Do not use for looping environment sound. */
export function useGuidedAudio({ source, autoPlay = false, initialMuted = false }: Options) {
  const player = useAudioPlayer(source, { updateInterval: 500 });
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    setMuted(initialMuted);
  }, [initialMuted]);

  const applyVolume = useCallback(() => {
    try {
      player.muted = muted;
      player.volume = muted ? 0 : volume;
    } catch {
      // Web volume can be ignored; never crash the guided session.
    }
  }, [muted, player, volume]);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        await setIsAudioActiveAsync(true);
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: 'doNotMix',
          shouldRouteThroughEarpiece: false,
        });
      } catch {
        // Web implements audio mode as a no-op.
      }
      if (cancelled) {
        return;
      }
      try {
        player.loop = false;
        applyVolume();
        if (isPlaying) {
          const started = await attemptPlayback(player);
          if (!started) {
            setIsPlaying(false);
          }
        } else {
          player.pause();
        }
      } catch {
        // Ignore a released player during unmount.
      }
    }

    void start();

    return () => {
      cancelled = true;
      try {
        player.pause();
      } catch {
        // Ignore.
      }
    };
    // Reload only when the bundled source changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  useEffect(() => {
    applyVolume();
  }, [applyVolume]);

  useEffect(() => {
    if (isPlaying) {
      void attemptPlayback(player).then((started) => {
        if (!started) {
          setIsPlaying(false);
        }
      });
      return;
    }
    try {
      player.pause();
    } catch {
      // Ignore.
    }
  }, [isPlaying, player]);

  return {
    isPlaying,
    muted,
    volume,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    toggle: () => setIsPlaying((value) => !value),
    toggleMute: () => setMuted((value) => !value),
    setVolume,
    replay: () => {
      void player.seekTo(0).then(() => setIsPlaying(true));
    },
  };
}
