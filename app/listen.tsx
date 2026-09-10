import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { VolumeBar } from '@/components/audio/VolumeBar';
import { ListenSoundVisual } from '@/components/listen/ListenSoundVisual';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { AppText } from '@/components/typography/AppText';
import {
  defaultListenSoundId,
  isListenSoundId,
  listenSounds,
  type ListenSoundId,
} from '@/features/listen/sounds';
import { useLoopingSound } from '@/hooks/useLoopingSound';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { loadLastSoundId, saveLastSoundId } from '@/storage/preferences';
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

export default function ListenScreen() {
  const { theme } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const compact = windowHeight < 740;
  const [soundId, setSoundId] = useState<ListenSoundId>(defaultListenSoundId);
  const [playbackReady, setPlaybackReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadLastSoundId().then((stored) => {
      if (cancelled) {
        return;
      }
      if (isListenSoundId(stored)) {
        setSoundId(stored);
      }
      setPlaybackReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(() => {
    return listenSounds.find((item) => item.id === soundId) ?? listenSounds[0]!;
  }, [soundId]);
  const audio = useLoopingSound({
    source: selected.audio,
    enabled: playbackReady,
    autoPlay: true,
    lockScreenTitle: t(selected.nameKey),
  });
  const visualHeight = visualHeightForWindow(windowHeight);
  const gap = compact ? spacing.xs : spacing.md;

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
    <ActiveSessionScreen tool="listen" title={t('home.tools.listen')} scroll={false}>
      <View style={styles.stage}>
        <View style={{ marginBottom: gap }}>
          <AppText
            accessibilityRole="header"
            style={[styles.name, compact && styles.nameCompact, { marginBottom: compact ? spacing.xxs : spacing.sm }]}
          >
            {t(selected.nameKey)}
          </AppText>
          {selected.placeholderAudio ? (
            <AppText variant="body" tone="secondary">
              {t('listen.placeholderAudio')}
            </AppText>
          ) : null}
        </View>
        <View style={[styles.visual, { height: visualHeight, marginVertical: compact ? spacing.xxs : spacing.sm }]}>
          <ListenSoundVisual sound={selected} height={visualHeight} />
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
              accessibilityLabel={audio.isPlaying ? t('common.pause') : t('common.play')}
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
          <VolumeBar value={audio.volume} onChange={audio.setVolume} />
        </View>
        <ScrollView
          horizontal
          accessibilityRole="radiogroup"
          accessibilityLabel={t('listen.chooseSound')}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.selector, { marginTop: gap }]}
          style={styles.selectorScroll}
        >
          {listenSounds.map((item) => {
            const active = item.id === soundId;
            return (
              <AccessiblePressable
                key={item.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t(item.nameKey)}
                onPress={() => select(item.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? theme.colors.surfaceSecondary : 'transparent',
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <AppText variant="body">{t(item.nameKey)}</AppText>
              </AccessiblePressable>
            );
          })}
        </ScrollView>
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
  selectorScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  chip: {
    minHeight: touch.min,
    paddingHorizontal: spacing.md,
    borderRadius: radius.circle,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
