import type { ImageSourcePropType } from 'react-native';

import type { ListenSoundId } from '@/features/listen/sounds';

export type ListenPremiumVisualAssets = {
  /** Active Listen screen — expressive loop (WebP). */
  loop: ImageSourcePropType;
  /** Picker + Reduce Motion — static PNG. */
  still: ImageSourcePropType;
  hasAnimatedLoop: boolean;
};

const premiumBySound: Partial<Record<ListenSoundId, ListenPremiumVisualAssets>> = {
  rain: {
    loop: require('../../assets/listen-art/runtime/rain-loop.webp'),
    still: require('../../assets/listen-art/runtime/rain-still.png'),
    hasAnimatedLoop: true,
  },
  ocean: {
    loop: require('../../assets/listen-art/runtime/ocean-loop.webp'),
    still: require('../../assets/listen-art/runtime/ocean-still.png'),
    hasAnimatedLoop: true,
  },
  stream: {
    loop: require('../../assets/listen-art/runtime/stream-loop.webp'),
    still: require('../../assets/listen-art/runtime/stream-still.png'),
    hasAnimatedLoop: true,
  },
  forest: {
    loop: require('../../assets/listen-art/runtime/forest-loop.webp'),
    still: require('../../assets/listen-art/runtime/forest-still.png'),
    hasAnimatedLoop: true,
  },
  birds: {
    loop: require('../../assets/listen-art/runtime/birds-loop.webp'),
    still: require('../../assets/listen-art/runtime/birds-still.png'),
    hasAnimatedLoop: true,
  },
  fan: {
    loop: require('../../assets/listen-art/runtime/fan-loop.webp'),
    still: require('../../assets/listen-art/runtime/fan-still.png'),
    hasAnimatedLoop: true,
  },
  brown: {
    loop: require('../../assets/listen-art/runtime/brown-loop.webp'),
    still: require('../../assets/listen-art/runtime/brown-still.png'),
    hasAnimatedLoop: true,
  },
  white: {
    still: require('../../assets/listen-art/runtime/white-still.png'),
    loop: require('../../assets/listen-art/runtime/white-loop.webp'),
    hasAnimatedLoop: true,
  },
};

export function listenPremiumVisual(soundId: ListenSoundId): ListenPremiumVisualAssets | null {
  return premiumBySound[soundId] ?? null;
}

/** Static thumbnail for the sound picker — never animated WebP. */
export function listenPremiumStill(soundId: ListenSoundId): ImageSourcePropType | null {
  const assets = premiumBySound[soundId];
  return assets?.still ?? null;
}
