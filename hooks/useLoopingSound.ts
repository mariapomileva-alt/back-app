import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';
import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioSource,
} from 'expo-audio';

import { attemptPlayback, isAudiblePlayback } from '@/features/audio/playback';
import { DEFAULT_SOUND_VOLUME } from '@/storage/preferences';

const FADE_MS = 1400;

type Options = {
  source: AudioSource;
  autoPlay?: boolean;
  enabled?: boolean;
  initialMuted?: boolean;
  initialVolume?: number;
  lockScreenTitle?: string;
};

export type LoopingPlayback = 'playing' | 'paused' | 'blocked';

function applyVolume(player: { volume: number }, value: number) {
  try {
    player.volume = Math.min(1, Math.max(0, value));
  } catch {
    // iOS Safari and some web engines ignore programmatic volume.
  }
}

async function configureListenAudioSession() {
  try {
    await setIsAudioActiveAsync(true);
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
      shouldRouteThroughEarpiece: false,
    });
  } catch {
    // Web implements audio mode as a no-op; native failures must not crash Listen.
  }
}

export function useLoopingSound({
  source,
  autoPlay = true,
  enabled = true,
  initialMuted = false,
  initialVolume = DEFAULT_SOUND_VOLUME,
  lockScreenTitle,
}: Options) {
  const player = useAudioPlayer(source, {
    updateInterval: 500,
    keepAudioSessionActive: true,
  });
  const status = useAudioPlayerStatus(player);
  const [playback, setPlayback] = useState<LoopingPlayback>(autoPlay ? 'paused' : 'paused');
  const [muted, setMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(initialVolume);

  const [prevInitialMuted, setPrevInitialMuted] = useState(initialMuted);
  if (initialMuted !== prevInitialMuted) {
    setPrevInitialMuted(initialMuted);
    setMuted(initialMuted);
  }

  const [prevInitialVolume, setPrevInitialVolume] = useState(initialVolume);
  if (initialVolume !== prevInitialVolume) {
    setPrevInitialVolume(initialVolume);
    setVolume(initialVolume);
  }

  const fadeFrame = useRef<number | null>(null);
  const fading = useRef(false);
  const fadeTarget = useRef(initialVolume);
  const wantsPlay = useRef(autoPlay);
  const suppressToggle = useRef(true);
  const playerRef = useRef(player);
  playerRef.current = player;

  const isPlaying = playback === 'playing';

  const stopFade = useCallback(() => {
    if (fadeFrame.current != null) {
      cancelAnimationFrame(fadeFrame.current);
      fadeFrame.current = null;
    }
    fading.current = false;
  }, []);

  const fadeIn = useCallback(
    (target: number) => {
      stopFade();
      fading.current = true;
      fadeTarget.current = target;
      applyVolume(player, 0);
      const started = Date.now();
      const tick = () => {
        const t = Math.min(1, (Date.now() - started) / FADE_MS);
        const eased = t * t * (3 - 2 * t);
        applyVolume(player, fadeTarget.current * eased);
        if (t < 1 && fading.current) {
          fadeFrame.current = requestAnimationFrame(tick);
        } else {
          applyVolume(player, fadeTarget.current);
          fading.current = false;
          fadeFrame.current = null;
        }
      };
      fadeFrame.current = requestAnimationFrame(tick);
    },
    [player, stopFade],
  );

  const attachLockScreen = useCallback(() => {
    if (!lockScreenTitle) {
      return;
    }
    try {
      player.setActiveForLockScreen(true, {
        title: lockScreenTitle,
        artist: 'Back',
      });
    } catch {
      // Lock-screen / media-session metadata is best-effort across platforms.
    }
  }, [lockScreenTitle, player]);

  const detachLockScreen = useCallback(() => {
    try {
      player.clearLockScreenControls();
    } catch {
      // Best-effort cleanup when leaving the screen or swapping sounds.
    }
  }, [player]);

  const startPlayback = useCallback(async (resync = false): Promise<boolean> => {
    wantsPlay.current = true;
    await configureListenAudioSession();
    const alreadyAudible = isAudiblePlayback(playerRef.current);
    // Silent bed: keep looping at volume 0 without re-calling play().
    if (alreadyAudible === true && muted) {
      applyVolume(playerRef.current, 0);
      setPlayback('playing');
      return true;
    }
    // Unmuted but HTML `paused === false` is not proof web audio unlocked (e.g. volume-0 autoplay).
    if (alreadyAudible === true && !resync) {
      if (!fading.current) {
        applyVolume(playerRef.current, volume);
      }
      setPlayback('playing');
      return true;
    }
    const started = await attemptPlayback(playerRef.current);
    if (!started) {
      wantsPlay.current = false;
      setPlayback('blocked');
      return false;
    }
    if (muted) {
      applyVolume(playerRef.current, 0);
    } else {
      fadeIn(volume);
    }
    setPlayback('playing');
    return true;
  }, [fadeIn, muted, volume]);

  const stopPlayback = useCallback(() => {
    wantsPlay.current = false;
    stopFade();
    try {
      playerRef.current.pause();
    } catch {
      // Ignore a released player.
    }
    setPlayback((current) => (current === 'blocked' ? 'blocked' : 'paused'));
  }, [stopFade]);

  useEffect(() => {
    let cancelled = false;
    suppressToggle.current = true;
    applyVolume(player, 0);
    try {
      player.loop = true;
      player.muted = muted;
    } catch {
      // Player methods can throw on a released instance during fast unmount.
    }

    async function start() {
      await configureListenAudioSession();
      if (cancelled) {
        return;
      }
      if (!enabled) {
        try {
          player.pause();
        } catch {
          // Ignore.
        }
        applyVolume(player, muted ? 0 : volume);
        suppressToggle.current = false;
        setPlayback('paused');
        return;
      }
      attachLockScreen();
      if (wantsPlay.current || autoPlay) {
        const started = await attemptPlayback(player);
        if (cancelled) {
          return;
        }
        if (started) {
          if (muted) {
            applyVolume(player, 0);
          } else {
            fadeIn(volume);
          }
          wantsPlay.current = true;
          setPlayback('playing');
        } else {
          wantsPlay.current = false;
          applyVolume(player, muted ? 0 : volume);
          setPlayback('blocked');
        }
      } else {
        try {
          player.pause();
        } catch {
          // Ignore.
        }
        applyVolume(player, muted ? 0 : volume);
        setPlayback((current) => (current === 'playing' ? 'paused' : current));
      }
      suppressToggle.current = false;
    }

    void start();

    return () => {
      cancelled = true;
      stopFade();
      try {
        player.pause();
      } catch {
        // Ignore.
      }
      detachLockScreen();
    };
    // Load a single player per bundled source. Volume/play are applied in dedicated effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, enabled]);

  useEffect(() => {
    return () => {
      void setIsAudioActiveAsync(false).catch(() => {});
    };
  }, []);

  useEffect(() => {
    fadeTarget.current = muted ? 0 : volume;
    try {
      player.muted = muted;
    } catch {
      // Ignore.
    }
    if (fading.current) {
      return;
    }
    applyVolume(player, muted ? 0 : volume);
  }, [muted, player, volume]);

  useEffect(() => {
    if (!enabled || suppressToggle.current) {
      return;
    }
    if (playback === 'playing') {
      return;
    }
    try {
      player.pause();
    } catch {
      // Ignore.
    }
  }, [enabled, playback, player]);

  useEffect(() => {
    if (!enabled || !status.isLoaded) {
      return;
    }
    try {
      player.loop = true;
    } catch {
      // Ignore.
    }
  }, [enabled, player, status.isLoaded]);

  useEffect(() => {
    const audible = isAudiblePlayback(player);
    if (audible === false && playback === 'playing') {
      setPlayback(wantsPlay.current ? 'blocked' : 'paused');
      return;
    }
    if (playback === 'playing') {
      return;
    }
    if (!wantsPlay.current) {
      return;
    }
    if (audible === true || (audible === null && status.playing && Platform.OS !== 'web')) {
      setPlayback('playing');
    }
  }, [playback, player, status.playing]);

  useEffect(() => {
    if (!enabled || playback !== 'playing' || !status.didJustFinish) {
      return;
    }
    try {
      player.loop = true;
      void player.seekTo(0).then(() => {
        if (wantsPlay.current) {
          player.play();
        }
      });
    } catch {
      // Native loop usually prevents didJustFinish; this is a web/fallback path.
    }
  }, [enabled, playback, player, status.didJustFinish]);

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      if (next !== 'active') {
        return;
      }
      void configureListenAudioSession();
      if (!enabled || !wantsPlay.current) {
        return;
      }
      void attemptPlayback(player).then((started) => {
        if (!started) {
          wantsPlay.current = false;
          setPlayback('blocked');
        }
      });
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [enabled, player]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    attachLockScreen();
  }, [attachLockScreen, enabled]);

  return {
    isPlaying,
    playback,
    muted,
    volume,
    play: (resync = false) => {
      void startPlayback(resync);
    },
    pause: stopPlayback,
    toggle: () => {
      if (playback === 'playing') {
        stopPlayback();
        return;
      }
      void startPlayback();
    },
    toggleMute: () => setMuted((value) => !value),
    setVolume,
    replay: () => {
      void player.seekTo(0).then(() => {
        void startPlayback();
      });
    },
  };
}
