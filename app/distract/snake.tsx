import { DistractActivityScreen } from '@/components/distract/DistractActivityScreen';
import { SnakePlay } from '@/components/distract/SnakePlay';

export default function DistractSnakeScreen() {
  return (
    <DistractActivityScreen activity="snake">
      <SnakePlay />
    </DistractActivityScreen>
  );
}
