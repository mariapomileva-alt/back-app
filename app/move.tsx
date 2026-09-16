import { useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';

import { TextButton } from '@/components/buttons/TextButton';
import { MoveSfxMuteButton } from '@/components/move/MoveSfxMuteButton';
import { MoveStage } from '@/components/move/MoveStage';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { SessionChoiceSheet } from '@/components/session/SessionChoiceSheet';
import { CrossfadeInstructionText } from '@/components/typography/CrossfadeInstructionText';
import { isMoveSequenceId, moveSequenceIds } from '@/features/move/steps';
import { useMoveCycle } from '@/features/move/useMoveCycle';
import { MOVE_UNCOMFORTABLE_INTENT } from '@/features/session/suggestions';
import { useMoveAmbient } from '@/hooks/useMoveAmbient';
import { usePaidToolGate } from '@/hooks/usePaidToolGate';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function MoveScreen() {
  usePaidToolGate();
  const { height, fontScale } = useWindowDimensions();
  const compact = height < 700 || fontScale > 1.35;
  const { phase, instructionKey, sequenceId, stepId, onPressIn, onPressOut, selectSequence } =
    useMoveCycle();
  const [chooserOpen, setChooserOpen] = useState(false);
  const moveAmbient = useMoveAmbient({ sessionPaused: chooserOpen });
  const { unlockFromUserGesture, muted: moveSfxMuted, toggleMute: toggleMoveSfxMute } =
    moveAmbient;
  const instruction = t(instructionKey);
  const hint = t(`move.hints.${phase}`);
  const openChooser = () => setChooserOpen(true);

  return (
    <>
      <ActiveSessionScreen
        tool="move"
        scroll={false}
        title={t('home.tools.move')}
        right={
          <MoveSfxMuteButton
            muted={moveSfxMuted}
            onPress={() => {
              unlockFromUserGesture();
              toggleMoveSfxMute();
            }}
          />
        }
        onTryAnother={openChooser}
        tryAnotherHint={t('move.tryAnotherHint')}
        backClosesSession
        backNavigates={chooserOpen}
        onBack={chooserOpen ? () => setChooserOpen(false) : undefined}
        extraActions={({ tryOfferedAlternatives }) => (
          <TextButton
            label={t('exercise.moveUncomfortable')}
            onPress={() => tryOfferedAlternatives(MOVE_UNCOMFORTABLE_INTENT)}
          />
        )}
      >
        <>
            <Pressable
              accessibilityRole="none"
              importantForAccessibility="no-hide-descendants"
              onPress={unlockFromUserGesture}
              style={[styles.stage, compact && styles.stageCompact]}
            >
              <MoveStage
                activityId={sequenceId}
                stepId={stepId}
                phase={phase}
                instruction={instruction}
                hint={hint}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
              />
              <CrossfadeInstructionText
                contentKey={instructionKey}
                variant="instruction"
                accessibilityLiveRegion="polite"
                style={[styles.instruction, compact && styles.instructionCompact]}
                minHeight={compact ? 68 : 84}
              >
                {instruction}
              </CrossfadeInstructionText>
            </Pressable>
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
            />
        </>
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
