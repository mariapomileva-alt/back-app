import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

export function OrganicShape() {
  const { theme } = useTheme();

  return (
    <View accessible={false} style={[styles.wrap, { pointerEvents: 'none' }]}>
      <View
        style={[
          styles.wave,
          {
            backgroundColor: theme.colors.organic,
          },
        ]}
      />
      <View style={styles.leaf}>
        <Svg width={64} height={48} viewBox="0 0 72 56">
          <Path
            d="M8 40c14-2 24-14 28-28 8 16 22 24 34 26"
            fill="none"
            stroke={theme.colors.secondaryGreen}
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.14}
          />
          <Path
            d="M36 14c-1 8-4 16-10 22"
            fill="none"
            stroke={theme.colors.secondaryGreen}
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.1}
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    right: '-18%',
    bottom: -86,
    width: '62%',
    height: 150,
    borderRadius: 999,
    opacity: 0.2,
  },
  leaf: {
    position: 'absolute',
    right: 32,
    bottom: 18,
  },
});
