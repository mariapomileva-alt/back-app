import { exerciseAudio, exerciseImages } from '@/features/media/catalog';

export type ListenSoundId = 'rain' | 'ocean' | 'fan' | 'forest' | 'brown';

export const listenSounds: Array<{
  id: ListenSoundId;
  nameKey: string;
  imageLabelKey: string;
  audio: number;
  image: (typeof exerciseImages)[keyof typeof exerciseImages];
  treatment: 'photo' | 'abstract';
}> = [
  {
    id: 'rain',
    nameKey: 'listen.sounds.rain',
    imageLabelKey: 'listen.images.rain',
    audio: exerciseAudio.softRain,
    image: exerciseImages.listenRain,
    treatment: 'photo',
  },
  {
    id: 'ocean',
    nameKey: 'listen.sounds.ocean',
    imageLabelKey: 'listen.images.ocean',
    audio: exerciseAudio.ocean,
    image: exerciseImages.listenOcean,
    treatment: 'photo',
  },
  {
    id: 'forest',
    nameKey: 'listen.sounds.forest',
    imageLabelKey: 'listen.images.forest',
    audio: exerciseAudio.forest,
    image: exerciseImages.listenForest,
    treatment: 'photo',
  },
  {
    id: 'fan',
    nameKey: 'listen.sounds.fan',
    imageLabelKey: 'listen.images.fan',
    audio: exerciseAudio.fan,
    image: exerciseImages.listenFan,
    treatment: 'abstract',
  },
  {
    id: 'brown',
    nameKey: 'listen.sounds.brown',
    imageLabelKey: 'listen.images.brown',
    audio: exerciseAudio.brownNoise,
    image: exerciseImages.listenBrown,
    treatment: 'abstract',
  },
];

export const defaultListenSoundId: ListenSoundId = 'rain';
