import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import { BreathingCircle } from '@/components/breathe/BreathingCircle';
import { PatternPicker } from '@/components/breathe/PatternPicker';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { TextButton } from '@/components/buttons/TextButton';
import { ExerciseShell } from '@/components/exercise/ExerciseShell';
import {
  cueKeyForPhase,
  defaultBreathPatternId,
  getBreathPattern,
  isBreathPatternId,
  type BreathPatternId,
} from '@/features/breathe/patterns';
import { useBreathCycle } from '@/features/breathe/useBreathCycle';
import { useExerciseClose } from '@/hooks/useExerciseClose';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { t } from '@/locales/i18n';
import { loadLastBreathPattern, saveLastBreathPattern } from '@/storage/preferences';
import { spacing } from '@/theme/spacing';

const REST_RATIO = 0.6;
const GROW_SCALE = 1.15;
const REDUCE_GROW_SCALE = 1.04;

export default function BreatheScreen() {
  const close = useExerciseClose('breathe');
  const router = useRouter();
  const reduceMotion = useReduceMotion();
  const { width } = useWindowDimensions();
  const [patternId, setPatternId] = useState<BreathPatternId>(defaultBreathPatternId);
  const pattern = getBreathPattern(patternId);
  const growScale = reduceMotion ? REDUCE_GROW_SCALE : GROW_SCALE;
  const restSize = Math.min(width * REST_RATIO, 280);
  const { phase, scale } = useBreathCycle(pattern, growScale);
  const cue = t(cueKeyForPhase(phase));

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
    <ExerciseShell title={t('home.tools.breathe')} onClose={close}>
      <View style={styles.stage}>
        <BreathingCircle
          restSize={restSize}
          maxScale={growScale}
          scale={scale}
          cue={cue}
          accessibilityLabel={`${t('breathe.circle')}. ${cue}`}
        />
      </View>
      <PrimaryButton label={t('exercise.okay')} onPress={close} />
      <PatternPicker selectedId={patternId} onSelect={selectPattern} />
      <TextButton
        label={t('exercise.breatheUncomfortable')}
        onPress={() => router.push('/session/alternatives')}
      />
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  stage: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
});
