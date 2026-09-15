import { G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, useMoveInk } from '@/components/move/moveInk';
import { MoveFloorLine, MoveSoleCompression, MoveSvgRoot } from '@/components/move/movePrimitives';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type FeetVariant = Extract<
  MoveIllustrationVariant,
  'pressFeet' | 'holdFeet' | 'releaseFeet' | 'noticeFeet'
>;

type Props = {
  variant: FeetVariant;
  reduceMotion: boolean;
};

const FLOOR_Y = 172;
const LEG_ANCHOR_Y = 100;
const LEFT_X = 96;
const RIGHT_X = 188;

function pose(variant: FeetVariant, reduceMotion: boolean) {
  switch (variant) {
    case 'pressFeet':
      return {
        drop: reduceMotion ? 2 : 3,
        contact: 0.62,
        floor: 1.2,
        fillBoost: 0.06,
        strokeBoost: 0,
      };
    case 'holdFeet':
      return {
        drop: reduceMotion ? 2 : 3,
        contact: 0.78,
        floor: 1.32,
        fillBoost: 0.1,
        strokeBoost: reduceMotion ? 0.12 : 0,
      };
    case 'releaseFeet':
      return {
        drop: reduceMotion ? 0 : -2,
        contact: 0,
        floor: 1,
        fillBoost: 0,
        strokeBoost: 0,
      };
    case 'noticeFeet':
      return {
        drop: 0,
        contact: 0,
        floor: 1,
        fillBoost: -0.03,
        strokeBoost: reduceMotion ? 0.12 : 0,
      };
  }
}

/** Side-view shin, ankle, and socked foot — heel, sole, rounded toe. */
function LegAndSockFoot({
  flip,
  fillOpacity,
  strokeWidth,
}: {
  flip: boolean;
  fillOpacity: number;
  strokeWidth: number;
}) {
  const ink = useMoveInk();
  const sx = flip ? -1 : 1;

  return (
    <G transform={`scale(${sx} 1)`}>
      <Path
        d="M7 0
           L15 0
           L15 6
           L14 44
           C13 49 11 52 9 53
           L-1 56
           C-7 58 -9 64 -7 69
           L-7 71
           L33 71
           C42 71 47 65 45 58
           C43 52 36 50 26 50
           L11 48
           L7 0
           Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M-7 69 L33 71"
        fill="none"
        stroke={ink.line}
        strokeWidth={strokeWidth * 0.5}
        strokeLinecap="round"
        opacity={0.26}
      />
      <Path
        d="M9 10 L11 40"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.65}
        strokeLinecap="round"
        opacity={0.18}
      />
      <Path
        d="M6 44 L16 44"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.75}
        strokeLinecap="round"
        opacity={0.34}
      />
      <Path
        d="M42 58 C44 62 42 66 38 68"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.7}
        strokeLinecap="round"
        opacity={0.3}
      />
    </G>
  );
}

export function PressFeetIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant, reduceMotion);
  const fillOpacity = Math.max(0.14, ink.washOpacity + p.fillBoost);
  const strokeWidth = MOVE_STROKE + p.strokeBoost;

  return (
    <MoveSvgRoot>
      <MoveFloorLine emphasis={p.floor} />
      <MoveSoleCompression x={LEFT_X + 18} soleY={FLOOR_Y - p.drop} strength={p.contact} />
      <MoveSoleCompression x={RIGHT_X - 18} soleY={FLOOR_Y - p.drop} strength={p.contact * 0.95} />
      <G opacity={ink.lineOpacity} transform={`translate(0 ${p.drop})`}>
        <G transform={`translate(${LEFT_X} ${LEG_ANCHOR_Y})`}>
          <LegAndSockFoot flip={false} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />
        </G>
        <G transform={`translate(${RIGHT_X} ${LEG_ANCHOR_Y})`}>
          <LegAndSockFoot flip fillOpacity={fillOpacity} strokeWidth={strokeWidth} />
        </G>
      </G>
      {variant === 'noticeFeet' ? (
        <G opacity={0.22 + (reduceMotion ? 0.12 : 0.06)}>
          <Path
            d="M118 148 C138 142 162 142 182 148"
            fill="none"
            stroke={ink.wash}
            strokeWidth={MOVE_STROKE_FINE * 0.75}
            strokeLinecap="round"
          />
        </G>
      ) : null}
    </MoveSvgRoot>
  );
}
