import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { TextButton } from '@/components/buttons/TextButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { isBreathPatternId } from '@/features/breathe/patterns';
import { isDistractActivityId } from '@/features/distract/activities';
import { isListenSoundId, listenSounds } from '@/features/listen/sounds';
import { isHomeToolId } from '@/features/session/activeSession';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { clearHistory, loadHistory } from '@/storage/history';
import {
  clearRememberedPreferences,
  loadRememberedChoices,
  type RememberedChoices,
} from '@/storage/preferences';
import { spacing } from '@/theme/spacing';
import type { SessionRecord } from '@/types';

const emptyChoices: RememberedChoices = {
  lastBreathPattern: null,
  lastDistractActivity: null,
  lastSoundId: null,
  themeName: null,
  hapticsEnabled: null,
  reduceMotionOverride: null,
};

const RECENT_LIMIT = 4;

function breathLabel(id: string | null): string {
  return isBreathPatternId(id) ? t(`breathe.patterns.${id}`) : t('patterns.empty');
}

function distractLabel(id: string | null): string {
  return isDistractActivityId(id) ? t(`distract.activities.${id}`) : t('patterns.empty');
}

function listenLabel(id: string | null): string {
  if (!isListenSoundId(id)) {
    return t('patterns.empty');
  }
  const match = listenSounds.find((item) => item.id === id);
  return match ? t(match.nameKey) : t('patterns.empty');
}

function themeLabel(name: RememberedChoices['themeName']): string {
  return name ? t(`themes.${name}`) : t('patterns.empty');
}

function toggleLabel(value: boolean | null): string {
  if (value === null) {
    return t('patterns.empty');
  }
  return value ? t('common.on') : t('common.off');
}

function toolLabel(tool: SessionRecord['tool']): string {
  return isHomeToolId(tool) ? t(`home.tools.${tool}`) : tool;
}

function durationLabel(durationMs: number): string {
  if (durationMs < 45_000) {
    return t('patterns.durationShort');
  }
  if (durationMs < 150_000) {
    return t('patterns.durationMinute');
  }
  return t('patterns.durationFew');
}

function PatternFact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact} accessible accessibilityLabel={`${label}, ${value}`}>
      <AppText variant="secondary" tone="secondary">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

export default function PatternsScreen() {
  const { reloadPreferences } = useTheme();
  const [choices, setChoices] = useState<RememberedChoices>(emptyChoices);
  const [recent, setRecent] = useState<SessionRecord[]>([]);

  const refresh = useCallback(() => {
    let active = true;
    void Promise.all([loadRememberedChoices(), loadHistory()]).then(([stored, history]) => {
      if (!active) {
        return;
      }
      setChoices(stored);
      setRecent(history.slice(-RECENT_LIMIT).reverse());
    });
    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return refresh();
    }, [refresh]),
  );

  const hasRemembered =
    Boolean(choices.lastBreathPattern) ||
    Boolean(choices.lastDistractActivity) ||
    Boolean(choices.lastSoundId) ||
    Boolean(choices.themeName) ||
    choices.hapticsEnabled !== null ||
    choices.reduceMotionOverride !== null ||
    recent.length > 0;

  const forget = () => {
    void (async () => {
      await clearRememberedPreferences();
      await clearHistory();
      await reloadPreferences();
      setChoices(emptyChoices);
      setRecent([]);
    })();
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings.patterns')} />
      <View style={styles.body}>
        <AppText variant="body" tone="secondary">
          {t('patterns.intro')}
        </AppText>

        <View style={styles.group}>
          <PatternFact label={t('patterns.breathe')} value={breathLabel(choices.lastBreathPattern)} />
          <PatternFact
            label={t('patterns.distract')}
            value={distractLabel(choices.lastDistractActivity)}
          />
          <PatternFact label={t('patterns.listen')} value={listenLabel(choices.lastSoundId)} />
          <PatternFact label={t('patterns.theme')} value={themeLabel(choices.themeName)} />
          <PatternFact label={t('patterns.haptics')} value={toggleLabel(choices.hapticsEnabled)} />
          <PatternFact
            label={t('patterns.reduceMotion')}
            value={toggleLabel(choices.reduceMotionOverride)}
          />
        </View>

        {recent.length > 0 ? (
          <View style={styles.group}>
            <AppText variant="secondary" tone="secondary">
              {t('patterns.recent')}
            </AppText>
            {recent.map((item) => (
              <AppText key={item.id} variant="body">
                {t('patterns.recentItem', {
                  tool: toolLabel(item.tool),
                  duration: durationLabel(item.durationMs),
                })}
              </AppText>
            ))}
          </View>
        ) : null}

        <TextButton
          label={t('patterns.forget')}
          accessibilityHint={t('patterns.forgetHint')}
          disabled={!hasRemembered}
          onPress={forget}
          style={styles.forget}
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
  group: {
    gap: spacing.md,
  },
  fact: {
    gap: spacing.xxs,
  },
  forget: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
  },
});
