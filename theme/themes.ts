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
    },
  },
  softBeige: {
    name: 'softBeige',
    statusBar: 'dark',
    colors: {
      background: '#E3E8DF',
      surface: '#F1F3ED',
      surfaceSecondary: '#D8DFD5',
      surfaceElevated: '#F1F3ED',
      primary: '#17483A',
      forest: brand.forestGreen,
      secondaryGreen: brand.sage,
      muted: brand.paleSage,
      text: '#173B32',
      textSecondary: '#64736C',
      border: '#CBD3C8',
      highlight: '#B89467',
      clay: '#B89467',
      organic: '#D8DFD5',
      cool: '#8FAAA4',
      buttonBackground: '#17483A',
      buttonText: brand.inverseText,
      secondaryButtonBackground: '#D8DFD5',
      secondaryButtonText: '#173B32',
      icon: '#17483A',
      overlay: hexToRgba(brand.deepForest, 0.28),
      markPrimary: brand.forestGreen,
      markSecondary: brand.sage,
      markMuted: brand.paleSage,
      markWarmAccent: '#B89467',
      markSurface: '#D8DFD5',
      markLine: '#8FAAA4',
    },
  },
};

export const defaultThemeName: ThemeName = 'warmNeutral';

export const themeOrder: ThemeName[] = ['warmNeutral', 'deepGreen', 'softBeige'];
