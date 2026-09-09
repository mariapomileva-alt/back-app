import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { maxFontSizeMultiplier, typography, type TypographyVariant } from '@/theme/typography';

type Tone = 'primary' | 'secondary' | 'inverse';

type Props = TextProps & {
  variant?: TypographyVariant;
  tone?: Tone;
};

export function AppText({
  variant = 'body',
  tone = 'primary',
  style,
  children,
  ...rest
}: Props) {
  const { theme } = useTheme();
  const color =
    tone === 'inverse'
      ? theme.colors.buttonText
      : tone === 'secondary'
        ? theme.colors.textSecondary
        : theme.colors.text;

  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[typography[variant], { color }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
