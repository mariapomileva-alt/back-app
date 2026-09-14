import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  BreatheMark,
  DistractMark,
  GroundMark,
  ListenMark,
  MoveMark,
  ReadMark,
} from '@/components/marks';
import { useTheme } from '@/hooks/useTheme';
import { hexToRgba } from '@/theme/colors';
import type { HomeToolId } from '@/types';

type Props = {
  id: HomeToolId;
};

export function HomeCardVisual({ id }: Props) {
  const { theme } = useTheme();
  let content: ReactNode;

  switch (id) {
    case 'breathe':
      content = <BreatheMark />;
      break;
    case 'distract':
      content = <DistractMark />;
      break;
    case 'ground':
      content = <GroundMark />;
      break;
    case 'move':
      content = <MoveMark />;
      break;
    case 'listen':
      content = <ListenMark />;
      break;
    case 'read':
      content = <ReadMark />;
      break;
  }

  return (
    <View
      style={[styles.wrap, { pointerEvents: 'none' }]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {content}
      <LinearGradient
        colors={[hexToRgba(theme.colors.surface, 0), theme.colors.surface]}
        locations={[0.88, 1]}
        style={styles.dissolve}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  dissolve: {
    ...StyleSheet.absoluteFill,
  },
});
