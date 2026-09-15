import { G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, useMoveInk } from '@/components/move/moveInk';
import { MoveSvgRoot } from '@/components/move/movePrimitives';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type PalmsVariant = Extract<
  MoveIllustrationVariant,
  'pressPalms' | 'holdPalms' | 'releasePalms' | 'noticePalms'
>;

type Props = {
  variant: PalmsVariant;
  reduceMotion: boolean;
};

function pose(variant: PalmsVariant, reduceMotion: boolean) {
  switch (variant) {
    case 'pressPalms':
      return { inset: reduceMotion ? 2 : 4, contact: 0.5, fillBoost: 0.05, gap: 0 };
    case 'holdPalms':
      return { inset: reduceMotion ? 1 : 2, contact: 0.68, fillBoost: 0.09, gap: 0 };
    case 'releasePalms':
      return { inset: 12, contact: 0, fillBoost: 0, gap: 1 };
    case 'noticePalms':
      return { inset: 18, contact: 0, fillBoost: -0.02, gap: 1 };
  }
}

/** Side profile — wrist, palm, and grouped fingers meeting center. */
function PalmProfile({ flip, fillOpacity, strokeWidth }: { flip: boolean; fillOpacity: number; strokeWidth: number }) {
  const ink = useMoveInk();
  return (
    <G transform={flip ? 'scale(-1 1)' : undefined}>
      <Path
        d="M-4 48
           L-8 38
           C-10 32 -8 26 -2 24
           C4 22 10 26 12 32
           L14 28
           C16 22 22 20 26 24
           C28 26 28 30 26 34
           L28 18
           C30 12 36 10 40 14
           C42 18 40 22 36 24
           L34 8
           C36 2 42 0 46 4
           C48 8 46 12 42 14
           C34 20 22 26 14 32
           C6 38 0 44 -4 48
           Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 26 C8 30 10 36 8 42"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.75}
        strokeLinecap="round"
        opacity={0.24}
      />
    </G>
  );
}

export function PressPalmsIllustration({ variant, reduceMotion }: Props) {
  const ink = useMoveInk();
  const p = pose(variant, reduceMotion);
  const fillOpacity = Math.max(0.14, ink.washOpacity + p.fillBoost);
  const centerY = 106;
  const meetX = 140;

  return (
    <MoveSvgRoot>
      <Path
        d="M72 168 C112 158 168 158 208 168"
        fill="none"
        stroke={ink.ground}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={ink.groundOpacity * 0.55}
      />
      <G opacity={ink.lineOpacity}>
        {p.contact > 0 ? (
          <Path
            d={`M${meetX - 6} ${centerY - 2} L${meetX + 6} ${centerY + 2}`}
            fill="none"
            stroke={ink.contact}
            strokeWidth={MOVE_STROKE_FINE + p.contact * 0.4}
            strokeLinecap="round"
            opacity={ink.contactOpacity * p.contact}
          />
        ) : null}
        <G transform={`translate(${meetX - 46 - p.inset} ${centerY - 6})`}>
          <PalmProfile flip={false} fillOpacity={fillOpacity} strokeWidth={MOVE_STROKE} />
        </G>
        <G transform={`translate(${meetX + 46 + p.inset} ${centerY - 2})`}>
          <PalmProfile flip fillOpacity={fillOpacity} strokeWidth={MOVE_STROKE} />
        </G>
      </G>
      {p.gap ? (
        <G opacity={0.2}>
          <Path
            d="M126 118 C136 112 144 112 154 118"
            fill="none"
            stroke={ink.wash}
            strokeWidth={MOVE_STROKE_FINE * 0.9}
            strokeLinecap="round"
          />
        </G>
      ) : null}
    </MoveSvgRoot>
  );
}
