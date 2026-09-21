import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedAppShell } from '@/components/layout/ThemedAppShell';
import { ActiveSessionHeader } from '@/components/session/ActiveSessionHeader';

type Props = {
  title: string;
  onClose: () => void;
  showClose?: boolean;
  right?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  closeLabel?: string;
  closeHint?: string;
  onBack?: () => void;
  backLabel?: string;
  backHint?: string;
};

export function ExerciseShell({
  title,
  onClose,
  showClose = false,
  right,
  children,
  scroll,
  closeLabel,
  closeHint,
  onBack,
  backLabel,
  backHint,
}: Props) {
  return (
    <ThemedAppShell scroll={scroll} contentStyle={[styles.content, scroll === false ? styles.fill : null]}>
      <ActiveSessionHeader
        title={title}
        onClose={onClose}
        showClose={showClose}
        closeLabel={closeLabel}
        closeHint={closeHint}
        onBack={onBack}
        backLabel={backLabel}
        backHint={backHint}
        right={right}
      />
      {children}
    </ThemedAppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
  fill: {
    flex: 1,
    minHeight: 0,
  },
});
