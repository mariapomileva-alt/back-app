import type {
  CuriousItem,
  MicroStoryItem,
  ObservationItem,
  ReadLanguage,
  ReadPack,
  WordItem,
} from './types';

import curiousDe from '../../content/read/de/curious.json';
import noticeDe from '../../content/read/de/notice.json';
import observeDe from '../../content/read/de/observe.json';
import storiesDe from '../../content/read/de/stories.json';
import wordsDe from '../../content/read/de/words.json';

import curiousEn from '../../content/read/en/curious.json';
import noticeEn from '../../content/read/en/notice.json';
import observeEn from '../../content/read/en/observe.json';
import storiesEn from '../../content/read/en/stories.json';
import wordsEn from '../../content/read/en/words.json';

import curiousEs from '../../content/read/es/curious.json';
import noticeEs from '../../content/read/es/notice.json';
import observeEs from '../../content/read/es/observe.json';
import storiesEs from '../../content/read/es/stories.json';
import wordsEs from '../../content/read/es/words.json';

import curiousFr from '../../content/read/fr/curious.json';
import noticeFr from '../../content/read/fr/notice.json';
import observeFr from '../../content/read/fr/observe.json';
import storiesFr from '../../content/read/fr/stories.json';
import wordsFr from '../../content/read/fr/words.json';

import curiousIt from '../../content/read/it/curious.json';
import noticeIt from '../../content/read/it/notice.json';
import observeIt from '../../content/read/it/observe.json';
import storiesIt from '../../content/read/it/stories.json';
import wordsIt from '../../content/read/it/words.json';

import curiousNl from '../../content/read/nl/curious.json';
import noticeNl from '../../content/read/nl/notice.json';
import observeNl from '../../content/read/nl/observe.json';
import storiesNl from '../../content/read/nl/stories.json';
import wordsNl from '../../content/read/nl/words.json';

import curiousPl from '../../content/read/pl/curious.json';
import noticePl from '../../content/read/pl/notice.json';
import observePl from '../../content/read/pl/observe.json';
import storiesPl from '../../content/read/pl/stories.json';
import wordsPl from '../../content/read/pl/words.json';

import curiousPtBr from '../../content/read/pt-BR/curious.json';
import noticePtBr from '../../content/read/pt-BR/notice.json';
import observePtBr from '../../content/read/pt-BR/observe.json';
import storiesPtBr from '../../content/read/pt-BR/stories.json';
import wordsPtBr from '../../content/read/pt-BR/words.json';

import curiousRu from '../../content/read/ru/curious.json';
import noticeRu from '../../content/read/ru/notice.json';
import observeRu from '../../content/read/ru/observe.json';
import storiesRu from '../../content/read/ru/stories.json';
import wordsRu from '../../content/read/ru/words.json';

import curiousTr from '../../content/read/tr/curious.json';
import noticeTr from '../../content/read/tr/notice.json';
import observeTr from '../../content/read/tr/observe.json';
import storiesTr from '../../content/read/tr/stories.json';
import wordsTr from '../../content/read/tr/words.json';

import { resolveReadLanguage } from './language';

type PackFiles = {
  microStories: MicroStoryItem[];
  curious: CuriousItem[];
  words: WordItem[];
  observations: ObservationItem[];
  environments: ObservationItem[];
};

function buildReadPack(language: ReadLanguage, files: PackFiles): ReadPack {
  return {
    language,
    microStories: files.microStories,
    curious: files.curious,
    words: files.words,
    observations: files.observations,
    environments: files.environments,
  };
}

const readPacks: Record<ReadLanguage, ReadPack> = {
  en: buildReadPack('en', {
    microStories: storiesEn as MicroStoryItem[],
    curious: curiousEn as CuriousItem[],
    words: wordsEn as WordItem[],
    observations: observeEn as ObservationItem[],
    environments: noticeEn as ObservationItem[],
  }),
  es: buildReadPack('es', {
    microStories: storiesEs as MicroStoryItem[],
    curious: curiousEs as CuriousItem[],
    words: wordsEs as WordItem[],
    observations: observeEs as ObservationItem[],
    environments: noticeEs as ObservationItem[],
  }),
  de: buildReadPack('de', {
    microStories: storiesDe as MicroStoryItem[],
    curious: curiousDe as CuriousItem[],
    words: wordsDe as WordItem[],
    observations: observeDe as ObservationItem[],
    environments: noticeDe as ObservationItem[],
  }),
  fr: buildReadPack('fr', {
    microStories: storiesFr as MicroStoryItem[],
    curious: curiousFr as CuriousItem[],
    words: wordsFr as WordItem[],
    observations: observeFr as ObservationItem[],
    environments: noticeFr as ObservationItem[],
  }),
  'pt-BR': buildReadPack('pt-BR', {
    microStories: storiesPtBr as MicroStoryItem[],
    curious: curiousPtBr as CuriousItem[],
    words: wordsPtBr as WordItem[],
    observations: observePtBr as ObservationItem[],
    environments: noticePtBr as ObservationItem[],
  }),
  ru: buildReadPack('ru', {
    microStories: storiesRu as MicroStoryItem[],
    curious: curiousRu as CuriousItem[],
    words: wordsRu as WordItem[],
    observations: observeRu as ObservationItem[],
    environments: noticeRu as ObservationItem[],
  }),
  it: buildReadPack('it', {
    microStories: storiesIt as MicroStoryItem[],
    curious: curiousIt as CuriousItem[],
    words: wordsIt as WordItem[],
    observations: observeIt as ObservationItem[],
    environments: noticeIt as ObservationItem[],
  }),
  pl: buildReadPack('pl', {
    microStories: storiesPl as MicroStoryItem[],
    curious: curiousPl as CuriousItem[],
    words: wordsPl as WordItem[],
    observations: observePl as ObservationItem[],
    environments: noticePl as ObservationItem[],
  }),
  nl: buildReadPack('nl', {
    microStories: storiesNl as MicroStoryItem[],
    curious: curiousNl as CuriousItem[],
    words: wordsNl as WordItem[],
    observations: observeNl as ObservationItem[],
    environments: noticeNl as ObservationItem[],
  }),
  tr: buildReadPack('tr', {
    microStories: storiesTr as MicroStoryItem[],
    curious: curiousTr as CuriousItem[],
    words: wordsTr as WordItem[],
    observations: observeTr as ObservationItem[],
    environments: noticeTr as ObservationItem[],
  }),
};

export function loadReadPack(language?: ReadLanguage): ReadPack {
  const resolved = language ?? resolveReadLanguage();
  return readPacks[resolved] ?? readPacks.en;
}

/** @deprecated Use loadReadPack(). Kept for call sites during migration. */
export const englishReadPack = readPacks.en;
