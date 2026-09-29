# Warm Earth (theme key: `warmNeutral`)

Default app theme — ivory ground, deep forest type, sage marks. **Source of truth in code:** `theme/colors.ts` (`brand`), `theme/themes.ts` (`warmNeutral`).

Visual mock (Home greeting): `previews/home-greeting-warm-earth.html`.

## Brand tokens (`brand`)

| Token | Hex | Role |
|-------|-----|------|
| `warmIvory` | `#F3EDE1` | App background, inverse text on dark buttons |
| `warmSurface` | `#F8F4EC` | Cards, elevated surfaces |
| `softSand` | `#E7DDCE` | Secondary panels, organic fill |
| `warmDivider` | `#D8CFC0` | Borders, dividers |
| `deepForest` | `#0C3B2E` | Primary actions, wordmark, icon on light |
| `forestGreen` | `#315E4D` | Forest accent, links, settings gear |
| `sage` | `#6D9773` | Secondary green, breathe orb mid |
| `paleSage` | `#D7E0D5` | Muted fills |
| `softSage` | `#17483A` | Soft Sage wordmark variant |
| `blueSage` | `#9EB6B0` | Cool accent (Listen card tint) |
| `camel` | `#BB8A52` | Clay / warm accent (~5%) |
| `mutedGold` | `#C9A65B` | Highlight |
| `primaryText` | `#153C32` | Body, hero serif |
| `secondaryText` | `#65736C` | Captions, secondary labels |
| `inverseText` | `#F3EDE1` | Text on deep forest buttons |

## Theme map (`warmNeutral`)

Same values as `themes.warmNeutral.colors` — background `#F3EDE1`, surface `#F8F4EC`, text `#153C32`, textSecondary `#65736C`, border `#D8CFC0`, buttonBackground `#0C3B2E`, buttonText `#F3EDE1`.

Landing `theme-color`: `#F3EDE1` (`landing/*.html`).

## Home

| Element | Color |
|---------|--------|
| Hero serif (line 2 / no name) | `text` `#153C32` |
| Salutation line | `mix(textSecondary, text, 0.62)` → ~`#3D534C` |
| Sub-prompt | `textSecondary` |
| Name prompt body | `mix(textSecondary, text, 0.32)` |
| Name prompt action | `forest` `#315E4D` |
| Tool card fill | `homeCardSurface()` per tool (`features/home/surfaces.ts`) |
| Tool card border | `mix(border, background, 0.45)` |

## Tool card surface mixes (warmNeutral)

| Tool | Mix |
|------|-----|
| Breathe | surface + 8% surface |
| Distract | surface + 26% organic |
| Ground | surface + 24% muted |
| Move | surface + 16% surfaceSecondary |
| Listen | surface + 16% cool |
| Read | surface + 12% clay |

## Breathe orb (`breathingStops.warmEarth`)

Gradient stops: sage ↔ forestGreen ↔ deepForest (see `theme/brandIdentity.ts`).

## Wordmark & shell

| Context | Hex |
|---------|-----|
| Wordmark on Warm Earth | `#0C3B2E` |
| Screen background | `#F3EDE1` |

## Siblings

- **Forest** — `deepGreen` (`theme/themes.ts`)
- **Airy Blue Sage** — `softBeige` (`theme/airy-blue-sage.md`)

Do not recolor bundled tool artwork per theme; only chrome and backgrounds use these tokens (`assets/CURSOR_ART_PACK_README.md`).
