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
      return { inset: reduceMotion ? 3 : 6, contact: 0.45, fillBoost: 0.05, gap: 0 };
    case 'holdPalms':
      return { inset: reduceMotion ? 2 : 3, contact: 0.62, fillBoost: 0.09, gap: 0 };
    case 'releasePalms':
      return { inset: 14, contact: 0, fillBoost: 0, gap: 1 };
    case 'noticePalms':
      return { inset: 20, contact: 0, fillBoost: -0.02, gap: 1 };
  }
}

/** Side profile — palms meeting, not prayer pose. */
function PalmSide({ flip, fillOpacity }: { flip: boolean; fillOpacity: number }) {
  const ink = useMoveInk();
  return (
    <G transform={flip ? 'scale(-1 1)' : undefined}>
      <Path
        d="M-6 36
           C-14 28 -16 12 -10 0
           C-4 -10 8 -14 18 -10
           C26 -6 30 4 28 16
           C26 28 18 38 8 42
           C0 44 -4 42 -6 36
           Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={MOVE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 -6 C10 2 12 12 10 22"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.85}
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
  const centerY = 108;

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
            d={`M${140 - p.inset} ${centerY} L${140 + p.inset} ${centerY}`}
            fill="none"
            stroke={ink.line}
            strokeWidth={MOVE_STROKE_FINE + p.contact * 0.6}
            strokeLinecap="round"
            opacity={p.contact}
          />
        ) : null}
        <G transform={`translate(${140 - 52 - p.inset} ${centerY - 8})`}>
          <PalmSide flip={false} fillOpacity={fillOpacity} />
        </G>
        <G transform={`translate(${140 + 52 + p.inset} ${centerY - 4})`}>
          <PalmSide flip fillOpacity={fillOpacity} />
        </G>
      </G>
      {p.gap ? (
        <G opacity={0.22}>
          <Path
            d="M128 124 C136 118 144 118 152 124"
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
