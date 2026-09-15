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
      return { drop: 5, shadow: 0.36, shadowRx: 23, fillBoost: 0.05, ripple: 0 };
    case 'holdFeet':
      return { drop: 5, shadow: 0.42, shadowRx: 25, fillBoost: 0.09, ripple: 0 };
    case 'releaseFeet':
      return { drop: 1, shadow: 0.18, shadowRx: 18, fillBoost: 0, ripple: 0 };
    case 'noticeFeet':
      return { drop: 0, shadow: 0.15, shadowRx: 17, fillBoost: -0.02, ripple: 1 };
  }
}

function Foot({ flip, fillOpacity }: { flip: boolean; fillOpacity: number }) {
  const ink = useMoveInk();
  const scale = flip ? -1 : 1;
  return (
    <G transform={`scale(${scale} 1)`}>
      <Path
        d="M1.5-41 C16-40 24.5-27 24-7 C23.6 12 16.5 31 7 42 C2.8 47-5.2 46-9 38.5 C-18.5 24-22 5-20-14 C-18.2-32.5-12-42 1.5-41 Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={MOVE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M-4.5-10 C-0.5 9 3.5 23 7.5 32"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={0.22}
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
        <G transform="translate(102 118) rotate(-9)">
          <Ellipse cx="0" cy="44" rx={p.shadowRx} ry="7.2" fill={ink.ground} opacity={p.shadow} />
          <Foot flip={false} fillOpacity={fillOpacity} />
        </G>
        <G transform="translate(178 122) rotate(12)">
          <Ellipse cx="0" cy="44" rx={p.shadowRx - 1} ry="6.8" fill={ink.ground} opacity={p.shadow * 0.9} />
          <Foot flip fillOpacity={fillOpacity} />
        </G>
      </G>
    </Svg>
  );
}
