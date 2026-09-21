# Back Premium Art Pack

Production-oriented visual assets for the Back mobile app.

## Structure

- `listen-art/premium-stills/` — transparent source artwork for Soft Rain, Ocean, Gentle Stream and Quiet Forest.
- `listen-art/premium-loops/` — animated WebP loops and Reduce Motion PNG fallbacks for all completed Listen scenes.
- `ground-art/premium-stills/` — seven transparent Ground illustrations.
- `ground-art/premium-loops/` — seven six-second Ground animated WebP loops.

## Integration rules

- Bundle all assets locally; do not load them from remote URLs.
- Render artwork with `contentFit="contain"` and preserve the complete 5:3 safe zone.
- Use animated WebP on active exercise screens.
- Use the corresponding static PNG when Reduce Motion is enabled.
- Hide decorative artwork from VoiceOver and TalkBack; the instruction text carries the meaning.
- Do not add extra bounce, entrance animation, glow, or color filters.
- Test memory usage and animation playback on representative iOS and Android devices before release.

## Status

These files are original AI-assisted art-direction assets created specifically for the Back project. Keep the existing project license manifest with the files and complete any required legal review before store release.
