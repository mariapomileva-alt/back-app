import { G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, useMoveInk } from '@/components/move/moveInk';
import { MoveSvgRoot } from '@/components/move/movePrimitives';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type ShouldersVariant = Extract<
  MoveIllustrationVariant,
  'riseShoulders' | 'rollShoulders' | 'settleShoulders' | 'noticeShoulders'
>;

type Props = {
  variant: ShouldersVariant;
  reduceMotion: boolean;
};

function pose(variant: ShouldersVariant, reduceMotion: boolean) {
  switch (variant) {
    case 'riseShoulders':
      return { lift: reduceMotion ? -4 : -8, fillBoost: 0.05, roll: 0, strokeBoost: 0 };
    case 'rollShoulders':
      return { lift: reduceMotion ? -3 : -6, fillBoost: 0.07, roll: 1, strokeBoost: reduceMotion ? 0.12 : 0 };
    case 'settleShoulders':
      return { lift: reduceMotion ? 1 : 3, fillBoost: 0, roll: 0, strokeBoost: 0 };
    case 'noticeShoulders':
      return { lift: 4, fillBoost: -0.02, roll: 0, strokeBoost: reduceMotion ? 0.1 : 0 };
  }
}

export function ShouldersIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant, reduceMotion);
  const fillOpacity = Math.max(0.14, ink.washOpacity + p.fillBoost);
  const strokeWidth = MOVE_STROKE + p.strokeBoost;

  return (
    <MoveSvgRoot>
      <Path
        d="M88 176 C112 166 168 166 192 176"
        fill="none"
        stroke={ink.ground}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={ink.groundOpacity * 0.5}
      />
      <G opacity={ink.lineOpacity} transform={`translate(0 ${p.lift})`}>
        <Path
          d="M140 72 L140 92"
          fill="none"
          stroke={ink.line}
          strokeWidth={strokeWidth * 0.7}
          strokeLinecap="round"
          opacity={0.35}
        />
        <Path
          d="M58 98
             C86 78 114 86 140 90
             C166 86 194 78 222 98"
          fill="none"
          stroke={ink.line}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M72 98 C78 88 84 84 92 84"
          fill={ink.wash}
          fillOpacity={fillOpacity}
          stroke={ink.line}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M208 98 C202 88 196 84 188 84"
          fill={ink.wash}
          fillOpacity={fillOpacity}
          stroke={ink.line}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M96 108 C112 138 168 138 184 108"
          fill={ink.wash}
          fillOpacity={fillOpacity * 0.85}
          stroke={ink.line}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {p.roll ? (
          <Path
            d="M168 76 C182 68 196 72 204 84 C210 92 206 102 196 106"
            fill="none"
            stroke={ink.wash}
            strokeWidth={MOVE_STROKE_FINE}
            strokeLinecap="round"
            opacity={0.55}
          />
        ) : null}
        {variant === 'noticeShoulders' ? (
          <Path
            d="M152 118 C160 124 168 124 176 118"
            fill="none"
            stroke={ink.wash}
            strokeWidth={MOVE_STROKE_FINE * 0.85}
            strokeLinecap="round"
            opacity={0.28}
          />
        ) : null}
      </G>
    </MoveSvgRoot>
  );
}
