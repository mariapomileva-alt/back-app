import { Platform, type ViewProps } from 'react-native';

const isWeb = Platform.OS === 'web';

/** Hide this node and its descendants from the a11y tree without leaking Android-only props onto web DOM. */
export function hideFromA11yTree(): ViewProps {
  if (isWeb) {
    return {
      accessible: false,
      accessibilityRole: 'none',
      'aria-hidden': true,
    };
  }

  return {
    accessible: false,
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  };
}

/** Keep this node out of the a11y tree without hiding descendants (Android `no`). */
export function skipA11yNode(): ViewProps {
  if (isWeb) {
    return { accessible: false };
  }

  return {
    accessible: false,
    importantForAccessibility: 'no',
  };
}
