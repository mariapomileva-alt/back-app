import { mixHex } from '@/theme/colors';
import type { AppTheme } from '@/theme/themes';

/** Unselected mode / secondary control labels — ~12% stronger than raw textSecondary. */
export function secondaryControlLabelColor(theme: AppTheme): string {
  return mixHex(theme.colors.textSecondary, theme.colors.text, 0.12);
}

export const SECONDARY_CONTROL_LABEL_OPACITY = 0.84;
