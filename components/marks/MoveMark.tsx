import Svg, { G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox, strokeRegular } from './markLanguage';

/** Single open hand — three-quarter view, reads at card size. */
function GentleHand({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <G transform="translate(60 38) rotate(-8)">
      <Path
        d="M-18 14
           C-22 6 -18 -4 -10 -10
           C-4 -14 4 -14 10 -10
           C14 -8 16 -4 14 0
           L 18 -16
           C20 -22 26 -24 30 -18
           C32 -14 30 -10 26 -8
           L 32 -26
           C34 -32 40 -34 44 -28
           C46 -24 44 -20 40 -18
           L 38 -32
           C40 -38 46 -40 50 -34
           C52 -30 48 -26 44 -24
           C36 -18 22 -12 12 -6
           C2 0 -6 8 -10 14
           C-12 18 -14 18 -18 14
           Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeRegular}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M-4 -6 C2 0 8 2 14 -2"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeRegular * 0.75}
        strokeLinecap="round"
        opacity={0.3}
      />
    </G>
  );
}

export function MoveMark() {
  const { theme } = useTheme();
  const stroke = theme.colors.markPrimary;
  const fill = theme.colors.markSecondary;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Path
          d="M78 16 C88 10 98 12 104 20"
          fill="none"
          stroke={stroke}
          strokeWidth={strokeRegular * 0.95}
          strokeLinecap="round"
          opacity={0.42}
        />
        <GentleHand fill={fill} stroke={stroke} />
      </Svg>
    </MarkFrame>
  );
}
