import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';

import { AppText } from '@/components/typography/AppText';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
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
        <View style={[styles.surface, { backgroundColor: preview.colors.surface }]}>
          <Svg width={40} height={28} viewBox="0 0 40 28" preserveAspectRatio="xMidYMid meet">
            {themeName === 'softBeige' ? (
              <>
                <Ellipse cx="20" cy="16" rx="11" ry="3.5" fill={preview.colors.markMuted} opacity={0.72} />
                <Circle cx="20" cy="11" r="7" fill={preview.colors.markLine} opacity={0.38} />
                <Circle cx="20" cy="11" r="7" fill="none" stroke={preview.colors.cool} strokeWidth={1.1} opacity={0.9} />
              </>
            ) : (
              <>
                <Circle cx="20" cy="14" r="12" fill={preview.colors.markMuted} opacity={0.34} />
                <Circle cx="20" cy="14" r="8" fill={preview.colors.markSecondary} opacity={0.42} />
                <Circle cx="20" cy="14" r="4.2" fill={preview.colors.markPrimary} opacity={0.88} />
              </>
            )}
          </Svg>
          <AppText
            variant="secondary"
            numberOfLines={1}
            style={[styles.sample, { color: preview.colors.text }]}
          >
            {t('app.name')}
          </AppText>
        </View>
      </View>
      <View style={styles.meta}>
        <View style={styles.labelRow}>
          <AppText variant="button" style={styles.label}>
            {label}
          </AppText>
          {selected ? (
            <AppText variant="body" tone="secondary" accessibilityElementsHidden>
              ✓
            </AppText>
          ) : null}
        </View>
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
    height: 84,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  surface: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.button,
    minHeight: 44,
  },
  sample: {
    fontFamily: serif,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  meta: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  label: {
    flex: 1,
  },
});
