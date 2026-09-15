import { type ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { hideFromA11yTree } from '@/components/accessibility/hideFromA11y';

type Props = {
  children?: ReactNode;
};

export function MoveVisualFrame({ children }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const frameHeight = Math.round(Math.min(280, Math.max(148, windowHeight * 0.38)));

  return (
    <View
      {...hideFromA11yTree()}
      pointerEvents="none"
      style={[styles.frame, { height: frameHeight, maxHeight: frameHeight }]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '82%',
    maxWidth: 320,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
