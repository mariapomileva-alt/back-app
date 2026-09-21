import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { skipA11yNode } from '@/components/accessibility/hideFromA11y';
import { GroundInstructionVisual } from '@/components/ground/GroundInstructionVisual';
import { SessionVisualGrow } from '@/components/session/SessionVisualGrow';
import { ToolSessionEntryFade } from '@/components/session/ToolSessionEntryFade';
import {
  GROUND_PREMIUM_ASPECT,
  groundPremiumVisual,
} from '@/features/ground/premiumVisuals';
import type { GroundSequenceId } from '@/features/ground/steps';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

type Props = {
  sequenceId: GroundSequenceId;
  stepKey: string;
  paused: boolean;
};

export function GroundStage({ sequenceId, stepKey, paused }: Props) {
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const airy = theme.name === 'softBeige';
  const accentLine = airy ? theme.colors.markLine : theme.colors.secondaryGreen;
  const premium = groundPremiumVisual(sequenceId, stepKey) != null;
  const artWidth = Math.min(Math.max(0, windowWidth - 32), 358);
  const artHeight = Math.round(artWidth / GROUND_PREMIUM_ASPECT);

  const slotStyle = premium
    ? [styles.instructionSlotPremium, { width: artWidth, height: artHeight }]
    : styles.instructionSlot;

  const illustration = (
    <View style={slotStyle}>
      <GroundInstructionVisual sequenceId={sequenceId} stepKey={stepKey} />
    </View>
  );

  const visual = premium ? (
    <>
      {illustration}
      <View style={[styles.quietLine, { backgroundColor: accentLine }]} />
    </>
  ) : (
    <SessionVisualGrow stepKey={stepKey} paused={paused}>
      {illustration}
      <View style={[styles.quietLine, { backgroundColor: accentLine }]} />
    </SessionVisualGrow>
  );

  return (
    <View {...skipA11yNode()} style={styles.stage}>
      <ToolSessionEntryFade>{visual}</ToolSessionEntryFade>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
    overflow: 'visible',
    zIndex: 0,
  },
  instructionSlot: {
    width: '100%',
    maxWidth: 220,
    aspectRatio: 220 / 118,
    minHeight: 118,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionSlotPremium: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
  quietLine: {
    width: 36,
    height: 2,
    borderRadius: 2,
    marginTop: spacing.sm,
    opacity: 0.24,
  },
});
