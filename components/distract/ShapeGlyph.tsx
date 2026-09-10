import { View } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';

import type { ShapeKind } from '@/features/distract/shapes';

type Props = {
  shape: ShapeKind;
  color: string;
  size: number;
};

export function ShapeGlyph({ shape, color, size }: Props) {
  const box = {
    width: size,
    height: size,
    flexShrink: 0,
    overflow: 'visible' as const,
  };

  if (shape === 'circle') {
    return (
      <View
        accessible={false}
        style={[
          box,
          {
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    );
  }

  if (shape === 'square') {
    return (
      <View
        accessible={false}
        style={[
          box,
          {
            borderRadius: Math.max(6, size * 0.12),
            backgroundColor: color,
          },
        ]}
      />
    );
  }

  if (shape === 'triangle') {
    return (
      <View accessible={false} style={box}>
        <Svg width={size} height={size} viewBox="0 0 100 100" overflow="visible">
          <Polygon points="50,8 94,90 6,90" fill={color} />
        </Svg>
      </View>
    );
  }

  return (
    <View accessible={false} style={box}>
      <Svg width={size} height={size} viewBox="0 0 100 100" overflow="visible">
        <Path d="M12 88 A76 76 0 0 1 88 12 L88 88 Z" fill={color} />
      </Svg>
    </View>
  );
}
