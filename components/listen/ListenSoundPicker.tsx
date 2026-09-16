import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { listenSounds, type ListenSoundId } from '@/features/listen/sounds';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  soundId: ListenSoundId;
  onSelect: (id: ListenSoundId) => void;
  marginTop?: number;
};

export function ListenSoundPicker({ soundId, onSelect, marginTop }: Props) {
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const chipX = useRef<Partial<Record<ListenSoundId, number>>>({});

  const revealSelectedChip = (id: ListenSoundId, animated = true) => {
    const x = chipX.current[id];
    if (x == null) {
      return;
    }
    scrollRef.current?.scrollTo({ x: Math.max(0, x - spacing.sm), animated });
  };

  useEffect(() => {
    revealSelectedChip(soundId, true);
  }, [soundId]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      accessibilityRole="radiogroup"
      accessibilityLabel={t('listen.chooseSound')}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.content, marginTop != null ? { marginTop } : undefined]}
      style={styles.scroll}
    >
      {listenSounds.map((sound) => {
        const active = sound.id === soundId;
        return (
          <AccessiblePressable
            key={sound.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={
              active ? `${t(sound.nameKey)}, ${t('common.selected')}` : t(sound.nameKey)
            }
            onPress={() => onSelect(sound.id)}
            onLayout={(event) => {
              chipX.current[sound.id] = event.nativeEvent.layout.x;
              if (sound.id === soundId) {
                revealSelectedChip(sound.id, false);
              }
            }}
            style={[
              styles.chip,
              {
                backgroundColor: active ? theme.colors.surfaceSecondary : 'transparent',
                borderColor: active ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <AppText variant="body">{t(sound.nameKey)}</AppText>
          </AccessiblePressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xxs,
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
