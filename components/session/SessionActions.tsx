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
      <SessionExitAction onPress={onOkay} />
      {onTryAnother ? (
        <ActivitySwitcher
          onPress={onTryAnother}
          label={tryAnotherLabel}
          accessibilityHint={tryAnotherHint}
        />
      ) : null}
      {extra}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    width: '100%',
    alignItems: 'stretch',
    flexShrink: 0,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.xxs,
  },
});
