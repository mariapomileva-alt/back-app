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
      d="M36 172 L244 172"
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
  strength: number;
};

/** Short contact marks under a foot — press/hold only. */
export function MoveContactMarks({ x, strength }: CompressionProps) {
  const ink = useMoveInk();
  if (strength <= 0) {
    return null;
  }

  const opacity = 0.18 + strength * 0.32;
  return (
    <G opacity={opacity}>
      <Path
        d={`M${x - 14} 173.5 L${x + 14} 173.5`}
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE}
        strokeLinecap="round"
      />
      <Path
        d={`M${x - 9} 176 L${x + 9} 176`}
        fill="none"
        stroke={ink.line}
        strokeWidth={MOVE_STROKE_FINE * 0.9}
        strokeLinecap="round"
        opacity={0.75}
      />
    </G>
  );
}
