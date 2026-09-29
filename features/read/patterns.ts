import type { ReadSlotType } from './types';

export type SessionPattern = {
  id: string;
  slots: ReadSlotType[];
};

export const sessionPatterns: SessionPattern[] = [
  {
    id: 'scene-then-world',
    slots: ['micro_story', 'curious', 'word', 'environment', 'observation', 'micro_story', 'curious', 'environment'],
  },
  {
    id: 'fact-into-scene',
    slots: ['curious', 'micro_story', 'word', 'environment', 'observation', 'curious', 'word', 'environment'],
  },
  {
    id: 'look-then-stay',
    slots: ['environment', 'micro_story', 'curious', 'word', 'observation', 'micro_story', 'environment', 'curious'],
  },
  {
    id: 'word-in-place',
    slots: ['micro_story', 'word', 'curious', 'environment', 'observation', 'micro_story', 'curious', 'environment'],
  },
  {
    id: 'around-the-room',
    slots: ['micro_story', 'observation', 'curious', 'word', 'environment', 'micro_story', 'environment', 'curious'],
  },
  {
    id: 'slow-return',
    slots: ['curious', 'environment', 'micro_story', 'word', 'observation', 'curious', 'environment', 'word'],
  },
  {
    id: 'two-scenes',
    slots: ['micro_story', 'curious', 'environment', 'word', 'micro_story', 'observation', 'curious', 'environment'],
  },
  {
    id: 'quiet-walk',
    slots: ['environment', 'curious', 'micro_story', 'word', 'environment', 'observation', 'curious', 'micro_story'],
  },
  {
    id: 'keep-reading',
    slots: ['micro_story', 'curious', 'micro_story', 'environment', 'curious', 'word', 'micro_story', 'observation'],
  },
];

export function storySlotCount(pattern: SessionPattern): number {
  return pattern.slots.filter((slot) => slot === 'micro_story').length;
}
