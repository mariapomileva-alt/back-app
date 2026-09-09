import { useEffect, useRef, useState } from 'react';
import { Audio, type AVPlaybackSource } from 'expo-av';

type Options = {
  source: AVPlaybackSource;
  autoPlay?: boolean;
};

export function useLoopingSound({ source, autoPlay = true }: Options) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(source, {
        isLooping: true,
        volume: muted ? 0 : volume,
        shouldPlay: isPlaying,
      });

      if (cancelled) {
        await sound.unloadAsync();
        return;
      }
      soundRef.current = sound;
    }

    void load();

    return () => {
      cancelled = true;
      const current = soundRef.current;
      soundRef.current = null;
      void current?.unloadAsync();
    };
    // Reload only when the bundled source changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) {
      return;
    }
    void sound.setVolumeAsync(muted ? 0 : volume);
  }, [muted, volume]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) {
      return;
    }
    if (isPlaying) {
      void sound.playAsync();
    } else {
      void sound.pauseAsync();
    }
  }, [isPlaying]);

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
      const sound = soundRef.current;
      void sound?.setPositionAsync(0);
      setIsPlaying(true);
    },
  };
}
