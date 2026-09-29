import type { ImageSourcePropType } from 'react-native';

import { productionConfig } from '@/config/production';
import { exerciseAudio, productionAudioFiles } from '@/features/media/catalog';

export type ListenSoundGroup = 'nature' | 'steady';

export type ListenSoundId =
  | 'rain'
  | 'ocean'
  | 'stream'
  | 'forest'
  | 'birds'
  | 'fan'
  | 'brown'
  | 'white'
  | 'melody';

export type ListenGraphicVariant =
  | 'rain'
  | 'ocean'
  | 'forest'
  | 'fan'
  | 'brown'
  | 'stream'
  | 'birds'
  | 'white'
  | 'melody';

export type ListenSound = {
  id: ListenSoundId;
  group: ListenSoundGroup;
  nameKey: string;
  imageLabelKey: string;
  audio: number;
  /** Production drop-in path after a human replaces the placeholder require(). */
  productionFile: string;
  image?: ImageSourcePropType;
  treatment: 'photo' | 'abstract';
  graphicVariant?: ListenGraphicVariant;
  /** True until professionally mixed Listen loops ship (bundled synthetics are already distinct). */
  placeholderAudio: boolean;
};

/** True until professionally mixed Listen loops ship and environmentAudioReady is flipped. */
export const listenAudioIsPlaceholder = !productionConfig.environmentAudioReady;

export const listenSoundGroups: { id: ListenSoundGroup; labelKey: string }[] = [
  { id: 'nature', labelKey: 'listen.groups.nature' },
  { id: 'steady', labelKey: 'listen.groups.steady' },
];

/** Fixed playback and picker order (NATURE then STEADY). */
export const listenSounds: ListenSound[] = [
  {
    id: 'rain',
    group: 'nature',
    nameKey: 'listen.sounds.rain',
    imageLabelKey: 'listen.images.rain',
    audio: exerciseAudio.softRain,
    productionFile: productionAudioFiles.softRain,
    treatment: 'abstract',
    graphicVariant: 'rain',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'ocean',
    group: 'nature',
    nameKey: 'listen.sounds.ocean',
    imageLabelKey: 'listen.images.ocean',
    audio: exerciseAudio.ocean,
    productionFile: productionAudioFiles.ocean,
    treatment: 'abstract',
    graphicVariant: 'ocean',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'stream',
    group: 'nature',
    nameKey: 'listen.sounds.stream',
    imageLabelKey: 'listen.images.stream',
    audio: exerciseAudio.gentleStream,
    productionFile: productionAudioFiles.gentleStream,
    treatment: 'abstract',
    graphicVariant: 'stream',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'forest',
    group: 'nature',
    nameKey: 'listen.sounds.forest',
    imageLabelKey: 'listen.images.forest',
    audio: exerciseAudio.forest,
    productionFile: productionAudioFiles.forest,
    treatment: 'abstract',
    graphicVariant: 'forest',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'birds',
    group: 'nature',
    nameKey: 'listen.sounds.birds',
    imageLabelKey: 'listen.images.birds',
    audio: exerciseAudio.distantBirds,
    productionFile: productionAudioFiles.distantBirds,
    treatment: 'abstract',
    graphicVariant: 'birds',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'fan',
    group: 'steady',
    nameKey: 'listen.sounds.fan',
    imageLabelKey: 'listen.images.fan',
    audio: exerciseAudio.fan,
    productionFile: productionAudioFiles.fan,
    treatment: 'abstract',
    graphicVariant: 'fan',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'brown',
    group: 'steady',
    nameKey: 'listen.sounds.brown',
    imageLabelKey: 'listen.images.brown',
    audio: exerciseAudio.brownNoise,
    productionFile: productionAudioFiles.brownNoise,
    treatment: 'abstract',
    graphicVariant: 'brown',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'white',
    group: 'steady',
    nameKey: 'listen.sounds.white',
    imageLabelKey: 'listen.images.white',
    audio: exerciseAudio.softWhiteNoise,
    productionFile: productionAudioFiles.softWhiteNoise,
    treatment: 'abstract',
    graphicVariant: 'white',
    placeholderAudio: listenAudioIsPlaceholder,
  },
  {
    id: 'melody',
    group: 'steady',
    nameKey: 'listen.sounds.melody',
    imageLabelKey: 'listen.images.melody',
    audio: exerciseAudio.softMelody,
    productionFile: productionAudioFiles.softMelody,
    treatment: 'abstract',
    graphicVariant: 'melody',
    placeholderAudio: listenAudioIsPlaceholder,
  },
];

export const defaultListenSoundId: ListenSoundId = 'rain';

/** Store-facing picker (premium pass): eight core loops, no melody chip. */
export const listenPickerSounds: ListenSound[] = listenSounds.filter((item) => item.id !== 'melody');

export function isListenSoundId(value: string | null): value is ListenSoundId {
  return listenSounds.some((item) => item.id === value);
}

export function listenGraphicVariantFor(sound: ListenSound): ListenGraphicVariant {
  if (sound.graphicVariant) {
    return sound.graphicVariant;
  }
  if (sound.id === 'rain' || sound.id === 'ocean' || sound.id === 'forest') {
    return sound.id;
  }
  return sound.id === 'brown' ? 'brown' : 'fan';
}
