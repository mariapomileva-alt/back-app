import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { TextButton } from '@/components/buttons/TextButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { clearSupportContact, loadSupportContact, saveSupportContact } from '@/storage/supportContact';
import { spacing, touch } from '@/theme/spacing';

export default function SupportSetupScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadSupportContact().then((contact) => {
        if (!active) {
          return;
        }
        setName(contact?.name ?? '');
        setPhoneNumber(contact?.phoneNumber ?? '');
        setHasSaved(Boolean(contact));
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const canSave = name.trim().length > 0 && phoneNumber.trim().length > 0;

  return (
    <ScreenContainer>
      <ScreenHeader title={t('supportSetup.title')} />
      <View style={styles.body}>
        <AppText variant="body" tone="secondary" style={styles.intro}>
          {t('supportSetup.intro')}
        </AppText>

        <AppText variant="secondary" tone="secondary" style={styles.label}>
          {t('supportSetup.name')}
        </AppText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('supportSetup.nameHint')}
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="words"
          autoCorrect={false}
          accessibilityLabel={t('supportSetup.name')}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderBottomColor: theme.colors.border,
            },
          ]}
        />

        <AppText variant="secondary" tone="secondary" style={styles.label}>
          {t('supportSetup.phone')}
        </AppText>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder={t('supportSetup.phoneHint')}
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="phone-pad"
          autoCorrect={false}
          textContentType="telephoneNumber"
          accessibilityLabel={t('supportSetup.phone')}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderBottomColor: theme.colors.border,
            },
          ]}
        />

        <PrimaryButton
          label={t('supportSetup.save')}
          disabled={!canSave}
          onPress={() => {
            void saveSupportContact({
              id: 'local',
              name: name.trim(),
              phoneNumber: phoneNumber.trim(),
            }).then(() => {
              setHasSaved(true);
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            });
          }}
        />

        {hasSaved ? (
          <TextButton
            label={t('supportSetup.clear')}
            onPress={() => {
              void clearSupportContact().then(() => {
                setName('');
                setPhoneNumber('');
                setHasSaved(false);
              });
            }}
            style={styles.clear}
          />
        ) : null}

        <AppText variant="secondary" tone="secondary" style={styles.localNote}>
          {t('supportSetup.localNote')}
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: spacing.md,
    gap: spacing.sm,
    maxWidth: 400,
  },
  intro: {
    marginBottom: spacing.md,
  },
  label: {
    marginTop: spacing.sm,
  },
  input: {
    minHeight: touch.min,
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 17,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  clear: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
  },
  localNote: {
    marginTop: spacing.md,
  },
});
