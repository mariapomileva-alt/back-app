import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox } from './markLanguage';

export function DistractMark() {
  const { theme } = useTheme();
  const sage = theme.colors.markSecondary;
  const forest = theme.colors.markPrimary;
  const pale = theme.colors.markMuted;
  const clay = theme.colors.markWarmAccent;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Circle cx="41" cy="39" r="16" fill={sage} opacity={0.44} />
        <Circle cx="71" cy="23" r="11" fill={pale} opacity={0.72} />
        <Circle cx="87" cy="45" r="9" fill={forest} opacity={0.42} />
        <Circle cx="59" cy="51" r="7" fill={clay} opacity={0.38} />
      </Svg>
    </MarkFrame>
  );
}
