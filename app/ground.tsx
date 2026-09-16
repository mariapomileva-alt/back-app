import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

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
import { useGroundSequence } from '@/features/ground/useGroundSequence';
import { useGuidedAudio } from '@/hooks/useGuidedAudio';
import { t } from '@/locales/i18n';
import { loadSoundMuted, saveSoundMuted } from '@/storage/preferences';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function GroundScreen() {
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
  const { instructionKey, last, next, prev, reset } = useGroundSequence(paused, sequenceId);
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
      setPaused(false);
      if (narrationReady) {
        audio.play();
      }
      return;
    }
    setPaused(true);
    audio.pause();
  };

  const replay = () => {
    reset();
    setPaused(false);
    if (narrationReady) {
      audio.replay();
    }
  };

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
          <View style={[styles.stage, compact && styles.stageCompact]}>
            <GroundStage stepKey={instructionKey} />
            <Pressable
              accessibilityRole={last ? 'text' : 'button'}
              accessibilityLabel={instruction}
              accessibilityHint={last ? undefined : t('ground.continueHint')}
              onPress={last ? undefined : next}
              style={styles.instructionHit}
            >
              <AppText
                variant="instruction"
                accessibilityLiveRegion="polite"
                accessible={false}
                style={[styles.instruction, compact && styles.instructionCompact]}
              >
                {instruction}
              </AppText>
            </Pressable>
            <AudioControl
              isPlaying={!paused}
              muted={audio.muted}
              onPlayPause={onPlayPause}
              onPrevious={prev}
              onNext={next}
              onMute={
                narrationReady
                  ? () => {
                      const nextMuted = !audio.muted;
                      void saveSoundMuted(nextMuted);
                      audio.toggleMute();
                    }
                  : undefined
              }
              onReplay={replay}
            />
          </View>
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
