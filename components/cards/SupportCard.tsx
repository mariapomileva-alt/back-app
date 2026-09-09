import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  title: string;
  body?: string;
  onPress?: () => void;
  accessibilityHint?: string;
  children?: ReactNode;
};

export function SupportCard({ title, body, onPress, accessibilityHint, children }: Props) {
  const { theme } = useTheme();
  const content = (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <AppText variant="section">{title}</AppText>
      {body ? (
        <AppText variant="body" tone="secondary" style={styles.body}>
          {body}
        </AppText>
      ) : null}
      {children}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: touch.comfortable,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  body: {
    marginTop: spacing.sm,
  },
});
