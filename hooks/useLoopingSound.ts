import { useEffect, useRef, useState } from 'react';
import {
  setAudioModeAsync,
  useAudioPlayer,
  type AudioSource,
} from 'expo-audio';

type Options = {
  source: AudioSource;
  autoPlay?: boolean;
};

export function useLoopingSound({ source, autoPlay = true }: Options) {
  const player = useAudioPlayer(source);
  const sourceRef = useRef(source);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
      allowsRecording: false,
    });
  }, []);

  useEffect(() => {
    player.loop = true;
    player.volume = muted ? 0 : volume;
    player.muted = muted;

    if (sourceRef.current !== source) {
      player.replace(source);
      sourceRef.current = source;
    }

    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
    // Reload playback when the bundled source or player instance changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, player]);

  useEffect(() => {
    player.volume = muted ? 0 : volume;
    player.muted = muted;
  }, [muted, volume, player]);

  useEffect(() => {
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
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
      void player.seekTo(0);
      setIsPlaying(true);
    },
  };
}
