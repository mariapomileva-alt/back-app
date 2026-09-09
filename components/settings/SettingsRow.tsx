import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  label: string;
  value?: string;
  onPress?: () => void;
  accessibilityHint?: string;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  right?: ReactNode;
};

function QuietToggle({ on }: { on: boolean }) {
  const { theme } = useTheme();

  return (
    <View
      accessible={false}
      style={[
        styles.toggleTrack,
        {
          backgroundColor: on ? theme.colors.secondaryGreen : theme.colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.toggleThumb,
          {
            backgroundColor: theme.colors.surface,
            alignSelf: on ? 'flex-end' : 'flex-start',
          },
        ]}
      />
    </View>
  );
}

export function SettingsRow({
  label,
  value,
  onPress,
  accessibilityHint,
  switchValue,
  onSwitchChange,
  right,
}: Props) {
  const { theme } = useTheme();
  const isSwitch = typeof switchValue === 'boolean' && onSwitchChange;

  const content = (
    <View style={styles.row}>
      <View style={styles.copy}>
        <AppText variant="body">{label}</AppText>
        {value ? (
          <AppText variant="secondary" tone="secondary">
            {value}
          </AppText>
        ) : null}
      </View>
      {isSwitch ? (
        <QuietToggle on={switchValue} />
      ) : (
        (right ?? (
          <AppText variant="body" tone="secondary" accessibilityElementsHidden>
            ›
          </AppText>
        ))
      )}
    </View>
  );

  if (isSwitch) {
    return (
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ checked: switchValue }}
        onPress={() => onSwitchChange(!switchValue)}
        style={({ pressed }) => [
          styles.pressable,
          {
            borderBottomColor: theme.colors.border,
            opacity: pressed ? 0.86 : 1,
          },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        {
          borderBottomColor: theme.colors.border,
          opacity: pressed ? 0.86 : 1,
        },
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    minHeight: touch.min,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm,
  },
  row: {
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  toggleTrack: {
    width: 52,
    height: 32,
    borderRadius: radius.circle,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: radius.circle,
  },
});
