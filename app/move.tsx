import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { TextButton } from '@/components/buttons/TextButton';
import { ExerciseShell } from '@/components/exercise/ExerciseShell';
import { AtmosphericImage } from '@/components/media/AtmosphericImage';
import { AppText } from '@/components/typography/AppText';
import { moveSteps } from '@/features/move/steps';
import { useExerciseClose } from '@/hooks/useExerciseClose';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function MoveScreen() {
  const close = useExerciseClose('move');
  const router = useRouter();
  const [step, setStep] = useState(0);
  const current = moveSteps[step] ?? moveSteps[0]!;

  useEffect(() => {
    const id = setInterval(() => {
      setStep((value) => (value + 1) % moveSteps.length);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <ExerciseShell title={t('home.tools.move')} onClose={close}>
      <AppText variant="secondary" tone="secondary">
        {t('exercise.progress', { current: step + 1, total: moveSteps.length })}
      </AppText>
      <AppText variant="instruction" style={styles.instruction}>
        {t(current.textKey)}
      </AppText>
      <AtmosphericImage
        source={current.image}
        accessibilityLabel={t(current.imageLabelKey)}
        heightRatio={0.34}
        treatment="photo"
      />
      <View style={styles.footer}>
        <TextButton
          label={t('exercise.moveUncomfortable')}
          onPress={() => router.push('/session/alternatives')}
        />
      </View>
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  instruction: {
    fontFamily: serif,
    fontWeight: '500',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    maxWidth: 340,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'flex-start',
  },
});
