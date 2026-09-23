import { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { HorizontalTextCarouselFrame } from '@/components/session/HorizontalTextCarouselFrame';
import { AppText } from '@/components/typography/AppText';
import { listenPickerSounds, type ListenSoundId } from '@/features/listen/sounds';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import {
  SECONDARY_CONTROL_LABEL_OPACITY,
  secondaryControlLabelColor,
} from '@/theme/colors';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  soundId: ListenSoundId;
  onSelect: (id: ListenSoundId) => void;
};

const ITEM_MIN_WIDTH = 108;
const ITEM_GAP = spacing.sm;

export function ListenSoundPicker({ soundId, onSelect }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const scrollRef = useRef<ScrollView>(null);
  const itemX = useRef<Partial<Record<ListenSoundId, number>>>({});

  const scrollToId = useCallback((id: ListenSoundId, animated: boolean) => {
    const x = itemX.current[id];
    if (x == null) {
      return;
    }
    const target = Math.max(0, x - spacing.lg);
    scrollRef.current?.scrollTo({ x: target, animated });
  }, []);

  useEffect(() => {
    scrollToId(soundId, true);
  }, [scrollToId, soundId]);

  return (
    <HorizontalTextCarouselFrame>
      <ScrollView
        ref={scrollRef}
        horizontal
        accessibilityRole="radiogroup"
        accessibilityLabel={t('listen.menu')}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={styles.scroll}
      >
        {listenPickerSounds.map((sound, index) => {
        const selected = sound.id === soundId;
        const label = t(sound.nameKey);
        return (
          <AccessiblePressable
            key={sound.id}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityHint={t('listen.soundHint')}
            accessibilityState={{ selected }}
            onLayout={(event) => {
              itemX.current[sound.id] = event.nativeEvent.layout.x;
              if (sound.id === soundId) {
                scrollToId(sound.id, false);
              }
            }}
            onPress={() => {
              if (selected) {
                return;
              }
              haptics.selection();
              onSelect(sound.id);
            }}
            style={[styles.item, index > 0 ? { marginLeft: ITEM_GAP } : null]}
          >
            <AppText
              variant="secondary"
              numberOfLines={2}
              style={[
                styles.label,
                {
                  color: selected ? theme.colors.text : secondaryControlLabelColor(theme),
                  fontWeight: selected ? '500' : '400',
                  opacity: selected ? 1 : SECONDARY_CONTROL_LABEL_OPACITY,
                },
              ]}
            >
              {label}
            </AppText>
          </AccessiblePressable>
        );
        })}
      </ScrollView>
    </HorizontalTextCarouselFrame>
  );
}

const styles = StyleSheet.create({
  scroll: {
    width: '100%',
    flexGrow: 0,
    marginTop: spacing.md,
    opacity: 0.92,
  },
  content: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.xl + spacing.lg,
    alignItems: 'stretch',
  },
  item: {
    minWidth: ITEM_MIN_WIDTH,
    minHeight: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    gap: 6,
  },
  label: {
    textAlign: 'center',
  },
});
