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
          d="M140 86
             C128 82 118 84 112 92
             L108 118
             C106 132 118 142 140 144
             C162 142 174 132 172 118
             L168 92
             C162 84 152 82 140 86
             Z"
          fill={ink.wash}
          fillOpacity={fillOpacity * 0.75}
          stroke={ink.line}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M68 96
             C92 82 118 88 140 92
             C162 88 188 82 212 96"
          fill="none"
          stroke={ink.line}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M76 96 C84 88 92 86 100 88"
          fill={ink.wash}
          fillOpacity={fillOpacity}
          stroke={ink.line}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M204 96 C196 88 188 86 180 88"
          fill={ink.wash}
          fillOpacity={fillOpacity}
          stroke={ink.line}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {p.roll ? (
          <Path
            d="M176 78 C192 70 208 74 214 86 C218 94 214 102 204 106"
            fill="none"
            stroke={ink.wash}
            strokeWidth={MOVE_STROKE_FINE}
            strokeLinecap="round"
            opacity={0.58}
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
