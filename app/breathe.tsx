import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';

import { BreathingCircle } from '@/components/breathe/BreathingCircle';
import { BreatheSfxMuteButton } from '@/components/breathe/BreatheSfxMuteButton';
import { PatternPicker } from '@/components/breathe/PatternPicker';
import { TextButton } from '@/components/buttons/TextButton';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { SessionChoiceSheet } from '@/components/session/SessionChoiceSheet';
import { CrossfadeInstructionText } from '@/components/typography/CrossfadeInstructionText';
import {
  breathPatterns,
  cueKeyForPhase,
  defaultBreathPatternId,
  getBreathPattern,
  isBreathPatternId,
  type BreathPatternId,
} from '@/features/breathe/patterns';
import { useBreathCycle } from '@/features/breathe/useBreathCycle';
import { useBreatheAmbient } from '@/hooks/useBreatheAmbient';
import { usePaidToolGate } from '@/hooks/usePaidToolGate';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { t } from '@/locales/i18n';
import { loadLastBreathPattern, saveLastBreathPattern } from '@/storage/preferences';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

// User-approved orb: 180 rest → 320 open. Do not shrink, height-cap for “compact”,
// or replace with scale-only / Reduce-Motion-as-default. Size via width/height.
const REST_SIZE = 180;
const OPEN_SIZE = 320;
const REDUCE_OPEN_SIZE = 280;

export default function BreatheScreen() {
  usePaidToolGate();
  const reduceMotion = useReduceMotion();
  const { width, height, fontScale } = useWindowDimensions();
  const compact = height < 700 || fontScale > 1.35;
  const [patternId, setPatternId] = useState<BreathPatternId>(defaultBreathPatternId);
  const [chooserOpen, setChooserOpen] = useState(false);
  const pattern = getBreathPattern(patternId);
  const restSize = Math.min(REST_SIZE, Math.round(width * 0.48));
  const openSize = Math.max(
    restSize + 100,
    Math.min(reduceMotion ? REDUCE_OPEN_SIZE : OPEN_SIZE, Math.round(width * 0.84)),
  );
  const { phase, openness } = useBreathCycle(pattern);
  const breatheAmbient = useBreatheAmbient({
    openness,
    sessionPaused: chooserOpen,
    reduceMotion,
  });
  const { unlockFromUserGesture, muted: breatheSfxMuted, toggleMute: toggleBreatheSfxMute } =
    breatheAmbient;
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
        right={
          <BreatheSfxMuteButton
            muted={breatheSfxMuted}
            onPress={() => {
              unlockFromUserGesture();
              toggleBreatheSfxMute();
            }}
          />
        }
        onTryAnother={openChooser}
        tryAnotherHint={t('breathe.tryAnotherHint')}
        backClosesSession
        backNavigates={chooserOpen}
        onBack={chooserOpen ? () => setChooserOpen(false) : undefined}
        extraActions={({ trySomethingElse }) => (
          <>
            <PatternPicker
              selectedId={patternId}
              onSelect={(id) => {
                unlockFromUserGesture();
                selectPattern(id);
              }}
            />
            <TextButton label={t('exercise.breatheUncomfortable')} onPress={trySomethingElse} />
          </>
        )}
      >
        {(controls) => (
          <>
            <Pressable
              accessibilityRole="none"
              importantForAccessibility="no-hide-descendants"
              onPress={unlockFromUserGesture}
              style={[styles.stage, compact && styles.stageCompact]}
            >
              <BreathingCircle
                restSize={restSize}
                openSize={openSize}
                openness={openness}
                reduceMotion={reduceMotion}
                accessibilityLabel={t('breathe.circle')}
              />
              <CrossfadeInstructionText
                contentKey={`${patternId}-${phase}`}
                variant="instruction"
                accessibilityLiveRegion="polite"
                accessibilityLabel={`${cue}. ${patternName}`}
                style={styles.cue}
                minHeight={36}
              >
                {cue}
              </CrossfadeInstructionText>
            </Pressable>
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
