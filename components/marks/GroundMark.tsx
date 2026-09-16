import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markIdleMix, markIdleRange, useMarkIdlePhase } from './markIdleMotion';
import { markViewBox, strokeRegular, strokeThin } from './markLanguage';

const AnimatedG = Animated.createAnimatedComponent(G);

const SPROUT_ORIGIN_X = 60;
const SPROUT_ORIGIN_Y = 58;

export function GroundMark() {
  const { theme } = useTheme();
  const { phase, motionActive } = useMarkIdlePhase('ground');
  const mound = theme.colors.markSurface;
  const sage = theme.colors.markSecondary;

  const sproutAnimatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return {
        opacity: 1,
        transform: [
          { translateX: SPROUT_ORIGIN_X },
          { translateY: SPROUT_ORIGIN_Y },
          { scale: 1 },
          { translateX: -SPROUT_ORIGIN_X },
          { translateY: -SPROUT_ORIGIN_Y },
        ],
      };
    }
    const mix = markIdleMix(phase.value, 0);
    const scale = markIdleRange(mix, 0.97, 1.05);
    return {
      opacity: 0.88 + mix * 0.12,
      transform: [
        { translateX: SPROUT_ORIGIN_X },
        { translateY: SPROUT_ORIGIN_Y },
        { scale },
        { translateX: -SPROUT_ORIGIN_X },
        { translateY: -SPROUT_ORIGIN_Y },
      ],
    };
  });

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Ellipse cx="60" cy="60" rx="26" ry="7" fill={mound} opacity={0.78} />
        <AnimatedG animatedProps={sproutAnimatedProps}>
          <Path
            d="M60 58 L60 24"
            fill="none"
            stroke={sage}
            strokeWidth={strokeRegular}
            strokeLinecap="round"
            opacity={0.8}
          />
          <Path
            d="M60 26 C50 8 70 8 60 26 Z"
            fill={sage}
            fillOpacity={0.14}
            stroke={sage}
            strokeWidth={strokeThin}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.9}
          />
          <Path
            d="M60 42 C44 38 38 22 56 32 C48 28 58 36 60 42 Z"
            fill={sage}
            fillOpacity={0.12}
            stroke={sage}
            strokeWidth={strokeThin}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.82}
          />
          <Path
            d="M60 42 C76 38 82 22 64 32 C72 28 62 36 60 42 Z"
            fill={sage}
            fillOpacity={0.12}
            stroke={sage}
            strokeWidth={strokeThin}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.82}
          />
        </AnimatedG>
      </Svg>
    </MarkFrame>
  );
}
