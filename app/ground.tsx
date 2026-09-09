import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AudioControl } from '@/components/audio/AudioControl';
import { MuteButton } from '@/components/audio/MuteButton';
import { ExerciseShell } from '@/components/exercise/ExerciseShell';
import { AtmosphericImage } from '@/components/media/AtmosphericImage';
import { AppText } from '@/components/typography/AppText';
import { groundSteps } from '@/features/ground/steps';
import { exerciseAudio, exerciseImages } from '@/features/media/catalog';
import { useElapsedTime, formatElapsed } from '@/hooks/useElapsedTime';
import { useExerciseClose } from '@/hooks/useExerciseClose';
import { useLoopingSound } from '@/hooks/useLoopingSound';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function GroundScreen() {
  const close = useExerciseClose('ground');
  const audio = useLoopingSound({ source: exerciseAudio.groundingEnglish });
  const elapsed = useElapsedTime(audio.isPlaying);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!audio.isPlaying) {
      return;
    }
    const id = setInterval(() => {
      setStep((current) => (current + 1) % groundSteps.length);
    }, 10000);
    return () => clearInterval(id);
  }, [audio.isPlaying]);

  const instruction = t(groundSteps[step] ?? groundSteps[0]!);

  return (
    <ExerciseShell
      title={t('home.tools.ground')}
      onClose={close}
      right={<MuteButton muted={audio.muted} onPress={audio.toggleMute} />}
    >
      <AppText variant="secondary" tone="secondary">
        {t('exercise.progress', { current: step + 1, total: groundSteps.length })}
      </AppText>
      <AppText variant="instruction" style={styles.instruction}>
        {instruction}
      </AppText>
      <AtmosphericImage
        source={exerciseImages.groundFeet}
        accessibilityLabel={t('ground.image')}
        heightRatio={0.32}
        treatment="photo"
      />
      <View style={styles.controls}>
        <AudioControl
          layout="stack"
          isPlaying={audio.isPlaying}
          onPlayPause={audio.toggle}
          elapsed={formatElapsed(elapsed)}
          onReplay={() => {
            setStep(0);
            audio.replay();
          }}
        />
      </View>
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  instruction: {
    fontFamily: serif,
    fontWeight: '500',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    maxWidth: 340,
  },
  controls: {
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
});
