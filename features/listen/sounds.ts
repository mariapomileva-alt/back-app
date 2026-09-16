import type { ImageSourcePropType } from 'react-native';

import { productionConfig } from '@/config/production';
import { exerciseAudio, exerciseImages, productionAudioFiles } from '@/features/media/catalog';

export type ListenSoundId = 'rain' | 'ocean' | 'fan' | 'forest' | 'brown';

export type ListenSound = {
  id: ListenSoundId;
  nameKey: string;
  imageLabelKey: string;
  audio: number;
  /** Production drop-in path after a human replaces the placeholder require(). */
  productionFile: string;
  image?: ImageSourcePropType;
  treatment: 'photo' | 'abstract';
  /** True until professionally mixed Listen loops ship (bundled synthetics are already distinct). */
  placeholderAudio: boolean;
};

/** True until professionally mixed Listen loops ship and environmentAudioReady is flipped. */
export const listenAudioIsPlaceholder = !productionConfig.environmentAudioReady;

export const listenSounds: ListenSound[] = [
  {
    id: 'rain',
    nameKey: 'listen.sounds.rain',
    imageLabelKey: 'listen.images.rain',
    audio: exerciseAudio.softRain,
    productionFile: productionAudioFiles.softRain,
    image: exerciseImages.listenRain,
    treatment: 'photo',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'ocean',
    nameKey: 'listen.sounds.ocean',
    imageLabelKey: 'listen.images.ocean',
    audio: exerciseAudio.ocean,
    productionFile: productionAudioFiles.ocean,
    image: exerciseImages.listenOcean,
    treatment: 'photo',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'forest',
    nameKey: 'listen.sounds.forest',
    imageLabelKey: 'listen.images.forest',
    audio: exerciseAudio.forest,
    productionFile: productionAudioFiles.forest,
    image: exerciseImages.listenForest,
    treatment: 'photo',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'fan',
    nameKey: 'listen.sounds.fan',
    imageLabelKey: 'listen.images.fan',
    audio: exerciseAudio.fan,
    productionFile: productionAudioFiles.fan,
    treatment: 'abstract',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'brown',
    nameKey: 'listen.sounds.brown',
    imageLabelKey: 'listen.images.brown',
    audio: exerciseAudio.brownNoise,
    productionFile: productionAudioFiles.brownNoise,
    treatment: 'abstract',
    placeholderAudio: listenAudioIsPlaceholder,
  },
];

export const defaultListenSoundId: ListenSoundId = 'rain';

export function isListenSoundId(value: string | null): value is ListenSoundId {
  return listenSounds.some((item) => item.id === value);
}
