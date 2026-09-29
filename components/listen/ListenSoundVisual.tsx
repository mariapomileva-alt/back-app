import { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ListenGraphic } from '@/components/listen/ListenGraphic';
import { ListenPremiumVisual } from '@/components/listen/ListenPremiumVisual';
import { listenPremiumVisual } from '@/features/listen/premiumVisuals';
import { listenGraphicVariantFor, type ListenSound } from '@/features/listen/sounds';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { t } from '@/locales/i18n';

type Props = {
  sound: ListenSound;
  /** Fixed band height when the stage scrolls or on short layouts. */
  height: number;
  /** Grow with free space between title and transport (default Listen layout). */
  fill?: boolean;
  width?: number;
  style?: StyleProp<ViewStyle>;
};

/** Main Listen stage — runtime-trimmed art at responsive size; PNG when Reduce Motion. */
export function ListenSoundVisual({ sound, height, fill = false, width, style }: Props) {
  const reduceMotion = useReduceMotion();
  const reveal = useSharedValue(1);
  const premium = listenPremiumVisual(sound.id);
  const label = t(sound.imageLabelKey);

  useEffect(() => {
    if (reduceMotion) {
      reveal.value = 1;
      return;
    }
    reveal.value = 0.94;
    reveal.value = withTiming(1, {
      duration: 420,
      easing: Easing.inOut(Easing.quad),
    });
  }, [reduceMotion, reveal, sound.id]);

  const crossfadeStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
  }));

  return (
    <Animated.View
      accessible={!premium}
      accessibilityRole={premium ? undefined : 'image'}
      accessibilityLabel={premium ? undefined : label}
      importantForAccessibility={premium ? 'no-hide-descendants' : 'auto'}
      style={[
        styles.slot,
        fill ? styles.slotFill : width != null ? { width, height } : { height },
        style,
        crossfadeStyle,
      ]}
    >
      {premium ? (
        <ListenPremiumVisual assets={premium} reduceMotion={reduceMotion} />
      ) : (
        <ListenGraphic variant={listenGraphicVariantFor(sound)} motionActive={false} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  slotFill: {
    flex: 1,
    minHeight: 0,
    height: '100%',
  },
});
