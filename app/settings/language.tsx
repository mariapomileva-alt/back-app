import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { isActiveSessionVisible } from '@/features/session/activeSession';
import { useHaptics } from '@/hooks/useHaptics';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { localeNativeNames, supportedUiLocales, type UiLocale } from '@/locales/locale';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

export default function LanguageSettingsScreen() {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const { locale, setLocale, isLocaleEnabled } = useLocale();

  const onSelect = (value: UiLocale) => {
    if (isActiveSessionVisible()) {
      Alert.alert(t('settings.language'), t('settings.languageBlockedDuringSession'));
      return;
    }
    if (!isLocaleEnabled(value)) {
      return;
    }
    if (value === locale) {
      return;
    }
    haptics.selection();
    void setLocale(value);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings.language')} />
      <AppText tone="secondary" style={styles.lead}>
        {t('settings.languageHint')}
      </AppText>
      <View style={styles.list}>
        {supportedUiLocales.map((value) => {
          const selected = value === locale;
          const enabled = isLocaleEnabled(value);
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityLabel={localeNativeNames[value]}
              accessibilityHint={
                enabled ? t('settings.languageHint') : t('settings.languageComingSoon')
              }
              accessibilityState={{ selected, disabled: !enabled }}
              disabled={!enabled}
              onPress={() => onSelect(value)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: selected ? theme.colors.primary : theme.colors.border,
                  opacity: !enabled ? 0.45 : pressed ? 0.9 : 1,
                },
              ]}
            >
              <View style={styles.copy}>
                <AppText variant="button">{localeNativeNames[value]}</AppText>
                {!enabled ? (
                  <AppText variant="secondary" tone="secondary">
                    {t('settings.languageComingSoon')}
                  </AppText>
                ) : null}
              </View>
              {selected ? (
                <AppText variant="secondary" tone="secondary">
                  {t('common.selected')}
                </AppText>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lead: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    maxWidth: 340,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    minHeight: touch.comfortable,
    borderRadius: radius.card,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
});
