import type { ListenSoundId } from '@/features/listen/sounds';

/** Trim so tonal loops match noise beds at the same volume slider. */
const PLAYBACK_GAIN: Partial<Record<ListenSoundId, number>> = {
  melody: 0.88,
};

export function listenPlaybackGainFor(id: ListenSoundId): number {
  return PLAYBACK_GAIN[id] ?? 1;
}

export function listenEffectiveVolume(userVolume: number, soundId: ListenSoundId): number {
  return userVolume * listenPlaybackGainFor(soundId);
}
