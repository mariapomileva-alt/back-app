import { useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { VolumeBar } from '@/components/audio/VolumeBar';
import { ListenSoundPicker } from '@/components/listen/ListenSoundPicker';
import { ListenSoundVisual } from '@/components/listen/ListenSoundVisual';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import {
  LISTEN_ART_MIN_HEIGHT,
  LISTEN_CONTROLS_MIN_HEIGHT,
  listenArtMinHeightForScreen,
  listenLayoutGaps,
} from '@/features/listen/artworkLayout';
import { listenEffectiveVolume } from '@/features/listen/playback';
import {
  defaultListenSoundId,
  isListenSoundId,
  listenPickerSounds,
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
import { spacing, touch } from '@/theme/spacing';

const PLAY_SIZE = 64;
const PLAY_ICON = 24;
const TRANSPORT_ICON = 24;

function initialSoundId(): ListenSoundId {
  const cached = peekLastSoundId();
  if (cached && isListenSoundId(cached)) {
    if (cached === 'melody') {
      return defaultListenSoundId;
    }
    return cached;
  }
  return defaultListenSoundId;
}

function normalizePickerSound(id: ListenSoundId): ListenSoundId {
  if (id === 'melody') {
    return defaultListenSoundId;
  }
  return listenPickerSounds.some((item) => item.id === id) ? id : defaultListenSoundId;
}

export default function ListenScreen() {
  usePaidToolGate();
  const { theme } = useTheme();
  const { width: windowWidth, height: windowHeight, fontScale } = useWindowDimensions();
  const compact = windowHeight < 740;
  const shortScreen = windowHeight < 620;
  const needsScroll = shortScreen || fontScale > 1.85;
  const gaps = listenLayoutGaps(compact || shortScreen);
  const [chromeHeights, setChromeHeights] = useState({ stage: 0, controls: 0 });
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
          setSoundId(normalizePickerSound(stored));
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

  const artMinHeight = useMemo(
    () => listenArtMinHeightForScreen(windowHeight, compact || shortScreen),
    [compact, shortScreen, windowHeight],
  );

  const artDisplayHeight = useMemo(() => {
    const { stage, controls } = chromeHeights;
    const controlsBlock = Math.max(controls, LISTEN_CONTROLS_MIN_HEIGHT);
    if (stage > 0) {
      const fitted = Math.floor(stage - controlsBlock - gaps.artToPlayback);
      return Math.max(LISTEN_ART_MIN_HEIGHT, fitted);
    }
    return artMinHeight;
  }, [artMinHeight, chromeHeights, gaps.artToPlayback]);

  const playbackVolume = listenEffectiveVolume(soundVolume, soundId);
  const nativeAutoPlay = Platform.OS !== 'web';
  const audio = useLoopingSound({
    source: selected.audio,
    enabled: true,
    autoPlay: nativeAutoPlay,
    webRequiresUserGesture: true,
    initialMuted: soundMuted,
    initialVolume: playbackVolume,
    lockScreenTitle: t(selected.nameKey),
  });

  useEffect(() => {
    if (soundMuted) {
      return;
    }
    audio.setVolume(listenEffectiveVolume(soundVolume, soundId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundId, soundMuted, soundVolume]);

  useEffect(() => {
    if (soundMuted) {
      return;
    }
    audio.replay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.audio]);

  const soundName = t(selected.nameKey);
  const awaitingGesture = audio.playback === 'blocked';
  const playPauseA11y = awaitingGesture
    ? `${t('common.play')}. ${t('listen.tapToPlay')}`
    : audio.isPlaying
      ? `${t('common.pause')}. ${soundName}`
      : `${t('common.play')}. ${soundName}`;

  const select = (id: ListenSoundId) => {
    setSoundId(id);
    void saveLastSoundId(id);
  };

  const shift = (delta: number) => {
    const index = listenPickerSounds.findIndex((item) => item.id === soundId);
    const resolvedIndex = index >= 0 ? index : 0;
    const next = listenPickerSounds[(resolvedIndex + delta + listenPickerSounds.length) % listenPickerSounds.length];
    if (next) {
      select(next.id);
    }
  };

  const onPlayPress = () => {
    if (audio.isPlaying) {
      audio.pause();
      return;
    }
    if (Platform.OS === 'web') {
      audio.play(true);
      return;
    }
    audio.toggle();
  };

  const transportGap = windowWidth < 360 ? spacing.md : spacing.lg;

  return (
    <ActiveSessionScreen
      tool="listen"
      title={t('home.tools.listen')}
      scroll={needsScroll}
      backClosesSession
      extraActions={
        <ListenSoundPicker soundId={normalizePickerSound(soundId)} onSelect={select} />
      }
    >
      <View
        style={[styles.stage, needsScroll && styles.stageScroll]}
        onLayout={(event) => {
          const next = event.nativeEvent.layout.height;
          setChromeHeights((current) =>
            Math.abs(current.stage - next) < 1 ? current : { ...current, stage: next },
          );
        }}
      >
        <View
          style={[
            styles.artSlot,
            { height: artDisplayHeight, marginBottom: gaps.artToPlayback },
          ]}
          accessibilityLabel={soundName}
          accessibilityRole="image"
        >
          <ListenSoundVisual sound={selected} fill height={artDisplayHeight} />
        </View>

        <View
          style={[styles.controlsDock, needsScroll ? { marginTop: spacing.md } : null]}
          onLayout={(event) => {
            const next = event.nativeEvent.layout.height;
            setChromeHeights((current) =>
              Math.abs(current.controls - next) < 1 ? current : { ...current, controls: next },
            );
          }}
        >
        <View style={[styles.playback, { gap: gaps.playbackToVolume }]}>
          <View style={[styles.transport, { gap: transportGap }]}>
            <AccessiblePressable
              accessibilityRole="button"
              accessibilityLabel={t('listen.previous')}
              onPress={() => shift(-1)}
              style={[styles.side, styles.sideQuiet]}
            >
              <Svg width={TRANSPORT_ICON} height={TRANSPORT_ICON} viewBox="0 0 22 22">
                <Path
                  d="M13.5 6L8 11l5.5 5"
                  stroke={theme.colors.icon}
                  strokeWidth={1.5}
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
            </AccessiblePressable>
            <AccessiblePressable
              accessibilityRole="button"
              accessibilityLabel={playPauseA11y}
              accessibilityState={{ selected: audio.isPlaying }}
              onPress={onPlayPress}
              style={[
                styles.play,
                {
                  backgroundColor: theme.colors.buttonBackground,
                  borderColor: audio.isPlaying ? theme.colors.primary : 'transparent',
                },
              ]}
            >
              {audio.isPlaying ? (
                <Svg width={PLAY_ICON} height={PLAY_ICON} viewBox="0 0 28 28">
                  <Path d="M9 7h3.4v14H9zM15.6 7H19v14h-3.4z" fill={theme.colors.buttonText} />
                </Svg>
              ) : (
                <Svg width={PLAY_ICON} height={PLAY_ICON} viewBox="0 0 28 28">
                  <Path d="M10 7.2v13.6L21 14 10 7.2z" fill={theme.colors.buttonText} />
                </Svg>
              )}
            </AccessiblePressable>
            <AccessiblePressable
              accessibilityRole="button"
              accessibilityLabel={t('listen.next')}
              onPress={() => shift(1)}
              style={[styles.side, styles.sideQuiet]}
            >
              <Svg width={TRANSPORT_ICON} height={TRANSPORT_ICON} viewBox="0 0 22 22">
                <Path
                  d="M8.5 6L14 11l-5.5 5"
                  stroke={theme.colors.icon}
                  strokeWidth={1.5}
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
            </AccessiblePressable>
          </View>
          <VolumeBar
            listenLayout
            value={soundVolume}
            onChange={(value) => {
              setSoundVolume(value);
              audio.setVolume(listenEffectiveVolume(value, soundId));
              void saveSoundVolume(value);
            }}
          />
        </View>
        </View>
      </View>
    </ActiveSessionScreen>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  stageScroll: {
    flexGrow: 1,
    flex: undefined,
    minHeight: undefined,
    paddingBottom: spacing.md,
  },
  artSlot: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 0,
    flexShrink: 1,
  },
  controlsDock: {
    flexShrink: 0,
    width: '100%',
    alignItems: 'stretch',
    zIndex: 1,
    paddingBottom: spacing.xs,
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
  },
  play: {
    width: PLAY_SIZE,
    height: PLAY_SIZE,
    borderRadius: PLAY_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  side: {
    width: touch.min,
    height: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.88,
  },
  sideQuiet: Platform.select({
    web: { outlineWidth: 0, boxShadow: 'none' } as object,
    default: {},
  }),
});
