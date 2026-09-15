import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { brandIdentity, type BreathingMarkVariant } from '@/theme/brandIdentity';
import { brand } from '@/theme/colors';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

import { BackBreathingMark } from './BackBreathingMark';
import { BackWordmark } from './BackWordmark';

type Layout = 'stacked' | 'horizontal';

type Props = {
  size?: number;
  layout?: Layout;
  variant?: BreathingMarkVariant;
  showTagline?: boolean;
  decorative?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function BackBrandLockup({
  size = 180,
  layout = 'stacked',
  variant = 'warmEarth',
  showTagline = false,
  decorative = false,
  accessibilityLabel = 'Back',
  style,
}: Props) {
  const onForest = variant === 'forest';
  const background = onForest ? brandIdentity.surface.forest : brandIdentity.surface.warmEarth;
  const wordmarkVariant = onForest ? 'forest' : 'warmEarth';
  const markSize = layout === 'horizontal' ? size * 0.48 : size * 0.38;
  const wordSize = layout === 'horizontal' ? size * 0.36 : size * 0.32;
  const taglineColor = onForest ? brand.paleSage : brand.secondaryText;
  const label = showTagline ? 'Back. Something to do right now.' : accessibilityLabel;

  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : label}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      style={[
        layout === 'horizontal' ? styles.horizontal : styles.stacked,
        { backgroundColor: background, minHeight: size },
        style,
      ]}
    >
      <BackBreathingMark size={markSize} variant={variant} decorative />
      <View style={layout === 'horizontal' ? styles.horizontalCopy : styles.stackedCopy}>
        <BackWordmark size={wordSize} variant={wordmarkVariant} decorative />
        {showTagline ? (
          <AppText
            accessible={false}
            importantForAccessibility="no"
            style={[
              styles.tagline,
              {
                color: taglineColor,
                fontFamily: serif,
                marginTop: layout === 'horizontal' ? spacing.xxs : spacing.sm,
              },
            ]}
          >
            Something to do right now.
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stacked: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  stackedCopy: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  horizontalCopy: {
    justifyContent: 'center',
  },
  tagline: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
