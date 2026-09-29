import type { AppTheme } from '@/theme/themes';

export type GroundInstructionInk = {
  primary: string;
  sage: string;
  sand: string;
  mound: string;
};

export function groundInstructionInk(theme: AppTheme): GroundInstructionInk {
  if (theme.name === 'softBeige') {
    return {
      primary: theme.colors.markPrimary,
      sage: theme.colors.cool,
      sand: theme.colors.clay,
      mound: theme.colors.markMuted,
    };
  }
  return {
    primary: theme.colors.markPrimary,
    sage: theme.colors.markSecondary,
    sand: theme.colors.markSurface,
    mound: theme.colors.organic,
  };
}
