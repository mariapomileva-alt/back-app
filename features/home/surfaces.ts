import type { AppTheme } from '@/theme/themes';
import type { HomeToolId } from '@/types';

type Rgb = { r: number; g: number; b: number };

function parseColor(value: string | null | undefined): Rgb | null {
  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length !== 6) {
      return null;
    }
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }

  const match = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match?.[1] || !match[2] || !match[3]) {
    return null;
  }

  return {
    r: Number.parseInt(match[1], 10),
    g: Number.parseInt(match[2], 10),
    b: Number.parseInt(match[3], 10),
  };
}

function toHex({ r, g, b }: Rgb): string {
  const channel = (value: number) => Math.round(value).toString(16).padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function mix(base: string, tint: string | undefined, amount: number): string {
  const from = parseColor(base);
  const to = parseColor(tint);
  if (!from || !to) {
    return base;
  }

  return toHex({
    r: from.r + (to.r - from.r) * amount,
    g: from.g + (to.g - from.g) * amount,
    b: from.b + (to.b - from.b) * amount,
  });
}

const surfaceMix: Record<HomeToolId, { tint: keyof AppTheme['colors']; amount: number }> = {
  breathe: { tint: 'surface', amount: 0.08 },
  distract: { tint: 'organic', amount: 0.26 },
  ground: { tint: 'muted', amount: 0.24 },
  move: { tint: 'surfaceSecondary', amount: 0.16 },
  listen: { tint: 'cool', amount: 0.16 },
  read: { tint: 'clay', amount: 0.12 },
};

export function homeCardSurface(theme: AppTheme, id: HomeToolId): string {
  const mixGuide = surfaceMix[id];
  if (!mixGuide) {
    return theme.colors.surface;
  }
  return mix(theme.colors.surface, theme.colors[mixGuide.tint], mixGuide.amount);
}

export function homeCardBorder(theme: AppTheme): string {
  return mix(theme.colors.border, theme.colors.background, 0.45);
}
