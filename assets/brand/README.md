# Back brand identity

Three separate assets. Do not combine them where a platform requires only one.

1. **Wordmark** — the name `Back`. Vector in-app (`BackWordmark`). Not the app icon.
2. **App icon** — ivory field + one breathing object. No text, no letter, no underline.
3. **Lockup** — object over the wordmark for splash/marketing/web. Not for the small icon.

Official marketing color: forest `#0C3B2E` on ivory `#F3EDE1` (Warm Earth). Forest (ivory on deep forest) and Soft Sage `#17483A` are variants.

## Font decision

Home sentences already use the **system serif** (Georgia on iOS, generic `serif` on Android). No licensed display face is bundled.

The official wordmark is **outlined from Georgia Regular** (macOS system font used as a drawing source). Those outlines ship as SVG/paths so Android, web, and marketing match. Live headings such as “You’re here.” still use the system serif.

**TODO:** If Android live headings must match iOS Georgia exactly, license and bundle a production serif. Do not swap in an unlicensed display face (including landing’s remote Fraunces) for the in-app wordmark.

Regenerate vectors/rasters:

```bash
python3 scripts/export-brand-assets.py
```

## Comparison board

Open locally (do not approve from 1024 alone — 40px is on the board):

```bash
open "assets/brand/comparison-board.html"
```

Or File → Open in a browser on `assets/brand/comparison-board.html`.
