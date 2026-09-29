import { StyleSheet, View } from 'react-native';

import { ContainedArtImage } from '@/components/media/ContainedArtImage';
import type { GroundPremiumVisualAssets } from '@/features/ground/premiumVisuals';

type Props = {
  assets: GroundPremiumVisualAssets;
  reduceMotion: boolean;
};

/** Premium Ground loop or still — no extra motion layered on the loop. */
export function GroundPremiumVisual({ assets, reduceMotion }: Props) {
  const source = reduceMotion ? assets.still : assets.loop;

  return (
    <View
      style={styles.frame}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ContainedArtImage source={source} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});
