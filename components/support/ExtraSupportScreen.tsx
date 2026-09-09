import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { TextButton } from '@/components/buttons/TextButton';
import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { CountryPicker } from '@/components/support/CountryPicker';
import { AppText } from '@/components/typography/AppText';
import { getDeviceRegionCode } from '@/features/emergency/deviceRegion';
import { canPlaceLocalCall, openPhoneCall, openSmsMessage } from '@/features/emergency/dial';
import { resolveEmergencyRecord } from '@/features/emergency/numbers';
import type { EmergencyNumberRecord } from '@/features/emergency/types';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { loadEmergencyCountryCode, saveEmergencyCountryCode } from '@/storage/emergencyCountry';
import { loadSupportContact } from '@/storage/supportContact';
import { mixHex } from '@/theme/colors';
import { serif } from '@/theme/fonts';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';
import type { SupportContact } from '@/types';

const STEP_KEYS = ['feet', 'breath', 'water', 'see', 'now'] as const;

const PREVIEW_CONTACT: SupportContact = {
  id: 'preview',
  name: 'Alex',
  phoneNumber: '20000000',
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function ExtraSupportScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ region?: string; person?: string }>();
  const previewRegion = firstParam(params.region);
  const previewPerson = firstParam(params.person) === '1';

  const [pickingCountry, setPickingCountry] = useState(false);
  const [storedCountryCode, setStoredCountryCode] = useState<string | null>(null);
  const [contact, setContact] = useState<SupportContact | null>(null);

  const loadLocalState = useCallback(async () => {
    const [countryCode, savedContact] = await Promise.all([
      loadEmergencyCountryCode(),
      loadSupportContact(),
    ]);
    setStoredCountryCode(countryCode);
    setContact(savedContact);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLocalState();
    }, [loadLocalState]),
  );

  const record: EmergencyNumberRecord | null = resolveEmergencyRecord({
    previewRegion,
    storedCountryCode,
    deviceRegionCode: getDeviceRegionCode(),
  });

  const shownContact = contact ?? (previewPerson ? PREVIEW_CONTACT : null);
  const canMessage = canPlaceLocalCall(shownContact?.phoneNumber);
  const canCallPerson = canPlaceLocalCall(shownContact?.phoneNumber);

  const onSelectCountry = async (countryCode: string) => {
    await saveEmergencyCountryCode(countryCode);
    setStoredCountryCode(countryCode);
    setPickingCountry(false);
  };

  if (pickingCountry) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <PaperGrain opacity={0.1} />
        <ScreenContainer style={styles.transparent}>
          <ScreenHeader
            title={t('extraSupport.chooseCountry')}
            onClose={() => setPickingCountry(false)}
            closeVariant="close"
          />
          <CountryPicker onSelect={onSelectCountry} />
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain opacity={0.1} />
      <ScreenContainer style={styles.transparent}>
        <ScreenHeader title={t('extraSupport.title')} />

        <AppText style={styles.heading}>{t('extraSupport.heading')}</AppText>

        <View style={styles.steps}>
          {STEP_KEYS.map((key) => (
            <AppText key={key} variant="body" style={styles.step}>
              {t(`extraSupport.steps.${key}`)}
            </AppText>
          ))}
        </View>

        <View style={styles.human}>
          {shownContact && canCallPerson ? (
            <>
              <PrimaryButton
                label={t('extraSupport.callMyPerson')}
                accessibilityHint={t('extraSupport.callHint')}
                onPress={() => {
                  void openPhoneCall(shownContact.phoneNumber ?? '');
                }}
              />
              {canMessage ? (
                <SecondaryButton
                  label={t('extraSupport.messageMyPerson')}
                  accessibilityHint={t('extraSupport.messageHint')}
                  onPress={() => {
                    void openSmsMessage(shownContact.phoneNumber ?? '');
                  }}
                />
              ) : null}
            </>
          ) : (
            <PrimaryButton
              label={t('extraSupport.chooseSomeone')}
              accessibilityHint={t('extraSupport.chooseSomeoneHint')}
              onPress={() => router.push('/support/setup')}
            />
          )}
        </View>

        <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

        <AppText variant="section" style={styles.urgentTitle}>
          {t('extraSupport.urgentTitle')}
        </AppText>
        <AppText variant="body" tone="secondary" style={styles.urgentBody}>
          {t('extraSupport.urgentBody')}
        </AppText>

        {record ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('extraSupport.emergencyHelp', {
              number: record.generalEmergency,
            })}
            accessibilityHint={t('extraSupport.emergencyHint')}
            onPress={() => {
              void openPhoneCall(record.generalEmergency);
            }}
            style={({ pressed }) => [
              styles.emergencyButton,
              {
                backgroundColor: mixHex(theme.colors.surfaceSecondary, theme.colors.forest, 0.12),
                borderColor: mixHex(theme.colors.border, theme.colors.forest, 0.28),
                opacity: pressed ? 0.86 : 1,
              },
            ]}
          >
            <AppText variant="button" style={{ color: theme.colors.text }}>
              {t('extraSupport.emergencyHelp', { number: record.generalEmergency })}
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.unknown}>
            <AppText variant="body" style={styles.findLocal}>
              {t('extraSupport.findLocal')}
            </AppText>
            <SecondaryButton
              label={t('extraSupport.chooseCountry')}
              onPress={() => setPickingCountry(true)}
            />
          </View>
        )}

        {record ? (
          <TextButton
            label={t('extraSupport.chooseCountry')}
            onPress={() => setPickingCountry(true)}
            style={styles.changeCountry}
          />
        ) : null}
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
  heading: {
    fontFamily: serif,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '500',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    maxWidth: 320,
  },
  steps: {
    gap: spacing.md,
    maxWidth: 340,
    marginBottom: spacing.xl,
  },
  step: {
    fontSize: 17,
    lineHeight: 24,
  },
  human: {
    gap: spacing.sm,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    opacity: 0.9,
  },
  urgentTitle: {
    marginBottom: spacing.sm,
  },
  urgentBody: {
    marginBottom: spacing.md,
    maxWidth: 340,
  },
  emergencyButton: {
    minHeight: touch.comfortable,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  unknown: {
    gap: spacing.md,
  },
  findLocal: {
    fontWeight: '600',
  },
  changeCountry: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
  },
});
