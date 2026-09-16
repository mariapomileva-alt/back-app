import { useCallback, useEffect, useMemo, useState } from 'react';

import { DISTRACT_SFX_VOLUME, distractSfx } from '@/features/distract/sfx';
import { useOneShotSound } from '@/hooks/useOneShotSound';
import {
  loadDistractSfxMuted,
  loadSoundMuted,
  saveDistractSfxMuted,
} from '@/storage/preferences';

export function useDistractSfx() {
  const [distractMuted, setDistractMuted] = useState(false);
  const [globalMuted, setGlobalMuted] = useState(false);
  const catchTap = useOneShotSound({ source: distractSfx.catchTap, volume: DISTRACT_SFX_VOLUME });
  const blocksClear = useOneShotSound({
    source: distractSfx.blocksClear,
    volume: DISTRACT_SFX_VOLUME,
  });

  useEffect(() => {
    let cancelled = false;
    void Promise.all([loadDistractSfxMuted(), loadSoundMuted()]).then(([localMuted, masterMuted]) => {
      if (cancelled) {
        return;
      }
      setDistractMuted(localMuted);
      setGlobalMuted(masterMuted);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sfxMuted = useMemo(() => distractMuted || globalMuted, [distractMuted, globalMuted]);

  const playCatchTap = useCallback(() => {
    void catchTap.play(sfxMuted);
  }, [catchTap, sfxMuted]);

  const playBlocksClear = useCallback(() => {
    void blocksClear.play(sfxMuted);
  }, [blocksClear, sfxMuted]);

  const toggleMute = useCallback(() => {
    setDistractMuted((current) => {
      const next = !current;
      void saveDistractSfxMuted(next);
      if (!next) {
        void catchTap.unlock();
      }
      return next;
    });
  }, [catchTap]);

  return {
    /** Distract-only mute preference (header icon). */
    muted: distractMuted,
    /** True when distract or Voice and sound master mute blocks SFX. */
    sfxMuted,
    globalMuted,
    playCatchTap,
    playBlocksClear,
    toggleMute,
  };
}
