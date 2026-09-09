export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

export const touch = {
  min: 56,
  comfortable: 64,
} as const;

export type SpacingToken = keyof typeof spacing;
