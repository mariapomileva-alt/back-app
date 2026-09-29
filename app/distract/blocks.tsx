import { BlocksPlay } from '@/components/distract/BlocksPlay';
import { DistractActivityScreen } from '@/components/distract/DistractActivityScreen';
import { DistractSfxMuteButton } from '@/components/distract/DistractSfxMuteButton';
import { useDistractSfx } from '@/hooks/useDistractSfx';

export default function DistractBlocksScreen() {
  const sfx = useDistractSfx();

  return (
    <DistractActivityScreen
      activity="blocks"
      right={<DistractSfxMuteButton muted={sfx.muted} onPress={sfx.toggleMute} />}
    >
      <BlocksPlay onAreaClear={sfx.playBlocksClear} />
    </DistractActivityScreen>
  );
}
