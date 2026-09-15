import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { hideFromA11yTree } from '@/components/accessibility/hideFromA11y';

type Props = {
  children: ReactNode;
};

export function MarkFrame({ children }: Props) {
  return (
    <View {...hideFromA11yTree()} style={[styles.frame, { pointerEvents: 'none' }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
