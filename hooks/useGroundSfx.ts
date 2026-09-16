import { useCallback, useEffect, useMemo, useState } from 'react';

import { GROUND_STEP_SFX_VOLUME, groundSfx } from '@/features/ground/sfx';
import { useOneShotSound } from '@/hooks/useOneShotSound';
import { loadGroundSfxMuted, saveGroundSfxMuted } from '@/storage/preferences';

type Options = {
  /** Voice / settings master mute (same key as Listen and guided narration). */
  masterMuted?: boolean;
};

export function useGroundSfx({ masterMuted = false }: Options = {}) {
  const [groundMuted, setGroundMuted] = useState(false);
  const step = useOneShotSound({ source: groundSfx.step, volume: GROUND_STEP_SFX_VOLUME });

  useEffect(() => {
    let cancelled = false;
    void loadGroundSfxMuted().then((localMuted) => {
      if (!cancelled) {
        setGroundMuted(localMuted);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sfxMuted = useMemo(() => groundMuted || masterMuted, [groundMuted, masterMuted]);

  const playStep = useCallback(() => {
    void step.play(sfxMuted);
  }, [sfxMuted, step]);

  const toggleMute = useCallback(() => {
    setGroundMuted((current) => {
      const next = !current;
      void saveGroundSfxMuted(next);
      if (!next) {
        void step.unlock();
      }
      return next;
    });
  }, [step]);

  return {
    muted: groundMuted,
    sfxMuted,
    playStep,
    toggleMute,
  };
}
