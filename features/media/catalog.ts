import type { ImageSourcePropType } from 'react-native';

/**
 * TODO: REPLACE WITH FINAL PRODUCTION ARTWORK
 * Bundled locally so Ground, Listen, and Move work offline.
 * homeGround / homeMove are compressed Home-card JPEGs of groundFeet / moveHands.
 */
export const exerciseImages = {
  groundFeet: require('../../assets/images/ground-feet-placeholder.png') as ImageSourcePropType,
  listenOcean: require('../../assets/images/listen-ocean-placeholder.png') as ImageSourcePropType,
  listenRain: require('../../assets/images/listen-rain-placeholder.png') as ImageSourcePropType,
  listenForest: require('../../assets/images/listen-forest-placeholder.png') as ImageSourcePropType,
  listenFan: require('../../assets/images/listen-fan-placeholder.png') as ImageSourcePropType,
  listenBrown: require('../../assets/images/listen-brown-placeholder.png') as ImageSourcePropType,
  moveFeet: require('../../assets/images/move-feet-placeholder.png') as ImageSourcePropType,
  moveHands: require('../../assets/images/move-hands-placeholder.png') as ImageSourcePropType,
  homeGround: require('../../assets/images/home-ground-placeholder.jpg') as ImageSourcePropType,
  homeMove: require('../../assets/images/home-move-placeholder.jpg') as ImageSourcePropType,
} as const;

/**
 * TODO: replace placeholder with professionally recorded English grounding audio before store release
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
