import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox, strokeRegular } from './markLanguage';

export function MoveMark() {
  const { theme } = useTheme();
  const stroke = theme.colors.markPrimary;
  const fill = theme.colors.markSecondary;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Path
          d="M76 20 C86 12 98 14 106 24"
          fill="none"
          stroke={stroke}
          strokeWidth={strokeRegular}
          strokeLinecap="round"
          opacity={0.44}
        />
        <Path
          d="M34 54
             C26 46 24 34 32 24
             C38 16 48 12 58 16
             L62 6
             C64 2 68 2 70 6
             L72 16
             C74 12 78 12 80 16
             L82 4
             C84 0 88 0 90 4
             L88 18
             C92 22 92 30 86 38
             C78 48 62 56 42 56
             C38 56 36 55 34 54
             Z"
          fill={fill}
          fillOpacity={0.52}
          stroke={stroke}
          strokeWidth={strokeRegular}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="rotate(-10 60 36)"
        />
      </Svg>
    </MarkFrame>
  );
}
