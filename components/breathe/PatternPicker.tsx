import { StyleSheet, View } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { breathPatterns, type BreathPatternId } from '@/features/breathe/patterns';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  selectedId: BreathPatternId;
  onSelect: (id: BreathPatternId) => void;
};

export function PatternPicker({ selectedId, onSelect }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {breathPatterns.map((pattern) => {
        const selected = pattern.id === selectedId;
        const label = t(pattern.nameKey);
        return (
          <AccessiblePressable
            key={pattern.id}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityHint={t('breathe.patternHint')}
            accessibilityState={{ selected }}
            onPress={() => {
              if (selected) {
                return;
              }
              haptics.selection();
              onSelect(pattern.id);
            }}
            style={styles.item}
          >
            <AppText
              variant="secondary"
              numberOfLines={2}
              style={[
                styles.label,
                {
                  color: selected ? theme.colors.text : theme.colors.textSecondary,
                  fontWeight: selected ? '600' : '400',
                },
              ]}
            >
              {label}
            </AppText>
          </AccessiblePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: spacing.xxs,
    marginTop: spacing.sm,
  },
  item: {
    flex: 1,
    minHeight: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxs,
  },
  label: {
    textAlign: 'center',
  },
});
