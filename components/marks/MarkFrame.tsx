import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: ReactNode;
};

export function MarkFrame({ children }: Props) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      pointerEvents="none"
      style={styles.frame}
    >
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
