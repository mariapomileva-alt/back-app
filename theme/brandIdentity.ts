import { brand, mixHex } from '@/theme/colors';
import type { ThemeName } from '@/theme/themes';

export const brandIdentity = {
  objectDiameterRatio: 0.62,
  wordmark: {
    warmEarth: brand.deepForest,
    forest: brand.warmIvory,
    softSage: '#212121',
  },
  surface: {
    warmEarth: brand.warmIvory,
    forest: brand.deepForest,
  },
} as const;

export type WordmarkVariant = keyof typeof brandIdentity.wordmark | 'theme';

export type BreathingMarkVariant = 'warmEarth' | 'forest';

export function wordmarkColorForTheme(themeName: ThemeName): string {
  if (themeName === 'deepGreen') {
    return brandIdentity.wordmark.forest;
  }
  if (themeName === 'softBeige') {
    return brandIdentity.wordmark.softSage;
  }
  return brandIdentity.wordmark.warmEarth;
}

export function resolveWordmarkColor(variant: WordmarkVariant, themeName: ThemeName, color?: string) {
  if (color) {
    return color;
  }
  if (variant === 'theme') {
    return wordmarkColorForTheme(themeName);
  }
  return brandIdentity.wordmark[variant];
}

export const breathingStops = {
  warmEarth: [
    { offset: '0%', color: mixHex(brand.sage, brand.forestGreen, 0.12) },
    { offset: '40%', color: brand.sage },
    { offset: '74%', color: brand.forestGreen },
    { offset: '100%', color: mixHex(brand.deepForest, brand.forestGreen, 0.22) },
  ],
  forest: [
    { offset: '0%', color: mixHex(brand.sage, brand.paleSage, 0.18) },
    { offset: '40%', color: brand.sage },
    { offset: '74%', color: mixHex(brand.sage, brand.forestGreen, 0.35) },
    { offset: '100%', color: brand.forestGreen },
  ],
} as const;
