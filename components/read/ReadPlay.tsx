import { StyleSheet, View } from 'react-native';

import { ReadingCanvas } from '@/components/read/ReadingCanvas';
import type { ReadRevealSpeed, RevealFragment } from '@/features/read/types';

type Props = {
  fragments: RevealFragment[];
  speed: ReadRevealSpeed;
  revealedCount: number;
  onReveal: () => void;
  paused?: boolean;
};

export function ReadPlay({ fragments, speed, revealedCount, onReveal, paused = false }: Props) {
  return (
    <View style={styles.play}>
      <ReadingCanvas
        fragments={fragments}
        revealedCount={revealedCount}
        onReveal={onReveal}
        speed={speed}
        paused={paused}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  play: {
    flex: 1,
  },
});
