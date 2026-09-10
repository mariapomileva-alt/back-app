import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { BreathingCircle } from '@/components/breathe/BreathingCircle';
import { TextButton } from '@/components/buttons/TextButton';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { SessionChoiceSheet } from '@/components/session/SessionChoiceSheet';
import { AppText } from '@/components/typography/AppText';
import {
  breathPatterns,
  cueKeyForPhase,
  defaultBreathPatternId,
  getBreathPattern,
  isBreathPatternId,
  type BreathPatternId,
} from '@/features/breathe/patterns';
import { useBreathCycle } from '@/features/breathe/useBreathCycle';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { t } from '@/locales/i18n';
import { loadLastBreathPattern, saveLastBreathPattern } from '@/storage/preferences';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

const REST_SIZE = 180;
const OPEN_SIZE = 320;
const REDUCE_OPEN_SIZE = 280;

export default function BreatheScreen() {
  const reduceMotion = useReduceMotion();
  const { width, height, fontScale } = useWindowDimensions();
  const compact = height < 700 || fontScale > 1.35;
  const [patternId, setPatternId] = useState<BreathPatternId>(defaultBreathPatternId);
  const [chooserOpen, setChooserOpen] = useState(false);
  const pattern = getBreathPattern(patternId);
  const restSize = Math.min(REST_SIZE, Math.round(width * 0.48), Math.round(height * (compact ? 0.2 : 0.24)));
  const openSize = Math.max(
    restSize + (compact ? 72 : 100),
    Math.min(
      reduceMotion ? REDUCE_OPEN_SIZE : OPEN_SIZE,
      Math.round(width * 0.84),
      Math.round(height * (compact ? 0.32 : 0.4)),
    ),
  );
  const { phase, openness } = useBreathCycle(pattern);
  const cue = t(cueKeyForPhase(phase));
  const patternName = t(pattern.nameKey);

  useEffect(() => {
    let cancelled = false;
    void loadLastBreathPattern().then((stored) => {
      if (!cancelled && isBreathPatternId(stored)) {
        setPatternId(stored);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectPattern = (id: BreathPatternId) => {
    setPatternId(id);
    void saveLastBreathPattern(id);
    setChooserOpen(false);
  };

  const openChooser = () => setChooserOpen(true);

  return (
    <>
      <ActiveSessionScreen
        tool="breathe"
        title={t('home.tools.breathe')}
        onTryAnother={openChooser}
        tryAnotherHint={t('breathe.tryAnotherHint')}
        onBack={openChooser}
        backLabel={t('breathe.menu')}
        backHint={t('breathe.menuHint')}
        backNavigates={!chooserOpen}
        extraActions={({ trySomethingElse }) => (
          <TextButton label={t('exercise.breatheUncomfortable')} onPress={trySomethingElse} />
        )}
      >
        {(controls) => (
          <>
            <View style={[styles.stage, compact && styles.stageCompact]}>
              <BreathingCircle
                restSize={restSize}
                openSize={openSize}
                openness={openness}
                reduceMotion={reduceMotion}
                accessibilityLabel={t('breathe.circle')}
              />
              <AppText
                variant="instruction"
                accessibilityLiveRegion="polite"
                accessibilityLabel={`${cue}. ${patternName}`}
                style={styles.cue}
              >
                {cue}
              </AppText>
            </View>
            <SessionChoiceSheet
              visible={chooserOpen}
              title={t('breathe.menu')}
              selectedId={patternId}
              options={breathPatterns.map((item) => ({
                id: item.id,
                label: t(item.nameKey),
              }))}
              onSelect={(id) => {
                if (isBreathPatternId(id)) {
                  selectPattern(id);
                }
              }}
              onDismiss={() => setChooserOpen(false)}
              onHardwareBack={controls.close}
            />
          </>
        )}
      </ActiveSessionScreen>
    </>
  );
}

const styles = StyleSheet.create({
  stage: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  stageCompact: {
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  cue: {
    fontFamily: serif,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 280,
  },
});
