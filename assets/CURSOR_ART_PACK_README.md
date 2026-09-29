# Back premium art — Cursor integration brief

This folder contains the approved final visual assets for the Back mobile app.

## Important

- Preserve the artwork exactly. Do not redraw, recolor, filter, blur or add shadows.
- Bundle every file locally. Do not upload assets or load them from remote URLs.
- Use animated WebP only on active experience screens.
- Use the matching static PNG when Reduce Motion is enabled.
- Hide decorative artwork from VoiceOver and TalkBack; the visible instruction carries the meaning.
- Use `contentFit="contain"`. Never use `cover` for these assets.
- Do not crop visible artwork.

## Folder structure

```text
assets/
  listen/
    stills/
    animations/
  ground/
    stills/
    animations/
  move/
    stills/
    animations/
```

## Listen mapping

Map the current sound IDs to these visual families:

```text
rain   -> soft-rain
ocean  -> ocean
stream -> gentle-stream
forest -> quiet-forest
birds  -> distant-birds
fan    -> steady-fan
brown  -> brown-noise
white  -> soft-white-noise
```

Use the `*-loop-strong.webp` file when one exists. For the other sounds, use `*-loop.webp`.

Target active-screen art size on a 390 dp phone:

```text
width: 340–360 dp
maxWidth: 420 dp
height: 220–280 dp
contentFit: contain
```

Calculate dimensions responsively. The visible artwork should occupy approximately 88–92% of the available width. Trim excessive transparent padding in runtime copies if necessary, but preserve the provided masters.

## Ground mapping

### Feet & Body sequence

```text
1 -> 01-feet-contact
2 -> 02-move-toes
3 -> 03-feel-weight
4 -> 04-feel-support
5 -> 05-notice-hands
6 -> 06-soften-shoulders
7 -> 07-stay-here
```

### Additional modes

```text
5–4–3–2–1           -> mode-5-4-3-2-1
Look Around          -> mode-look-around
Texture & Temperature -> mode-texture-temperature
```

Use a soft crossfade of approximately 350–500 ms when moving between Ground steps. Do not slide, bounce or zoom the complete scene during transitions.

## Reduce Motion

When system Reduce Motion or the Back override is active:

1. do not load or play animated WebP;
2. render the corresponding PNG;
3. use either no transition or a short opacity transition under 200 ms;
4. preserve exactly the same layout bounds to prevent visual jumping.

## Move mapping

```text
Press feet   -> 01-feet-press
Hold         -> 02-feet-hold
Release      -> 03-feet-release
Press palms  -> 04-palms-press
Shoulders    -> 05-shoulders-roll
Tense hands  -> 06-hands-tense
Relax hands  -> 07-hands-relax
Shake hands  -> 08-hands-shake
```

Crossfade between states over 350–500 ms. Do not stack an additional scale or spring animation over the animated WebP. When Reduce Motion is active, use the matching PNG and a transition under 200 ms.

## Themes

Use the same artwork in Warm Earth, Forest and Soft Sage. Do not recolor assets per theme. Only the surrounding screen background and controls should use theme tokens.

## Performance

- Preload only the current asset and, when appropriate, the next one.
- Do not mount every animation simultaneously in the sound selector.
- Sound-selector thumbnails should use static PNG files.
- Pause animation when the screen is inactive or the app enters the background.
- Test on representative iOS and Android devices.

## Acceptance criteria

- All eight Listen sounds display the correct visual.
- All four Ground modes display the correct visual.
- All seven Feet & Body steps change artwork correctly.
- All eight Move states display the correct visual.
- Artwork works completely offline.
- Reduce Motion uses static files.
- No visible asset is cropped or accidentally tiny because of transparent padding.
- No layout shifts when switching static/animated assets.
- TypeScript and lint pass.

Implement only asset integration and required responsive layout corrections. Do not redesign navigation, copy, audio behavior, subscriptions or other screens.
