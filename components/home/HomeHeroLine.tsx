import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import type { HomeFitLayout } from '@/features/home/homeFitLayout';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { mixHex } from '@/theme/colors';
import { serif } from '@/theme/fonts';

type Props = {
  salutation: string | null;
  layout: HomeFitLayout;
};

export function HomeHeroLine({ salutation, layout }: Props) {
  const { theme } = useTheme();
  const nameColor = mixHex(theme.colors.textSecondary, theme.colors.text, 0.62);

  if (!salutation) {
    return (
      <AppText
        variant="hero"
        maxFontSizeMultiplier={layout.maxFontSizeMultiplier}
        style={[
          styles.hero,
          {
            fontSize: layout.heroSingleFontSize,
            lineHeight: layout.heroSingleLineHeight,
          },
        ]}
        accessibilityRole="header"
      >
        {t('home.hero')}
      </AppText>
    );
  }

  const spoken = t('home.heroNamedA11y', { name: salutation });

  return (
    <View style={styles.namedWrap} accessibilityRole="header" accessibilityLabel={spoken}>
      <AppText
        maxFontSizeMultiplier={layout.maxFontSizeMultiplier}
        style={[
          styles.salutation,
          {
            fontSize: layout.heroNamedSalutationFontSize,
            lineHeight: layout.heroNamedSalutationLineHeight,
            color: nameColor,
          },
        ]}
      >
        {salutation},
      </AppText>
      <AppText
        variant="hero"
        maxFontSizeMultiplier={layout.maxFontSizeMultiplier}
        style={[
          styles.hero,
          {
            marginTop: layout.heroNamedHeadlineGap,
            fontSize: layout.heroSingleFontSize,
            lineHeight: layout.heroSingleLineHeight,
          },
        ]}
      >
        {t('home.heroNamedLine2')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    fontFamily: serif,
    fontWeight: '500',
    letterSpacing: -0.6,
  },
  namedWrap: {
    maxWidth: 320,
  },
  salutation: {
    fontFamily: serif,
    fontWeight: '500',
    letterSpacing: 0.06,
  },
});
