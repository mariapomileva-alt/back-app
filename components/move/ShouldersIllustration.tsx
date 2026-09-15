import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, MOVE_VIEWBOX, useMoveInk } from '@/components/move/moveInk';
import { useMoveLoop } from '@/components/move/useMoveLoop';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type ShouldersVariant = Extract<
  MoveIllustrationVariant,
  'riseShoulders' | 'rollShoulders' | 'settleShoulders' | 'noticeShoulders'
>;

type Props = {
  variant: ShouldersVariant;
  reduceMotion: boolean;
};

function pose(variant: ShouldersVariant) {
  switch (variant) {
    case 'riseShoulders':
      return { lift: -10, fillBoost: 0.04, roll: 0 };
    case 'rollShoulders':
      return { lift: -7, fillBoost: 0.06, roll: 1 };
    case 'settleShoulders':
      return { lift: 2, fillBoost: 0, roll: 0 };
    case 'noticeShoulders':
      return { lift: 4, fillBoost: -0.02, roll: 0 };
  }
}

export function ShouldersIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant);
  const loop = useMoveLoop(!reduceMotion && variant === 'rollShoulders');
  const angle = p.roll && !reduceMotion ? (loop - 0.5) * 8 : 0;
  const fillOpacity = Math.max(0.12, ink.washOpacity + p.fillBoost);

  return (
    <Svg width="100%" height="100%" viewBox={MOVE_VIEWBOX} preserveAspectRatio="xMidYMid meet">
      <Ellipse cx="140" cy="178" rx="74" ry="11" fill={ink.surface} opacity={ink.groundOpacity * 0.7} />
      <G opacity={ink.lineOpacity} transform={`translate(0 ${p.lift}) rotate(${angle} 140 92)`}>
        <Path
          d="M134 58 C134 50 146 50 146 58 L146 78 L134 78 Z"
          fill={ink.wash}
          fillOpacity={fillOpacity}
          stroke={ink.line}
          strokeWidth={MOVE_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M52 96 C84 72 112 82 140 88 C168 82 196 72 228 96"
          fill="none"
          stroke={ink.line}
          strokeWidth={MOVE_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Ellipse cx="58" cy="96" rx="11" ry="8" fill={ink.wash} fillOpacity={fillOpacity} stroke={ink.line} strokeWidth={MOVE_STROKE} />
        <Ellipse cx="222" cy="96" rx="11" ry="8" fill={ink.wash} fillOpacity={fillOpacity} stroke={ink.line} strokeWidth={MOVE_STROKE} />
        <Path
          d="M78 104 C98 148 182 148 202 104"
          fill={ink.wash}
          fillOpacity={fillOpacity * 0.9}
          stroke={ink.line}
          strokeWidth={MOVE_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M92 114 C112 124 168 124 188 114"
          fill="none"
          stroke={ink.line}
          strokeWidth={MOVE_STROKE_FINE}
          strokeLinecap="round"
          opacity={0.24}
        />
      </G>
    </Svg>
  );
}
