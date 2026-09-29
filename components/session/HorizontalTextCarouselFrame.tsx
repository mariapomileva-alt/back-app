import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/hooks/useTheme';
import { hexToRgba } from '@/theme/colors';

type Props = {
  children: ReactNode;
};

/** Edge fade so horizontal text pickers read as scrollable when labels extend past the screen. */
export function HorizontalTextCarouselFrame({ children }: Props) {
  const { theme } = useTheme();
  const fade = theme.colors.background;

  return (
    <View style={styles.wrap}>
      {children}
      <LinearGradient
        colors={[fade, hexToRgba(fade, 0)]}
        locations={[0, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.edgeLeft, styles.noPointer]}
      />
      <LinearGradient
        colors={[hexToRgba(fade, 0), fade]}
        locations={[0, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.edgeRight, styles.noPointer]}
      />
    </View>
  );
}

const EDGE_WIDTH = 22;

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    position: 'relative',
  },
  edgeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_WIDTH,
  },
  edgeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: EDGE_WIDTH,
  },
  noPointer: {
    pointerEvents: 'none',
  },
});
