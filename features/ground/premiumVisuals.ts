import type { ImageSourcePropType } from 'react-native';

import type { GroundSequenceId } from '@/features/ground/steps';

export type GroundPremiumVisualAssets = {
  loop: ImageSourcePropType;
  still: ImageSourcePropType;
};

const feetBodyByStep: Record<string, GroundPremiumVisualAssets> = {
  'ground.steps.feet': {
    loop: require('../../assets/ground-art/premium-loops/01-feet-contact-loop.webp'),
    still: require('../../assets/ground-art/premium-stills/01-feet-contact.png'),
  },
  'ground.steps.toes': {
    loop: require('../../assets/ground-art/premium-loops/02-move-toes-loop.webp'),
    still: require('../../assets/ground-art/premium-stills/02-move-toes.png'),
  },
  'ground.steps.weight': {
    loop: require('../../assets/ground-art/premium-loops/03-feel-weight-loop.webp'),
    still: require('../../assets/ground-art/premium-stills/03-feel-weight.png'),
  },
  'ground.steps.support': {
    loop: require('../../assets/ground-art/premium-loops/04-feel-support-loop.webp'),
    still: require('../../assets/ground-art/premium-stills/04-feel-support.png'),
  },
  'ground.steps.hands': {
    loop: require('../../assets/ground-art/premium-loops/05-notice-hands-loop.webp'),
    still: require('../../assets/ground-art/premium-stills/05-notice-hands.png'),
  },
  'ground.steps.shoulders': {
    loop: require('../../assets/ground-art/premium-loops/06-soften-shoulders-loop.webp'),
    still: require('../../assets/ground-art/premium-stills/06-soften-shoulders.png'),
  },
  'ground.steps.stay': {
    loop: require('../../assets/ground-art/premium-loops/07-stay-here-loop.webp'),
    still: require('../../assets/ground-art/premium-stills/07-stay-here.png'),
  },
};

const modeFiveSenses: GroundPremiumVisualAssets = {
  loop: require('../../assets/ground-art/premium-loops/mode-5-4-3-2-1-loop.webp'),
  still: require('../../assets/ground-art/premium-stills/mode-5-4-3-2-1.png'),
};

const modeLookAround: GroundPremiumVisualAssets = {
  loop: require('../../assets/ground-art/premium-loops/mode-look-around-loop.webp'),
  still: require('../../assets/ground-art/premium-stills/mode-look-around.png'),
};

const modeTexture: GroundPremiumVisualAssets = {
  loop: require('../../assets/ground-art/premium-loops/mode-texture-temperature-loop.webp'),
  still: require('../../assets/ground-art/premium-stills/mode-texture-temperature.png'),
};

/** One hero scene per non–feet-body mode; feet & body uses seven step scenes. */
export function groundPremiumVisual(
  sequenceId: GroundSequenceId,
  stepKey: string,
): GroundPremiumVisualAssets | null {
  switch (sequenceId) {
    case 'feetBody':
      return feetBodyByStep[stepKey] ?? null;
    case 'fiveSenses':
      return modeFiveSenses;
    case 'lookAround':
      return modeLookAround;
    case 'texture':
      return modeTexture;
    default:
      return null;
  }
}

/** React key so mode hero art does not remount on internal step changes. */
export function groundPremiumVisualKey(sequenceId: GroundSequenceId, stepKey: string): string {
  if (sequenceId === 'feetBody') {
    return stepKey;
  }
  return `ground.mode.${sequenceId}`;
}

/** Shared 5:3 safe zone for Ground premium art. */
export const GROUND_PREMIUM_ASPECT = 5 / 3;
