import { View } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';

import type { ShapeKind } from '@/features/distract/shapes';

type Props = {
  shape: ShapeKind;
  color: string;
  size: number;
};

export function ShapeGlyph({ shape, color, size }: Props) {
  if (shape === 'circle') {
    return (
      <View
        accessible={false}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    );
  }

  if (shape === 'square') {
    return (
      <View
        accessible={false}
        style={{
          width: size,
          height: size,
          borderRadius: Math.max(6, size * 0.12),
          backgroundColor: color,
        }}
      />
    );
  }

  if (shape === 'triangle') {
    return (
      <View accessible={false}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Polygon points="50,8 94,90 6,90" fill={color} />
        </Svg>
      </View>
    );
  }

  return (
    <View accessible={false}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M12 88 A76 76 0 0 1 88 12 L88 88 Z" fill={color} />
      </Svg>
    </View>
  );
}
