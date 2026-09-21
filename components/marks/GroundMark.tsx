import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { groundMarkMotionProfile } from './groundMarkMotionProfile';
import { markViewBox, strokeRegular, strokeThin } from './markLanguage';
import {
  groundMarkRootOpacity,
  groundMarkSettleTranslateY,
  groundMarkSoilOpacity,
  useGroundMarkSettleMotion,
} from './useGroundMarkSettleMotion';

const AnimatedG = Animated.createAnimatedComponent(G);

const SPROUT_ORIGIN_X = 60;
const SPROUT_ORIGIN_Y = 58;
export function GroundMark() {
  const { theme } = useTheme();
  const motion = groundMarkMotionProfile(theme.name);
  const { progress, motionActive } = useGroundMarkSettleMotion();
  const earth = theme.colors.groundEarth;
  const root = theme.colors.groundRoot;
  const stem = theme.name === 'softBeige' ? theme.colors.cool : theme.colors.markDeep;
  const leaf = theme.colors.markPale;
  const leafFill = theme.name === 'softBeige' ? theme.colors.markLine : theme.colors.markSecondary;
  const horizon = theme.colors.markSecondary;
  const airy = theme.name === 'softBeige';

  const soilAnimatedProps = useAnimatedProps(() => ({
    opacity: groundMarkSoilOpacity(
      progress.value,
      motionActive.value,
      motion.soilBaseOpacity,
      motion.soilPeakBoost,
    ),
  }));

  const sproutAnimatedProps = useAnimatedProps(() => {
    const translateY = groundMarkSettleTranslateY(
      progress.value,
      motionActive.value,
      motion.settlePx,
    );
    return {
      transform: [
        { translateX: SPROUT_ORIGIN_X },
        { translateY: SPROUT_ORIGIN_Y + translateY },
        { translateX: -SPROUT_ORIGIN_X },
        { translateY: -SPROUT_ORIGIN_Y },
      ],
    };
  });

  const rootsAnimatedProps = useAnimatedProps(() => ({
    opacity: groundMarkRootOpacity(
      progress.value,
      motionActive.value,
      motion.rootRestOpacity,
      motion.rootPeakOpacity,
    ),
  }));

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Path
          d="M28 58.5 Q60 52 92 58.5 L92 62 Q60 56 28 62 Z"
          fill={earth}
          opacity={airy ? 0.96 : 0.88}
        />
        <AnimatedG animatedProps={soilAnimatedProps}>
          <Path
            d="M30 58 Q60 53.5 90 58"
            fill="none"
            stroke={horizon}
            strokeWidth={strokeRegular + 0.05}
            strokeLinecap="round"
          />
          <Path
            d="M34 59.5 Q60 57 86 59.5"
            fill="none"
            stroke={stem}
            strokeWidth={strokeThin}
            strokeLinecap="round"
            opacity={0.35}
          />
        </AnimatedG>
        <AnimatedG animatedProps={rootsAnimatedProps}>
          <Path
            d="M52 59 C48 64 46 68 44 70"
            fill="none"
            stroke={root}
            strokeWidth={strokeThin}
            strokeLinecap="round"
          />
          <Path
            d="M60 59.5 C60 65 59 69 58 71"
            fill="none"
            stroke={root}
            strokeWidth={strokeThin}
            strokeLinecap="round"
          />
          <Path
            d="M68 59 C72 64 74 68 76 70"
            fill="none"
            stroke={root}
            strokeWidth={strokeThin}
            strokeLinecap="round"
          />
        </AnimatedG>
        <AnimatedG animatedProps={sproutAnimatedProps}>
          <Path
            d="M60 58 L60 22"
            fill="none"
            stroke={stem}
            strokeWidth={strokeRegular + 0.12}
            strokeLinecap="round"
            opacity={airy ? 0.94 : 0.86}
          />
          <Path
            d="M60 24 C49 6 71 6 60 24 Z"
            fill={leafFill}
            fillOpacity={airy ? 0.58 : 0.16}
            stroke={stem}
            strokeWidth={strokeThin}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.92}
          />
          <Path
            d="M60 40 C43 36 36 20 55 30 C47 26 57 34 60 40 Z"
            fill={leafFill}
            fillOpacity={airy ? 0.5 : 0.14}
            stroke={stem}
            strokeWidth={strokeThin}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.86}
          />
          <Path
            d="M60 40 C77 36 84 20 65 30 C73 26 63 34 60 40 Z"
            fill={leafFill}
            fillOpacity={airy ? 0.5 : 0.14}
            stroke={stem}
            strokeWidth={strokeThin}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.86}
          />
          <Path
            d="M58 58 C56 54 62 54 60 58 Z"
            fill={leaf}
            fillOpacity={0.22}
            stroke="none"
          />
        </AnimatedG>
      </Svg>
    </MarkFrame>
  );
}
