import type { ImageSourcePropType } from 'react-native';

import { exerciseAudio, exerciseImages } from '@/features/media/catalog';

export type ListenSoundId = 'rain' | 'ocean' | 'fan' | 'forest' | 'brown';

export type ListenSound = {
  id: ListenSoundId;
  nameKey: string;
  imageLabelKey: string;
  audio: number;
  image?: ImageSourcePropType;
  treatment: 'photo' | 'abstract';
  /** Bundled Listen loops are generated placeholders until production mixes land. */
  placeholderAudio: boolean;
};

export const listenSounds: ListenSound[] = [
  {
    id: 'rain',
    nameKey: 'listen.sounds.rain',
    imageLabelKey: 'listen.images.rain',
    audio: exerciseAudio.softRain,
    image: exerciseImages.listenRain,
    treatment: 'photo',
    placeholderAudio: true,
  },
  {
    id: 'ocean',
    nameKey: 'listen.sounds.ocean',
    imageLabelKey: 'listen.images.ocean',
    audio: exerciseAudio.ocean,
    image: exerciseImages.listenOcean,
    treatment: 'photo',
    placeholderAudio: true,
  },
  {
    id: 'forest',
    nameKey: 'listen.sounds.forest',
    imageLabelKey: 'listen.images.forest',
    audio: exerciseAudio.forest,
    image: exerciseImages.listenForest,
    treatment: 'photo',
    placeholderAudio: true,
  },
  {
    id: 'fan',
    nameKey: 'listen.sounds.fan',
    imageLabelKey: 'listen.images.fan',
    audio: exerciseAudio.fan,
    treatment: 'abstract',
    placeholderAudio: true,
  },
  {
    id: 'brown',
    nameKey: 'listen.sounds.brown',
    imageLabelKey: 'listen.images.brown',
    audio: exerciseAudio.brownNoise,
    treatment: 'abstract',
    placeholderAudio: true,
  },
];

export const defaultListenSoundId: ListenSoundId = 'rain';

export function isListenSoundId(value: string | null): value is ListenSoundId {
  return listenSounds.some((item) => item.id === value);
}
