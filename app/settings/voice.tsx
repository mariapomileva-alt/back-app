import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { AppText } from '@/components/typography/AppText';
import { isListenSoundId, listenSounds } from '@/features/listen/sounds';
import { t } from '@/locales/i18n';
import { loadLastSoundId, loadSoundMuted, saveSoundMuted } from '@/storage/preferences';
import { spacing } from '@/theme/spacing';

export default function VoiceSettingsScreen() {
  const [lastSoundName, setLastSoundName] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([loadLastSoundId(), loadSoundMuted()]).then(([stored, soundMuted]) => {
      if (cancelled) {
        return;
      }
      if (isListenSoundId(stored)) {
        const match = listenSounds.find((item) => item.id === stored);
        setLastSoundName(match ? t(match.nameKey) : null);
      }
      setMuted(soundMuted);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings.voice')} />
      <View style={styles.body}>
        <AppText variant="body">{t('voice.notShipped')}</AppText>
        <View style={styles.block}>
          <AppText variant="secondary" tone="secondary">
            {t('voice.lastSound')}
          </AppText>
          <AppText variant="body">{lastSoundName ?? t('voice.lastSoundEmpty')}</AppText>
          <AppText variant="body" tone="secondary">
            {t('voice.lastSoundNote')}
          </AppText>
        </View>
        <SettingsRow
          label={t('voice.mute')}
          accessibilityHint={t('voice.muteHint')}
          switchValue={muted}
          onSwitchChange={(value) => {
            setMuted(value);
            void saveSoundMuted(value);
          }}
          showDivider={false}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: spacing.xl,
    maxWidth: 360,
    gap: spacing.lg,
  },
  block: {
    gap: spacing.sm,
  },
});
