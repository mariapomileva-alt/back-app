import type { ThemeName } from '@/theme/themes';

/** Per-theme motion readout — same cycle everywhere; contrast tuned so Warm/Forest read at card size. */
export type GroundMarkMotionProfile = {
  settlePx: number;
  soilBaseOpacity: number;
  soilPeakBoost: number;
  rootRestOpacity: number;
  rootPeakOpacity: number;
};

export function groundMarkMotionProfile(themeName: ThemeName): GroundMarkMotionProfile {
  if (themeName === 'softBeige') {
    return {
      settlePx: 1.75,
      soilBaseOpacity: 0.92,
      soilPeakBoost: 0.14,
      rootRestOpacity: 0.28,
      rootPeakOpacity: 0.42,
    };
  }
  if (themeName === 'deepGreen') {
    return {
      settlePx: 2.1,
      soilBaseOpacity: 0.78,
      soilPeakBoost: 0.22,
      rootRestOpacity: 0.34,
      rootPeakOpacity: 0.62,
    };
  }
  return {
    settlePx: 2.25,
    soilBaseOpacity: 0.8,
    soilPeakBoost: 0.2,
    rootRestOpacity: 0.36,
    rootPeakOpacity: 0.58,
  };
}
