import { SfxMuteButton } from '@/components/audio/SfxMuteButton';

type Props = {
  muted: boolean;
  onPress: () => void;
};

export function DistractSfxMuteButton({ muted, onPress }: Props) {
  return <SfxMuteButton muted={muted} onPress={onPress} />;
}
