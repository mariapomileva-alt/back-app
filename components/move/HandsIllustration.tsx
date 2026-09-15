import { G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, useMoveInk } from '@/components/move/moveInk';
import { MoveSvgRoot } from '@/components/move/movePrimitives';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type HandsVariant = Extract<
  MoveIllustrationVariant,
  'tenseHands' | 'holdTenseHands' | 'releaseHands' | 'noticeHands'
>;

type Props = {
  variant: HandsVariant;
  reduceMotion: boolean;
};

function pose(variant: HandsVariant, reduceMotion: boolean) {
  switch (variant) {
    case 'tenseHands':
      return { tense: true, fillBoost: 0.06, motion: 0, strokeBoost: 0 };
    case 'holdTenseHands':
      return { tense: true, fillBoost: 0.1, motion: 0, strokeBoost: reduceMotion ? 0.14 : 0 };
    case 'releaseHands':
      return { tense: false, fillBoost: 0, motion: 1, strokeBoost: 0 };
    case 'noticeHands':
      return { tense: false, fillBoost: -0.02, motion: 2, strokeBoost: reduceMotion ? 0.1 : 0 };
  }
}

function RelaxedHand({ fillOpacity, strokeWidth }: { fillOpacity: number; strokeWidth: number }) {
  const ink = useMoveInk();
  return (
    <>
      <Path
        d="M-8 20
           C-14 4 -6 -14 10 -20
           C22 -24 34 -18 42 -8
           C50 -16 62 -14 68 -2
           C74 8 70 22 58 30
           C46 38 30 40 16 36
           C4 32 -4 28 -8 20
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
    </>
  );
}

function TenseHand({ fillOpacity, strokeWidth }: { fillOpacity: number; strokeWidth: number }) {
  const ink = useMoveInk();
  return (
    <>
      <Path
        d="M-6 14
           C-12 2 -6 -12 8 -16
           C18 -20 30 -12 36 -2
           C42 -10 54 -8 58 2
           C62 12 56 24 44 30
           C32 36 18 36 8 32
           C0 28 -4 22 -6 14
           Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 -2 C10 6 12 16 8 24"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.85}
        strokeLinecap="round"
        opacity={0.28}
      />
    </>
  );
}

function MotionLines({ level }: { level: number }) {
  const ink = useMoveInk();
  if (level <= 0) {
    return null;
  }

  return (
    <G opacity={0.18 + level * 0.08}>
      <Path d="M118 118 C128 112 152 112 162 118" fill="none" stroke={ink.wash} strokeWidth={MOVE_STROKE_FINE} strokeLinecap="round" />
      {level > 1 ? (
        <Path d="M118 126 C128 132 152 132 162 126" fill="none" stroke={ink.wash} strokeWidth={MOVE_STROKE_FINE * 0.9} strokeLinecap="round" />
      ) : null}
      {level > 1 ? (
        <Path d="M124 134 C136 128 148 128 156 134" fill="none" stroke={ink.wash} strokeWidth={MOVE_STROKE_FINE * 0.8} strokeLinecap="round" opacity={0.75} />
      ) : null}
    </G>
  );
}

export function HandsIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant, reduceMotion);
  const fillOpacity = Math.max(0.14, ink.washOpacity + p.fillBoost);
  const strokeWidth = MOVE_STROKE + p.strokeBoost;
  const Hand = p.tense ? TenseHand : RelaxedHand;

  return (
    <MoveSvgRoot>
      <Path
        d="M80 168 C112 158 168 158 200 168"
        fill="none"
        stroke={ink.ground}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={ink.groundOpacity * 0.5}
      />
      <G opacity={ink.lineOpacity}>
        <G transform="translate(88 108) rotate(-10)">
          <Hand fillOpacity={fillOpacity} strokeWidth={strokeWidth} />
        </G>
        <G transform="translate(192 112) rotate(8) scale(-1 1)">
          <Hand fillOpacity={fillOpacity} strokeWidth={strokeWidth} />
        </G>
      </G>
      <MotionLines level={p.motion} />
    </MoveSvgRoot>
  );
}
