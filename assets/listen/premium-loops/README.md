# Back Listen — premium motion set

Four transparent, seamless motion studies for the Listen experience.

| Sound | Animated asset | Reduce Motion fallback |
| --- | --- | --- |
| Distant Birds | `distant-birds-loop.webp` | `distant-birds-reduce-motion.png` |
| Steady Fan | `steady-fan-loop.webp` | `steady-fan-reduce-motion.png` |
| Brown Noise | `brown-noise-loop.webp` | `brown-noise-reduce-motion.png` |
| Soft White Noise | `soft-white-noise-loop.webp` | `soft-white-noise-reduce-motion.png` |

## Playback

- Canvas: 720 × 432 (5:3), RGBA transparency.
- Intended loop: 6 seconds, infinite, muted/no audio track.
- Do not stack an extra entrance animation on top of the loop.
- Render with `contentFit="contain"` and keep the full safe zone visible.
- When Reduce Motion is enabled, render the matching PNG instead.
- The sound loop and visual loop must remain independent; the visual must never imply audio synchronization.

## Status

These are art-direction-ready motion studies. Test on representative iOS and Android devices before release, especially memory use in the Listen sound selector.

## Expressive nature loops

The following variants use stronger, clearly visible motion while preserving a slow six-second rhythm:

- `soft-rain-loop-strong.webp`
- `ocean-loop-strong.webp`
- `gentle-stream-loop-strong.webp`
- `quiet-forest-loop-strong.webp`

Use these on the active Listen screen, not inside the compact sound selector. The matching `*-reduce-motion.png` file is mandatory when Reduce Motion is enabled.
