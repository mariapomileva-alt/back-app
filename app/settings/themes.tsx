import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ThemeCard } from '@/components/cards/ThemeCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { usePaidToolGate } from '@/hooks/usePaidToolGate';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';
import { themeOrder } from '@/theme/themes';

export default function ThemesScreen() {
  usePaidToolGate();
  const { themeName, setThemeName, reloadPreferences } = useTheme();

  useFocusEffect(
    useCallback(() => {
      void reloadPreferences();
    }, [reloadPreferences]),
  );

  return (
    <ScreenContainer phoneWidth>
      <ScreenHeader title={t('themes.title')} />
      <View style={styles.list}>
        {themeOrder.map((name) => (
          <ThemeCard
            key={name}
            themeName={name}
            selected={themeName === name}
            onPress={() => setThemeName(name)}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
