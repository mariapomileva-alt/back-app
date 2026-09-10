import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { AudioControl } from '@/components/audio/AudioControl';
import { GroundStage } from '@/components/ground/GroundStage';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { SessionChoiceSheet } from '@/components/session/SessionChoiceSheet';
import { AppText } from '@/components/typography/AppText';
import { GROUND_AUDIO_PLACEHOLDER_TODO, groundAudio } from '@/features/ground/audio';
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
  const audio = useGuidedAudio({
    source: groundAudio.source,
    autoPlay: groundAudio.ready,
    initialMuted: soundMuted,
  });
  const [paused, setPaused] = useState(false);
  const [sequenceId, setSequenceId] = useState<GroundSequenceId>(defaultGroundSequenceId);
  const [chooserOpen, setChooserOpen] = useState(false);
  const { instructionKey, last, next, reset } = useGroundSequence(paused, sequenceId);
  const instruction = t(instructionKey);

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

  const onPlayPause = () => {
    if (paused) {
      setPaused(false);
      if (groundAudio.ready) {
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
    audio.replay();
  };

  const openChooser = () => setChooserOpen(true);

  const selectSequence = (id: GroundSequenceId) => {
    setSequenceId(id);
    setPaused(false);
    setChooserOpen(false);
  };

  return (
    <>
      <ActiveSessionScreen
        tool="ground"
        title={t('home.tools.ground')}
        onTryAnother={openChooser}
        tryAnotherHint={t('ground.tryAnotherHint')}
        onBack={openChooser}
        backLabel={t('ground.menu')}
        backHint={t('ground.menuHint')}
      >
        <View style={[styles.stage, compact && styles.stageCompact]}>
          <GroundStage />
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
            onMute={() => {
              const nextMuted = !audio.muted;
              void saveSoundMuted(nextMuted);
              audio.toggleMute();
            }}
            onReplay={replay}
          />
          {groundAudio.ready ? null : (
            <AppText variant="secondary" tone="secondary" style={styles.placeholder}>
              {GROUND_AUDIO_PLACEHOLDER_TODO}
            </AppText>
          )}
        </View>
      </ActiveSessionScreen>
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
      />
    </>
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
  placeholder: {
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 280,
    opacity: 0.72,
  },
});
