import { Pressable, StyleSheet } from 'react-native';

import { MoveIllustration } from '@/components/move/MoveIllustration';
import type { MovePhase, MoveSequenceId, MoveStepId } from '@/features/move/steps';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  activityId: MoveSequenceId;
  stepId: MoveStepId;
  phase: MovePhase;
  instruction: string;
  hint: string;
  onPressIn: () => void;
  onPressOut: () => void;
};

export function MoveStage({
  activityId,
  stepId,
  phase,
  instruction,
  hint,
  onPressIn,
  onPressOut,
}: Props) {
  const reduceMotion = useReduceMotion();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={instruction}
      accessibilityHint={hint}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}
    >
      <MoveIllustration activityId={activityId} stepId={stepId} phase={phase} reduceMotion={reduceMotion} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    minHeight: touch.min,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
});
