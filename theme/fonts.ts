import { Platform, type TextStyle } from 'react-native';

/**
 * Live sentences use the system serif (Georgia on iOS, generic serif on Android).
 * The Back wordmark is outlined from Georgia Regular — see assets/brand/README.md.
 * TODO: license and bundle a production serif if Android live headings must match
 * iOS Georgia. Do not swap in an unlicensed display face.
 */
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
