import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ListenGraphic } from '@/components/listen/ListenGraphic';
import { ListenVisualAmbientMotion } from '@/components/listen/ListenVisualAmbientMotion';
import { AtmosphericImage } from '@/components/media/AtmosphericImage';
import { listenGraphicVariantFor, type ListenSound } from '@/features/listen/sounds';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { t } from '@/locales/i18n';

type Props = {
  sound: ListenSound;
  height: number;
  /** Drives ambient drift while the session is playing. */
  motionActive?: boolean;
};

export function ListenSoundVisual({ sound, height, motionActive = true }: Props) {
  const reduceMotion = useReduceMotion();
  const reveal = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      reveal.value = 1;
      return;
    }
    reveal.value = 0.82;
    reveal.value = withTiming(1, {
      duration: 640,
      easing: Easing.inOut(Easing.quad),
      reduceMotion: ReduceMotion.Never,
    });
  }, [reduceMotion, reveal, sound.id]);

  const crossfadeStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
  }));

  if (sound.treatment === 'photo' && sound.image) {
    return (
      <Animated.View style={[styles.frame, { height }, crossfadeStyle]}>
        <AtmosphericImage
          source={sound.image}
          accessibilityLabel={t(sound.imageLabelKey)}
          height={height}
          treatment="photo"
          ambientMotion
          ambientMotionActive={motionActive}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      accessible
      accessibilityRole="image"
      accessibilityLabel={t(sound.imageLabelKey)}
      style={[styles.frame, styles.graphic, { height }, crossfadeStyle]}
    >
      <ListenVisualAmbientMotion active={motionActive} style={styles.fill}>
        <ListenGraphic variant={listenGraphicVariantFor(sound)} motionActive={motionActive} />
      </ListenVisualAmbientMotion>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    alignSelf: 'center',
  },
  graphic: {
    minHeight: 0,
  },
  fill: {
    flex: 1,
  },
});
