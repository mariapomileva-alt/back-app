import Svg, { Ellipse } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox } from './markLanguage';

/** Soft tonal breathing mass — offset ellipses, no concentric bullseye. */
export function BreatheMark() {
  const { theme } = useTheme();
  const core = theme.colors.markPrimary;
  const mid = theme.colors.markSecondary;
  const outer = theme.colors.markMuted;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Ellipse cx="56" cy="38" rx="30" ry="26" fill={outer} opacity={0.24} />
        <Ellipse cx="63" cy="35" rx="22" ry="20" fill={mid} opacity={0.32} />
        <Ellipse cx="59" cy="33" rx="14" ry="13" fill={mid} opacity={0.48} />
        <Ellipse cx="61" cy="32" rx="8" ry="7.5" fill={core} opacity={0.72} />
      </Svg>
    </MarkFrame>
  );
}
