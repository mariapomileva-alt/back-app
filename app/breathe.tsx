import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { BreathingCircle } from '@/components/breathe/BreathingCircle';
import { PatternPicker } from '@/components/breathe/PatternPicker';
import { TextButton } from '@/components/buttons/TextButton';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { AppText } from '@/components/typography/AppText';
import {
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
  const { width } = useWindowDimensions();
  const [patternId, setPatternId] = useState<BreathPatternId>(defaultBreathPatternId);
  const pattern = getBreathPattern(patternId);
  const restSize = Math.min(REST_SIZE, Math.round(width * 0.48));
  const openSize = Math.max(
    restSize + 100,
    Math.min(reduceMotion ? REDUCE_OPEN_SIZE : OPEN_SIZE, Math.round(width * 0.84)),
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
  };

  return (
    <ActiveSessionScreen
      tool="breathe"
      title={t('home.tools.breathe')}
      extraActions={({ trySomethingElse }) => (
        <>
          <PatternPicker selectedId={patternId} onSelect={selectPattern} />
          <TextButton label={t('exercise.breatheUncomfortable')} onPress={trySomethingElse} />
        </>
      )}
    >
      <View style={styles.stage}>
        <BreathingCircle
          restSize={restSize}
          openSize={openSize}
          openness={openness}
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
    </ActiveSessionScreen>
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
  cue: {
    fontFamily: serif,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 280,
  },
});
