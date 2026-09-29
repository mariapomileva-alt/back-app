import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';
import { serif } from '@/theme/fonts';

import { MarkFrame } from './MarkFrame';
import {
  markIdleDriftRange,
  markIdleMix,
  markIdleOpacityRange,
  useMarkIdlePhase,
} from './markIdleMotion';
import { markViewBox } from './markLanguage';

const AnimatedG = Animated.createAnimatedComponent(G);

type RuleSpec = {
  y: number;
  width: number;
  baseOpacity: number;
  offset: number;
};

function FadeRule({
  y,
  width,
  baseOpacity,
  offset,
  color,
  phase,
  motionActive,
}: RuleSpec & {
  color: string;
  phase: ReturnType<typeof useMarkIdlePhase>['phase'];
  motionActive: ReturnType<typeof useMarkIdlePhase>['motionActive'];
}) {
  const animatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return { opacity: baseOpacity, transform: [{ translateX: 0 }, { translateY: 0 }] };
    }
    const mix = markIdleMix(phase.value, offset);
    return {
      opacity: markIdleOpacityRange(mix, baseOpacity - 0.06, baseOpacity + 0.1),
      transform: [
        { translateX: markIdleDriftRange(mix, -0.6, 0.6) },
        { translateY: markIdleDriftRange(markIdleMix(phase.value, offset + 0.2), -1.2, 1.2) },
      ],
    };
  });

  return (
    <AnimatedG animatedProps={animatedProps}>
      <Rect x="70" y={y} width={width} height="1.35" rx="0.7" fill={color} />
    </AnimatedG>
  );
}

export function ReadMark() {
  const { theme } = useTheme();
  const { phase, motionActive } = useMarkIdlePhase('read');
  const letter = theme.colors.markWarmAccent;
  const rule = theme.colors.markPrimary;

  const letterAnimatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return { opacity: 0.62, transform: [{ translateX: 0 }, { translateY: 0 }] };
    }
    const mix = markIdleMix(phase.value, 0);
    return {
      opacity: markIdleOpacityRange(mix, 0.52, 0.72),
      transform: [
        { translateX: markIdleDriftRange(mix, -1.4, 1.4) },
        { translateY: markIdleDriftRange(markIdleMix(phase.value, 0.25), -2.2, 2.2) },
      ],
    };
  });

  const rules: RuleSpec[] = [
    { y: 28, width: 36, baseOpacity: 0.32, offset: 0.15 },
    { y: 38, width: 28, baseOpacity: 0.24, offset: 0.32 },
    { y: 48, width: 20, baseOpacity: 0.18, offset: 0.48 },
  ];

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <AnimatedG animatedProps={letterAnimatedProps}>
          <SvgText
            x="16"
            y="50"
            fontFamily={serif}
            fontSize="38"
            fontWeight="500"
            fill={letter}
          >
            Aa
          </SvgText>
        </AnimatedG>
        {rules.map((line) => (
          <FadeRule
            key={line.y}
            {...line}
            color={rule}
            phase={phase}
            motionActive={motionActive}
          />
        ))}
      </Svg>
    </MarkFrame>
  );
}
