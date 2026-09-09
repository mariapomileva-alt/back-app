import type {
  CuriousItem,
  MicroStoryItem,
  ObservationItem,
  ReadPack,
  WordItem,
} from './types';

import curious from '../../content/read/en/curious.json';
import notice from '../../content/read/en/notice.json';
import observe from '../../content/read/en/observe.json';
import stories from '../../content/read/en/stories.json';
import words from '../../content/read/en/words.json';

export const englishReadPack: ReadPack = {
  language: 'en',
  microStories: stories as MicroStoryItem[],
  curious: curious as CuriousItem[],
  words: words as WordItem[],
  observations: observe as ObservationItem[],
  environments: notice as ObservationItem[],
};

export function loadReadPack(): ReadPack {
  return englishReadPack;
}
