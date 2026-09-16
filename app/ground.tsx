import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, useWindowDimensions } from 'react-native';

import { AudioControl } from '@/components/audio/AudioControl';
import { GroundStage } from '@/components/ground/GroundStage';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { SessionChoiceSheet } from '@/components/session/SessionChoiceSheet';
import { AppText } from '@/components/typography/AppText';
import { groundAudio } from '@/features/ground/audio';
import {
  defaultGroundSequenceId,
  groundSequenceIds,
  isGroundSequenceId,
  type GroundSequenceId,
} from '@/features/ground/steps';
import {
  GROUND_INSTRUCTION_DIM,
  GROUND_INSTRUCTION_FADE_IN_MS,
  GROUND_INSTRUCTION_FADE_OUT_MS,
} from '@/features/ground/transitions';
import { useGroundSequence } from '@/features/ground/useGroundSequence';
import { useGroundAmbient } from '@/hooks/useGroundAmbient';
import { useGuidedAudio } from '@/hooks/useGuidedAudio';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { t } from '@/locales/i18n';
import { loadSoundMuted, saveSoundMuted } from '@/storage/preferences';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function GroundScreen() {
  const reduceMotion = useReduceMotion();
  const { height, fontScale } = useWindowDimensions();
  const compact = height < 700 || fontScale > 1.35;
  const [soundMuted, setSoundMuted] = useState(false);
  const narrationReady = groundAudio.ready;
  const audio = useGuidedAudio({
    source: groundAudio.source,
    autoPlay: narrationReady,
    initialMuted: soundMuted,
  });
  const [paused, setPaused] = useState(false);
  const [sequenceId, setSequenceId] = useState<GroundSequenceId>(defaultGroundSequenceId);
  const [chooserOpen, setChooserOpen] = useState(false);
  const {
    instructionKey,
    last,
    next,
    prev,
    reset,
    forwardTransition,
    stepEnter,
    finishForwardTransition,
    acknowledgeStepEnter,
  } = useGroundSequence(paused, sequenceId);
  const groundAmbient = useGroundAmbient({
    paused,
    masterMuted: soundMuted || audio.muted,
  });
  const { unlockFromUserGesture, muted: activitySfxMuted, toggleMute: toggleActivitySfxMute } =
    groundAmbient;
  const instruction = t(instructionKey);
  const skipSequenceAudioReset = useRef(true);
  const [instructionOpacity] = useState(() => new Animated.Value(1));
  const instructionKeyRef = useRef(instructionKey);
  const useNativeDriver = Platform.OS !== 'web';

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
    if (!forwardTransition) {
      return;
    }
    Animated.timing(instructionOpacity, {
      toValue: GROUND_INSTRUCTION_DIM,
      duration: GROUND_INSTRUCTION_FADE_OUT_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver,
    }).start();
  }, [forwardTransition, instructionOpacity, useNativeDriver]);

  useEffect(() => {
    if (!forwardTransition) {
      return;
    }
    const timeout = setTimeout(() => {
      finishForwardTransition();
    }, GROUND_INSTRUCTION_FADE_OUT_MS);
    return () => clearTimeout(timeout);
  }, [finishForwardTransition, forwardTransition]);

  useEffect(() => {
    if (instructionKeyRef.current === instructionKey) {
      return;
    }
    instructionKeyRef.current = instructionKey;
    if (stepEnter === 'forward' || reduceMotion) {
      instructionOpacity.setValue(GROUND_INSTRUCTION_DIM);
      Animated.timing(instructionOpacity, {
        toValue: 1,
        duration: GROUND_INSTRUCTION_FADE_IN_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver,
      }).start();
    } else {
      instructionOpacity.setValue(1);
    }
  }, [instructionKey, instructionOpacity, reduceMotion, stepEnter, useNativeDriver]);

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

  const replay = () => {
    unlockFromUserGesture();
    reset();
    setPaused(false);
    if (narrationReady) {
      audio.replay();
    }
  };

  const goNext = useCallback(() => withSfxUnlock(next), [next, withSfxUnlock]);
  const goPrev = useCallback(() => withSfxUnlock(prev), [prev, withSfxUnlock]);

  const openChooser = () => setChooserOpen(true);

  const selectSequence = (id: GroundSequenceId) => {
    setSequenceId(id);
    setPaused(false);
    setChooserOpen(false);
  };

  return (
    <ActiveSessionScreen
      tool="ground"
      title={t('home.tools.ground')}
      onTryAnother={openChooser}
      tryAnotherHint={t('ground.tryAnotherHint')}
      onBack={openChooser}
      backLabel={t('ground.menu')}
      backHint={t('ground.menuHint')}
      backNavigates={!chooserOpen}
    >
      {(controls) => (
        <>
          <Pressable
            accessibilityRole="none"
            importantForAccessibility="no-hide-descendants"
            onPress={unlockFromUserGesture}
            style={[styles.stage, compact && styles.stageCompact]}
          >
            <GroundStage stepKey={instructionKey} paused={paused} />
            <Pressable
              accessibilityRole={last ? 'text' : 'button'}
              accessibilityLabel={instruction}
              accessibilityHint={last ? undefined : t('ground.continueHint')}
              onPress={last ? undefined : goNext}
              style={styles.instructionHit}
            >
              <Animated.View style={{ opacity: instructionOpacity }}>
                <AppText
                  variant="instruction"
                  accessibilityLiveRegion="polite"
                  accessible={false}
                  style={[styles.instruction, compact && styles.instructionCompact]}
                >
                  {instruction}
                </AppText>
              </Animated.View>
            </Pressable>
            <AudioControl
              isPlaying={!paused}
              muted={audio.muted}
              onPlayPause={onPlayPause}
              onPrevious={goPrev}
              onNext={goNext}
              activitySfxMuted={activitySfxMuted}
              onActivitySfxMute={() => {
                unlockFromUserGesture();
                toggleActivitySfxMute();
              }}
              onMute={
                narrationReady
                  ? () => {
                      unlockFromUserGesture();
                      const nextMuted = !audio.muted;
                      setSoundMuted(nextMuted);
                      void saveSoundMuted(nextMuted);
                      audio.toggleMute();
                    }
                  : undefined
              }
              onReplay={replay}
            />
          </Pressable>
          <SessionChoiceSheet
            visible={chooserOpen}
            title={t('ground.menu')}
            selectedId={sequenceId}
            options={groundSequenceIds.map((id) => ({
              id,
              label: t(`ground.sequences.${id}`),
            }))}
            onSelect={(id) => {
              if (isGroundSequenceId(id)) {
                selectSequence(id);
              }
            }}
            onDismiss={() => setChooserOpen(false)}
            onHardwareBack={controls.close}
          />
        </>
      )}
    </ActiveSessionScreen>
  );
}

const styles = StyleSheet.create({
  stage: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.md,
  },
  stageCompact: {
    paddingBottom: spacing.xs,
  },
  instructionHit: {
    width: '100%',
    alignItems: 'center',
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
