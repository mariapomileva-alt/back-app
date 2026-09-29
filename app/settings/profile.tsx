import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { TextButton } from '@/components/buttons/TextButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { clearLocalProfile, loadLocalProfile, saveLocalProfile } from '@/storage/profile';
import { spacing, touch } from '@/theme/spacing';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const haptics = useHaptics();
  const [displayName, setDisplayName] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadLocalProfile().then((profile) => {
        if (!active) {
          return;
        }
        setDisplayName(profile?.displayName ?? '');
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const save = async () => {
    haptics.light();
    await saveLocalProfile({
      displayName: displayName.trim() || undefined,
    });
    router.back();
  };

  const removeAll = async () => {
    haptics.light();
    await clearLocalProfile();
    setDisplayName('');
    router.back();
  };

  return (
    <ScreenContainer phoneWidth>
      <ScreenHeader title={t('profile.title')} />
      <View style={styles.body}>
        <AppText tone="secondary" style={styles.lead}>
          {t('profile.lead')}
        </AppText>

        <AppText variant="secondary" tone="secondary" style={styles.label}>
          {t('profile.displayName')}
        </AppText>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={t('profile.displayNameHint')}
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="sentences"
          autoCorrect={false}
          maxLength={40}
          accessibilityLabel={t('profile.displayName')}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderBottomColor: theme.colors.border,
            },
          ]}
        />

        <AppText tone="secondary" style={styles.note}>
          {t('profile.deviceOnly')}
        </AppText>

        <PrimaryButton label={t('profile.save')} onPress={() => void save()} style={styles.save} />
        <TextButton label={t('profile.clear')} onPress={() => void removeAll()} />
        <TextButton label={t('profile.skip')} onPress={() => router.back()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  lead: {
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: touch.min,
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 18,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  save: {
    marginBottom: spacing.sm,
  },
});
