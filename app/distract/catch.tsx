import { CatchPlay } from '@/components/distract/CatchPlay';
import { DistractActivityScreen } from '@/components/distract/DistractActivityScreen';
import { DistractSfxMuteButton } from '@/components/distract/DistractSfxMuteButton';
import { useDistractSfx } from '@/hooks/useDistractSfx';

export default function DistractCatchScreen() {
  const sfx = useDistractSfx();

  return (
    <DistractActivityScreen
      activity="catch"
      right={<DistractSfxMuteButton muted={sfx.muted} onPress={sfx.toggleMute} />}
    >
      <CatchPlay onCatchTap={sfx.playCatchTap} />
    </DistractActivityScreen>
  );
}
