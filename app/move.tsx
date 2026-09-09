import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { TextButton } from '@/components/buttons/TextButton';
import { ProgressDots } from '@/components/feedback/ProgressDots';
import { MoveMark } from '@/components/marks';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { AppText } from '@/components/typography/AppText';
import { moveSteps } from '@/features/move/steps';
import { useHaptics } from '@/hooks/useHaptics';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function MoveScreen() {
  const haptics = useHaptics();
  const [step, setStep] = useState(0);
  const last = step >= moveSteps.length - 1;
  const current = moveSteps[step] ?? moveSteps[0]!;

  const next = () => {
    haptics.light();
    if (!last) {
      setStep((value) => value + 1);
    }
  };

  return (
    <ActiveSessionScreen
      tool="move"
      title={t('home.tools.move')}
      extraActions={({ trySomethingElse }) => (
        <TextButton label={t('exercise.moveUncomfortable')} onPress={trySomethingElse} />
      )}
    >
      <View style={styles.mark} accessible={false}>
        <MoveMark />
      </View>
      <AppText variant="instruction" style={styles.instruction}>
        {t(current.textKey)}
      </AppText>
      <ProgressDots count={moveSteps.length} index={step} />
      {last ? null : (
        <View style={styles.footer}>
          <PrimaryButton label={t('common.next')} onPress={next} />
        </View>
      )}
    </ActiveSessionScreen>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 168,
    height: 100,
    marginTop: spacing.md,
    alignSelf: 'center',
  },
  instruction: {
    fontFamily: serif,
    fontWeight: '500',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    maxWidth: 340,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
  },
});
