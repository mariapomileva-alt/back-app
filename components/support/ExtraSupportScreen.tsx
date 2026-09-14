import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { TextButton } from '@/components/buttons/TextButton';
import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { CountryPicker } from '@/components/support/CountryPicker';
import { AppText } from '@/components/typography/AppText';
import { getDeviceRegionSignal } from '@/features/emergency/deviceRegion';
import { canPlaceLocalCall, openPhoneCall, openSmsMessage } from '@/features/emergency/dial';
import { resolveEmergencyNumber } from '@/features/emergency/numbers';
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
  const { height, fontScale } = useWindowDimensions();
  const compact = height < 740 || fontScale > 1.35;
  const params = useLocalSearchParams<{ region?: string; person?: string }>();
  const previewRegion = firstParam(params.region);
  const previewPerson = firstParam(params.person) === '1';

  const [pickingCountry, setPickingCountry] = useState(false);
  const [storedCountryCode, setStoredCountryCode] = useState<string | null>(null);
  const [countryReady, setCountryReady] = useState(Boolean(previewRegion));
  const [contact, setContact] = useState<SupportContact | null>(null);

  const loadLocalState = useCallback(async () => {
    const [countryCode, savedContact] = await Promise.all([
      loadEmergencyCountryCode(),
      loadSupportContact(),
    ]);
    setStoredCountryCode(countryCode);
    setContact(savedContact);
    setCountryReady(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLocalState();
    }, [loadLocalState]),
  );

  const resolution = countryReady
    ? resolveEmergencyNumber({
        previewRegion,
        storedCountryCode,
        deviceRegion: getDeviceRegionSignal(),
      })
    : null;

  const record = resolution?.status === 'ready' ? resolution.record : null;
  const countrySource = resolution?.status === 'ready' ? resolution.source : null;
  const shownContact = contact ?? (previewPerson ? PREVIEW_CONTACT : null);
  const canMessage = canPlaceLocalCall(shownContact?.phoneNumber);
  const canCallPerson = canPlaceLocalCall(shownContact?.phoneNumber);

  const onSelectCountry = async (countryCode: string) => {
    await saveEmergencyCountryCode(countryCode);
    setStoredCountryCode(countryCode);
    setPickingCountry(false);
    if (previewRegion) {
      router.replace('/settings/emergency');
    }
  };

  if (pickingCountry) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <PaperGrain opacity={0.1} />
        <ScreenContainer scroll={false} style={styles.transparent} contentStyle={styles.pickerBody}>
          <ScreenHeader
            title={t('extraSupport.chooseCountry')}
            onClose={() => setPickingCountry(false)}
            closeVariant="close"
          />
          <CountryPicker
            onSelect={onSelectCountry}
            selectedCountryCode={storedCountryCode ?? record?.countryCode}
          />
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain opacity={0.1} />
      <ScreenContainer style={styles.transparent}>
        <ScreenHeader title={t('extraSupport.title')} />

        <AppText style={[styles.heading, compact && styles.headingCompact]}>{t('extraSupport.heading')}</AppText>

        <View style={[styles.steps, compact && styles.stepsCompact]}>
          {STEP_KEYS.map((key) => (
            <AppText key={key} variant="body" style={[styles.step, compact && styles.stepCompact]}>
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

        <View style={[styles.separator, compact && styles.separatorCompact, { backgroundColor: theme.colors.border }]} />

        <AppText variant="section" style={[styles.urgentTitle, compact && styles.urgentTitleCompact]}>
          {t('extraSupport.urgentTitle')}
        </AppText>
        <AppText
          variant="body"
          tone="secondary"
          style={[styles.urgentBody, compact && styles.urgentBodyCompact]}
        >
          {t('extraSupport.urgentBody')}
        </AppText>

        {record ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t('extraSupport.urgentInCountry', {
              country: record.countryName,
            })}. ${t('extraSupport.emergencyHelp', { number: record.generalEmergency })}`}
            accessibilityHint={t('extraSupport.emergencyHint')}
            onPress={() => {
              void openPhoneCall(record.generalEmergency);
            }}
            style={({ pressed }) => [
              styles.emergencyButton,
              compact && styles.emergencyButtonCompact,
              {
                backgroundColor: mixHex(theme.colors.surfaceSecondary, theme.colors.forest, 0.12),
                borderColor: mixHex(theme.colors.border, theme.colors.forest, 0.28),
                opacity: pressed ? 0.86 : 1,
              },
            ]}
          >
            <AppText variant="secondary" tone="secondary" style={styles.emergencyCountry}>
              {t('extraSupport.urgentInCountry', { country: record.countryName })}
            </AppText>
            <AppText variant="button" style={{ color: theme.colors.text }}>
              {t('extraSupport.emergencyHelp', { number: record.generalEmergency })}
            </AppText>
          </Pressable>
        ) : countryReady ? (
          <View style={styles.unknown}>
            <AppText variant="body" style={styles.findLocal}>
              {t('extraSupport.findLocal')}
            </AppText>
            <SecondaryButton
              label={t('extraSupport.chooseCountry')}
              onPress={() => setPickingCountry(true)}
            />
          </View>
        ) : null}

        {record && countrySource === 'deviceRegion' ? (
          <SecondaryButton
            label={t('extraSupport.keepCountry')}
            accessibilityHint={t('extraSupport.keepCountryHint')}
            onPress={() => {
              void onSelectCountry(record.countryCode);
            }}
            style={styles.keepCountry}
          />
        ) : null}

        {record ? (
          <TextButton
            label={
              countrySource === 'stored'
                ? t('extraSupport.changeCountry')
                : t('extraSupport.chooseCountry')
            }
            onPress={() => setPickingCountry(true)}
            style={styles.changeCountry}
          />
        ) : null}

        {record && countrySource === 'stored' ? (
          <AppText variant="secondary" tone="secondary" style={styles.savedCountry}>
            {t('extraSupport.savedCountry')}
          </AppText>
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
  pickerBody: {
    flex: 1,
    minHeight: 0,
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
  headingCompact: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  steps: {
    gap: spacing.md,
    maxWidth: 340,
    marginBottom: spacing.xl,
  },
  stepsCompact: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  step: {
    fontSize: 17,
    lineHeight: 24,
  },
  stepCompact: {
    fontSize: 16,
    lineHeight: 22,
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
  separatorCompact: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  urgentTitle: {
    marginBottom: spacing.sm,
  },
  urgentTitleCompact: {
    marginBottom: spacing.xs,
  },
  urgentBody: {
    marginBottom: spacing.md,
    maxWidth: 340,
  },
  urgentBodyCompact: {
    marginBottom: spacing.sm,
  },
  emergencyButton: {
    minHeight: touch.comfortable,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
  },
  emergencyButtonCompact: {
    paddingVertical: spacing.sm,
  },
  emergencyCountry: {
    textAlign: 'center',
  },
  unknown: {
    gap: spacing.md,
  },
  findLocal: {
    fontWeight: '600',
  },
  keepCountry: {
    marginTop: spacing.sm,
  },
  changeCountry: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
  },
  savedCountry: {
    marginTop: spacing.xxs,
  },
});
