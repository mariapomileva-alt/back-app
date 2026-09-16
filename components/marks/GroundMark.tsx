import Svg, { Ellipse, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox, strokeRegular } from './markLanguage';

/** Contact with surface — horizontal base, form meeting widened contact. */
export function GroundMark() {
  const { theme } = useTheme();
  const base = theme.colors.markSurface;
  const form = theme.colors.markSecondary;
  const contact = theme.colors.markPrimary;

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Path
          d="M14 59 H106"
          fill="none"
          stroke={base}
          strokeWidth={strokeRegular + 0.4}
          strokeLinecap="round"
          opacity={0.88}
        />
        <Ellipse cx="60" cy="57" rx="22" ry="6" fill={form} opacity={0.26} />
        <Path
          d="M56 54 Q54 54 54 48 L55 24 Q60 17 65 24 L66 48 Q66 54 64 54 Q60 58 56 54 Z"
          fill={form}
          fillOpacity={0.22}
          stroke={contact}
          strokeWidth={strokeRegular}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.9}
        />
      </Svg>
    </MarkFrame>
  );
}
