import { type ReactNode } from 'react';
import Svg, { G, Path } from 'react-native-svg';

import { MOVE_STROKE_FINE, MOVE_VIEWBOX, useMoveInk } from '@/components/move/moveInk';

type RootProps = {
  children: ReactNode;
};

export function MoveSvgRoot({ children }: RootProps) {
  return (
    <Svg width="100%" height="100%" viewBox={MOVE_VIEWBOX} preserveAspectRatio="xMidYMid meet">
      {children}
    </Svg>
  );
}

/** Single horizontal floor — feet stay in contact, never floating. */
export function MoveFloorLine({ emphasis = 1 }: { emphasis?: number }) {
  const ink = useMoveInk();
  const width = MOVE_STROKE_FINE + (emphasis - 1) * 0.55;
  const opacity = Math.min(0.92, 0.52 + emphasis * 0.18);

  return (
    <Path
      d="M36 144 L244 144"
      fill="none"
      stroke={ink.ground}
      strokeWidth={width}
      strokeLinecap="round"
      opacity={opacity}
    />
  );
}

type CompressionProps = {
  x: number;
  soleY?: number;
  strength: number;
};

/** Soft sage + warm sand contact under a planted sole — press/hold only. */
export function MoveSoleCompression({ x, soleY = 143.5, strength }: CompressionProps) {
  const ink = useMoveInk();
  if (strength <= 0) {
    return null;
  }

  const spread = 20 + strength * 6;
  const depth = 2.5 + strength * 2.5;
  const washOpacity = 0.12 + strength * 0.22;
  const sandOpacity = ink.contactOpacity * (0.35 + strength * 0.45);

  return (
    <G>
      <Path
        d={`M${x - spread} ${soleY}
           Q${x} ${soleY + depth} ${x + spread} ${soleY}
           L${x + spread - 2} ${soleY + 0.6}
           Q${x} ${soleY + depth - 0.8} ${x - spread + 2} ${soleY + 0.6}
           Z`}
        fill={ink.wash}
        fillOpacity={washOpacity}
        stroke="none"
      />
      <Path
        d={`M${x - spread + 4} ${soleY + 0.4} L${x + spread - 4} ${soleY + 0.4}`}
        fill="none"
        stroke={ink.contact}
        strokeWidth={MOVE_STROKE_FINE * 0.85}
        strokeLinecap="round"
        opacity={sandOpacity}
      />
    </G>
  );
}
