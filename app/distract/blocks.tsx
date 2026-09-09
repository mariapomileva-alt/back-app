import { BlocksPlay } from '@/components/distract/BlocksPlay';
import { DistractActivityScreen } from '@/components/distract/DistractActivityScreen';

export default function DistractBlocksScreen() {
  return (
    <DistractActivityScreen activity="blocks">
      <BlocksPlay />
    </DistractActivityScreen>
  );
}
