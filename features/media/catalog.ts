import type { ImageSourcePropType } from 'react-native';

/**
 * TODO: REPLACE WITH FINAL PRODUCTION ARTWORK
 * Bundled locally so Ground, Listen, and Move work offline.
 * Listen rain/ocean/forest are compressed local JPEGs. Other Listen sounds use graphics, not photos.
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
 * Production filenames a human can drop in (wav or m4a).
 * Metro needs static require() paths — after the files exist, change exerciseAudio
 * below to these names (keep the matching extension) and flip the flags in
 * config/production.ts. Do not flip flags while placeholder files are still bundled.
 */
export const productionAudioFiles = {
  groundingEnglish: 'audio/grounding/english.wav',
  softRain: 'audio/sounds/soft-rain.wav',
  ocean: 'audio/sounds/ocean.wav',
  gentleStream: 'audio/sounds/gentle-stream.wav',
  forest: 'audio/sounds/forest.wav',
  distantBirds: 'audio/sounds/distant-birds.wav',
  fan: 'audio/sounds/fan.wav',
  brownNoise: 'audio/sounds/brown-noise.wav',
  softWhiteNoise: 'audio/sounds/soft-white-noise.wav',
  softMelody: 'audio/sounds/soft-melody.wav',
} as const;

/**
 * PLACEHOLDER AUDIO — Listen loops are distinct synthetics from scripts/generate-listen-sounds.py
 * (not a production field recording mix). Ground uses its own placeholder generator.
 * All Listen + Ground audio is a local require() so the tools work offline.
 * TODO: REPLACE WITH PROFESSIONALLY RECORDED BACK GROUNDING AUDIO BEFORE RELEASE
 * TODO: replace looping environment sounds with professionally mixed audio before store release
 *
 * Drop-in map (placeholder file → productionAudioFiles name):
 *   audio/grounding/english-placeholder.wav       →  audio/grounding/english.wav
 *   audio/sounds/soft-rain-placeholder.wav        →  audio/sounds/soft-rain.wav
 *   audio/sounds/ocean-placeholder.wav            →  audio/sounds/ocean.wav
 *   audio/sounds/gentle-stream-placeholder.wav    →  audio/sounds/gentle-stream.wav
 *   audio/sounds/forest-placeholder.wav           →  audio/sounds/forest.wav
 *   audio/sounds/distant-birds-placeholder.wav    →  audio/sounds/distant-birds.wav
 *   audio/sounds/fan-placeholder.wav              →  audio/sounds/fan.wav
 *   audio/sounds/brown-noise-placeholder.wav      →  audio/sounds/brown-noise.wav
 *   audio/sounds/soft-white-noise-placeholder.wav →  audio/sounds/soft-white-noise.wav
 *   audio/sounds/soft-melody-placeholder.wav      →  audio/sounds/soft-melody.wav
 */
export const exerciseAudio = {
  groundingEnglish: require('../../audio/grounding/english-placeholder.wav'),
  softRain: require('../../audio/sounds/soft-rain.wav'),
  ocean: require('../../audio/sounds/ocean.wav'),
  gentleStream: require('../../audio/sounds/gentle-stream.wav'),
  forest: require('../../audio/sounds/forest.wav'),
  distantBirds: require('../../audio/sounds/distant-birds.wav'),
  fan: require('../../audio/sounds/fan.wav'),
  brownNoise: require('../../audio/sounds/brown-noise.wav'),
  softWhiteNoise: require('../../audio/sounds/soft-white-noise.wav'),
  softMelody: require('../../audio/sounds/soft-melody.wav'),
} as const;
