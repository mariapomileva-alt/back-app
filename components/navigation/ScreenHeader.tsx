import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { CloseButton } from '@/components/buttons/CloseButton';
import { AppText } from '@/components/typography/AppText';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  title: string;
  showClose?: boolean;
  onClose?: () => void;
  closeVariant?: 'close' | 'back';
  closeLabel?: string;
  closeHint?: string;
  right?: ReactNode;
};

export function ScreenHeader({
  title,
  showClose = true,
  onClose,
  closeVariant = 'close',
  closeLabel,
  closeHint,
  right,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {showClose ? (
          <CloseButton
            variant={closeVariant}
            onPress={onClose}
            accessibilityLabel={closeLabel}
            accessibilityHint={closeHint}
          />
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
      <AppText variant="section" style={styles.title} numberOfLines={2} accessibilityRole="header">
        {title}
      </AppText>
      <View style={styles.side}>{right ?? <View style={styles.spacer} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  side: {
    width: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: touch.min,
    height: touch.min,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
});
