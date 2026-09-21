import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ContainedArtImage } from '@/components/media/ContainedArtImage';
import type { MovePremiumVisualAssets } from '@/features/move/premiumVisuals';
import { MOVE_PREMIUM_ASPECT } from '@/features/move/premiumVisuals';

const CROSSFADE_MS = 420;
const REDUCE_CROSSFADE_MS = 160;

type Props = {
  assets: MovePremiumVisualAssets;
  reduceMotion: boolean;
  visualKey: string;
};

export function MovePremiumVisual({ assets, reduceMotion, visualKey }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const opacity = useSharedValue(1);
  const source = reduceMotion ? assets.still : assets.loop;
  const artWidth = Math.min(Math.max(0, windowWidth - 32), 340);
  const artHeight = Math.round(artWidth / MOVE_PREMIUM_ASPECT);

  useEffect(() => {
    opacity.value = reduceMotion ? 0.92 : 0.88;
    opacity.value = withTiming(1, {
      duration: reduceMotion ? REDUCE_CROSSFADE_MS : CROSSFADE_MS,
      easing: Easing.out(Easing.quad),
    });
  }, [opacity, reduceMotion, visualKey]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.frame,
        { width: artWidth, height: artHeight },
        fadeStyle,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ContainedArtImage source={source} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
});
