import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

export type SessionChoice = {
  id: string;
  label: string;
};

type Props = {
  visible: boolean;
  title: string;
  options: readonly SessionChoice[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onDismiss: () => void;
  /** Android / hardware back while the menu is open. Defaults to dismiss. */
  onHardwareBack?: () => void;
};

export function SessionChoiceSheet({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onDismiss,
  onHardwareBack,
}: Props) {
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? 'none' : 'fade'}
      onRequestClose={onHardwareBack ?? onDismiss}
    >
      <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onDismiss}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <AppText variant="section" accessibilityRole="header" style={styles.title}>
            {title}
          </AppText>
          <View accessibilityRole="radiogroup" accessibilityLabel={title}>
            {options.map((option) => {
              const selected = option.id === selectedId;
              return (
                <AccessiblePressable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={
                    selected ? `${option.label}, ${t('common.selected')}` : option.label
                  }
                  onPress={() => onSelect(option.id)}
                  style={[
                    styles.row,
                    {
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                >
                  <AppText
                    variant="body"
                    style={{
                      color: selected ? theme.colors.text : theme.colors.textSecondary,
                      fontWeight: selected ? '600' : '400',
                    }}
                  >
                    {option.label}
                  </AppText>
                  {selected ? (
                    <AppText variant="secondary" tone="secondary">
                      {t('common.selected')}
                    </AppText>
                  ) : null}
                </AccessiblePressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '72%',
  },
  title: {
    marginBottom: spacing.sm,
  },
  row: {
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
