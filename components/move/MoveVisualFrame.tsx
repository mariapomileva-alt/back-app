import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { hideFromA11yTree } from '@/components/accessibility/hideFromA11y';

type Props = {
  children?: ReactNode;
};

/** Premium art stage — sits just above instruction copy. */
export function MoveVisualFrame({ children }: Props) {
  return (
    <View {...hideFromA11yTree()} style={[styles.frame, styles.noPointer]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    maxWidth: 340,
    minHeight: 180,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  noPointer: {
    pointerEvents: 'none',
  },
});
