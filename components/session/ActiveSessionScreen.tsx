import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExerciseShell } from '@/components/exercise/ExerciseShell';
import { SessionActions } from '@/components/session/SessionActions';
import {
  useActiveSession,
  type ActiveSessionControls,
} from '@/hooks/useActiveSession';
import type { HomeToolId } from '@/types';

type Props = {
  tool: HomeToolId;
  title: string;
  children: ReactNode | ((controls: ActiveSessionControls) => ReactNode);
  scroll?: boolean;
  right?: ReactNode;
  showSessionActions?: boolean;
  onChangeActivity?: () => void;
  changeActivityLabel?: string;
  extraActions?: ReactNode | ((controls: ActiveSessionControls) => ReactNode);
};

export function ActiveSessionScreen({
  tool,
  title,
  children,
  scroll,
  right,
  showSessionActions = true,
  onChangeActivity,
  changeActivityLabel,
  extraActions,
}: Props) {
  const controls = useActiveSession(tool);
  const body = typeof children === 'function' ? children(controls) : children;
  const extra = typeof extraActions === 'function' ? extraActions(controls) : extraActions;

  return (
    <ExerciseShell title={title} onClose={controls.close} right={right} scroll={scroll}>
      {scroll === false ? <View style={styles.body}>{body}</View> : body}
      {showSessionActions ? (
        <SessionActions
          onOkay={controls.close}
          onTrySomethingElse={controls.trySomethingElse}
          onChangeActivity={onChangeActivity}
          changeActivityLabel={changeActivityLabel}
          extra={extra}
        />
      ) : null}
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
