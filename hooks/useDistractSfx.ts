import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  CATCH_TAP_SFX_VOLUME,
  DISTRACT_SFX_VOLUME,
  SHAPES_CORRECT_SFX_VOLUME,
  SNAKE_FOOD_SFX_VOLUME,
  distractSfx,
} from '@/features/distract/sfx';
import { useOneShotSound } from '@/hooks/useOneShotSound';
import {
  loadDistractSfxMuted,
  loadSoundMuted,
  saveDistractSfxMuted,
} from '@/storage/preferences';

export function useDistractSfx() {
  const [distractMuted, setDistractMuted] = useState(false);
  const [globalMuted, setGlobalMuted] = useState(false);
  const catchTap = useOneShotSound({ source: distractSfx.catchTap, volume: CATCH_TAP_SFX_VOLUME });
  const blocksClear = useOneShotSound({
    source: distractSfx.blocksClear,
    volume: DISTRACT_SFX_VOLUME,
  });
  const shapesCorrect = useOneShotSound({
    source: distractSfx.shapesCorrect,
    volume: SHAPES_CORRECT_SFX_VOLUME,
  });
  const snakeFood = useOneShotSound({
    source: distractSfx.snakeFood,
    volume: SNAKE_FOOD_SFX_VOLUME,
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

  const playShapesCorrect = useCallback(() => {
    void shapesCorrect.play(sfxMuted);
  }, [shapesCorrect, sfxMuted]);

  const playSnakeFood = useCallback(() => {
    void snakeFood.play(sfxMuted);
  }, [snakeFood, sfxMuted]);

  const toggleMute = useCallback(() => {
    setDistractMuted((current) => {
      const next = !current;
      void saveDistractSfxMuted(next);
      if (!next) {
        void catchTap.unlock();
        void blocksClear.unlock();
        void shapesCorrect.unlock();
        void snakeFood.unlock();
      }
      return next;
    });
  }, [blocksClear, catchTap, shapesCorrect, snakeFood]);

  return {
    /** Distract-only mute preference (header icon). */
    muted: distractMuted,
    /** True when distract or Voice and sound master mute blocks SFX. */
    sfxMuted,
    globalMuted,
    playCatchTap,
    playBlocksClear,
    playShapesCorrect,
    playSnakeFood,
    toggleMute,
  };
}
