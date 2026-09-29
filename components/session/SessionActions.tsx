import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActivitySwitcher } from '@/components/session/ActivitySwitcher';
import { SessionExitAction } from '@/components/session/SessionExitAction';
import { spacing } from '@/theme/spacing';

type Props = {
  onOkay: () => void;
  onTryAnother?: () => void;
  tryAnotherLabel?: string;
  tryAnotherHint?: string;
  extra?: ReactNode;
};

export function SessionActions({
  onOkay,
  onTryAnother,
  tryAnotherLabel,
  tryAnotherHint,
  extra,
}: Props) {
  return (
    <View style={styles.actions}>
      {extra}
      {onTryAnother ? (
        <ActivitySwitcher
          onPress={onTryAnother}
          label={tryAnotherLabel}
          accessibilityHint={tryAnotherHint}
        />
      ) : null}
      <SessionExitAction onPress={onOkay} />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    width: '100%',
    alignItems: 'stretch',
    flexShrink: 0,
    paddingTop: spacing.xxs,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
});
