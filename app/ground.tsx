import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AudioControl } from '@/components/audio/AudioControl';
import { GroundStage } from '@/components/ground/GroundStage';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { AppText } from '@/components/typography/AppText';
import { GROUND_AUDIO_PLACEHOLDER_TODO, groundAudio } from '@/features/ground/audio';
import { useGroundSequence } from '@/features/ground/useGroundSequence';
import { useGuidedAudio } from '@/hooks/useGuidedAudio';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function GroundScreen() {
  const audio = useGuidedAudio({
    source: groundAudio.source,
    autoPlay: groundAudio.ready,
  });
  const [paused, setPaused] = useState(false);
  const { instructionKey, last, next, reset } = useGroundSequence(paused);
  const instruction = t(instructionKey);

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

  return (
    <ActiveSessionScreen tool="ground" title={t('home.tools.ground')}>
      <View style={styles.stage}>
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
            style={styles.instruction}
          >
            {instruction}
          </AppText>
        </Pressable>
        <AudioControl
          isPlaying={!paused}
          muted={audio.muted}
          onPlayPause={onPlayPause}
          onMute={audio.toggleMute}
          onReplay={replay}
        />
        {groundAudio.ready ? null : (
          <AppText variant="secondary" tone="secondary" style={styles.placeholder}>
            {GROUND_AUDIO_PLACEHOLDER_TODO}
          </AppText>
        )}
      </View>
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
  placeholder: {
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 280,
    opacity: 0.72,
  },
});
