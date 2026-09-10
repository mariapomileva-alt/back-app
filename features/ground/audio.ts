import { productionConfig } from '@/config/production';
import { exerciseAudio, productionAudioFiles } from '@/features/media/catalog';

/** Visible until professionally recorded grounding voice ships. */
export const GROUND_AUDIO_PLACEHOLDER_TODO =
  'TODO: REPLACE WITH PROFESSIONALLY RECORDED BACK GROUNDING AUDIO BEFORE RELEASE';

export const groundAudio = {
  source: exerciseAudio.groundingEnglish,
  /** Drop audio/grounding/english.wav (or .m4a), update catalog require(), then flip ready. */
  productionFile: productionAudioFiles.groundingEnglish,
  ready: productionConfig.groundingAudioReady,
} as const;
