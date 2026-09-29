import { Pressable, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { loadReadMemory, saveReadRevealSpeed } from '@/features/read/storage';
import { readRevealSpeeds, type ReadRevealSpeed } from '@/features/read/types';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

export default function ReadSettingsScreen() {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const [speed, setSpeed] = useState<ReadRevealSpeed>('steady');

  useEffect(() => {
    let cancelled = false;
    void loadReadMemory().then((memory) => {
      if (!cancelled) {
        setSpeed(memory.revealSpeed);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScreenContainer phoneWidth>
      <ScreenHeader title={t('settings.read')} />
      <AppText tone="secondary" style={styles.lead}>
        {t('read.speedHint')}
      </AppText>
      <View style={styles.list}>
        {readRevealSpeeds.map((value) => {
          const selected = value === speed;
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityLabel={t(`read.speeds.${value}`)}
              accessibilityState={{ selected }}
              onPress={() => {
                haptics.selection();
                setSpeed(value);
                void saveReadRevealSpeed(value);
              }}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: selected ? theme.colors.primary : theme.colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <AppText variant="button">{t(`read.speeds.${value}`)}</AppText>
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
    justifyContent: 'center',
    gap: spacing.xxs,
  },
});
