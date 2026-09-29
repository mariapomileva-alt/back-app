import type { ImageSourcePropType } from 'react-native';

import { moveStepId, moveSequenceIds, type MovePhase, type MoveSequenceId, type MoveStepId } from '@/features/move/steps';

export type MovePremiumVisualAssets = {
  loop: ImageSourcePropType;
  still: ImageSourcePropType;
};

type AssetKey =
  | '01-feet-press'
  | '02-feet-hold'
  | '03-feet-release'
  | '04-palms-press'
  | '05-shoulders-roll'
  | '06-hands-tense'
  | '07-hands-relax'
  | '08-hands-shake';

const assetsByKey: Record<AssetKey, MovePremiumVisualAssets> = {
  '01-feet-press': {
    loop: require('../../assets/move-art/premium-loops/01-feet-press-loop.webp'),
    still: require('../../assets/move-art/premium-stills/01-feet-press.png'),
  },
  '02-feet-hold': {
    loop: require('../../assets/move-art/premium-loops/02-feet-hold-loop.webp'),
    still: require('../../assets/move-art/premium-stills/02-feet-hold.png'),
  },
  '03-feet-release': {
    loop: require('../../assets/move-art/premium-loops/03-feet-release-loop.webp'),
    still: require('../../assets/move-art/premium-stills/03-feet-release.png'),
  },
  '04-palms-press': {
    loop: require('../../assets/move-art/premium-loops/04-palms-press-loop.webp'),
    still: require('../../assets/move-art/premium-stills/04-palms-press.png'),
  },
  '05-shoulders-roll': {
    loop: require('../../assets/move-art/premium-loops/05-shoulders-roll-loop.webp'),
    still: require('../../assets/move-art/premium-stills/05-shoulders-roll.png'),
  },
  '06-hands-tense': {
    loop: require('../../assets/move-art/premium-loops/06-hands-tense-loop.webp'),
    still: require('../../assets/move-art/premium-stills/06-hands-tense.png'),
  },
  '07-hands-relax': {
    loop: require('../../assets/move-art/premium-loops/07-hands-relax-loop.webp'),
    still: require('../../assets/move-art/premium-stills/07-hands-relax.png'),
  },
  '08-hands-shake': {
    loop: require('../../assets/move-art/premium-loops/08-hands-shake-loop.webp'),
    still: require('../../assets/move-art/premium-stills/08-hands-shake.png'),
  },
};

function assetKeyFor(sequenceId: MoveSequenceId, phase: MovePhase): AssetKey {
  switch (sequenceId) {
    case 'feet':
      if (phase === 'press') return '01-feet-press';
      if (phase === 'hold') return '02-feet-hold';
      return '03-feet-release';
    case 'palms':
      return '04-palms-press';
    case 'shoulders':
      return '05-shoulders-roll';
    case 'tense':
      return phase === 'press' || phase === 'hold' ? '06-hands-tense' : '07-hands-relax';
    case 'hands':
      return phase === 'press' || phase === 'hold' ? '08-hands-shake' : '07-hands-relax';
    case 'fingers':
      return phase === 'press' || phase === 'hold' ? '06-hands-tense' : '07-hands-relax';
    case 'bodyScan':
      if (phase === 'press' || phase === 'hold') return '02-feet-hold';
      if (phase === 'release') return '03-feet-release';
      return '07-hands-relax';
    default:
      return '01-feet-press';
  }
}

const premiumByStepId: Record<MoveStepId, MovePremiumVisualAssets> = Object.fromEntries(
  moveSequenceIds.flatMap((sequenceId) =>
    (['press', 'hold', 'release', 'notice'] as const).map((phase) => {
      const stepId = moveStepId(sequenceId, phase);
      const key = assetKeyFor(sequenceId, phase);
      return [stepId, assetsByKey[key]] as const;
    }),
  ),
) as Record<MoveStepId, MovePremiumVisualAssets>;

export function movePremiumVisual(stepId: MoveStepId): MovePremiumVisualAssets {
  return premiumByStepId[stepId] ?? assetsByKey['01-feet-press'];
}

export function movePremiumVisualKey(stepId: MoveStepId): AssetKey {
  const [sequenceId, phase] = stepId.split('.') as [MoveSequenceId, MovePhase];
  return assetKeyFor(sequenceId, phase);
}

export const MOVE_PREMIUM_ASPECT = 5 / 3;
