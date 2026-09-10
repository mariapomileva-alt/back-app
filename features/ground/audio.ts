import { productionConfig } from '@/config/production';
import { exerciseAudio } from '@/features/media/catalog';

/** Visible until professionally recorded grounding voice ships. */
export const GROUND_AUDIO_PLACEHOLDER_TODO =
  'TODO: REPLACE WITH PROFESSIONALLY RECORDED BACK GROUNDING AUDIO BEFORE RELEASE';

export const groundAudio = {
  source: exerciseAudio.groundingEnglish,
  ready: productionConfig.groundingAudioReady,
} as const;
