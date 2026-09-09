import { Platform, type TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: undefined,
  android: 'Roboto',
  default: undefined,
});

const semibold: TextStyle = {
  fontFamily,
  fontWeight: '600',
};

const regular: TextStyle = {
  fontFamily,
  fontWeight: '400',
};

export const typography = {
  brand: {
    ...semibold,
    fontSize: 22,
    lineHeight: 28,
  },
  hero: {
    ...semibold,
    fontSize: 36,
    lineHeight: 42,
  },
  instruction: {
    ...semibold,
    fontSize: 30,
    lineHeight: 36,
  },
  section: {
    ...semibold,
    fontSize: 22,
    lineHeight: 28,
  },
  button: {
    ...semibold,
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    ...regular,
    fontSize: 17,
    lineHeight: 24,
  },
  secondary: {
    ...regular,
    fontSize: 16,
    lineHeight: 22,
  },
} as const;

export type TypographyVariant = keyof typeof typography;

export const maxFontSizeMultiplier = 2;
