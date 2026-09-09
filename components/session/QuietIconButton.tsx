import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { touch } from '@/theme/spacing';

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  children: ReactNode;
};

export function QuietIconButton({
  onPress,
  accessibilityLabel,
  accessibilityHint,
  children,
}: Props) {
  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={styles.button}
    >
      {children}
    </AccessiblePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: touch.min,
    height: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
