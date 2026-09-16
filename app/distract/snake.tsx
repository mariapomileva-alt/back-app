import { DistractActivityScreen } from '@/components/distract/DistractActivityScreen';
import { DistractSfxMuteButton } from '@/components/distract/DistractSfxMuteButton';
import { SnakePlay } from '@/components/distract/SnakePlay';
import { useDistractSfx } from '@/hooks/useDistractSfx';

export default function DistractSnakeScreen() {
  const sfx = useDistractSfx();

  return (
    <DistractActivityScreen
      activity="snake"
      right={<DistractSfxMuteButton muted={sfx.muted} onPress={sfx.toggleMute} />}
    >
      <SnakePlay onSnakeFood={sfx.playSnakeFood} />
    </DistractActivityScreen>
  );
}
