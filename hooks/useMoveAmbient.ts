import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MOVE_AMBIENT_VOLUME, moveAmbient } from '@/features/move/ambient';
import { useLoopingSound } from '@/hooks/useLoopingSound';
import {
  loadMoveAmbientMuted,
  loadSoundMuted,
  saveMoveAmbientMuted,
} from '@/storage/preferences';

type Options = {
  /** Activity menu or other overlay that should hush the bed. */
  sessionPaused?: boolean;
};

export function useMoveAmbient({ sessionPaused = false }: Options = {}) {
  const [moveMuted, setMoveMuted] = useState(false);
  const [masterMuted, setMasterMuted] = useState(false);
  const [prefLoaded, setPrefLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([loadMoveAmbientMuted(), loadSoundMuted()]).then(([localMuted, globalMuted]) => {
      if (!cancelled) {
        setMoveMuted(localMuted);
        setMasterMuted(globalMuted);
        setPrefLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const ambientMuted = useMemo(() => moveMuted || masterMuted, [moveMuted, masterMuted]);

  const loop = useLoopingSound({
    source: moveAmbient.loop,
    autoPlay: true,
    enabled: prefLoaded,
    initialMuted: ambientMuted,
    initialVolume: MOVE_AMBIENT_VOLUME,
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
    if (sessionPaused) {
      loopRef.current.pause();
      return;
    }
    if (ambientMuted) {
      return;
    }
    if (loopRef.current.playback !== 'playing') {
      loopRef.current.play();
      return;
    }
    if (wasMuted) {
      loopRef.current.play(true);
    }
  }, [ambientMuted, prefLoaded, sessionPaused]);

  const unlockFromUserGesture = useCallback(() => {
    if (ambientMuted) {
      return;
    }
    loopRef.current.play(true);
  }, [ambientMuted]);

  const toggleMute = useCallback(() => {
    setMoveMuted((current) => {
      const next = !current;
      void saveMoveAmbientMuted(next);
      return next;
    });
  }, []);

  return {
    muted: moveMuted,
    ambientMuted,
    unlockFromUserGesture,
    toggleMute,
  };
}
