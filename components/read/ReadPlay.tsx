import { StyleSheet, View } from 'react-native';

import { ReadingCanvas } from '@/components/read/ReadingCanvas';
import type { ReadRevealSpeed, RevealFragment } from '@/features/read/types';

type Props = {
  fragments: RevealFragment[];
  speed: ReadRevealSpeed;
  revealedCount: number;
  onReveal: () => void;
};

export function ReadPlay({ fragments, speed, revealedCount, onReveal }: Props) {
  return (
    <View style={styles.play}>
      <ReadingCanvas
        fragments={fragments}
        revealedCount={revealedCount}
        onReveal={onReveal}
        speed={speed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  play: {
    flex: 1,
  },
});
