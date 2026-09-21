import {
  Image,
  Platform,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { resolveWebAssetUri } from '@/components/media/resolveWebAssetUri';

type Props = {
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  /** Fractional inset on each edge (0–0.15) — keeps illustration margins inside the stage. */
  contentInset?: number;
};

function clampInset(value: number | undefined): number {
  if (value == null || !Number.isFinite(value)) {
    return 0;
  }
  return Math.min(0.15, Math.max(0, value));
}

/** Session art — full frame visible (letterboxed), never cropped. */
export function ContainedArtImage({ source, style, contentInset }: Props) {
  const inset = clampInset(contentInset);
  const innerScale = 1 - inset * 2;

  if (Platform.OS === 'web') {
    const uri = resolveWebAssetUri(source);
    return (
      <View style={[styles.frame, style]}>
        {uri ? (
          <img
            src={uri}
            alt=""
            style={{
              width: `${innerScale * 100}%`,
              height: `${innerScale * 100}%`,
              objectFit: 'contain',
              display: 'block',
              margin: 'auto',
            }}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.frame, style]}>
      <Image
        source={source}
        style={[styles.image, inset > 0 ? { width: `${innerScale * 100}%`, height: `${innerScale * 100}%` } : null]}
        resizeMode="contain"
        fadeDuration={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    height: '100%',
    minHeight: 0,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
