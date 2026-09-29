import { useTheme } from '@/hooks/useTheme';

export const MOVE_KINETIC_VIEWBOX = '0 0 200 120';

export type MoveInk = {
  primary: string;
  sage: string;
  sand: string;
  primaryOpacity: number;
  sageOpacity: number;
  sandOpacity: number;
};

export function useMoveInk(): MoveInk {
  const { theme } = useTheme();
  const forest = theme.name === 'deepGreen';

  return {
    primary: theme.colors.markPrimary,
    sage: theme.colors.markSecondary,
    sand: theme.colors.markSurface,
    primaryOpacity: forest ? 0.96 : 0.9,
    sageOpacity: forest ? 0.52 : 0.38,
    sandOpacity: forest ? 0.44 : 0.58,
  };
}
