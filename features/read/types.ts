export const readLanguages = ['en'] as const;
export type ReadLanguage = (typeof readLanguages)[number];

export const readItemTypes = ['micro_story', 'curious', 'word', 'observation'] as const;
export type ReadItemType = (typeof readItemTypes)[number];

export const readSlotTypes = ['micro_story', 'curious', 'word', 'observation', 'environment'] as const;
export type ReadSlotType = (typeof readSlotTypes)[number];

export const readRevealSpeeds = ['unhurried', 'steady', 'quick'] as const;
export type ReadRevealSpeed = (typeof readRevealSpeeds)[number];

export type ReadLanguagePreference = 'en';

export type EnvironmentFollowUp = {
  type: 'environment';
  text: string;
};

export type ChoiceFollowUp = {
  type: 'choice';
  text: string;
  options: string[];
};

export type ReadFollowUp = EnvironmentFollowUp | ChoiceFollowUp;

export type ReadContentItem = {
  id: string;
  type: ReadItemType;
  fragments: string[];
  topics: string[];
  difficulty: number;
  followUp?: ReadFollowUp;
};

export type MicroStoryItem = ReadContentItem & { type: 'micro_story' };
export type CuriousItem = ReadContentItem & { type: 'curious' };
export type WordItem = ReadContentItem & { type: 'word' };
export type ObservationItem = ReadContentItem & { type: 'observation' };

export type ReadItem = MicroStoryItem | CuriousItem | WordItem | ObservationItem;

export type ReadPack = {
  language: ReadLanguage;
  microStories: MicroStoryItem[];
  curious: CuriousItem[];
  words: WordItem[];
  observations: ObservationItem[];
  environments: ObservationItem[];
};

export type RevealKind = ReadItemType | 'environment' | 'choice';

export type RevealFragment = {
  id: string;
  itemId: string;
  storyId?: string;
  kind: RevealKind;
  text: string;
  options?: string[];
};

export type ReadSession = {
  patternId: string;
  threadId: string;
  storyIds: string[];
  itemIds: string[];
  fragments: RevealFragment[];
};

export type ReadMemory = {
  recentBlockIds: string[];
  usedStoryIds: string[];
  patternHistory: string[];
  threadHistory: string[];
  sessionCount: number;
  lastSeenAt: Record<string, number>;
  language: ReadLanguagePreference;
  revealSpeed: ReadRevealSpeed;
};

export const defaultReadMemory: ReadMemory = {
  recentBlockIds: [],
  usedStoryIds: [],
  patternHistory: [],
  threadHistory: [],
  sessionCount: 0,
  lastSeenAt: {},
  language: 'en',
  revealSpeed: 'steady',
};
