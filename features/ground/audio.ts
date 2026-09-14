import { productionConfig } from '@/config/production';
import { exerciseAudio, productionAudioFiles } from '@/features/media/catalog';

export const groundAudio = {
  source: exerciseAudio.groundingEnglish,
  /** Drop audio/grounding/english.wav (or .m4a), update catalog require(), then flip ready. */
  productionFile: productionAudioFiles.groundingEnglish,
  ready: productionConfig.groundingAudioReady,
} as const;
