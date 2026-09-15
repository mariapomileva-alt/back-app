import Svg, { G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox, strokeRegular } from './markLanguage';

/** Minimal open palm — no fingers, reads at card size. */
function OpenPalm({ fill, stroke, mirror }: { fill: string; stroke: string; mirror?: boolean }) {
  const sx = mirror ? -1 : 1;
  return (
    <G transform={`scale(${sx} 1)`}>
      <Path
        d="M0 6
           C-10 6 -16 -2 -15 -10
           C-14 -16 -8 -20 0 -20
           C8 -20 14 -16 15 -10
           C16 -2 10 6 0 6
           Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeRegular}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M-8 -18 C-4 -14 4 -14 8 -18"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeRegular * 0.85}
        strokeLinecap="round"
        opacity={0.35}
      />
    </G>
  );
}

export function MoveMark() {
  const { theme } = useTheme();
  const stroke = theme.colors.markPrimary;
  const fillNear = theme.colors.markSecondary;
  const fillFar = theme.colors.markMuted;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <G transform="translate(34 38)">
          <OpenPalm fill={fillFar} stroke={stroke} mirror />
        </G>
        <G transform="translate(86 38)">
          <OpenPalm fill={fillNear} stroke={stroke} />
        </G>
        <Path
          d="M52 36 C58 36 62 36 68 36"
          fill="none"
          stroke={stroke}
          strokeWidth={strokeRegular * 0.9}
          strokeLinecap="round"
          opacity={0.28}
        />
      </Svg>
    </MarkFrame>
  );
}
