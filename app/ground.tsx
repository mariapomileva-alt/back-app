import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { ProgressDots } from '@/components/feedback/ProgressDots';
import { GroundMark } from '@/components/marks';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { AppText } from '@/components/typography/AppText';
import { groundSteps } from '@/features/ground/steps';
import { useHaptics } from '@/hooks/useHaptics';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function GroundScreen() {
  const haptics = useHaptics();
  const [step, setStep] = useState(0);
  const last = step >= groundSteps.length - 1;
  const instruction = t(groundSteps[step] ?? groundSteps[0]!);

  const next = () => {
    haptics.light();
    if (!last) {
      setStep((current) => current + 1);
    }
  };

  return (
    <ActiveSessionScreen tool="ground" title={t('home.tools.ground')}>
      <View style={styles.mark} accessible={false}>
        <GroundMark />
      </View>
      <AppText variant="instruction" style={styles.instruction}>
        {instruction}
      </AppText>
      <ProgressDots count={groundSteps.length} index={step} />
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
