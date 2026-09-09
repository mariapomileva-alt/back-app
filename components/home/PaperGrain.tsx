import { Image, StyleSheet, View } from 'react-native';

type Props = {
  opacity?: number;
};

export function PaperGrain({ opacity = 0.16 }: Props) {
  return (
    <View pointerEvents="none" style={styles.wrap} accessible={false}>
      <Image
        source={require('../../assets/images/paper-grain.png')}
        resizeMode="repeat"
        style={[styles.grain, { opacity }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
  },
  grain: {
    ...StyleSheet.absoluteFill,
  },
});
