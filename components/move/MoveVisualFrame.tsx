import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { hideFromA11yTree } from '@/components/accessibility/hideFromA11y';

type Props = {
  children?: ReactNode;
};

/** Compact kinetic stage — sits just above instruction copy. */
export function MoveVisualFrame({ children }: Props) {
  return (
    <View
      {...hideFromA11yTree()}
      pointerEvents="none"
      style={styles.frame}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '82%',
    maxWidth: 220,
    height: 132,
    maxHeight: 140,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    marginBottom: 4,
  },
});
