import { StyleSheet, View } from 'react-native';

import { ListenGraphic } from '@/components/listen/ListenGraphic';
import { AtmosphericImage } from '@/components/media/AtmosphericImage';
import type { ListenSound } from '@/features/listen/sounds';
import { t } from '@/locales/i18n';

type Props = {
  sound: ListenSound;
  height: number;
};

export function ListenSoundVisual({ sound, height }: Props) {
  if (sound.treatment === 'photo' && sound.image) {
    return (
      <AtmosphericImage
        source={sound.image}
        accessibilityLabel={t(sound.imageLabelKey)}
        height={height}
        treatment="photo"
      />
    );
  }

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={t(sound.imageLabelKey)}
      style={[styles.graphic, { height }]}
    >
      <ListenGraphic variant={sound.id === 'brown' ? 'brown' : 'fan'} />
    </View>
  );
}

const styles = StyleSheet.create({
  graphic: {
    width: '100%',
    alignSelf: 'center',
  },
});
