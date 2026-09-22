export type HomeCardDensity = 'standard' | 'compact';

export type HomeFitLayout = {
  wordmarkSize: number;
  gridGap: number;
  heroMarginTop: number;
  heroMarginBottom: number;
  /** Tighter block when a one-line salutation sits above the hero. */
  heroMarginBottomNamed: number;
  promptFontSize: number;
  promptLineHeight: number;
  heroSingleFontSize: number;
  heroSingleLineHeight: number;
  heroNamedSalutationFontSize: number;
  heroNamedSalutationLineHeight: number;
  heroNamedHeadlineGap: number;
  cardDensity: HomeCardDensity;
  maxFontSizeMultiplier: number;
};

type Input = {
  /** Safe-area-aware content height (px). */
  availableHeight: number;
  fontScale: number;
  showNamePrompt: boolean;
  namedHero: boolean;
};

function tierBase(
  tier: 'comfortable' | 'standard' | 'compact' | 'tight',
): HomeFitLayout {
  switch (tier) {
    case 'tight':
      return {
        wordmarkSize: 20,
        gridGap: 8,
        heroMarginTop: 4,
        heroMarginBottom: 10,
        heroMarginBottomNamed: 8,
        promptFontSize: 14,
        promptLineHeight: 20,
        heroSingleFontSize: 34,
        heroSingleLineHeight: 38,
        heroNamedSalutationFontSize: 15,
        heroNamedSalutationLineHeight: 20,
        heroNamedHeadlineGap: 0,
        cardDensity: 'compact',
        maxFontSizeMultiplier: 1.12,
      };
    case 'compact':
      return {
        wordmarkSize: 21,
        gridGap: 8,
        heroMarginTop: 6,
        heroMarginBottom: 12,
        heroMarginBottomNamed: 10,
        promptFontSize: 14,
        promptLineHeight: 20,
        heroSingleFontSize: 36,
        heroSingleLineHeight: 40,
        heroNamedSalutationFontSize: 16,
        heroNamedSalutationLineHeight: 21,
        heroNamedHeadlineGap: 2,
        cardDensity: 'compact',
        maxFontSizeMultiplier: 1.15,
      };
    case 'standard':
      return {
        wordmarkSize: 22,
        gridGap: 9,
        heroMarginTop: 8,
        heroMarginBottom: 14,
        heroMarginBottomNamed: 10,
        promptFontSize: 15,
        promptLineHeight: 21,
        heroSingleFontSize: 38,
        heroSingleLineHeight: 44,
        heroNamedSalutationFontSize: 16,
        heroNamedSalutationLineHeight: 22,
        heroNamedHeadlineGap: 2,
        cardDensity: 'compact',
        maxFontSizeMultiplier: 1.18,
      };
    case 'comfortable':
    default:
      return {
        wordmarkSize: 22,
        gridGap: 10,
        heroMarginTop: 8,
        heroMarginBottom: 18,
        heroMarginBottomNamed: 12,
        promptFontSize: 15,
        promptLineHeight: 22,
        heroSingleFontSize: 40,
        heroSingleLineHeight: 46,
        heroNamedSalutationFontSize: 17,
        heroNamedSalutationLineHeight: 23,
        heroNamedHeadlineGap: 2,
        cardDensity: 'standard',
        maxFontSizeMultiplier: 1.2,
      };
  }
}

/**
 * Keeps Home (header + hero + 6 tools + footer) on one screen without scroll.
 * Named greeting uses a quiet salutation line + the same hero size as the anonymous state.
 */
export function computeHomeFitLayout(input: Input): HomeFitLayout {
  const { availableHeight, showNamePrompt } = input;
  const fontScale = Math.min(Math.max(input.fontScale, 1), 1.35);

  const stress = showNamePrompt;
  const short = availableHeight < 700;
  const veryShort = availableHeight < 640;

  let tier: 'comfortable' | 'standard' | 'compact' | 'tight' = 'comfortable';
  if (veryShort || (short && stress) || fontScale >= 1.2) {
    tier = 'tight';
  } else if (short || stress || fontScale > 1.05 || availableHeight < 760) {
    tier = 'compact';
  } else if (availableHeight < 820) {
    tier = 'standard';
  }

  return tierBase(tier);
}
