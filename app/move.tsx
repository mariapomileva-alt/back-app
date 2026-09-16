import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

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
  const { height, fontScale } = useWindowDimensions();
  const compact = height < 700 || fontScale > 1.35;
  const { phase, instructionKey, sequenceId, stepId, onPressIn, onPressOut, selectSequence } =
    useMoveCycle();
  const [chooserOpen, setChooserOpen] = useState(false);
  const instruction = t(instructionKey);
  const hint = t(`move.hints.${phase}`);
  const openChooser = () => setChooserOpen(true);

  return (
    <>
      <ActiveSessionScreen
        tool="move"
        scroll={false}
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
            <View style={[styles.stage, compact && styles.stageCompact]}>
              <MoveStage
                activityId={sequenceId}
                stepId={stepId}
                phase={phase}
                instruction={instruction}
                hint={hint}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
              />
              <AppText
                variant="instruction"
                accessibilityLiveRegion="polite"
                style={[styles.instruction, compact && styles.instructionCompact]}
              >
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
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  stageCompact: {
    paddingVertical: spacing.xxs,
    gap: spacing.sm,
  },
  instruction: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 320,
    paddingHorizontal: spacing.sm,
    flexShrink: 0,
  },
  instructionCompact: {
    fontSize: 28,
    lineHeight: 34,
  },
});
