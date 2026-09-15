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
const SOLE_LOCAL_Y = 46;
const LEFT_X = 78;
const RIGHT_X = 206;

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

/** Socked foot in side profile — short calf, heel cup, thick sole, rounded toe. */
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
        d="M10 0
           L14 0
           L13 16
           C12 20 10 22 8 23
           L4 25
           C-1 27 -4 32 -3 38
           C-2 42 2 46 8 46
           L38 46
           C46 46 50 40 48 32
           C46 24 38 22 24 22
           L13 20
           L10 0
           Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M-3 38 C-1 42 2 44 8 44 L36 44"
        fill="none"
        stroke={ink.line}
        strokeWidth={strokeWidth * 0.42}
        strokeLinecap="round"
        opacity={0.22}
      />
      <Path
        d="M6 24 L14 24"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.72}
        strokeLinecap="round"
        opacity={0.34}
      />
      <Path
        d="M46 32 C48 36 46 40 42 42"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.65}
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
  const anchorY = FLOOR_Y - SOLE_LOCAL_Y;
  const leftSole = LEFT_X + 18;
  const rightSole = RIGHT_X - 18;

  return (
    <MoveSvgRoot>
      <MoveFloorLine emphasis={p.floor} />
      <MoveSoleCompression x={leftSole} soleY={FLOOR_Y - p.drop} strength={p.contact} />
      <MoveSoleCompression x={rightSole} soleY={FLOOR_Y - p.drop} strength={p.contact * 0.95} />
      <G opacity={ink.lineOpacity} transform={`translate(0 ${p.drop})`}>
        <G transform={`translate(${LEFT_X} ${anchorY}) rotate(-5)`}>
          <LegAndSockFoot flip={false} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />
        </G>
        <G transform={`translate(${RIGHT_X} ${anchorY}) rotate(5)`}>
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
