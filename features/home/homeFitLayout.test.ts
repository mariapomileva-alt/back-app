import { describe, expect, it } from 'vitest';

import { computeHomeFitLayout } from './homeFitLayout';

describe('computeHomeFitLayout', () => {
  it('uses tight tier on short phones with name prompt', () => {
    const layout = computeHomeFitLayout({
      availableHeight: 620,
      fontScale: 1,
      showNamePrompt: true,
      namedHero: false,
    });
    expect(layout.cardDensity).toBe('compact');
    expect(layout.heroNamedSalutationFontSize).toBeLessThanOrEqual(16);
    expect(layout.heroSingleFontSize).toBeGreaterThan(layout.heroNamedSalutationFontSize);
  });

  it('allows standard cards on tall comfortable screens', () => {
    const layout = computeHomeFitLayout({
      availableHeight: 860,
      fontScale: 1,
      showNamePrompt: false,
      namedHero: false,
    });
    expect(layout.cardDensity).toBe('standard');
    expect(layout.heroSingleFontSize).toBe(40);
  });
});
