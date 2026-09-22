import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/typography/AppText';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { mixHex } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  onDismiss: () => void;
};

export function HomeNamePrompt({ onDismiss }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const haptics = useHaptics();
  const quiet = mixHex(theme.colors.textSecondary, theme.colors.text, 0.32);
  const action = theme.colors.forest;

  return (
    <View style={styles.wrap}>
      <AppText variant="secondary" style={[styles.message, { color: quiet }]}>
        {t('home.namePrompt')}
      </AppText>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.namePromptAction')}
          onPress={() => {
            haptics.light();
            router.push('/settings/profile');
          }}
          style={({ pressed }) => [{ opacity: pressed ? 0.72 : 1 }]}
        >
          <AppText variant="secondary" style={[styles.action, { color: action }]}>
            {t('home.namePromptAction')}
          </AppText>
        </Pressable>
        <AppText variant="secondary" style={[styles.sep, { color: quiet }]}>
          ·
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.namePromptSkip')}
          onPress={() => {
            haptics.light();
            onDismiss();
          }}
          style={({ pressed }) => [{ opacity: pressed ? 0.72 : 1 }]}
        >
          <AppText variant="secondary" style={[styles.skip, { color: quiet }]}>
            {t('home.namePromptSkip')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xxs,
    marginBottom: spacing.xs,
    gap: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.12,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  action: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.12,
  },
  skip: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.12,
  },
  sep: {
    fontSize: 15,
    lineHeight: 20,
  },
});
