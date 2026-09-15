import Svg, { G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox } from './markLanguage';

/** Top-down footprint silhouette — no separate toe circles. */
function HumanFootprint({ fill, opacity }: { fill: string; opacity: number }) {
  return (
    <G fill={fill} opacity={opacity}>
      <Path
        d="M0 14
           C-4 14-8 11-9.5 7
           C-11 3-10.5-3-8.5-7
           C-6.5-11-3-13 1-13
           C5-13 8.5-11 9.5-7
           C10.5-3 10 3 8.5 7
           C7 11 3.5 14 0 14Z"
      />
    </G>
  );
}

export function MoveMark() {
  const { theme } = useTheme();
  const planted = theme.colors.markSecondary;
  const stepping = theme.colors.markPrimary;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <G transform="translate(38 50) rotate(-16) scale(-1 1)">
          <HumanFootprint fill={planted} opacity={0.56} />
        </G>
        <G transform="translate(80 26) rotate(14)">
          <HumanFootprint fill={stepping} opacity={0.42} />
        </G>
      </Svg>
    </MarkFrame>
  );
}
