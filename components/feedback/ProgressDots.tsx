import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

type Props = {
  count: number;
  index: number;
};

export function ProgressDots({ count, index }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: count, now: index + 1 }}
    >
      {Array.from({ length: count }, (_, itemIndex) => {
        const active = itemIndex === index;
        return (
          <View
            key={itemIndex}
            style={[
              styles.dot,
              {
                backgroundColor: active ? theme.colors.primary : theme.colors.border,
                transform: [{ scale: active ? 1 : 0.78 }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
});
