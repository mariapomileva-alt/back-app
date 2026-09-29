import { SfxMuteButton } from '@/components/audio/SfxMuteButton';

type Props = {
  muted: boolean;
  onPress: () => void;
};

export function GroundSfxMuteButton({ muted, onPress }: Props) {
  return <SfxMuteButton muted={muted} onPress={onPress} />;
}
