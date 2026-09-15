import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { MOVE_STROKE, MOVE_STROKE_FINE, MOVE_VIEWBOX, useMoveInk } from '@/components/move/moveInk';
import type { MoveIllustrationVariant } from '@/features/move/visualMap';

type PalmsVariant = Extract<
  MoveIllustrationVariant,
  'pressPalms' | 'holdPalms' | 'releasePalms' | 'noticePalms'
>;

type Props = {
  variant: PalmsVariant;
  reduceMotion: boolean;
};

function pose(variant: PalmsVariant) {
  switch (variant) {
    case 'pressPalms':
      return { gap: 6, contact: 0.3, fillBoost: 0.04 };
    case 'holdPalms':
      return { gap: 1.5, contact: 0.44, fillBoost: 0.08 };
    case 'releasePalms':
      return { gap: 18, contact: 0.08, fillBoost: 0 };
    case 'noticePalms':
      return { gap: 24, contact: 0, fillBoost: -0.02 };
  }
}

function Hand({ flip, fillOpacity }: { flip: boolean; fillOpacity: number }) {
  const ink = useMoveInk();
  return (
    <G transform={flip ? 'scale(-1 1)' : undefined}>
      <Path
        d="M-8 28 C-14 12 -8 -8 8 -16 C18 -22 30 -18 38 -8 C46 -18 60 -20 70 -8 C78 -2 80 14 74 28 C68 42 54 52 38 54 C24 56 10 64 -2 58 C-12 52 -10 38 -8 28 Z"
        fill={ink.wash}
        fillOpacity={fillOpacity}
        stroke={ink.line}
        strokeWidth={MOVE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 -4 C24 10 28 26 26 40"
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
        opacity={0.22}
      />
    </G>
  );
}

export function PressPalmsIllustration({ variant, reduceMotion }: Props) {
  void reduceMotion;
  const ink = useMoveInk();
  const p = pose(variant);
  const fillOpacity = Math.max(0.12, ink.washOpacity + p.fillBoost);
  const shift = 54 + p.gap / 2;

  return (
    <Svg width="100%" height="100%" viewBox={MOVE_VIEWBOX} preserveAspectRatio="xMidYMid meet">
      <Ellipse cx="140" cy="170" rx="72" ry="11" fill={ink.surface} opacity={ink.groundOpacity * 0.7} />
      <G opacity={ink.lineOpacity}>
        {p.contact > 0 ? (
          <Ellipse cx="140" cy="108" rx="9" ry="20" fill={ink.wash} opacity={p.contact} />
        ) : null}
        <G transform={`translate(${140 - shift} 96)`}>
          <Hand flip={false} fillOpacity={fillOpacity} />
        </G>
        <G transform={`translate(${140 + shift} 100)`}>
          <Hand flip fillOpacity={fillOpacity} />
        </G>
      </G>
    </Svg>
  );
}
