import { brand, hexToRgba } from '@/theme/colors';

export type ThemeName = 'warmNeutral' | 'deepGreen' | 'softBeige';

export type StatusBarStyle = 'dark' | 'light';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  primary: string;
  forest: string;
  secondaryGreen: string;
  muted: string;
  text: string;
  textSecondary: string;
  border: string;
  highlight: string;
  clay: string;
  organic: string;
  cool: string;
  buttonBackground: string;
  buttonText: string;
  secondaryButtonBackground: string;
  secondaryButtonText: string;
  icon: string;
  overlay: string;
  markPrimary: string;
  markSecondary: string;
  markMuted: string;
  markWarmAccent: string;
  markSurface: string;
  markLine: string;
  markDeep: string;
  markPale: string;
  groundEarth: string;
  groundRoot: string;
};

export type AppTheme = {
  name: ThemeName;
  statusBar: StatusBarStyle;
  colors: ThemeColors;
};

export const themes: Record<ThemeName, AppTheme> = {
  warmNeutral: {
    name: 'warmNeutral',
    statusBar: 'dark',
    colors: {
      background: '#F3EDE1',
      surface: '#F8F4EC',
      surfaceSecondary: '#E7DDCE',
      surfaceElevated: '#F8F4EC',
      primary: brand.deepForest,
      forest: brand.forestGreen,
      secondaryGreen: brand.sage,
      muted: brand.paleSage,
      text: '#153C32',
      textSecondary: '#65736C',
      border: '#D8CFC0',
      highlight: brand.mutedGold,
      clay: brand.camel,
      organic: '#E7DDCE',
      cool: brand.blueSage,
      buttonBackground: brand.deepForest,
      buttonText: brand.inverseText,
      secondaryButtonBackground: '#E7DDCE',
      secondaryButtonText: '#153C32',
      icon: brand.deepForest,
      overlay: hexToRgba(brand.deepForest, 0.28),
      markPrimary: brand.forestGreen,
      markSecondary: brand.sage,
      markMuted: brand.paleSage,
      markWarmAccent: brand.camel,
      markSurface: '#E7DDCE',
      markLine: brand.blueSage,
      markDeep: brand.deepForest,
      markPale: brand.paleSage,
      groundEarth: '#E7DDCE',
      groundRoot: brand.forestGreen,
    },
  },
  deepGreen: {
    name: 'deepGreen',
    statusBar: 'light',
    colors: {
      background: '#183F34',
      surface: '#214A3E',
      surfaceSecondary: '#2A5548',
      surfaceElevated: '#345F51',
      primary: '#F3EDE1',
      forest: brand.forestGreen,
      secondaryGreen: brand.sage,
      muted: '#9DB7A1',
      text: '#F3EDE1',
      textSecondary: '#CFD9D2',
      border: hexToRgba('#F3EDE1', 0.14),
      highlight: '#C19A64',
      clay: '#C19A64',
      organic: '#2A5548',
      cool: brand.blueSage,
      buttonBackground: '#9DB7A1',
      buttonText: '#183F34',
      secondaryButtonBackground: '#2A5548',
      secondaryButtonText: '#F3EDE1',
      icon: '#F3EDE1',
      overlay: hexToRgba(brand.deepForest, 0.4),
      markPrimary: '#D2E0D0',
      markSecondary: '#A3C0A6',
      markMuted: '#8AAF9A',
      markWarmAccent: '#D1A96C',
      markSurface: '#3D6658',
      markLine: '#C5D4CC',
      markDeep: '#F3EDE1',
      markPale: '#8AAF9A',
      groundEarth: '#3D6658',
      groundRoot: '#A3C0A6',
    },
  },
  /** Airy Blue Sage — Ground sprout reference: cool gray milk, cornflower + sage. */
  softBeige: {
    name: 'softBeige',
    statusBar: 'dark',
    colors: {
      background: '#F2F3F5',
      surface: '#E1EDE5',
      surfaceSecondary: '#CFDFD4',
      surfaceElevated: '#FAFBFC',
      primary: '#212121',
      forest: '#212121',
      secondaryGreen: '#9FC4AD',
      muted: '#E1EDE5',
      text: '#212121',
      textSecondary: '#5C6560',
      border: '#D5DDE2',
      highlight: '#CBA980',
      clay: '#CBA980',
      organic: '#E1EDE5',
      cool: '#5494F7',
      buttonBackground: '#5494F7',
      buttonText: '#FFFFFF',
      secondaryButtonBackground: '#FAFBFC',
      secondaryButtonText: '#212121',
      icon: '#212121',
      overlay: hexToRgba('#212121', 0.22),
      markPrimary: '#212121',
      markSecondary: '#9FC4AD',
      markMuted: '#E1EDE5',
      markWarmAccent: '#CBA980',
      markSurface: '#E1EDE5',
      markLine: '#BBD3FB',
      markDeep: '#212121',
      markPale: '#E1EDE5',
      groundEarth: '#CFDFD4',
      groundRoot: '#9FC4AD',
    },
  },
};

export const defaultThemeName: ThemeName = 'warmNeutral';

export const themeOrder: ThemeName[] = ['warmNeutral', 'deepGreen', 'softBeige'];
