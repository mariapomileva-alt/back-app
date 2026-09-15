import { type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { hideFromA11yTree } from '@/components/accessibility/hideFromA11y';
import { AppText } from '@/components/typography/AppText';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { brand, hexToRgba } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

type Props = {
  label: string;
  icon?: ReactNode;
  visual?: ReactNode;
  onPress: () => void;
  accessibilityHint?: string;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ToolCard({ label, icon, visual, onPress, accessibilityHint, selected = false, style }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const withVisual = Boolean(visual);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={selected ? `${label}, ${t('common.selected')}` : label}
      accessibilityState={{ selected }}
      accessibilityHint={accessibilityHint ?? t('home.startToolHint')}
      onPress={() => {
        haptics.light();
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        withVisual ? styles.cardVisual : styles.cardIcon,
        styles.elevation,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.96 : 1,
        },
        style,
      ]}
    >
      {visual ? (
        <View {...hideFromA11yTree()} style={[styles.visual, { pointerEvents: 'none' }]}>
          {visual}
        </View>
      ) : null}
      {icon ? (
        <View {...hideFromA11yTree()} style={styles.icon}>
          {icon}
        </View>
      ) : null}
      <AppText
        variant="button"
        numberOfLines={1}
        accessible={false}
        style={[styles.label, withVisual ? styles.labelUnderMark : null]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexBasis: 0,
    alignSelf: 'stretch',
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  cardVisual: {
    minHeight: 118,
    paddingHorizontal: spacing.sm,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cardIcon: {
    minHeight: 98,
    paddingHorizontal: spacing.md,
    paddingTop: 14,
    paddingBottom: 13,
    justifyContent: 'flex-start',
  },
  elevation: Platform.select<ViewStyle>({
    web: {
      boxShadow: `0 4px 14px ${hexToRgba(brand.deepForest, 0.018)}`,
    },
    default: {
      shadowColor: brand.deepForest,
      shadowOpacity: 0.028,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 1,
    },
  }) ?? {},
  visual: {
    flex: 1,
    width: '100%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    marginBottom: 8,
    justifyContent: 'center',
  },
  label: {
    letterSpacing: 0.15,
    zIndex: 1,
    includeFontPadding: false,
  },
  labelUnderMark: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
});
