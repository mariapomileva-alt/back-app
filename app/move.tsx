import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { TextButton } from '@/components/buttons/TextButton';
import { MoveStage } from '@/components/move/MoveStage';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { SessionChoiceSheet } from '@/components/session/SessionChoiceSheet';
import { AppText } from '@/components/typography/AppText';
import { isMoveSequenceId, moveSequenceIds } from '@/features/move/steps';
import { useMoveCycle } from '@/features/move/useMoveCycle';
import { MOVE_UNCOMFORTABLE_INTENT } from '@/features/session/suggestions';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function MoveScreen() {
  const { phase, pressed, instructionKey, sequenceId, onPressIn, onPressOut, selectSequence } =
    useMoveCycle();
  const [chooserOpen, setChooserOpen] = useState(false);
  const instruction = t(instructionKey);
  const hint = t(`move.hints.${phase}`);
  const openChooser = () => setChooserOpen(true);

  return (
    <>
      <ActiveSessionScreen
        tool="move"
        title={t('home.tools.move')}
        onTryAnother={openChooser}
        tryAnotherHint={t('move.tryAnotherHint')}
        onBack={openChooser}
        backLabel={t('move.menu')}
        backHint={t('move.menuHint')}
        backNavigates={!chooserOpen}
        extraActions={({ tryOfferedAlternatives }) => (
          <TextButton
            label={t('exercise.moveUncomfortable')}
            onPress={() => tryOfferedAlternatives(MOVE_UNCOMFORTABLE_INTENT)}
          />
        )}
      >
        {(controls) => (
          <>
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
            <SessionChoiceSheet
              visible={chooserOpen}
              title={t('move.menu')}
              selectedId={sequenceId}
              options={moveSequenceIds.map((id) => ({
                id,
                label: t(`move.activities.${id}`),
              }))}
              onSelect={(id) => {
                if (isMoveSequenceId(id)) {
                  selectSequence(id);
                  setChooserOpen(false);
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
