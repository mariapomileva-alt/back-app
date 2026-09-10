import { StyleSheet, View } from 'react-native';

import { TextButton } from '@/components/buttons/TextButton';
import { MoveStage } from '@/components/move/MoveStage';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { AppText } from '@/components/typography/AppText';
import { useMoveCycle } from '@/features/move/useMoveCycle';
import { MOVE_UNCOMFORTABLE_INTENT } from '@/features/session/suggestions';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function MoveScreen() {
  const { phase, pressed, instructionKey, onPressIn, onPressOut, tryAnother } = useMoveCycle();
  const instruction = t(instructionKey);
  const hint = t(`move.hints.${phase}`);

  return (
    <ActiveSessionScreen
      tool="move"
      title={t('home.tools.move')}
      onChangeActivity={tryAnother}
      changeActivityLabel={t('exercise.tryAnother')}
      changeActivityHint={t('move.tryAnotherHint')}
      extraActions={({ tryOfferedAlternatives }) => (
        <TextButton
          label={t('exercise.moveUncomfortable')}
          onPress={() => tryOfferedAlternatives(MOVE_UNCOMFORTABLE_INTENT)}
        />
      )}
    >
      <View style={styles.stage}>
        <MoveStage
          pressed={pressed}
          instruction={instruction}
          hint={hint}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
        <AppText variant="instruction" accessibilityLiveRegion="polite" style={styles.instruction}>
          {instruction}
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
  },
  instruction: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    maxWidth: 320,
    paddingHorizontal: spacing.sm,
  },
});
