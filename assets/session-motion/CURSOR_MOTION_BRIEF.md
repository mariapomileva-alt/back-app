# Session motion — Read, Listen, Distract (Cursor brief)

Use this when changing layout, motion, or art for these three tools. **Do not** add extra bounce, spring, or scale on top of bundled WebP loops (Listen). **Do not** recolor premium art assets.

---

## Listen

### Art source

- Runtime loops + stills: `assets/listen-art/runtime/` (`*-loop.webp`, `*-still.png`)
- Mapping: `features/listen/premiumVisuals.ts` → sound id → assets
- Master pack notes: `assets/CURSOR_ART_PACK_README.md`, `assets/listen/premium-loops/`

### Render rules

| Rule | Detail |
|------|--------|
| Fit | `contain` only (`ContainedArtImage`, `resizeMode="contain"`) |
| Reduce Motion | Show PNG still; never autoplay WebP |
| Extra motion | No second scale/bounce on the loop; optional subtle stage opacity breathe only (`useListenPremiumStageMotion`, scale stays 1) |
| A11y | Decorative art hidden from screen readers; title + status carry meaning |

### Layout (active screen)

- Title + status (playing / paused / tap to play) above art
- **Art band** grows with free space between title and transport (`flex: 1`, full width, min height from `listenArtMinHeightForScreen`)
- Transport: prev / play / next, then volume bar
- Sound picker: **footer text carousel** (Ground-style underline), not thumbnail chips — `ListenSoundPicker` in `ActiveSessionScreen` `extraActions`

### Sound → file (runtime)

```text
rain   → rain-loop.webp / rain-still.png
ocean  → ocean-loop.webp / ocean-still.png
stream → stream-loop.webp / stream-still.png
forest → forest-loop.webp / forest-still.png
birds  → birds-loop.webp / birds-still.png
fan    → fan-loop.webp / fan-still.png
brown  → brown-loop.webp / brown-still.png
white  → white-loop.webp / white-still.png
```

### Code entrypoints

- Screen: `app/listen.tsx`
- Visual: `components/listen/ListenSoundVisual.tsx`, `ListenPremiumVisual.tsx`
- Size helpers: `features/listen/artworkLayout.ts`
- Fallback SVG (no premium): `components/listen/ListenGraphic.tsx` — uses theme `cool` / sage sparingly

---

## Read

### No raster art pack

Read is **typography on canvas** — progressive reveal of text fragments, not WebP/PNG scenes.

### Motion behavior

| Element | Behavior |
|---------|----------|
| Reveal timing | `fragmentDelayMs()` in `features/read/reveal.ts` — per fragment kind and user speed (steady / faster settings) |
| Auto-advance | `ReadingCanvas` schedules `onReveal` until paused or end of session |
| On canvas | Up to ~8 visible lines; older lines fade/shift up; newest line fades in with slight rise (`ENTER_RISE_PX`) |
| Tap | Canvas press reveals next fragment immediately |
| Speed boost | Header ×2 halves delay (`speedBoost` in `ReadPlay`) |
| Reduce Motion | Shorter fades (`REDUCE_FADE_MS`), no vertical scroll animation between lines |

### Layout

- `ActiveSessionScreen`, `scroll={false}`
- Footer: I'm okay, Try another, Pause the lines
- No overlap between reading canvas and footer actions

### Code entrypoints

- Screen: `app/read.tsx`
- Play shell: `components/read/ReadPlay.tsx`
- Canvas: `components/read/ReadingCanvas.tsx`
- Engine: `features/read/attentionEngine.ts`, `features/read/bootstrapSession.ts`

---

## Distract

### No premium WebP pack

Each activity uses **in-app graphics + game logic** (SVG, blocks, grid). SFX optional via `useDistractSfx`.

### Activities

| Route | Component | Motion notes |
|-------|-----------|--------------|
| `/distract/shapes` | `ShapesPlay.tsx` | Shape glyphs; wrong tap fades option; correct advances deck |
| `/distract/blocks` | `BlocksPlay.tsx` | Drag tray → board; line clear animation; reduce motion respected in timings |
| `/distract/snake` | `SnakePlay.tsx` | Grid tick `TICK_MS` / `TICK_REDUCED_MS` when Reduce Motion |
| `/distract/catch` | `CatchPlay.tsx` | Target fade in/out; `Animated` opacity; reduced motion skips delay |

### Layout

- Shared shell: `DistractActivityScreen` / `ActiveSessionScreen`
- Paid gate: `app/distract/_layout.tsx` → `usePaidToolGate`
- Chooser: `app/distract/index.tsx` — remembers last activity

### Code entrypoints

- Shapes: `components/distract/ShapesPlay.tsx`
- Blocks: `components/distract/BlocksPlay.tsx`
- Snake: `components/distract/SnakePlay.tsx`
- Catch: `components/distract/CatchPlay.tsx`
- Marks/ambient SVG: `components/marks/DistractMark.tsx`, `components/distract/ShapeGlyph.tsx`

---

## Shared session chrome

All three use Phase 1 session foundation:

- `ActiveSessionScreen`, `useActiveSession`
- Back closes session; 20s+ may route to outcome flow
- Reduce Motion: `useReduceMotion()` from theme + system

---

## Related (not in this brief)

- **Ground / Move** premium loops: `assets/animations/README.md`, `assets/CURSOR_ART_PACK_README.md`
- **Themes**: third theme **Airy Blue Sage** (`softBeige` key) — `theme/themes.ts`
