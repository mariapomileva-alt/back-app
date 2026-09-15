import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, MOVE_VIEWBOX, useMoveInk } from '@/components/move/moveInk';
import { useMoveLoop } from '@/components/move/useMoveLoop';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type HandsVariant = Extract<
  MoveIllustrationVariant,
  'tenseHands' | 'holdTenseHands' | 'releaseHands' | 'noticeHands'
>;

type Props = {
  variant: HandsVariant;
  reduceMotion: boolean;
};

function pose(variant: HandsVariant) {
  switch (variant) {
    case 'tenseHands':
      return { compact: 0.9, fillBoost: 0.06, open: 0 };
    case 'holdTenseHands':
      return { compact: 0.87, fillBoost: 0.1, open: 0 };
    case 'releaseHands':
      return { compact: 1, fillBoost: 0, open: 1 };
    case 'noticeHands':
      return { compact: 1.02, fillBoost: -0.02, open: 1 };
  }
}

function RelaxedHand({ fillOpacity }: { fillOpacity: number }) {
  const ink = useMoveInk();
  return (
    <>
      <Path
        d="M-8 22 C-14 6 -6 -16 10 -24 C22 -30 36 -26 46 -14 C54 -24 68 -22 74 -8 C80 2 78 18 70 30 C60 44 44 50 28 48 C14 46 2 54 -6 46 C-14 38 -10 30 -8 22 Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={MOVE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 -8 C16 6 20 20 16 34"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={0.22}
      />
    </>
  );
}

function CurledHand({ fillOpacity }: { fillOpacity: number }) {
  const ink = useMoveInk();
  return (
    <>
      <Path
        d="M-6 16 C-12 4 -6 -12 8 -16 C20 -20 32 -12 38 -2 C44 -12 56 -10 60 0 C64 8 60 20 50 28 C40 36 26 38 14 34 C4 30 -2 26 -6 16 Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={MOVE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 -2 C14 8 16 18 12 26"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={0.26}
      />
    </>
  );
}

export function HandsIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant);
  const loop = useMoveLoop(!reduceMotion && variant === 'holdTenseHands');
  const fillOpacity = Math.max(
    0.12,
    ink.washOpacity + p.fillBoost + (!reduceMotion && variant === 'holdTenseHands' ? loop * 0.05 : 0),
  );
  const open = p.open === 1;

  return (
    <Svg width="100%" height="100%" viewBox={MOVE_VIEWBOX} preserveAspectRatio="xMidYMid meet">
      <Ellipse cx="140" cy="172" rx="66" ry="10" fill={ink.surface} opacity={ink.groundOpacity * 0.65} />
      <G opacity={ink.lineOpacity}>
        <G transform={`translate(90 108) rotate(-12) scale(${p.compact})`}>
          {open ? <RelaxedHand fillOpacity={fillOpacity} /> : <CurledHand fillOpacity={fillOpacity} />}
        </G>
        <G transform={`translate(190 112) rotate(10) scale(${-p.compact} ${p.compact})`}>
          {open ? <RelaxedHand fillOpacity={fillOpacity} /> : <CurledHand fillOpacity={fillOpacity} />}
        </G>
      </G>
    </Svg>
  );
}
