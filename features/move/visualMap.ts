import { allMoveStepIds, isMoveStepId, type MoveStepId } from '@/features/move/steps';

export const moveIllustrationVariants = [
  'pressFeet',
  'holdFeet',
  'releaseFeet',
  'noticeFeet',
  'pressPalms',
  'holdPalms',
  'releasePalms',
  'noticePalms',
  'tenseHands',
  'holdTenseHands',
  'releaseHands',
  'noticeHands',
  'riseShoulders',
  'rollShoulders',
  'settleShoulders',
  'noticeShoulders',
  'pressLegs',
  'holdLegs',
  'releaseLegs',
  'noticeLegs',
] as const;

export type MoveIllustrationVariant = (typeof moveIllustrationVariants)[number];

export const moveAnimationVariants = [
  'compress',
  'deepen',
  'soften',
  'ripple',
  'meet',
  'still',
  'separate',
  'rest',
  'curl',
  'open',
  'rise',
  'roll',
  'settle',
  'plant',
  'lift',
] as const;

export type MoveAnimationVariant = (typeof moveAnimationVariants)[number];

export type MoveVisualSpec = {
  illustration: MoveIllustrationVariant;
  animation: MoveAnimationVariant;
};

/**
 * Strict stepId → illustration → animation. Every Move phase has its own visual.
 * Never keyed off translated copy. Missing keys fail at compile time.
 */
export const MOVE_VISUAL_MAP: Record<MoveStepId, MoveVisualSpec> = {
  'feet.press': { illustration: 'pressFeet', animation: 'compress' },
  'feet.hold': { illustration: 'holdFeet', animation: 'deepen' },
  'feet.release': { illustration: 'releaseFeet', animation: 'soften' },
  'feet.notice': { illustration: 'noticeFeet', animation: 'ripple' },
  'palms.press': { illustration: 'pressPalms', animation: 'meet' },
  'palms.hold': { illustration: 'holdPalms', animation: 'still' },
  'palms.release': { illustration: 'releasePalms', animation: 'separate' },
  'palms.notice': { illustration: 'noticePalms', animation: 'rest' },
  'tense.press': { illustration: 'tenseHands', animation: 'curl' },
  'tense.hold': { illustration: 'holdTenseHands', animation: 'deepen' },
  'tense.release': { illustration: 'releaseHands', animation: 'open' },
  'tense.notice': { illustration: 'noticeHands', animation: 'rest' },
  'shoulders.press': { illustration: 'riseShoulders', animation: 'rise' },
  'shoulders.hold': { illustration: 'rollShoulders', animation: 'roll' },
  'shoulders.release': { illustration: 'settleShoulders', animation: 'settle' },
  'shoulders.notice': { illustration: 'noticeShoulders', animation: 'rest' },
  'hands.press': { illustration: 'pressLegs', animation: 'plant' },
  'hands.hold': { illustration: 'holdLegs', animation: 'deepen' },
  'hands.release': { illustration: 'releaseLegs', animation: 'lift' },
  'hands.notice': { illustration: 'noticeLegs', animation: 'rest' },
};

function assertMoveVisualCoverage(): void {
  if (!__DEV__) {
    return;
  }

  const used = new Set<MoveIllustrationVariant>();
  for (const stepId of allMoveStepIds()) {
    const spec = MOVE_VISUAL_MAP[stepId];
    if (!spec) {
      throw new Error(`Missing Move visual mapping for stepId "${stepId}"`);
    }
    used.add(spec.illustration);
  }

  for (const variant of moveIllustrationVariants) {
    if (!used.has(variant)) {
      throw new Error(`Move illustration variant "${variant}" is unused`);
    }
  }
}

assertMoveVisualCoverage();

/** Empty frame if unknown — never the previous or a default illustration. */
export function resolveMoveVisual(stepId: string): MoveVisualSpec | null {
  if (!isMoveStepId(stepId)) {
    if (__DEV__) {
      console.error(`[Move] No illustration mapped for stepId "${stepId}"`);
    }
    return null;
  }
  return MOVE_VISUAL_MAP[stepId];
}
