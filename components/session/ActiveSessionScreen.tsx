import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExerciseShell } from '@/components/exercise/ExerciseShell';
import { SessionActions } from '@/components/session/SessionActions';
import {
  useActiveSession,
  type ActiveSessionControls,
} from '@/hooks/useActiveSession';
import { t } from '@/locales/i18n';
import type { HomeToolId } from '@/types';

type Props = {
  tool: HomeToolId;
  title: string;
  children: ReactNode | ((controls: ActiveSessionControls) => ReactNode);
  scroll?: boolean;
  right?: ReactNode;
  showSessionActions?: boolean;
  onTryAnother?: () => void;
  tryAnotherLabel?: string;
  tryAnotherHint?: string;
  extraActions?: ReactNode | ((controls: ActiveSessionControls) => ReactNode);
  onClose?: () => void;
  closeLabel?: string;
  closeHint?: string;
  onBack?: () => void;
  backLabel?: string;
  backHint?: string;
  backNavigates?: boolean;
  /** When set, show a header back control that ends the session (same as close) if `onBack` is unset. */
  backClosesSession?: boolean;
  /** Header × close (right when back is shown). Default off — back exits to home. */
  showSessionClose?: boolean;
};

export function ActiveSessionScreen({
  tool,
  title,
  children,
  scroll,
  right,
  showSessionActions = true,
  onTryAnother,
  tryAnotherLabel,
  tryAnotherHint,
  extraActions,
  onClose,
  closeLabel,
  closeHint,
  onBack,
  backLabel,
  backHint,
  backNavigates = false,
  backClosesSession = false,
  showSessionClose = false,
}: Props) {
  const controls = useActiveSession(tool, backNavigates ? onBack : undefined);
  const headerBack = onBack ?? (backClosesSession ? controls.close : undefined);
  const body = typeof children === 'function' ? children(controls) : children;
  const extra = typeof extraActions === 'function' ? extraActions(controls) : extraActions;

  return (
    <ExerciseShell
      title={title}
      onClose={onClose ?? controls.close}
      showClose={showSessionClose}
      right={right}
      scroll={scroll}
      closeLabel={closeLabel ?? t('exercise.closeSession')}
      closeHint={closeHint}
      onBack={headerBack}
      backLabel={backLabel ?? (headerBack ? t('common.back') : undefined)}
      backHint={backHint}
    >
      {scroll === false ? <View style={styles.body}>{body}</View> : body}
      {showSessionActions ? (
        <View style={styles.footer}>
          <SessionActions
            onOkay={controls.close}
            onTryAnother={onTryAnother}
            tryAnotherLabel={tryAnotherLabel}
            tryAnotherHint={tryAnotherHint}
            extra={extra}
          />
        </View>
      ) : null}
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    minHeight: 0,
  },
  footer: {
    flexShrink: 0,
    width: '100%',
  },
});
