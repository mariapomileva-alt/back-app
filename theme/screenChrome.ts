import type { ThemeName } from '@/theme/themes';

/** Warm paper grain reads as beige on cool green-milk — keep Airy almost flat. */
export function paperGrainOpacity(themeName: ThemeName): number {
  switch (themeName) {
    case 'softBeige':
      return 0.028;
    case 'deepGreen':
      return 0.07;
    default:
      return 0.12;
  }
}
