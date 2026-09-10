import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioSource,
} from 'expo-audio';

const FADE_MS = 1400;
const DEFAULT_VOLUME = 0.7;

type Options = {
  source: AudioSource;
  autoPlay?: boolean;
  enabled?: boolean;
  initialMuted?: boolean;
  lockScreenTitle?: string;
};

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
  lockScreenTitle,
}: Options) {
  const player = useAudioPlayer(source, {
    updateInterval: 500,
    keepAudioSessionActive: true,
  });
  const status = useAudioPlayerStatus(player);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  const [prevInitialMuted, setPrevInitialMuted] = useState(initialMuted);
  if (initialMuted !== prevInitialMuted) {
    setPrevInitialMuted(initialMuted);
    setMuted(initialMuted);
  }

  const fadeFrame = useRef<number | null>(null);
  const fading = useRef(false);
  const fadeTarget = useRef(DEFAULT_VOLUME);
  const wantsPlay = useRef(autoPlay);
  const suppressToggle = useRef(true);
  wantsPlay.current = isPlaying;

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
        return;
      }
      attachLockScreen();
      if (isPlaying) {
        applyVolume(player, 0);
        try {
          player.play();
        } catch {
          setIsPlaying(false);
          suppressToggle.current = false;
          return;
        }
        if (muted) {
          applyVolume(player, 0);
        } else {
          fadeIn(volume);
        }
      } else {
        try {
          player.pause();
        } catch {
          // Ignore.
        }
        applyVolume(player, muted ? 0 : volume);
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
    try {
      if (isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    } catch {
      if (isPlaying) {
        setIsPlaying(false);
      }
    }
  }, [enabled, isPlaying, player]);

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
    if (!enabled || !isPlaying || !status.didJustFinish) {
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
  }, [enabled, isPlaying, player, status.didJustFinish]);

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      if (next !== 'active') {
        return;
      }
      void configureListenAudioSession();
      if (!enabled || !wantsPlay.current) {
        return;
      }
      try {
        player.play();
      } catch {
        // Ignore.
      }
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
