import { useTheme } from '@/hooks/useTheme';

export const MOVE_VIEWBOX = '0 0 280 200';
export const MOVE_STROKE = 1.85;
export const MOVE_STROKE_FINE = 1.5;

export type MoveInk = {
  line: string;
  wash: string;
  ground: string;
  surface: string;
  contact: string;
  lineOpacity: number;
  washOpacity: number;
  groundOpacity: number;
  contactOpacity: number;
};

export function useMoveInk(): MoveInk {
  const { theme } = useTheme();
  const forest = theme.name === 'deepGreen';

  return {
    line: theme.colors.markPrimary,
    wash: theme.colors.markSecondary,
    ground: theme.colors.markMuted,
    surface: theme.colors.markSurface,
    contact: theme.colors.markSurface,
    lineOpacity: forest ? 0.98 : 0.92,
    washOpacity: forest ? 0.42 : 0.22,
    groundOpacity: forest ? 0.55 : 0.44,
    contactOpacity: forest ? 0.38 : 0.52,
  };
}
