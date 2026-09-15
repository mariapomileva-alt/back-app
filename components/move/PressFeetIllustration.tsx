import { G, Path } from 'react-native-svg';

import { MOVE_STROKE, useMoveInk } from '@/components/move/moveInk';
import { MoveContactMarks, MoveFloorLine, MoveSvgRoot } from '@/components/move/movePrimitives';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type FeetVariant = Extract<
  MoveIllustrationVariant,
  'pressFeet' | 'holdFeet' | 'releaseFeet' | 'noticeFeet'
>;

type Props = {
  variant: FeetVariant;
  reduceMotion: boolean;
};

function pose(variant: FeetVariant, reduceMotion: boolean) {
  switch (variant) {
    case 'pressFeet':
      return {
        drop: reduceMotion ? 2 : 4,
        contact: 0.55,
        floor: 1.15,
        fillBoost: 0.06,
        strokeBoost: 0,
      };
    case 'holdFeet':
      return {
        drop: reduceMotion ? 2.5 : 5,
        contact: 0.85,
        floor: 1.35,
        fillBoost: 0.1,
        strokeBoost: reduceMotion ? 0.15 : 0,
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

/** Side-view lower leg + foot planted on the floor line. */
function LegAndFoot({ flip, fillOpacity, strokeWidth }: { flip: boolean; fillOpacity: number; strokeWidth: number }) {
  const ink = useMoveInk();
  const sx = flip ? -1 : 1;
  return (
    <G transform={`scale(${sx} 1)`}>
      <Path
        d="M0 0
           L0 58
           C0 64 4 68 10 68
           L34 68
           C42 68 48 72 48 78
           L48 82
           C48 88 42 92 34 92
           L6 92
           C-2 92 -8 88 -8 82
           L-8 78
           C-8 72 -2 68 6 68
           L0 68
           Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M0 18 L0 58"
        fill="none"
        stroke={ink.line}
        strokeWidth={strokeWidth * 0.65}
        strokeLinecap="round"
        opacity={0.22}
      />
    </G>
  );
}

export function PressFeetIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant, reduceMotion);
  const fillOpacity = Math.max(0.14, ink.washOpacity + p.fillBoost);
  const strokeWidth = MOVE_STROKE + p.strokeBoost;
  const leftFootX = 98;
  const rightFootX = 182;

  return (
    <MoveSvgRoot>
      <MoveFloorLine emphasis={p.floor} />
      <G opacity={ink.lineOpacity} transform={`translate(0 ${p.drop})`}>
        <G transform={`translate(${leftFootX} 80)`}>
          <LegAndFoot flip={false} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />
        </G>
        <G transform={`translate(${rightFootX} 80)`}>
          <LegAndFoot flip fillOpacity={fillOpacity} strokeWidth={strokeWidth} />
        </G>
      </G>
      <MoveContactMarks x={leftFootX} strength={p.contact} />
      <MoveContactMarks x={rightFootX} strength={p.contact * 0.95} />
      {variant === 'noticeFeet' ? (
        <G opacity={0.2 + (reduceMotion ? 0.14 : 0.08)}>
          <Path
            d="M118 148 C128 142 152 142 162 148"
            fill="none"
            stroke={ink.wash}
            strokeWidth={MOVE_STROKE * 0.75}
            strokeLinecap="round"
          />
          <Path
            d="M118 154 C128 160 152 160 162 154"
            fill="none"
            stroke={ink.wash}
            strokeWidth={MOVE_STROKE * 0.65}
            strokeLinecap="round"
          />
        </G>
      ) : null}
    </MoveSvgRoot>
  );
}
