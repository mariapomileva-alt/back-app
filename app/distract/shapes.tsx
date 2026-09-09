import { DistractActivityScreen } from '@/components/distract/DistractActivityScreen';
import { ShapesPlay } from '@/components/distract/ShapesPlay';

export default function DistractShapesScreen() {
  return (
    <DistractActivityScreen activity="shapes">
      <ShapesPlay />
    </DistractActivityScreen>
  );
}
