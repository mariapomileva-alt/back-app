import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { primaryButtonRadius, secondaryButtonUsesOutline } from '@/theme/buttonChrome';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  label: string;
  onPress: () => void;
  accessibilityHint?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SecondaryButton({
  label,
  onPress,
  accessibilityHint,
  disabled,
  style,
}: Props) {
  const { theme, themeName } = useTheme();
  const outline = secondaryButtonUsesOutline(themeName);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          borderRadius: primaryButtonRadius(themeName),
          backgroundColor: theme.colors.secondaryButtonBackground,
          borderWidth: outline ? 1 : 0,
          borderColor: outline ? theme.colors.border : 'transparent',
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <AppText variant="button" style={{ color: theme.colors.secondaryButtonText }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touch.comfortable,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
});
