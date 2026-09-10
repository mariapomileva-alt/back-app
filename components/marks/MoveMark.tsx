import Svg, { Circle, G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox } from './markLanguage';

function HumanFootprint({ fill, opacity }: { fill: string; opacity: number }) {
  return (
    <G fill={fill} opacity={opacity}>
      <Path d="M-4.4 15.6C-7.4 15.4-8.6 11.2-7.2 7C-5.4 1.2-4.2-6.2 0.2-10.4C3.6-14 11-14.2 13.2-9.8C15-6.2 13.2 1.4 10.6 7.4C9 12.4 6.4 16 1.2 16.2C-1.6 16.4-2.8 15.8-4.4 15.6Z" />
      <Circle cx={-4.8} cy={-13} r={1.85} />
      <Circle cx={-1.2} cy={-15.4} r={2.1} />
      <Circle cx={2.8} cy={-16.2} r={2.25} />
      <Circle cx={6.8} cy={-15} r={2.4} />
      <Circle cx={10.6} cy={-11.8} r={2.75} />
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
