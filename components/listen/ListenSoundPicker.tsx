import { useEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import {
  listenSoundGroups,
  listenSounds,
  type ListenSoundGroup,
  type ListenSoundId,
} from '@/features/listen/sounds';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  soundId: ListenSoundId;
  onSelect: (id: ListenSoundId) => void;
  marginTop?: number;
};

const groupLabelKey: Record<ListenSoundGroup, string> = Object.fromEntries(
  listenSoundGroups.map((group) => [group.id, group.labelKey]),
) as Record<ListenSoundGroup, string>;

export function ListenSoundPicker({ soundId, onSelect, marginTop }: Props) {
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const chipX = useRef<Partial<Record<ListenSoundId, number>>>({});

  const rows = useMemo(() => {
    const items: (
      | { type: 'label'; group: ListenSoundGroup; key: string }
      | { type: 'chip'; id: ListenSoundId; nameKey: string; key: string }
    )[] = [];
    let lastGroup: ListenSoundGroup | null = null;
    for (const sound of listenSounds) {
      if (sound.group !== lastGroup) {
        items.push({ type: 'label', group: sound.group, key: `label-${sound.group}` });
        lastGroup = sound.group;
      }
      items.push({ type: 'chip', id: sound.id, nameKey: sound.nameKey, key: sound.id });
    }
    return items;
  }, []);

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
      {rows.map((row) => {
        if (row.type === 'label') {
          return (
            <View key={row.key} style={styles.groupLabelWrap} accessible={false} importantForAccessibility="no">
              <AppText variant="secondary" tone="secondary" style={styles.groupLabel}>
                {t(groupLabelKey[row.group])}
              </AppText>
            </View>
          );
        }
        const active = row.id === soundId;
        return (
          <AccessiblePressable
            key={row.key}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={
              active ? `${t(row.nameKey)}, ${t('common.selected')}` : t(row.nameKey)
            }
            onPress={() => onSelect(row.id)}
            onLayout={(event) => {
              chipX.current[row.id] = event.nativeEvent.layout.x;
              if (row.id === soundId) {
                revealSelectedChip(row.id, false);
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
            <AppText variant="body">{t(row.nameKey)}</AppText>
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
  groupLabelWrap: {
    justifyContent: 'center',
    paddingRight: spacing.xxs,
  },
  groupLabel: {
    letterSpacing: 0.6,
    textTransform: 'uppercase',
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
