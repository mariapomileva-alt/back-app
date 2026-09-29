import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import {
  BREATHE_AMBIENT_MOD_DEPTH,
  BREATHE_AMBIENT_MOD_FLOOR,
  BREATHE_AMBIENT_VOLUME,
  BREATHE_REDUCE_MOTION_MOD_DEPTH,
  BREATHE_REDUCE_MOTION_MOD_FLOOR,
  breatheAmbient,
} from '@/features/breathe/ambient';
import { useLoopingSound } from '@/hooks/useLoopingSound';
import { loadBreatheSfxMuted, loadSoundMuted, saveBreatheSfxMuted } from '@/storage/preferences';

type Options = {
  /** Orb openness 0–1 from the same clock as the circle. */
  openness: number;
  /** Pattern chooser or other UI that should hush the bed. */
  sessionPaused?: boolean;
  reduceMotion?: boolean;
};

function isForeground(state: AppStateStatus): boolean {
  if (Platform.OS === 'web') {
    return state !== 'background';
  }
  return state === 'active';
}

function modulatedVolume(openness: number, reduceMotion: boolean): number {
  const floor = reduceMotion ? BREATHE_REDUCE_MOTION_MOD_FLOOR : BREATHE_AMBIENT_MOD_FLOOR;
  const depth = reduceMotion ? BREATHE_REDUCE_MOTION_MOD_DEPTH : BREATHE_AMBIENT_MOD_DEPTH;
  const clamped = Math.min(1, Math.max(0, openness));
  return BREATHE_AMBIENT_VOLUME * (floor + depth * clamped);
}

export function useBreatheAmbient({
  openness,
  sessionPaused = false,
  reduceMotion = false,
}: Options) {
  const [breatheMuted, setBreatheMuted] = useState(false);
  const [masterMuted, setMasterMuted] = useState(false);
  const [prefLoaded, setPrefLoaded] = useState(false);
  const [appPaused, setAppPaused] = useState(!isForeground(AppState.currentState));

  useEffect(() => {
    let cancelled = false;
    void Promise.all([loadBreatheSfxMuted(), loadSoundMuted()]).then(([localMuted, globalMuted]) => {
      if (!cancelled) {
        setBreatheMuted(localMuted);
        setMasterMuted(globalMuted);
        setPrefLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      setAppPaused(!isForeground(state));
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

  const ambientMuted = useMemo(
    () => breatheMuted || masterMuted,
    [breatheMuted, masterMuted],
  );

  const paused = sessionPaused || appPaused;

  const loop = useLoopingSound({
    source: breatheAmbient.loop,
    autoPlay: true,
    enabled: prefLoaded,
    initialMuted: ambientMuted,
    initialVolume: modulatedVolume(openness, reduceMotion),
  });

  const loopRef = useRef(loop);
  loopRef.current = loop;
  const prevAmbientMutedRef = useRef(ambientMuted);

  useEffect(() => {
    if (!prefLoaded || ambientMuted || paused) {
      return;
    }
    loopRef.current.setVolume(modulatedVolume(openness, reduceMotion));
  }, [ambientMuted, openness, paused, prefLoaded, reduceMotion]);

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
      return;
    }
    if (loopRef.current.playback !== 'playing') {
      loopRef.current.play();
      return;
    }
    if (wasMuted) {
      loopRef.current.play(true);
    }
  }, [ambientMuted, paused, prefLoaded]);

  const unlockFromUserGesture = useCallback(() => {
    if (ambientMuted || paused) {
      return;
    }
    loopRef.current.play(true);
  }, [ambientMuted, paused]);

  const toggleMute = useCallback(() => {
    setBreatheMuted((current) => {
      const next = !current;
      void saveBreatheSfxMuted(next);
      return next;
    });
  }, []);

  return {
    /** Breathe-only mute preference (header speaker). */
    muted: breatheMuted,
    ambientMuted,
    unlockFromUserGesture,
    toggleMute,
  };
}
