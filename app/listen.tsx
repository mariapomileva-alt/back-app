import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { VolumeBar } from '@/components/audio/VolumeBar';
import { ListenSoundPicker } from '@/components/listen/ListenSoundPicker';
import { ListenSoundVisual } from '@/components/listen/ListenSoundVisual';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { AppText } from '@/components/typography/AppText';
import { listenEffectiveVolume } from '@/features/listen/playback';
import {
  defaultListenSoundId,
  isListenSoundId,
  listenSounds,
  type ListenSoundId,
} from '@/features/listen/sounds';
import { useLoopingSound } from '@/hooks/useLoopingSound';
import { usePaidToolGate } from '@/hooks/usePaidToolGate';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import {
  DEFAULT_SOUND_VOLUME,
  loadLastSoundId,
  loadSoundMuted,
  loadSoundVolume,
  peekLastSoundId,
  saveLastSoundId,
  saveSoundVolume,
} from '@/storage/preferences';
import { serif } from '@/theme/fonts';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

function visualHeightForWindow(height: number): number {
  if (height < 680) {
    return 108;
  }
  if (height < 740) {
    return 148;
  }
  if (height < 820) {
    return 180;
  }
  return 220;
}

function initialSoundId(): ListenSoundId {
  const cached = peekLastSoundId();
  return cached && isListenSoundId(cached) ? cached : defaultListenSoundId;
}

export default function ListenScreen() {
  usePaidToolGate();
  const { theme } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const compact = windowHeight < 740;
  const [soundId, setSoundId] = useState<ListenSoundId>(initialSoundId);
  const [soundMuted, setSoundMuted] = useState(false);
  const [soundVolume, setSoundVolume] = useState(DEFAULT_SOUND_VOLUME);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([loadLastSoundId(), loadSoundMuted(), loadSoundVolume()]).then(
      ([stored, muted, volume]) => {
        if (cancelled) {
          return;
        }
        if (isListenSoundId(stored)) {
          setSoundId(stored);
        }
        setSoundMuted(muted);
        setSoundVolume(volume);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(() => {
    return listenSounds.find((item) => item.id === soundId) ?? listenSounds[0]!;
  }, [soundId]);
  const playbackVolume = listenEffectiveVolume(soundVolume, soundId);
  const audio = useLoopingSound({
    source: selected.audio,
    enabled: true,
    autoPlay: true,
    initialMuted: soundMuted,
    initialVolume: playbackVolume,
    lockScreenTitle: t(selected.nameKey),
  });

  useEffect(() => {
    if (soundMuted) {
      return;
    }
    audio.setVolume(listenEffectiveVolume(soundVolume, soundId));
    // Re-apply trim when the sound chip changes; `setVolume` is stable on the loop hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundId, soundMuted, soundVolume]);
  const visualHeight = visualHeightForWindow(windowHeight);
  const gap = compact ? spacing.xs : spacing.md;
  const soundName = t(selected.nameKey);
  const statusLabel = audio.isPlaying
    ? t('listen.nowPlaying', { name: soundName })
    : t('listen.tapToPlay');

  const select = (id: ListenSoundId) => {
    setSoundId(id);
    void saveLastSoundId(id);
  };

  const shift = (delta: number) => {
    const index = listenSounds.findIndex((item) => item.id === soundId);
    const next = listenSounds[(index + delta + listenSounds.length) % listenSounds.length];
    if (next) {
      select(next.id);
    }
  };

  return (
    <ActiveSessionScreen
      tool="listen"
      title={t('home.tools.listen')}
      scroll={false}
      backClosesSession
    >
      <View style={styles.stage}>
            <View style={{ marginBottom: gap }}>
              <AppText
                accessibilityRole="header"
                style={[styles.name, compact && styles.nameCompact, { marginBottom: compact ? spacing.xxs : spacing.sm }]}
              >
                {soundName}
              </AppText>
              <AppText
                variant="body"
                tone="secondary"
                accessibilityLiveRegion="polite"
                accessibilityLabel={statusLabel}
              >
                {statusLabel}
              </AppText>
            </View>
            <View style={[styles.visual, { height: visualHeight, marginVertical: compact ? spacing.xxs : spacing.sm }]}>
              <ListenSoundVisual
                sound={selected}
                height={visualHeight}
                motionActive={audio.isPlaying}
              />
            </View>
            <View style={[styles.playback, { marginTop: gap }]}>
              <View style={[styles.transport, { marginBottom: compact ? spacing.xxs : spacing.sm }]}>
                <AccessiblePressable
                  accessibilityRole="button"
                  accessibilityLabel={t('listen.previous')}
                  onPress={() => shift(-1)}
                  style={styles.side}
                >
                  <Svg width={22} height={22} viewBox="0 0 22 22">
                    <Path d="M13.5 6L8 11l5.5 5" stroke={theme.colors.icon} strokeWidth={1.5} fill="none" strokeLinecap="round" />
                  </Svg>
                </AccessiblePressable>
                <AccessiblePressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    audio.isPlaying ? `${t('common.pause')}. ${statusLabel}` : `${t('common.play')}. ${statusLabel}`
                  }
                  accessibilityState={{ selected: audio.isPlaying }}
                  onPress={audio.toggle}
                  style={[styles.play, { backgroundColor: theme.colors.buttonBackground }]}
                >
                  {audio.isPlaying ? (
                    <Svg width={28} height={28} viewBox="0 0 28 28">
                      <Path d="M9 7h3.4v14H9zM15.6 7H19v14h-3.4z" fill={theme.colors.buttonText} />
                    </Svg>
                  ) : (
                    <Svg width={28} height={28} viewBox="0 0 28 28">
                      <Path d="M10 7.2v13.6L21 14 10 7.2z" fill={theme.colors.buttonText} />
                    </Svg>
                  )}
                </AccessiblePressable>
                <AccessiblePressable
                  accessibilityRole="button"
                  accessibilityLabel={t('listen.next')}
                  onPress={() => shift(1)}
                  style={styles.side}
                >
                  <Svg width={22} height={22} viewBox="0 0 22 22">
                    <Path d="M8.5 6L14 11l-5.5 5" stroke={theme.colors.icon} strokeWidth={1.5} fill="none" strokeLinecap="round" />
                  </Svg>
                </AccessiblePressable>
              </View>
              <VolumeBar
                value={soundVolume}
                onChange={(value) => {
                  setSoundVolume(value);
                  audio.setVolume(listenEffectiveVolume(value, soundId));
                  void saveSoundVolume(value);
                }}
              />
            </View>
            <ListenSoundPicker soundId={soundId} onSelect={select} marginTop={gap} />
          </View>
    </ActiveSessionScreen>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'flex-start',
  },
  name: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '500',
  },
  nameCompact: {
    fontSize: 28,
    lineHeight: 34,
  },
  visual: {
    width: '100%',
    minHeight: 0,
    flexShrink: 1,
  },
  playback: {
    flexShrink: 0,
    width: '100%',
    maxWidth: '100%',
  },
  transport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  play: {
    width: 72,
    height: 72,
    borderRadius: radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  side: {
    width: touch.min,
    height: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
