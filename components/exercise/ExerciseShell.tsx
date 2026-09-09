import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  title: string;
  onClose: () => void;
  right?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  closeVariant?: 'close' | 'back';
  closeLabel?: string;
  closeHint?: string;
};

export function ExerciseShell({
  title,
  onClose,
  right,
  children,
  scroll,
  closeVariant,
  closeLabel,
  closeHint,
}: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain />
      <ScreenContainer
        scroll={scroll}
        style={styles.transparent}
        contentStyle={[styles.content, scroll === false ? styles.fill : null]}
      >
        <ScreenHeader
          title={title}
          onClose={onClose}
          closeVariant={closeVariant}
          closeLabel={closeLabel}
          closeHint={closeHint}
          right={right}
        />
        {children}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
  fill: {
    flex: 1,
  },
});
