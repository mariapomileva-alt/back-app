import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox } from './markLanguage';

export function BreatheMark() {
  const { theme } = useTheme();
  const core = theme.name === 'deepGreen' ? theme.colors.text : theme.colors.forest;
  const mid = theme.colors.secondaryGreen;
  const outer = theme.colors.muted;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Circle cx="60" cy="36" r="30" fill={outer} opacity={0.28} />
        <Circle cx="60" cy="36" r="22" fill={mid} opacity={0.28} />
        <Circle cx="60" cy="36" r="15" fill={mid} opacity={0.42} />
        <Circle cx="60" cy="36" r="8.5" fill={core} opacity={0.82} />
      </Svg>
    </MarkFrame>
  );
}
