import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { PaperGrain } from '@/components/home/PaperGrain';
import { ActiveSessionHeader } from '@/components/session/ActiveSessionHeader';
import { SessionSafeArea } from '@/components/session/SessionSafeArea';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  title: string;
  onClose: () => void;
  right?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  closeLabel?: string;
  closeHint?: string;
};

export function ExerciseShell({
  title,
  onClose,
  right,
  children,
  scroll,
  closeLabel,
  closeHint,
}: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain />
      <SessionSafeArea
        scroll={scroll}
        style={styles.transparent}
        contentStyle={[styles.content, scroll === false ? styles.fill : null]}
      >
        <ActiveSessionHeader
          title={title}
          onClose={onClose}
          closeLabel={closeLabel}
          closeHint={closeHint}
          right={right}
        />
        {children}
      </SessionSafeArea>
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
