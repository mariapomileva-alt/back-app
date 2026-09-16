import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GROUND_AMBIENT_VOLUME, groundAmbient } from '@/features/ground/ambient';
import { useLoopingSound } from '@/hooks/useLoopingSound';
import { loadGroundAmbientMuted, saveGroundAmbientMuted } from '@/storage/preferences';

type Options = {
  paused?: boolean;
  /** Voice / settings master mute (same key as Listen and guided narration). */
  masterMuted?: boolean;
};

export function useGroundAmbient({ paused = false, masterMuted = false }: Options = {}) {
  const [groundMuted, setGroundMuted] = useState(false);
  const [prefLoaded, setPrefLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadGroundAmbientMuted().then((localMuted) => {
      if (!cancelled) {
        setGroundMuted(localMuted);
        setPrefLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const ambientMuted = useMemo(() => groundMuted || masterMuted, [groundMuted, masterMuted]);

  const loop = useLoopingSound({
    source: groundAmbient.loop,
    autoPlay: true,
    enabled: prefLoaded,
    initialMuted: ambientMuted,
    initialVolume: GROUND_AMBIENT_VOLUME,
  });

  const loopRef = useRef(loop);
  loopRef.current = loop;
  const prevAmbientMutedRef = useRef(ambientMuted);

  useEffect(() => {
    if (!prefLoaded) {
      return;
    }
    const wasMuted = prevAmbientMutedRef.current;
    prevAmbientMutedRef.current = ambientMuted;
    if (paused) {
      loopRef.current.pause();
      return;
    }
    if (ambientMuted) {
      // Keep the loop running silently so unmute does not restart the bed.
      return;
    }
    if (loopRef.current.playback !== 'playing') {
      loopRef.current.play();
      return;
    }
    // Unmute after a silent bed: re-sync play() on the user gesture that toggled mute.
    if (wasMuted) {
      loopRef.current.play(true);
    }
  }, [ambientMuted, paused, prefLoaded]);

  const unlockFromUserGesture = useCallback(() => {
    if (paused || ambientMuted) {
      return;
    }
    // Always re-attempt on tap so web NotAllowedError unlocks even when paused === false.
    loopRef.current.play(true);
  }, [ambientMuted, paused]);

  const toggleMute = useCallback(() => {
    setGroundMuted((current) => {
      const next = !current;
      void saveGroundAmbientMuted(next);
      return next;
    });
  }, []);

  return {
    muted: groundMuted,
    ambientMuted,
    unlockFromUserGesture,
    toggleMute,
  };
}
