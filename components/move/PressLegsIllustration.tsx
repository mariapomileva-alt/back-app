import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, MOVE_VIEWBOX, useMoveInk } from '@/components/move/moveInk';
import { useMoveLoop } from '@/components/move/useMoveLoop';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type LegsVariant = Extract<MoveIllustrationVariant, 'pressLegs' | 'holdLegs' | 'releaseLegs' | 'noticeLegs'>;

type Props = {
  variant: LegsVariant;
  reduceMotion: boolean;
};

function pose(variant: LegsVariant) {
  switch (variant) {
    case 'pressLegs':
      return { drop: 5, shadow: 0.32, fillBoost: 0.05 };
    case 'holdLegs':
      return { drop: 5, shadow: 0.38, fillBoost: 0.09 };
    case 'releaseLegs':
      return { drop: -2, shadow: 0.14, fillBoost: 0 };
    case 'noticeLegs':
      return { drop: 0, shadow: 0.12, fillBoost: -0.02 };
  }
}

function RestingHand({ flip, fillOpacity }: { flip: boolean; fillOpacity: number }) {
  const ink = useMoveInk();
  return (
    <G transform={flip ? 'scale(-1 1)' : undefined}>
      <Path
        d="M-10 12 C-14 -2 -4 -20 12 -24 C24 -28 38 -20 46 -8 C54 -14 66 -10 70 2 C74 14 68 26 54 32 C40 38 26 40 12 34 C0 28 -8 22 -10 12 Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={MOVE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 -8 C14 4 16 16 12 26"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={0.22}
      />
    </G>
  );
}

export function PressLegsIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant);
  const loop = useMoveLoop(!reduceMotion && variant === 'holdLegs');
  const fillOpacity = Math.max(
    0.12,
    ink.washOpacity + p.fillBoost + (!reduceMotion && variant === 'holdLegs' ? loop * 0.05 : 0),
  );

  return (
    <Svg width="100%" height="100%" viewBox={MOVE_VIEWBOX} preserveAspectRatio="xMidYMid meet">
      <Ellipse
        cx="96"
        cy="152"
        rx="54"
        ry="20"
        fill={ink.surface}
        stroke={ink.ground}
        strokeWidth={MOVE_STROKE_FINE}
        opacity={ink.groundOpacity + 0.12}
      />
      <Ellipse
        cx="184"
        cy="152"
        rx="54"
        ry="20"
        fill={ink.surface}
        stroke={ink.ground}
        strokeWidth={MOVE_STROKE_FINE}
        opacity={ink.groundOpacity + 0.12}
      />
      <Path
        d="M52 148 C84 138 108 140 132 148"
        fill="none"
        stroke={ink.ground}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={0.45}
      />
      <Path
        d="M148 148 C172 138 196 140 228 148"
        fill="none"
        stroke={ink.ground}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={0.45}
      />
      <G opacity={ink.lineOpacity} transform={`translate(0 ${p.drop})`}>
        <G transform="translate(88 112) rotate(-12)">
          <Ellipse cx="8" cy="28" rx="26" ry="7" fill={ink.ground} opacity={p.shadow} />
          <RestingHand flip={false} fillOpacity={fillOpacity} />
        </G>
        <G transform="translate(192 114) rotate(10)">
          <Ellipse cx="-8" cy="28" rx="24" ry="6.5" fill={ink.ground} opacity={p.shadow * 0.9} />
          <RestingHand flip fillOpacity={fillOpacity} />
        </G>
      </G>
    </Svg>
  );
}
