import Animated from 'react-native-reanimated';
import { Image, StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useListenVisualAmbientMotion } from '@/components/listen/ListenVisualAmbientMotion';
import { useReduceTransparency } from '@/hooks/useReduceTransparency';
import { useTheme } from '@/hooks/useTheme';
import { brand, hexToRgba } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

export type AtmosphericTreatment = 'photo' | 'abstract';

type Props = {
  source: ImageSourcePropType;
  accessibilityLabel: string;
  height?: number;
  heightRatio?: number;
  treatment?: AtmosphericTreatment;
  /** Gentle Ken Burns drift on the photo layer (Listen). */
  ambientMotion?: boolean;
  ambientMotionActive?: boolean;
};

export function AtmosphericImage({
  source,
  accessibilityLabel,
  height,
  heightRatio = 0.36,
  treatment = 'photo',
  ambientMotion = false,
  ambientMotionActive = true,
}: Props) {
  const { theme } = useTheme();
  const reduceTransparency = useReduceTransparency();
  const { height: windowHeight } = useWindowDimensions();
  const imageHeight = height ?? Math.round(windowHeight * heightRatio);
  const fade = theme.colors.background || brand.warmIvory;
  const clear = hexToRgba(fade, 0);
  const abstract = treatment === 'abstract';
  const wash = abstract ? 0.14 : theme.name === 'deepGreen' ? 0.12 : 0.04;
  const motion = useListenVisualAmbientMotion(ambientMotion && ambientMotionActive);
  const photoLayer = ambientMotion ? (
    <Animated.View style={[styles.imageMotion, motion.contentStyle]}>
      <Image source={source} style={styles.image} resizeMode="cover" fadeDuration={0} />
    </Animated.View>
  ) : (
    <Image source={source} style={styles.image} resizeMode="cover" fadeDuration={0} />
  );

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[styles.wrap, { height: imageHeight }]}
    >
      {photoLayer}
      {reduceTransparency ? (
        <View style={[styles.solidEdge, { borderColor: theme.colors.border, pointerEvents: 'none' }]} />
      ) : (
        <>
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: fade, opacity: wash, pointerEvents: 'none' }]}
          />
          <LinearGradient
            colors={[fade, clear]}
            style={[styles.fadeTop, abstract ? styles.fadeTopAbstract : null, styles.ignorePointer]}
          />
          <LinearGradient
            colors={[clear, fade]}
            style={[styles.fadeBottom, abstract ? styles.fadeBottomAbstract : null, styles.ignorePointer]}
          />
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[fade, clear, clear, fade]}
            locations={abstract ? [0, 0.2, 0.8, 1] : [0, 0.16, 0.84, 1]}
            style={[StyleSheet.absoluteFill, styles.ignorePointer]}
          />
          {motion.showShimmer ? (
            <Animated.View
              style={[StyleSheet.absoluteFill, styles.shimmer, motion.shimmerStyle, styles.ignorePointer]}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginHorizontal: -spacing.lg,
    overflow: 'hidden',
  },
  imageMotion: {
    ...StyleSheet.absoluteFill,
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  shimmer: {
    backgroundColor: '#ffffff',
  },
  fadeTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '32%',
  },
  fadeTopAbstract: {
    height: '40%',
  },
  fadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '36%',
  },
  fadeBottomAbstract: {
    height: '44%',
  },
  ignorePointer: {
    pointerEvents: 'none',
  },
  solidEdge: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.lg,
  },
});
