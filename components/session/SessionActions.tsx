import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActivitySwitcher } from '@/components/session/ActivitySwitcher';
import { SessionExitAction } from '@/components/session/SessionExitAction';
import { TrySomethingElse } from '@/components/session/TrySomethingElse';
import { spacing } from '@/theme/spacing';

type Props = {
  onOkay: () => void;
  onTrySomethingElse: () => void;
  onChangeActivity?: () => void;
  changeActivityLabel?: string;
  extra?: ReactNode;
};

export function SessionActions({
  onOkay,
  onTrySomethingElse,
  onChangeActivity,
  changeActivityLabel,
  extra,
}: Props) {
  return (
    <View style={styles.actions}>
      <SessionExitAction onPress={onOkay} />
      {onChangeActivity ? (
        <ActivitySwitcher onPress={onChangeActivity} label={changeActivityLabel} />
      ) : null}
      <TrySomethingElse onPress={onTrySomethingElse} />
      {extra}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    width: '100%',
    alignItems: 'stretch',
    paddingTop: spacing.sm,
  },
});
