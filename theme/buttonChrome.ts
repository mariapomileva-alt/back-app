import { radius } from '@/theme/radius';
import type { ThemeName } from '@/theme/themes';

/** Pill CTAs on Airy Blue Sage (Ground reference). */
export function primaryButtonRadius(themeName: ThemeName): number {
  return themeName === 'softBeige' ? radius.circle : radius.button;
}

export function secondaryButtonUsesOutline(themeName: ThemeName): boolean {
  return themeName === 'softBeige';
}
