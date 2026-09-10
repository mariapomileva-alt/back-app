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

function CatPaw({ fill, opacity }: { fill: string; opacity: number }) {
  return (
    <G fill={fill} opacity={opacity}>
      <Path d="M-7.2 2C-8.6 6.4-4.6 10.2 0 10.4C4.6 10.2 8.6 6.4 7.2 2C6-1.2 2.4 0 0 2.6C-2.4 0-6-1.2-7.2 2Z" />
      <Circle cx={-8.2} cy={-5} r={2.55} />
      <Circle cx={-2.8} cy={-8} r={2.75} />
      <Circle cx={2.8} cy={-8} r={2.75} />
      <Circle cx={8.2} cy={-5} r={2.55} />
    </G>
  );
}

export function MoveMark() {
  const { theme } = useTheme();
  const human = theme.colors.markSecondary;
  const paw = theme.colors.markPrimary;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <G transform="translate(36 50) rotate(-16)">
          <HumanFootprint fill={human} opacity={0.56} />
        </G>
        <G transform="translate(82 24) rotate(12) scale(1.12)">
          <CatPaw fill={paw} opacity={0.46} />
        </G>
      </Svg>
    </MarkFrame>
  );
}
