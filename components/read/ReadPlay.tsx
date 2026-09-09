import { StyleSheet, View } from 'react-native';

import { TextButton } from '@/components/buttons/TextButton';
import { ReadingCanvas } from '@/components/read/ReadingCanvas';
import type { ReadRevealSpeed, RevealFragment } from '@/features/read/types';
import { t } from '@/locales/i18n';

type Props = {
  fragments: RevealFragment[];
  speed: ReadRevealSpeed;
  revealedCount: number;
  onReveal: () => void;
  onClose: () => void;
};

export function ReadPlay({ fragments, speed, revealedCount, onReveal, onClose }: Props) {
  return (
    <View style={styles.play}>
      <ReadingCanvas
        fragments={fragments}
        revealedCount={revealedCount}
        onReveal={onReveal}
        speed={speed}
      />
      <TextButton label={t('exercise.okay')} onPress={onClose} style={styles.exit} />
    </View>
  );
}

const styles = StyleSheet.create({
  play: {
    flex: 1,
  },
  exit: {
    alignSelf: 'center',
    minHeight: 44,
    marginTop: 4,
  },
});
