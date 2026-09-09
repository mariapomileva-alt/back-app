import Svg, { G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox, strokeRegular } from './markLanguage';

const leftHand =
  'M22 56c-1.4-7.2 2.4-11.2 10-11.2h1V27.2c0-3.6 4.6-3.8 4.8.2V24c0-3.8 4.8-3.8 5 .4v-.6c0-4 5-3.8 5 .8v2c0-3.2 4.6-2.6 4.6 2.2V44.8h1.2c5.6.4 7.6 5.6 4.6 11-4 7.2-20 9-31.2 4.8C23.4 59.4 22.4 58 22 56Z';

const leftThumb = 'M32.5 45.2c-6-1.8-9.8-7-6.6-11.2 2.8-3.8 9.4-1 10.6 5.2';

export function MoveMark() {
  const { theme } = useTheme();
  const ink = theme.colors.secondaryGreen;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <G opacity={0.78} fill="none" stroke={ink} strokeWidth={strokeRegular} strokeLinejoin="round" strokeLinecap="round">
          <Path d={leftHand} />
          <Path d={leftThumb} />
        </G>
        <G
          opacity={0.78}
          fill="none"
          stroke={ink}
          strokeWidth={strokeRegular}
          strokeLinejoin="round"
          strokeLinecap="round"
          transform="matrix(-1 0 0 1 120 0)"
        >
          <Path d={leftHand} />
          <Path d={leftThumb} />
        </G>
      </Svg>
    </MarkFrame>
  );
}
