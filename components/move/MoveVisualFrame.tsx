import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { hideFromA11yTree } from '@/components/accessibility/hideFromA11y';

type Props = {
  children?: ReactNode;
};

export function MoveVisualFrame({ children }: Props) {
  return (
    <View {...hideFromA11yTree()} pointerEvents="none" style={styles.frame}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '78%',
    maxWidth: 300,
    height: 200,
    maxHeight: 240,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
