import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  computeHomeFitLayout,
  type HomeFitLayout,
} from '@/features/home/homeFitLayout';

export function useHomeFitLayout(showNamePrompt: boolean, namedHero: boolean): HomeFitLayout {
  const { height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const availableHeight = height - insets.top - insets.bottom;

  return computeHomeFitLayout({
    availableHeight,
    fontScale,
    showNamePrompt,
    namedHero,
  });
}
