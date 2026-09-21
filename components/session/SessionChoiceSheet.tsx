import { useCallback, useEffect, useRef } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View, type ListRenderItemInfo } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { skipA11yNode } from '@/components/accessibility/hideFromA11y';
import { CloseButton } from '@/components/buttons/CloseButton';
import { AppText } from '@/components/typography/AppText';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

export type SessionChoice = {
  id: string;
  label: string;
};

type Props = {
  visible: boolean;
  title: string;
  options: readonly SessionChoice[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onDismiss: () => void;
  /** Android / hardware back while the menu is open. Defaults to dismiss. */
  onHardwareBack?: () => void;
};

const CHIP_WIDTH = 168;
const CHIP_HEIGHT = 60;
const CHIP_GAP = 11;
const HORIZONTAL_PAD = spacing.md;

export function SessionChoiceSheet({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onDismiss,
  onHardwareBack,
}: Props) {
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();
  const listRef = useRef<FlatList<SessionChoice>>(null);

  const scrollToSelected = useCallback(
    (animated: boolean) => {
      if (!selectedId) {
        return;
      }
      const index = options.findIndex((item) => item.id === selectedId);
      if (index < 0) {
        return;
      }
      listRef.current?.scrollToIndex({ index, animated, viewPosition: 0.5 });
    },
    [options, selectedId],
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    requestAnimationFrame(() => scrollToSelected(!reduceMotion));
  }, [reduceMotion, scrollToSelected, visible]);

  const renderItem = ({ item }: ListRenderItemInfo<SessionChoice>) => {
    const selected = item.id === selectedId;
    return (
      <AccessiblePressable
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={
          selected ? `${item.label}, ${t('common.selected')}` : item.label
        }
        onPress={() => onSelect(item.id)}
        style={[
          styles.chip,
          {
            backgroundColor: selected ? theme.colors.surfaceSecondary : theme.colors.surface,
            borderColor: selected ? theme.colors.primary : theme.colors.border,
            borderWidth: selected ? 1.5 : 1,
          },
        ]}
      >
        <AppText
          variant="body"
          numberOfLines={2}
          style={[styles.chipLabel, selected ? styles.chipLabelActive : undefined]}
        >
          {item.label}
        </AppText>
      </AccessiblePressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? 'none' : 'fade'}
      onRequestClose={onHardwareBack ?? onDismiss}
    >
      <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <Pressable
          {...skipA11yNode()}
          onPress={onDismiss}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.titleRow}>
            <AppText variant="section" accessibilityRole="header" style={styles.title}>
              {title}
            </AppText>
            <CloseButton
              onPress={onHardwareBack ?? onDismiss}
              accessibilityLabel={t('exercise.closeSession')}
              accessibilityHint={t('exercise.closeHint')}
            />
          </View>
          <FlatList
            ref={listRef}
            horizontal
            data={options as SessionChoice[]}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            accessibilityRole="radiogroup"
            accessibilityLabel={title}
            showsHorizontalScrollIndicator={false}
            onScrollToIndexFailed={(info) => {
              listRef.current?.scrollToOffset({
                offset: Math.max(0, info.index * (CHIP_WIDTH + CHIP_GAP) - HORIZONTAL_PAD),
                animated: true,
              });
            }}
            ItemSeparatorComponent={() => <View style={styles.gap} />}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}
            getItemLayout={(_data, index) => ({
              length: CHIP_WIDTH + CHIP_GAP,
              offset: (CHIP_WIDTH + CHIP_GAP) * index,
              index,
            })}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '52%',
  },
  titleRow: {
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginHorizontal: -spacing.sm,
  },
  title: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  carousel: {
    flexGrow: 0,
    marginHorizontal: -spacing.lg,
  },
  carouselContent: {
    paddingHorizontal: HORIZONTAL_PAD,
    paddingVertical: spacing.xxs,
  },
  gap: {
    width: CHIP_GAP,
  },
  chip: {
    width: CHIP_WIDTH,
    minHeight: CHIP_HEIGHT,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chipLabel: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  chipLabelActive: {
    fontWeight: '600',
  },
});
