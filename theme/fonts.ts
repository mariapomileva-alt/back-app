import { Platform, type TextStyle } from 'react-native';

export const serif: TextStyle['fontFamily'] = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia, Times, serif',
});

export const sans: TextStyle['fontFamily'] = Platform.select({
  ios: undefined,
  android: 'Roboto',
  default: undefined,
});
