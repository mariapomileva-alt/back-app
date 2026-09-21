import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';

import { AudioControl } from '@/components/audio/AudioControl';
import { GroundSfxMuteButton } from '@/components/ground/GroundSfxMuteButton';
import { GroundSequencePicker } from '@/components/ground/GroundSequencePicker';
import { GroundStage } from '@/components/ground/GroundStage';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { CrossfadeInstructionText } from '@/components/typography/CrossfadeInstructionText';
import { groundAudio } from '@/features/ground/audio';
import {
  defaultGroundSequenceId,
  type GroundSequenceId,
} from '@/features/ground/steps';
import { useGroundSequence } from '@/features/ground/useGroundSequence';
import { useGroundAmbient } from '@/hooks/useGroundAmbient';
import { usePaidToolGate } from '@/hooks/usePaidToolGate';
import { useGuidedAudio } from '@/hooks/useGuidedAudio';
import { t } from '@/locales/i18n';
import { loadSoundMuted } from '@/storage/preferences';
import { useTheme } from '@/hooks/useTheme';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function GroundScreen() {
  usePaidToolGate();
  const { theme } = useTheme();
  const { height, fontScale } = useWindowDimensions();
  const compact = height < 700 || fontScale > 1.35;
  const needsScroll = height < 640 || fontScale > 1.85;
  const [soundMuted, setSoundMuted] = useState(false);
  const narrationReady = groundAudio.ready;
  const audio = useGuidedAudio({
    source: groundAudio.source,
    autoPlay: narrationReady,
    initialMuted: soundMuted,
  });
  const [paused, setPaused] = useState(false);
  const [sequenceId, setSequenceId] = useState<GroundSequenceId>(defaultGroundSequenceId);
  const { instructionKey, last, next, prev, stepEnter, acknowledgeStepEnter } = useGroundSequence(
    paused,
    sequenceId,
  );
  const groundAmbient = useGroundAmbient({
    paused,
    masterMuted: soundMuted || audio.muted,
  });
  const { unlockFromUserGesture, muted: activitySfxMuted, toggleMute: toggleActivitySfxMute } =
    groundAmbient;
  const instruction = t(instructionKey);
  const skipSequenceAudioReset = useRef(true);

  useEffect(() => {
    let cancelled = false;
    void loadSoundMuted().then((muted) => {
      if (!cancelled) {
        setSoundMuted(muted);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (stepEnter !== 'forward') {
      return;
    }
    acknowledgeStepEnter();
  }, [acknowledgeStepEnter, stepEnter]);

  const withSfxUnlock = useCallback(
    (action: () => void) => {
      unlockFromUserGesture();
      action();
    },
    [unlockFromUserGesture],
  );

  useEffect(() => {
    if (skipSequenceAudioReset.current) {
      skipSequenceAudioReset.current = false;
      return;
    }
    if (!narrationReady) {
      audio.pause();
      return;
    }
    audio.replay();
    // Restart narration with the new grounding list only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequenceId]);

  const onPlayPause = () => {
    if (paused) {
      unlockFromUserGesture();
      setPaused(false);
      if (narrationReady) {
        audio.play();
      }
      return;
    }
    unlockFromUserGesture();
    setPaused(true);
    audio.pause();
  };

  const goNext = useCallback(() => withSfxUnlock(next), [next, withSfxUnlock]);
  const goPrev = useCallback(() => withSfxUnlock(prev), [prev, withSfxUnlock]);

  const selectSequence = (id: GroundSequenceId) => {
    setSequenceId(id);
    setPaused(false);
  };

  return (
    <ActiveSessionScreen
      tool="ground"
      scroll={needsScroll}
      title={t('home.tools.ground')}
      right={
        <GroundSfxMuteButton
          muted={activitySfxMuted}
          onPress={() => {
            unlockFromUserGesture();
            toggleActivitySfxMute();
          }}
        />
      }
      backClosesSession
      extraActions={
        <GroundSequencePicker
          selectedId={sequenceId}
          onSelect={(id) => {
            unlockFromUserGesture();
            selectSequence(id);
          }}
        />
      }
    >
      <>
        <Pressable
          accessibilityRole="none"
          importantForAccessibility="no-hide-descendants"
          onPress={unlockFromUserGesture}
          style={[styles.stage, compact && styles.stageCompact, needsScroll && styles.stageScroll]}
        >
          <GroundStage sequenceId={sequenceId} stepKey={instructionKey} paused={paused} />
          <Pressable
            accessibilityRole={last ? 'text' : 'button'}
            accessibilityLabel={instruction}
            accessibilityHint={last ? undefined : t('ground.continueHint')}
            onPress={last ? undefined : goNext}
            style={[styles.instructionHit, compact && styles.instructionHitCompact]}
          >
            <CrossfadeInstructionText
              contentKey={instructionKey}
              variant="instruction"
              accessibilityLiveRegion="polite"
              style={[
                styles.instruction,
                { color: theme.colors.text },
                compact && styles.instructionCompact,
              ]}
              minHeight={compact ? 102 : 132}
            >
              {instruction}
            </CrossfadeInstructionText>
          </Pressable>
          <AudioControl
            isPlaying={!paused}
            onPlayPause={onPlayPause}
            onPrevious={goPrev}
            onNext={goNext}
          />
        </Pressable>
      </>
    </ActiveSessionScreen>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.md,
    overflow: 'visible',
  },
  stageCompact: {
    paddingBottom: spacing.xs,
  },
  stageScroll: {
    flexGrow: 1,
    flex: undefined,
    minHeight: undefined,
    paddingBottom: spacing.md,
  },
  instructionHit: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 132,
  },
  instructionHitCompact: {
    minHeight: 102,
  },
  instruction: {
    fontFamily: serif,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    maxWidth: 340,
    paddingHorizontal: spacing.sm,
  },
  instructionCompact: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
});
