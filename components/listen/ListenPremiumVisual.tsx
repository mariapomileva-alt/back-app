import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ContainedArtImage } from '@/components/media/ContainedArtImage';
import { LISTEN_ART_CONTENT_INSET } from '@/features/listen/artworkLayout';
import type { ListenPremiumVisualAssets } from '@/features/listen/premiumVisuals';
import { useListenPremiumStageMotion } from '@/hooks/useListenPremiumStageMotion';

type Props = {
  assets: ListenPremiumVisualAssets;
  reduceMotion: boolean;
};

export function ListenPremiumVisual({ assets, reduceMotion }: Props) {
  const useStill = reduceMotion || !assets.hasAnimatedLoop;
  const source = useStill ? assets.still : assets.loop;
  const motionEnabled = !reduceMotion;
  const motionStyle = useListenPremiumStageMotion(motionEnabled);

  return (
    <View
      style={styles.frame}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View style={[styles.motionShell, motionStyle]}>
        <ContainedArtImage source={source} contentInset={LISTEN_ART_CONTENT_INSET} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  motionShell: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
