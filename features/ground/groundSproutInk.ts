import type { AppTheme } from '@/theme/themes';

/** Sprout / Ground mark colors — Airy Blue Sage uses blue foliage per brand reference. */
export type GroundSproutInk = {
  mound: string;
  stem: string;
  leaf: string;
  root: string;
};

export function groundSproutInk(theme: AppTheme): GroundSproutInk {
  if (theme.name === 'softBeige') {
    return {
      mound: theme.colors.groundEarth,
      stem: theme.colors.cool,
      leaf: theme.colors.markLine,
      root: theme.colors.groundRoot,
    };
  }
  const sage = theme.colors.markSecondary;
  return {
    mound: theme.colors.groundEarth,
    stem: sage,
    leaf: sage,
    root: theme.colors.groundRoot,
  };
}
