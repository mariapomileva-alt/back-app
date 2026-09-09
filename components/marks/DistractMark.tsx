import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox } from './markLanguage';

export function DistractMark() {
  const { theme } = useTheme();
  const sage = theme.colors.secondaryGreen;
  const forest = theme.colors.forest;
  const pale = theme.colors.muted;
  const clay = theme.colors.clay;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Circle cx="42" cy="40" r="16" fill={sage} opacity={0.42} />
        <Circle cx="70" cy="24" r="11" fill={pale} opacity={0.7} />
        <Circle cx="86" cy="46" r="9" fill={forest} opacity={0.38} />
        <Circle cx="60" cy="50" r="6.5" fill={clay} opacity={0.32} />
      </Svg>
    </MarkFrame>
  );
}
