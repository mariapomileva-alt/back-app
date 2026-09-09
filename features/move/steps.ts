import { exerciseImages } from '@/features/media/catalog';

export const moveSteps = [
  {
    textKey: 'move.steps.feet',
    image: exerciseImages.moveFeet,
    imageLabelKey: 'move.images.feet',
  },
  {
    textKey: 'move.steps.palms',
    image: exerciseImages.moveHands,
    imageLabelKey: 'move.images.hands',
  },
  {
    textKey: 'move.steps.release',
    image: exerciseImages.moveHands,
    imageLabelKey: 'move.images.hands',
  },
  {
    textKey: 'move.steps.shoulders',
    image: exerciseImages.moveHands,
    imageLabelKey: 'move.images.hands',
  },
  {
    textKey: 'move.steps.wall',
    image: exerciseImages.moveHands,
    imageLabelKey: 'move.images.hands',
  },
  {
    textKey: 'move.steps.shake',
    image: exerciseImages.moveHands,
    imageLabelKey: 'move.images.hands',
  },
] as const;
