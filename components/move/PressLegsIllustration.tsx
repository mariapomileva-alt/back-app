import { G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, useMoveInk } from '@/components/move/moveInk';
import { MoveFloorLine, MoveSoleCompression, MoveSvgRoot } from '@/components/move/movePrimitives';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type LegsVariant = Extract<MoveIllustrationVariant, 'pressLegs' | 'holdLegs' | 'releaseLegs' | 'noticeLegs'>;

type Props = {
  variant: LegsVariant;
  reduceMotion: boolean;
};

function pose(variant: LegsVariant, reduceMotion: boolean) {
  switch (variant) {
    case 'pressLegs':
      return { drop: reduceMotion ? 2 : 3, contact: 0.52, fillBoost: 0.05, motion: 1, strokeBoost: 0 };
    case 'holdLegs':
      return {
        drop: reduceMotion ? 2 : 3,
        contact: 0.76,
        fillBoost: 0.09,
        motion: 1,
        strokeBoost: reduceMotion ? 0.12 : 0,
      };
    case 'releaseLegs':
      return { drop: reduceMotion ? 0 : -2, contact: 0, fillBoost: 0, motion: 0, strokeBoost: 0 };
    case 'noticeLegs':
      return { drop: 0, contact: 0, fillBoost: -0.02, motion: 2, strokeBoost: reduceMotion ? 0.1 : 0 };
  }
}

function Thigh({ flip }: { flip: boolean }) {
  const ink = useMoveInk();
  const sx = flip ? -1 : 1;
  return (
    <G transform={`scale(${sx} 1)`}>
      <Path
        d="M0 0
           C16 6 26 24 28 46
           C30 64 22 78 10 86"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.55}
      />
    </G>
  );
}

function RestingHand({ flip, fillOpacity, strokeWidth }: { flip: boolean; fillOpacity: number; strokeWidth: number }) {
  const ink = useMoveInk();
  return (
    <G transform={flip ? 'scale(-1 1)' : undefined}>
      <Path
        d="M-10 10
           C-14 -4 -4 -18 12 -22
           C24 -26 38 -18 46 -6
           C54 -12 66 -8 70 4
           C74 16 66 28 52 34
           C38 40 22 40 10 34
           C0 28 -6 20 -10 10
           Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 -10 C12 2 14 14 10 26"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.85}
        strokeLinecap="round"
        opacity={0.22}
      />
    </G>
  );
}

export function PressLegsIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant, reduceMotion);
  const fillOpacity = Math.max(0.14, ink.washOpacity + p.fillBoost);
  const strokeWidth = MOVE_STROKE + p.strokeBoost;
  const leftCenter = 96;
  const rightCenter = 184;
  const floorY = 144;

  return (
    <MoveSvgRoot>
      <MoveFloorLine emphasis={p.contact > 0 ? 1.28 : 1} />
      <MoveSoleCompression x={leftCenter} soleY={floorY - p.drop} strength={p.contact} />
      <MoveSoleCompression x={rightCenter} soleY={floorY - p.drop} strength={p.contact * 0.92} />
      <G opacity={ink.lineOpacity * 0.9}>
        <G transform={`translate(${leftCenter} 78)`}>
          <Thigh flip={false} />
        </G>
        <G transform={`translate(${rightCenter} 78)`}>
          <Thigh flip />
        </G>
      </G>
      <G opacity={ink.lineOpacity} transform={`translate(0 ${p.drop})`}>
        <G transform={`translate(${leftCenter - 4} 118) rotate(-14)`}>
          <RestingHand flip={false} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />
        </G>
        <G transform={`translate(${rightCenter + 4} 120) rotate(12) scale(-1 1)`}>
          <RestingHand flip fillOpacity={fillOpacity} strokeWidth={strokeWidth} />
        </G>
      </G>
      {p.motion > 0 ? (
        <G opacity={0.16 + p.motion * 0.07}>
          <Path
            d={`M${leftCenter - 22} 132 C${leftCenter - 8} 126 ${leftCenter + 8} 126 ${leftCenter + 22} 132`}
            fill="none"
            stroke={ink.wash}
            strokeWidth={MOVE_STROKE_FINE}
            strokeLinecap="round"
          />
          {p.motion > 1 ? (
            <Path
              d={`M${leftCenter - 18} 140 C${leftCenter - 4} 146 ${leftCenter + 12} 146 ${leftCenter + 26} 140`}
              fill="none"
              stroke={ink.wash}
              strokeWidth={MOVE_STROKE_FINE * 0.9}
              strokeLinecap="round"
            />
          ) : null}
        </G>
      ) : null}
    </MoveSvgRoot>
  );
}
