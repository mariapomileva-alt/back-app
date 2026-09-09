import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { canPlaceLocalCall, openPhoneCall, openSmsMessage } from '@/features/emergency/dial';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { loadSupportContact } from '@/storage/supportContact';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';
import type { SupportContact } from '@/types';

export default function SupportScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [contact, setContact] = useState<SupportContact | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadSupportContact().then((value) => {
        if (active) {
          setContact(value);
        }
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const canCall = canPlaceLocalCall(contact?.phoneNumber);
  const canMessage = canCall;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain opacity={0.1} />
      <ScreenContainer style={styles.transparent}>
        <ScreenHeader title={t('session.callPerson')} />
        <AppText style={styles.title}>
          {contact ? contact.name : t('extraSupport.chooseSomeone')}
        </AppText>
        <View style={styles.actions}>
          {canCall && contact?.phoneNumber ? (
            <>
              <PrimaryButton
                label={t('extraSupport.callMyPerson')}
                accessibilityHint={t('extraSupport.callHint')}
                onPress={() => {
                  void openPhoneCall(contact.phoneNumber ?? '');
                }}
              />
              {canMessage ? (
                <SecondaryButton
                  label={t('extraSupport.messageMyPerson')}
                  accessibilityHint={t('extraSupport.messageHint')}
                  onPress={() => {
                    void openSmsMessage(contact.phoneNumber ?? '');
                  }}
                />
              ) : null}
              <SecondaryButton
                label={t('supportSetup.change')}
                onPress={() => router.push('/support/setup')}
              />
            </>
          ) : (
            <PrimaryButton
              label={t('extraSupport.chooseSomeone')}
              accessibilityHint={t('extraSupport.chooseSomeoneHint')}
              onPress={() => router.push('/support/setup')}
            />
          )}
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  title: {
    fontFamily: serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '500',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  actions: {
    gap: spacing.md,
  },
});
