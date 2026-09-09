import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';
import { themes, type ThemeName } from '@/theme/themes';

type Props = {
  themeName: ThemeName;
  selected: boolean;
  onPress: () => void;
};

export function ThemeCard({ themeName, selected, onPress }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const preview = themes[themeName];
  const label = t(`themes.${themeName}`);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={t('themes.selectHint')}
      accessibilityState={{ selected }}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          borderWidth: selected ? 2 : 1,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View
        style={[styles.preview, { backgroundColor: preview.colors.background }]}
        accessible={false}
      >
        <View style={[styles.surface, { backgroundColor: preview.colors.surface }]} />
        <View style={[styles.dot, { backgroundColor: preview.colors.buttonBackground }]} />
      </View>
      <View style={styles.meta}>
        <AppText variant="button">{label}</AppText>
        {selected ? (
          <AppText variant="secondary" tone="secondary">
            {t('common.selected')}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: touch.comfortable * 2,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  preview: {
    height: 88,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  surface: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    width: 72,
    height: 48,
    borderRadius: radius.button,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: radius.circle,
  },
  meta: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
  },
});
