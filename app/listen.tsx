import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { VolumeBar } from '@/components/audio/VolumeBar';
import { ListenMark } from '@/components/marks';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { AppText } from '@/components/typography/AppText';
import { defaultListenSoundId, listenSounds, type ListenSoundId } from '@/features/listen/sounds';
import { useLoopingSound } from '@/hooks/useLoopingSound';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';
import { loadLastSoundId, saveLastSoundId } from '@/storage/preferences';

export default function ListenScreen() {
  const { theme } = useTheme();
  const [soundId, setSoundId] = useState<ListenSoundId>(defaultListenSoundId);

  useEffect(() => {
    void loadLastSoundId().then((stored) => {
      if (listenSounds.some((item) => item.id === stored)) {
        setSoundId(stored as ListenSoundId);
      }
    });
  }, []);

  const selected = useMemo(() => {
    return listenSounds.find((item) => item.id === soundId) ?? listenSounds[0]!;
  }, [soundId]);
  const audio = useLoopingSound({ source: selected.audio });

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
    <ActiveSessionScreen tool="listen" title={t('home.tools.listen')}>
      <AppText style={styles.name}>{t(selected.nameKey)}</AppText>
      <View style={styles.mark} accessible={false} importantForAccessibility="no">
        <ListenMark />
      </View>
      <View style={styles.transport}>
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
      <View style={styles.selector}>
        {listenSounds.map((item) => {
          const active = item.id === soundId;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
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
              <AppText variant="secondary">{t(item.nameKey)}</AppText>
            </Pressable>
          );
        })}
      </View>
    </ActiveSessionScreen>
  );
}

const styles = StyleSheet.create({
  name: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  mark: {
    width: 220,
    height: 120,
    alignSelf: 'center',
    marginVertical: spacing.md,
  },
  transport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
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
  selector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.circle,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
