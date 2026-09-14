import Svg, { Rect, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';
import { serif } from '@/theme/fonts';

import { MarkFrame } from './MarkFrame';
import { markViewBox } from './markLanguage';

export function ReadMark() {
  const { theme } = useTheme();
  const letter = theme.colors.markWarmAccent;
  const rule = theme.colors.markPrimary;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <SvgText
          x="16"
          y="50"
          fontFamily={serif}
          fontSize="38"
          fontWeight="500"
          fill={letter}
          opacity={0.55}
        >
          Aa
        </SvgText>
        <Rect x="70" y="28" width="36" height="1.35" rx="0.7" fill={rule} opacity={0.22} />
        <Rect x="70" y="38" width="28" height="1.35" rx="0.7" fill={rule} opacity={0.16} />
        <Rect x="70" y="48" width="20" height="1.35" rx="0.7" fill={rule} opacity={0.12} />
      </Svg>
    </MarkFrame>
  );
}
