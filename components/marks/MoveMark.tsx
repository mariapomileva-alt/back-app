import Svg, { Circle, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox, strokeRegular } from './markLanguage';

/** Compact compression — two short organic arcs facing inward. */
export function MoveMark() {
  const { theme } = useTheme();
  const primary = theme.colors.markPrimary;
  const sage = theme.colors.markSecondary;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Path
          d="M34 22 C46 36 46 48 34 52"
          fill="none"
          stroke={primary}
          strokeWidth={strokeRegular + 0.15}
          strokeLinecap="round"
          opacity={0.82}
        />
        <Path
          d="M86 22 C74 36 74 48 86 52"
          fill="none"
          stroke={sage}
          strokeWidth={strokeRegular}
          strokeLinecap="round"
          opacity={0.62}
        />
        <Circle cx="60" cy="37" r="2.2" fill={primary} opacity={0.45} />
      </Svg>
    </MarkFrame>
  );
}
