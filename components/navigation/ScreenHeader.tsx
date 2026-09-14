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
  onBack?: () => void;
  backLabel?: string;
  backHint?: string;
  right?: ReactNode;
};

export function ScreenHeader({
  title,
  showClose = true,
  onClose,
  closeVariant = 'close',
  closeLabel,
  closeHint,
  onBack,
  backLabel,
  backHint,
  right,
}: Props) {
  const closeControl = showClose ? (
    <CloseButton
      variant={closeVariant}
      onPress={onClose}
      accessibilityLabel={closeLabel}
      accessibilityHint={closeHint}
    />
  ) : (
    <View style={styles.spacer} />
  );

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? (
          <CloseButton
            variant="back"
            onPress={onBack}
            accessibilityLabel={backLabel}
            accessibilityHint={backHint}
          />
        ) : (
          closeControl
        )}
      </View>
      <AppText variant="section" style={styles.title} numberOfLines={2} accessibilityRole="header">
        {title}
      </AppText>
      <View style={styles.side}>
        {right ??
          (onBack && showClose ? (
            <CloseButton
              variant={closeVariant}
              onPress={onClose}
              accessibilityLabel={closeLabel}
              accessibilityHint={closeHint}
            />
          ) : (
            <View style={styles.spacer} />
          ))}
      </View>
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
    minWidth: touch.min,
    flexShrink: 0,
    overflow: 'visible',
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
