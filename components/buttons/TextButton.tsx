import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import {
  SECONDARY_CONTROL_LABEL_OPACITY,
  secondaryControlLabelColor,
} from '@/theme/colors';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  label: string;
  onPress: () => void;
  accessibilityHint?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function TextButton({
  label,
  onPress,
  accessibilityHint,
  disabled,
  style,
}: Props) {
  const { theme } = useTheme();

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
        { opacity: disabled ? 0.5 : pressed ? 0.72 : 1 },
        style,
      ]}
    >
      <AppText
        variant="body"
        style={{
          color: secondaryControlLabelColor(theme),
          opacity: SECONDARY_CONTROL_LABEL_OPACITY,
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
