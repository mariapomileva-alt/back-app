import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox, strokeRegular } from './markLanguage';

/** Three short organic arcs — compression/release rhythm, denser than Listen. */
export function MoveMark() {
  const { theme } = useTheme();
  const primary = theme.colors.markPrimary;
  const sage = theme.colors.markSecondary;
  const sand = theme.colors.markSurface;

  const arcs = [
    {
      d: 'M20 44 C38 34 52 48 68 40 S92 32 102 40',
      stroke: primary,
      opacity: 0.78,
      width: strokeRegular,
    },
    {
      d: 'M16 54 C42 46 64 58 88 50 S108 44 112 50',
      stroke: sage,
      opacity: 0.5,
      width: 1.15,
    },
    {
      d: 'M26 32 C48 26 62 36 78 30 S94 26 98 32',
      stroke: sand,
      opacity: 0.62,
      width: 1.05,
    },
  ];

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        {arcs.map((arc) => (
          <Path
            key={arc.d}
            d={arc.d}
            fill="none"
            stroke={arc.stroke}
            strokeWidth={arc.width}
            strokeLinecap="round"
            opacity={arc.opacity}
          />
        ))}
      </Svg>
    </MarkFrame>
  );
}
