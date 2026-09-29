import { DistractActivityScreen } from '@/components/distract/DistractActivityScreen';
import { DistractSfxMuteButton } from '@/components/distract/DistractSfxMuteButton';
import { ShapesPlay } from '@/components/distract/ShapesPlay';
import { useDistractSfx } from '@/hooks/useDistractSfx';

export default function DistractShapesScreen() {
  const sfx = useDistractSfx();

  return (
    <DistractActivityScreen
      activity="shapes"
      scroll
      right={<DistractSfxMuteButton muted={sfx.muted} onPress={sfx.toggleMute} />}
    >
      <ShapesPlay onCorrectAdvance={sfx.playShapesCorrect} />
    </DistractActivityScreen>
  );
}
