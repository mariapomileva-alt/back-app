import { useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { createShapeDeck, drawShapeRound, type ShapeColorKey } from '@/features/distract/shapes';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

import { ShapeGlyph } from './ShapeGlyph';

const TARGET_SIZE = 118;
const OPTION_SIZE = 46;

export function ShapesPlay() {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const { height, fontScale } = useWindowDimensions();
  const compact = height < 700 || fontScale > 1.35;
  const targetSize = compact ? 92 : TARGET_SIZE;
  const [deck, setDeck] = useState(createShapeDeck);
  const [faded, setFaded] = useState<number | null>(null);
  const round = deck.round;

  const palette = useMemo(
    (): Record<ShapeColorKey, string> => ({
      forest: theme.colors.forest,
      sage: theme.colors.secondaryGreen,
      sand: theme.colors.clay,
      clay: theme.colors.muted,
      cool: theme.colors.cool,
    }),
    [theme],
  );

  return (
    <View style={styles.root}>
      <AppText style={[styles.instruction, compact && styles.instructionCompact]}>
        {t('distract.shapes.instruction')}
      </AppText>
      <View
        style={[styles.target, compact && styles.targetCompact]}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <ShapeGlyph shape={round.shape} color={palette[round.colorKey]} size={targetSize} />
      </View>
      <View style={styles.options}>
        {round.options.map((option, index) => (
          <AccessiblePressable
            key={`${option.shape}-${option.colorKey}-${index}-${round.shape}-${round.colorKey}`}
            accessibilityRole="button"
            accessibilityLabel={`${t(`distract.shapes.colors.${option.colorKey}`)} ${t(`distract.shapes.names.${option.shape}`)}`}
            onPress={() => {
              if (option.correct) {
                haptics.light();
                setFaded(null);
                setDeck((current) => drawShapeRound(current.remaining, current.round));
                return;
              }
              setFaded(index);
            }}
            style={[
              styles.option,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                opacity: faded === index ? 0.38 : 1,
                flexGrow: 1,
                flexBasis: round.options.length > 3 ? '46%' : 0,
              },
            ]}
          >
            <ShapeGlyph shape={option.shape} color={palette[option.colorKey]} size={OPTION_SIZE} />
          </AccessiblePressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },
  instruction: {
    fontFamily: serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '500',
    marginBottom: spacing.lg,
    maxWidth: 320,
  },
  instructionCompact: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: spacing.md,
  },
  target: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    overflow: 'visible',
  },
  targetCompact: {
    minHeight: 108,
    marginBottom: spacing.md,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    overflow: 'visible',
  },
  option: {
    minHeight: touch.comfortable + 20,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
