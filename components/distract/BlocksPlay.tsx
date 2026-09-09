import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import {
  BLOCK_COLS,
  BLOCK_ROWS,
  clearCells,
  completedLineCells,
  seedBoard,
  toggleCell,
} from '@/features/distract/blocks';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing, touch } from '@/theme/spacing';

export function BlocksPlay() {
  const { theme } = useTheme();
  const [filled, setFilled] = useState(seedBoard);
  const [clearing, setClearing] = useState<number[]>([]);

  const colors = useMemo(() => {
    const empty = theme.colors.surface;
    const on = theme.name === 'deepGreen' ? theme.colors.secondaryGreen : theme.colors.forest;
    return { empty, on };
  }, [theme]);

  useEffect(() => {
    if (clearing.length === 0) {
      return;
    }
    const id = setTimeout(() => {
      setFilled((current) => clearCells(current, clearing));
      setClearing([]);
    }, 420);
    return () => clearTimeout(id);
  }, [clearing]);

  return (
    <View style={styles.root}>
      <AppText style={styles.instruction}>{t('distract.blocks.instruction')}</AppText>
      <View style={styles.board} accessible={false}>
        {Array.from({ length: BLOCK_ROWS }, (_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: BLOCK_COLS }, (_, col) => {
              const index = row * BLOCK_COLS + col;
              const isFilled = filled[index] ?? false;
              const isClearing = clearing.includes(index);
              return (
                <AccessiblePressable
                  key={index}
                  accessibilityRole="button"
                  accessibilityLabel={isFilled ? t('distract.blocks.filled') : t('distract.blocks.empty')}
                  accessibilityState={{ selected: isFilled }}
                  onPress={() => {
                    if (clearing.length > 0) {
                      return;
                    }
                    const next = toggleCell(filled, index);
                    const complete = completedLineCells(next);
                    setFilled(next);
                    if (complete.length > 0) {
                      setClearing(complete);
                    }
                  }}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: isFilled ? colors.on : colors.empty,
                      borderColor: theme.colors.border,
                      opacity: isClearing ? 0.28 : 1,
                    },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  instruction: {
    fontFamily: serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '500',
    marginBottom: spacing.md,
    maxWidth: 320,
  },
  board: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    minWidth: touch.min - 8,
    minHeight: touch.min - 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
