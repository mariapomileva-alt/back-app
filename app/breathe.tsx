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

const REST_RATIO = 0.58;
const GROW_SCALE = 1.12;
const REDUCE_GROW_SCALE = 1.03;

export default function BreatheScreen() {
  const reduceMotion = useReduceMotion();
  const { width } = useWindowDimensions();
  const [patternId, setPatternId] = useState<BreathPatternId>(defaultBreathPatternId);
  const pattern = getBreathPattern(patternId);
  const growScale = reduceMotion ? REDUCE_GROW_SCALE : GROW_SCALE;
  const restSize = Math.min(width * REST_RATIO, 268);
  const { phase, scale } = useBreathCycle(pattern, growScale);
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
          maxScale={growScale}
          scale={scale}
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
