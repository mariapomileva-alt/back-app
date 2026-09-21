import { StyleSheet, View } from 'react-native';

import { ContainedArtImage } from '@/components/media/ContainedArtImage';
import { listenPremiumStill } from '@/features/listen/premiumVisuals';
import type { ListenSoundId } from '@/features/listen/sounds';

const THUMB = 32;

type Props = {
  soundId: ListenSoundId;
};

export function ListenSoundChipThumb({ soundId }: Props) {
  const source = listenPremiumStill(soundId);
  if (!source) {
    return null;
  }

  return (
    <View style={styles.frame} accessible={false}>
      <ContainedArtImage source={source} style={styles.artFrame} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: THUMB,
    height: THUMB,
    flexShrink: 0,
    backgroundColor: 'transparent',
  },
  artFrame: {
    width: THUMB,
    height: THUMB,
  },
});
