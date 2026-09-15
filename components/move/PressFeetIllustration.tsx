import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, MOVE_VIEWBOX, useMoveInk } from '@/components/move/moveInk';
import { useMoveLoop } from '@/components/move/useMoveLoop';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type FeetVariant = Extract<
  MoveIllustrationVariant,
  'pressFeet' | 'holdFeet' | 'releaseFeet' | 'noticeFeet'
>;

type Props = {
  variant: FeetVariant;
  reduceMotion: boolean;
};

function pose(variant: FeetVariant) {
  switch (variant) {
    case 'pressFeet':
      return { drop: 5, shadow: 0.36, shadowRx: 26, shadowRy: 7.5, fillBoost: 0.05, ripple: 0 };
    case 'holdFeet':
      return { drop: 5, shadow: 0.42, shadowRx: 28, shadowRy: 8, fillBoost: 0.09, ripple: 0 };
    case 'releaseFeet':
      return { drop: 1, shadow: 0.18, shadowRx: 20, shadowRy: 6, fillBoost: 0, ripple: 0 };
    case 'noticeFeet':
      return { drop: 0, shadow: 0.15, shadowRx: 19, shadowRy: 5.5, fillBoost: -0.02, ripple: 1 };
  }
}

/** Top-down footprint: toes toward -Y, heel toward +Y — not upright ovals. */
function Foot({ flip, fillOpacity }: { flip: boolean; fillOpacity: number }) {
  const ink = useMoveInk();
  const scale = flip ? -1 : 1;
  return (
    <G transform={`scale(${scale} 1)`}>
      <Path
        d="M0 28
           C-7 28-15 23-18 14
           C-21 5-20-6-16-14
           C-12-22-4-26 5-26
           C14-26 21-20 23-11
           C25-2 22 8 16 16
           C11 22 5 28 0 28Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={MOVE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M-5 4 C-1 10 2 10 6 4"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={0.2}
      />
    </G>
  );
}

export function PressFeetIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant);
  const loop = useMoveLoop(!reduceMotion && (variant === 'holdFeet' || variant === 'noticeFeet'));
  const fillOpacity = Math.max(
    0.12,
    ink.washOpacity + p.fillBoost + (variant === 'holdFeet' && !reduceMotion ? loop * 0.06 : 0),
  );
  const rippleT = variant === 'noticeFeet' && !reduceMotion ? loop : variant === 'noticeFeet' ? 0.45 : 0;
  const rippleOpacity = p.ripple ? 0.1 + rippleT * 0.16 : 0;
  const rippleRx = 78 + rippleT * 10;

  return (
    <Svg width="100%" height="100%" viewBox={MOVE_VIEWBOX} preserveAspectRatio="xMidYMid meet">
      <Ellipse cx="140" cy="174" rx="108" ry="17" fill={ink.surface} opacity={ink.groundOpacity} />
      <Path
        d="M42 170 C94 159 186 159 238 170"
        fill="none"
        stroke={ink.ground}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={0.58}
      />
      {p.ripple ? (
        <Ellipse
          cx="140"
          cy="171"
          rx={rippleRx}
          ry={10 + rippleT * 2}
          fill="none"
          stroke={ink.wash}
          strokeWidth={MOVE_STROKE_FINE}
          opacity={rippleOpacity}
        />
      ) : null}

      <G opacity={ink.lineOpacity} transform={`translate(0 ${p.drop})`}>
        <G transform="translate(96 128) rotate(-10)">
          <Ellipse
            cx="0"
            cy="34"
            rx={p.shadowRx}
            ry={p.shadowRy}
            fill={ink.ground}
            opacity={p.shadow}
          />
          <Foot flip={false} fillOpacity={fillOpacity} />
        </G>
        <G transform="translate(184 128) rotate(10)">
          <Ellipse
            cx="0"
            cy="34"
            rx={p.shadowRx - 1}
            ry={p.shadowRy - 0.4}
            fill={ink.ground}
            opacity={p.shadow * 0.9}
          />
          <Foot flip fillOpacity={fillOpacity} />
        </G>
      </G>
    </Svg>
  );
}
