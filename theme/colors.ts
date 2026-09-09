export const brand = {
  warmIvory: '#F3EDE1',
  warmSurface: '#F8F4EC',
  softSand: '#E7DDCE',
  warmDivider: '#D8CFC0',
  deepForest: '#0C3B2E',
  forestGreen: '#315E4D',
  sage: '#6D9773',
  paleSage: '#D7E0D5',
  blueSage: '#9EB6B0',
  camel: '#BB8A52',
  mutedGold: '#C9A65B',
  primaryText: '#153C32',
  secondaryText: '#65736C',
  inverseText: '#F3EDE1',
} as const;

export type BrandColor = (typeof brand)[keyof typeof brand];

export function hexToRgba(hex: string | null | undefined, alpha: number): string {
  const fallback = `rgba(243, 237, 225, ${alpha})`;
  if (typeof hex !== 'string') {
    return fallback;
  }
  const raw = hex.replace('#', '');
  if (raw.length !== 6) {
    return fallback;
  }
  const value = Number.parseInt(raw, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mixHex(base: string, tint: string, amount: number): string {
  const parse = (hex: string) => {
    const raw = hex.replace('#', '');
    if (raw.length !== 6) {
      return null;
    }
    const value = Number.parseInt(raw, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  };

  const from = parse(base);
  const to = parse(tint);
  if (!from || !to) {
    return base;
  }

  const channel = (start: number, end: number) =>
    Math.round(start + (end - start) * amount)
      .toString(16)
      .padStart(2, '0');

  return `#${channel(from.r, to.r)}${channel(from.g, to.g)}${channel(from.b, to.b)}`;
}
