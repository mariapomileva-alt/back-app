import type { ViewStyle } from 'react-native';

import { brand } from '@/theme/colors';

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  } satisfies ViewStyle,
  subtle: {
    shadowColor: brand.deepForest,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  } satisfies ViewStyle,
} as const;
