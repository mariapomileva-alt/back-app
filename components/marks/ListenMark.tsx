import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox } from './markLanguage';

export function ListenMark() {
  const { theme } = useTheme();
  const cool = theme.colors.markLine;
  const sage = theme.colors.markSecondary;

  const waves = [
    { d: 'M18 18 C36 12 52 24 70 18 S100 12 106 18', color: cool, opacity: 0.4, width: 1.05 },
    { d: 'M14 30 C38 22 56 38 78 30 S106 24 110 30', color: sage, opacity: 0.62, width: 1.35 },
    { d: 'M16 42 C40 36 58 48 80 42 S104 38 108 42', color: cool, opacity: 0.44, width: 1.15 },
    { d: 'M20 54 C40 50 58 60 76 54 S96 50 100 54', color: sage, opacity: 0.4, width: 1.1 },
  ];

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        {waves.map((wave) => (
          <Path
            key={wave.d}
            d={wave.d}
            fill="none"
            stroke={wave.color}
            strokeWidth={wave.width}
            strokeLinecap="round"
            opacity={wave.opacity}
          />
        ))}
      </Svg>
    </MarkFrame>
  );
}
