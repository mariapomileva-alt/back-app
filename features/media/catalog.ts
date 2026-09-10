import type { ImageSourcePropType } from 'react-native';

/**
 * TODO: REPLACE WITH FINAL PRODUCTION ARTWORK
 * Bundled locally so Ground, Listen, and Move work offline.
 * Listen rain/ocean/forest are compressed local JPEGs. Fan and brown use graphics, not photos.
 * homeGround / homeMove are compressed Home-card JPEGs of groundFeet / moveHands.
 */
export const exerciseImages = {
  groundFeet: require('../../assets/images/ground-feet-placeholder.png') as ImageSourcePropType,
  listenOcean: require('../../assets/images/listen-ocean-placeholder.jpg') as ImageSourcePropType,
  listenRain: require('../../assets/images/listen-rain-placeholder.jpg') as ImageSourcePropType,
  listenForest: require('../../assets/images/listen-forest-placeholder.jpg') as ImageSourcePropType,
  moveFeet: require('../../assets/images/move-feet-placeholder.png') as ImageSourcePropType,
  moveHands: require('../../assets/images/move-hands-placeholder.png') as ImageSourcePropType,
  homeGround: require('../../assets/images/home-ground-placeholder.jpg') as ImageSourcePropType,
  homeMove: require('../../assets/images/home-move-placeholder.jpg') as ImageSourcePropType,
} as const;

/**
 * PLACEHOLDER AUDIO — every file is a generated `-placeholder` loop, not a production mix.
 * TODO: REPLACE WITH PROFESSIONALLY RECORDED BACK GROUNDING AUDIO BEFORE RELEASE
 * TODO: replace looping environment sounds with professionally mixed audio before store release
 */
export const exerciseAudio = {
  groundingEnglish: require('../../audio/grounding/english-placeholder.wav'),
  softRain: require('../../audio/sounds/soft-rain-placeholder.wav'),
  ocean: require('../../audio/sounds/ocean-placeholder.wav'),
  fan: require('../../audio/sounds/fan-placeholder.wav'),
  forest: require('../../audio/sounds/forest-placeholder.wav'),
  brownNoise: require('../../audio/sounds/brown-noise-placeholder.wav'),
} as const;
