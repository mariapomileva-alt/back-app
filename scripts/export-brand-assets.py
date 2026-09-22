#!/usr/bin/env python3
"""Export Back's three-asset brand system: wordmark, app icon, lockup.

Reads identity hex from the same values as theme/colors.ts.
Does not upscale rasters. Master icon is 1024×1024 opaque RGB.
"""

from __future__ import annotations

import json
import math
import re
import shutil
from pathlib import Path

import numpy as np
from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "assets" / "brand"
PREVIEWS = BRAND / "previews"
IMAGES = ROOT / "assets" / "images"
STORE_ICON = ROOT / "store" / "ios" / "icon-1024.png"
APPROVED_ICON = ROOT / "assets" / "_brand" / "icon-master.png"
COMPONENTS = ROOT / "components" / "brand"
LANDING = ROOT / "landing"
GEORGIA = Path("/System/Library/Fonts/Supplemental/Georgia.ttf")

# Keep in sync with theme/colors.ts — identity tokens only.
IVORY = "#F3EDE1"
DEEP_FOREST = "#0C3B2E"
FOREST = "#315E4D"
SAGE = "#6D9773"
PALE_SAGE = "#D7E0D5"
INK = "#153C32"
SOFT_SAGE = "#17483A"
SECONDARY = "#65736C"

OBJECT_RATIO = 0.62
MASTER = 1024
# Georgia cap height of B in font units; used to optically settle k.
B_CAP = 1419.0
K_ASCENT = 1548.0
K_SCALE = B_CAP / K_ASCENT


def _round_path(d: str) -> str:
    def repl(match: re.Match[str]) -> str:
        value = round(float(match.group(0)), 2)
        if value == int(value):
            return str(int(value))
        return f"{value:.2f}"

    return re.sub(r"-?\d+\.\d+", repl, d)


def hex_rgb(hex_color: str) -> tuple[int, int, int]:
    raw = hex_color.removeprefix("#")
    return int(raw[0:2], 16), int(raw[2:4], 16), int(raw[4:6], 16)


def mix(a: str, b: str, t: float) -> str:
    ar, ag, ab = hex_rgb(a)
    br, bg, bb = hex_rgb(b)
    r = round(ar + (br - ar) * t)
    g = round(ag + (bg - ag) * t)
    bl = round(ab + (bb - ab) * t)
    return f"#{r:02X}{g:02X}{bl:02X}"


def mix_rgb(
    a: tuple[float, float, float], b: tuple[float, float, float], t: float
) -> tuple[float, float, float]:
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)


def extract_wordmark() -> dict:
    font = TTFont(str(GEORGIA))
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    extras = {("B", "a"): 52, ("a", "c"): 10, ("c", "k"): 48}
    chars = list("Back")
    x = 0.0
    placements: list[tuple[str, str, float, float]] = []
    for i, ch in enumerate(chars):
        gname = cmap[ord(ch)]
        width = float(glyph_set[gname].width)
        placements.append((ch, gname, x, width))
        x += width
        if i < len(chars) - 1:
            x += extras[(ch, chars[i + 1])]

    def glyph_transform(ch: str, px: float, dx: float, dy: float) -> Transform:
        y_scale = -K_SCALE if ch == "k" else -1.0
        return Transform(1, 0, 0, y_scale, px + dx, dy)

    minx, miny, maxx, maxy = 1e9, 1e9, -1e9, -1e9
    for ch, gname, px, _width in placements:
        bp = BoundsPen(glyph_set)
        glyph_set[gname].draw(TransformPen(bp, glyph_transform(ch, px, 0, 0)))
        b = bp.bounds
        minx, miny = min(minx, b[0]), min(miny, b[1])
        maxx, maxy = max(maxx, b[2]), max(maxy, b[3])

    # Extra left pad optically recenters the heavy B; modest right/top/bottom crop.
    left_pad, right_pad, top_pad, bot_pad = 88.0, 52.0, 28.0, 44.0
    vb_x = minx - left_pad
    vb_y = miny - top_pad
    vb_w = (maxx + right_pad) - vb_x
    vb_h = (maxy + bot_pad) - vb_y

    paths: dict[str, str] = {}
    for ch, gname, px, _width in placements:
        pen = SVGPathPen(glyph_set)
        glyph_set[gname].draw(
            TransformPen(pen, glyph_transform(ch, px, -vb_x, -vb_y))
        )
        paths[ch] = _round_path(pen.getCommands())

    return {
        "viewBox": f"0 0 {vb_w:.2f} {vb_h:.2f}",
        "width": vb_w,
        "height": vb_h,
        "paths": paths,
        "placements": placements,
    }


def wordmark_svg(fill: str, view: dict, bg: str | None = None) -> str:
    bg_rect = (
        f'  <rect width="100%" height="100%" fill="{bg}"/>\n' if bg else ""
    )
    paths = "\n".join(
        f'  <path fill="{fill}" d="{view["paths"][ch]}"/>' for ch in "Back"
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view["viewBox"]}" '
        f'role="img" aria-label="Back">\n{bg_rect}{paths}\n</svg>\n'
    )


def breathing_svg(cx: float, cy: float, r: float, on_dark: bool = False) -> str:
    gid = "breathForest" if on_dark else "breathWarm"
    if on_dark:
        stops = [
            (0, mix(SAGE, PALE_SAGE, 0.18)),
            (0.40, SAGE),
            (0.74, mix(SAGE, FOREST, 0.35)),
            (1, FOREST),
        ]
    else:
        stops = [
            (0, mix(SAGE, FOREST, 0.12)),
            (0.40, SAGE),
            (0.74, FOREST),
            (1, mix(DEEP_FOREST, FOREST, 0.22)),
        ]
    stop_xml = "\n".join(
        f'      <stop offset="{int(o * 100)}%" stop-color="{c}"/>' for o, c in stops
    )
    # Offset gradient = clay lighting, not a target.
    return f'''  <defs>
    <radialGradient id="{gid}" cx="38%" cy="34%" r="68%" fx="34%" fy="30%">
{stop_xml}
    </radialGradient>
  </defs>
  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="url(#{gid})"/>'''


def lockup_svg(
    view: dict,
    *,
    forest_bg: bool,
    tagline: bool,
    horizontal: bool,
) -> str:
    bg = DEEP_FOREST if forest_bg else IVORY
    type_color = IVORY if forest_bg else DEEP_FOREST
    tag_color = mix(IVORY, SAGE, 0.28) if forest_bg else SECONDARY
    if horizontal:
        width, height = 720.0, 220.0
        obj_r = 58.0
        obj_cx, obj_cy = 86.0, 110.0
        wm_w = 470.0
        wm_h = wm_w * view["height"] / view["width"]
        wm_x, wm_y = 168.0, (height - wm_h) / 2 - 4
        tag_xml = ""
    else:
        width, height = 520.0, 500.0 if tagline else 400.0
        obj_r = 68.0
        obj_cx, obj_cy = width / 2, 118.0
        wm_w = 280.0
        wm_h = wm_w * view["height"] / view["width"]
        wm_x = (width - wm_w) / 2
        wm_y = 210.0
        tag_xml = ""
        if tagline:
            tag_xml = (
                f'  <text x="{width/2:.1f}" y="372" text-anchor="middle" '
                f'font-family="Georgia, Times New Roman, serif" font-size="17" '
                f'font-weight="400" fill="{tag_color}">Something to do right now.</text>\n'
            )
    scale = wm_w / view["width"]
    paths = "\n".join(
        f'    <path fill="{type_color}" d="{view["paths"][ch]}"/>' for ch in "Back"
    )
    mark = breathing_svg(obj_cx, obj_cy, obj_r, on_dark=forest_bg)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} {height:.0f}" '
        f'role="img" aria-label="Back">\n'
        f'  <rect width="100%" height="100%" fill="{bg}"/>\n'
        f"{mark}\n"
        f'  <g transform="translate({wm_x:.2f} {wm_y:.2f}) scale({scale:.6f})">\n'
        f"{paths}\n"
        f"  </g>\n"
        f"{tag_xml}"
        f"</svg>\n"
    )


def write_wordmark_ts(view: dict) -> None:
    paths_lit = ",\n".join(
        f"  {ch}: '{view['paths'][ch]}'" for ch in "Back"
    )
    (COMPONENTS / "wordmarkPaths.ts").write_text(
        f"""export const wordmarkViewBox = '{view["viewBox"]}';\n\n"""
        f"""export const wordmarkWidth = {view["width"]:.4f};\n"""
        f"""export const wordmarkHeight = {view["height"]:.4f};\n\n"""
        f"""export const wordmarkPaths = {{\n{paths_lit},\n}} as const;\n"""
    )


def raster_wordmark(
    view: dict,
    *,
    fill: str,
    bg: str | None,
    height: int,
    padding: int = 0,
) -> Image.Image:
    aspect = view["width"] / view["height"]
    width = max(1, round(height * aspect))
    canvas_w = width + padding * 2
    canvas_h = height + padding * 2
    if bg:
        img = Image.new("RGB", (canvas_w, canvas_h), hex_rgb(bg))
    else:
        img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    # Render from Georgia with the same optical advances so PNG matches the SVG.
    font_px = height * (B_CAP / view["height"])
    font = ImageFont.truetype(str(GEORGIA), size=font_px)
    draw = ImageDraw.Draw(img)
    scale = font_px / 2048.0
    # Baseline in the raster: map font baseline through the viewBox.
    # After Y flip, baseline sits near the bottom of the viewBox minus bot pad.
    baseline = padding + height * ((-view["height"] * 0.0 + (view["height"] - 44.0)) / view["height"])
    # Use placements: x in font units relative to first glyph origin.
    vb_parts = view["viewBox"].split()
    vb_w = float(vb_parts[2])
    origin_shift = 88.0  # left_pad used in extract
    # First glyph font x=0; viewBox starts at minx-left_pad.
    # Simpler: draw SVG-equivalent by using font and our extras directly,
    # then center into the padded canvas.
    tmp = Image.new("RGBA", (width + 8, height + 8), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tmp)
    x = 4.0
    y = 4.0 + font_px * 0.12
    extras = {("B", "a"): 52, ("a", "c"): 10, ("c", "k"): 48}
    word = "Back"
    fill_rgba = hex_rgb(fill) + ((255,) if img.mode == "RGBA" else ())
    for i, ch in enumerate(word):
        tdraw.text((x, y), ch, font=font, fill=fill_rgba if img.mode == "RGBA" else hex_rgb(fill))
        advance = font.getlength(ch)
        x += advance
        if i < 3:
            x += extras[(ch, word[i + 1])] * scale
    bbox = tmp.getbbox()
    if bbox:
        cropped = tmp.crop(bbox)
        # Optical center: place slightly right to counter the B.
        ox = padding + (width - cropped.width) // 2 + 1
        oy = padding + (height - cropped.height) // 2
        if img.mode == "RGB":
            img.paste(cropped, (ox, oy), cropped)
        else:
            img.alpha_composite(cropped, (ox, oy))
    return img


def hash_noise(x: np.ndarray, y: np.ndarray) -> np.ndarray:
    n = np.sin(x * 127.1 + y * 311.7) * 43758.5453
    return n - np.floor(n)


def render_breathing_object(
    size: int,
    diameter_ratio: float = OBJECT_RATIO,
    *,
    transparent: bool = False,
) -> Image.Image:
    """Matte clay disc: one material, offset lighting, no rings, exact ivory."""
    ivory = np.array(hex_rgb(IVORY), dtype=np.float32)
    deep = np.array(hex_rgb(DEEP_FOREST), dtype=np.float32)
    forest = np.array(hex_rgb(FOREST), dtype=np.float32)
    sage = np.array(hex_rgb(SAGE), dtype=np.float32)

    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    cx = (size - 1) / 2.0
    cy = (size - 1) / 2.0 - size * 0.004
    radius = size * diameter_ratio / 2.0
    nx = (xx - cx) / radius
    ny = (yy - cy) / radius
    rho2 = nx * nx + ny * ny
    inside = rho2 <= 1.05
    nz = np.zeros_like(rho2)
    nz[inside] = np.sqrt(np.clip(1.0 - np.minimum(rho2[inside], 1.0), 0.0, 1.0))

    # Upper-left light, high wrap — ceramic, not plastic or a centered glow.
    lx, ly, lz = -0.34, -0.46, 0.82
    inv = 1.0 / math.sqrt(lx * lx + ly * ly + lz * lz)
    lx, ly, lz = lx * inv, ly * inv, lz * inv
    ndotl = np.clip(nx * lx + ny * ly + nz * lz, 0.0, 1.0)
    wrap = ndotl * 0.50 + 0.50

    # One albedo: lit face leans sage, body forest, terminator deep — no pale core.
    sage_amt = np.clip((wrap - 0.48) / 0.52, 0.0, 1.0)
    forest_amt = 1.0 - sage_amt
    albedo = forest[None, None, :] * forest_amt[:, :, None] + sage[None, None, :] * (
        sage_amt[:, :, None] * 0.88
    )
    albedo = albedo + forest[None, None, :] * (sage_amt * 0.12)[:, :, None]
    rim = np.power(np.clip(1.0 - nz, 0.0, 1.0), 2.1) * 0.22
    albedo = albedo * (1.0 - rim)[:, :, None] + deep[None, None, :] * rim[:, :, None]
    highlight = np.power(ndotl, 9.5) * 0.08
    hi = np.array(mix_rgb(tuple(sage), tuple(ivory), 0.08), dtype=np.float32)
    albedo = albedo * (1.0 - highlight)[:, :, None] + hi[None, None, :] * highlight[:, :, None]

    grain = (hash_noise(xx * 0.038, yy * 0.038) - 0.5) * 4.0
    albedo = np.clip(albedo + grain[:, :, None], 0, 255)

    dist = np.sqrt(rho2) * radius
    coverage = np.clip(radius + 0.85 - dist, 0.0, 1.5) / 1.5
    coverage = coverage * coverage * (3.0 - 2.0 * coverage)

    if transparent:
        rgba = np.dstack([albedo, coverage * 255.0])
        return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8))

    shadow = np.clip(
        1.0 - np.sqrt((xx - cx) ** 2 + (yy - (cy + radius * 0.18)) ** 2) / (radius * 1.22),
        0.0,
        1.0,
    )
    shadow = np.power(shadow, 2.2) * 0.07 * (1.0 - coverage * 0.72)
    out = ivory[None, None, :] * (1.0 - shadow)[:, :, None] + deep[None, None, :] * (
        shadow * 0.28
    )[:, :, None]
    out = out * (1.0 - coverage)[:, :, None] + albedo * coverage[:, :, None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def flatten_rgb(img: Image.Image, bg: str = IVORY) -> Image.Image:
    if img.mode == "RGB":
        return img
    canvas = Image.new("RGB", img.size, hex_rgb(bg))
    if img.mode == "RGBA":
        canvas.paste(img, mask=img.split()[-1])
        return canvas
    return img.convert("RGB")


def load_approved_icon() -> Image.Image:
    """Maria-approved tactile forest disc. Do not replace with a generated sphere."""
    if not APPROVED_ICON.exists():
        raise FileNotFoundError(
            f"Approved icon missing: {APPROVED_ICON}. "
            "Do not invent a new sphere."
        )
    ivory = np.array(hex_rgb(IVORY), dtype=np.float32)
    arr = np.array(Image.open(APPROVED_ICON).convert("RGB")).astype(np.float32)
    h, w, _ = arr.shape
    if (w, h) != (MASTER, MASTER):
        raise ValueError(f"Approved icon must be {MASTER}×{MASTER}, got {w}×{h}")
    corners = np.stack(
        [arr[2, 2], arr[2, -3], arr[-3, 2], arr[-3, -3], arr[20, 20], arr[20, -21]]
    )
    bg = corners.mean(axis=0)
    dist_bg = np.linalg.norm(arr - bg[None, None, :], axis=2)
    w_field = 1.0 - np.clip((dist_bg - 10.0) / 36.0, 0.0, 1.0)
    w_field = w_field * w_field * (3.0 - 2.0 * w_field)
    out = np.clip(arr + w_field[:, :, None] * (ivory - bg)[None, None, :], 0, 255)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx = cy = (w - 1) / 2.0
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    out[dist > w * 0.48] = ivory
    out[:2] = ivory
    out[-2:] = ivory
    out[:, :2] = ivory
    out[:, -2:] = ivory
    return Image.fromarray(out.astype(np.uint8))


def adaptive_foreground(master: Image.Image) -> Image.Image:
    ivory = np.array(hex_rgb(IVORY), dtype=np.float32)
    arr = np.array(master.convert("RGB")).astype(np.float32)
    d_iv = np.linalg.norm(arr - ivory, axis=2)
    alpha = np.clip((d_iv - 3.0) / 12.0, 0.0, 1.0)
    alpha = alpha * alpha * (3.0 - 2.0 * alpha) * 255.0
    return Image.fromarray(np.dstack([arr, alpha]).astype(np.uint8))


def downscale(master: Image.Image, px: int) -> Image.Image:
    img = master.resize((px, px), Image.Resampling.LANCZOS)
    if px <= 60:
        img = img.filter(ImageFilter.UnsharpMask(radius=0.6, percent=85, threshold=2))
    return img


def monochrome_icon(size: int = 1024) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    r = size * OBJECT_RATIO / 2.0
    cx = cy = size / 2.0
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255, 255))
    return img


def write_comparison_board() -> None:
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Back brand comparison board</title>
  <style>
    :root {{
      --ivory: {IVORY};
      --forest: {DEEP_FOREST};
      --grove: {FOREST};
      --sage: {SAGE};
      --soft: {SOFT_SAGE};
      --ink: {INK};
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: var(--ivory);
      color: var(--ink);
      font-family: ui-sans-serif, system-ui, sans-serif;
      padding: 32px 24px 80px;
    }}
    h1 {{
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 500;
      font-size: 32px;
      margin: 0 0 8px;
    }}
    .lede {{ color: #65736C; max-width: 42rem; line-height: 1.45; margin-bottom: 36px; }}
    section {{ margin: 36px 0 48px; }}
    h2 {{
      font-size: 13px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--soft);
      margin: 0 0 16px;
    }}
    .row {{ display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-end; }}
    figure {{
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }}
    figcaption {{
      font-size: 12px;
      color: #65736C;
      text-align: center;
    }}
    .card {{
      background: var(--ivory);
      border: 1px solid #D8CFC0;
      padding: 28px 32px;
      min-width: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .card.forest {{ background: var(--forest); border-color: var(--forest); }}
    .wm {{ height: 44px; width: auto; }}
    .wm.small {{ height: 14px; }}
    .icon {{ image-rendering: auto; display: block; }}
    .phone {{
      width: 180px;
      background: #1c1c1e;
      border-radius: 28px;
      padding: 18px 14px 22px;
    }}
    .phone.light {{ background: #e8e4dc; }}
    .phone-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px 8px;
      justify-items: center;
    }}
    .phone-grid img {{
      width: 36px;
      height: 36px;
      border-radius: 8px;
    }}
    .android {{
      width: 72px;
      height: 72px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(12, 59, 46, 0.12);
    }}
    .android img {{ width: 72px; height: 72px; display: block; }}
    .px40 {{
      width: 40px;
      height: 40px;
      border-radius: 9px;
      box-shadow: 0 0 0 1px rgba(12,59,46,0.12);
    }}
    .lockup {{ width: min(280px, 70vw); height: auto; border: 1px solid #D8CFC0; }}
    .note {{ font-size: 13px; color: #65736C; max-width: 46rem; }}
  </style>
</head>
<body>
  <h1>Back — three-asset identity</h1>
  <p class="lede">
    Wordmark, app icon, and lockup are separate. Official marketing is Warm Earth
    (forest on ivory). Open this file locally in a browser. Do not approve from 1024 alone —
    the 40px icon is mandatory.
  </p>

  <section>
    <h2>A. Wordmark</h2>
    <div class="row">
      <figure>
        <div class="card">
          <img class="wm" src="back-wordmark-dark.svg" alt="Back wordmark, Warm Earth" />
        </div>
        <figcaption>Warm Earth · {DEEP_FOREST} on {IVORY}</figcaption>
      </figure>
      <figure>
        <div class="card forest">
          <img class="wm" src="back-wordmark-light.svg" alt="Back wordmark, Forest" />
        </div>
        <figcaption>Forest · ivory on {DEEP_FOREST}</figcaption>
      </figure>
      <figure>
        <div class="card">
          <img class="wm" src="back-wordmark-soft-sage.svg" alt="Back wordmark, Soft Sage" />
        </div>
        <figcaption>Soft Sage · {SOFT_SAGE}</figcaption>
      </figure>
      <figure>
        <div class="card">
          <img class="wm small" src="back-wordmark-dark.svg" alt="Back wordmark at small size" />
        </div>
        <figcaption>Small-size · 14px height</figcaption>
      </figure>
    </div>
  </section>

  <section>
    <h2>B. App icon — no text</h2>
    <div class="row">
      <figure>
        <img class="icon" src="app-icon-master.png" width="220" height="220" alt="App icon at 1024" />
        <figcaption>1024 master (square, no mask)</figcaption>
      </figure>
      <figure>
        <div class="phone light">
          <div class="phone-grid">
            <img src="previews/icon-60.png" alt="" />
            <img src="previews/icon-60.png" alt="" />
            <img src="previews/icon-60.png" alt="" />
            <img src="previews/icon-60.png" alt="" />
          </div>
        </div>
        <figcaption>Simulated iPhone home · light</figcaption>
      </figure>
      <figure>
        <div class="phone">
          <div class="phone-grid">
            <img src="previews/icon-60.png" alt="" />
            <img src="previews/icon-60.png" alt="" />
            <img src="previews/icon-60.png" alt="" />
            <img src="previews/icon-60.png" alt="" />
          </div>
        </div>
        <figcaption>Simulated iPhone home · dark wallpaper</figcaption>
      </figure>
      <figure>
        <div class="android">
          <img src="previews/icon-180.png" alt="Android launcher circle crop" />
        </div>
        <figcaption>Android launcher (circle)</figcaption>
      </figure>
      <figure>
        <img class="px40" src="previews/icon-40.png" width="40" height="40" alt="App icon at 40 pixels" />
        <figcaption><strong>40 px (mandatory)</strong></figcaption>
      </figure>
      <figure>
        <img src="previews/icon-29.png" width="29" height="29" alt="App icon at 29 pixels" style="border-radius:6px" />
        <figcaption>29 px settings</figcaption>
      </figure>
      <figure>
        <img src="previews/icon-120.png" width="120" height="120" alt="App icon at 120 pixels" />
        <figcaption>120 px</figcaption>
      </figure>
    </div>
    <p class="note">Ivory field, one breathing object, no word Back, no letter, no gold line. Apple applies the squircle — this file stays square.</p>
  </section>

  <section>
    <h2>C. Lockup</h2>
    <div class="row">
      <figure>
        <img class="lockup" src="back-lockup-warm-earth.svg" alt="Warm Earth lockup" />
        <figcaption>Splash / quiet mark · Warm Earth</figcaption>
      </figure>
      <figure>
        <img class="lockup" src="back-lockup-warm-earth-tagline.svg" alt="Marketing lockup with tagline" />
        <figcaption>App Store / website · with tagline</figcaption>
      </figure>
      <figure>
        <img class="lockup" src="back-lockup-forest.svg" alt="Forest lockup" />
        <figcaption>Forest alternative</figcaption>
      </figure>
      <figure>
        <img class="lockup" src="back-lockup-horizontal.svg" alt="Horizontal lockup" />
        <figcaption>Horizontal lockup</figcaption>
      </figure>
    </div>
  </section>
</body>
</html>
"""
    (BRAND / "comparison-board.html").write_text(html)


def write_tokens_json() -> None:
    (BRAND / "tokens.json").write_text(
        json.dumps(
            {
                "warmIvory": IVORY,
                "deepForest": DEEP_FOREST,
                "forestGreen": FOREST,
                "sage": SAGE,
                "paleSage": PALE_SAGE,
                "ink": INK,
                "softSage": SOFT_SAGE,
                "objectDiameterRatio": OBJECT_RATIO,
                "font": {
                    "decision": "georgia-system",
                    "file": "Georgia.ttf (macOS system, not bundled)",
                    "inApp": "Vector outlines derived from Georgia Regular, plus iOS Georgia / Android serif fallback for live sentences",
                    "todo": "License a bundled app/web serif if Android must match iOS live headings exactly. Do not swap in an unlicensed display face.",
                },
            },
            indent=2,
        )
        + "\n"
    )


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)
    PREVIEWS.mkdir(parents=True, exist_ok=True)
    COMPONENTS.mkdir(parents=True, exist_ok=True)

    view = extract_wordmark()
    write_wordmark_ts(view)
    write_tokens_json()

    (BRAND / "back-wordmark-dark.svg").write_text(wordmark_svg(DEEP_FOREST, view))
    (BRAND / "back-wordmark-light.svg").write_text(wordmark_svg(IVORY, view))
    (BRAND / "back-wordmark-soft-sage.svg").write_text(wordmark_svg(SOFT_SAGE, view))
    (BRAND / "back-wordmark-warm-earth.svg").write_text(
        wordmark_svg(DEEP_FOREST, view, bg=IVORY)
    )

    (BRAND / "back-lockup-warm-earth.svg").write_text(
        lockup_svg(view, forest_bg=False, tagline=False, horizontal=False)
    )
    (BRAND / "back-lockup-warm-earth-tagline.svg").write_text(
        lockup_svg(view, forest_bg=False, tagline=True, horizontal=False)
    )
    (BRAND / "back-lockup-forest.svg").write_text(
        lockup_svg(view, forest_bg=True, tagline=False, horizontal=False)
    )
    (BRAND / "back-lockup-horizontal.svg").write_text(
        lockup_svg(view, forest_bg=False, tagline=False, horizontal=True)
    )

    raster_wordmark(view, fill=DEEP_FOREST, bg=None, height=256).save(
        BRAND / "back-wordmark-dark.png"
    )
    raster_wordmark(view, fill=IVORY, bg=None, height=256).save(
        BRAND / "back-wordmark-light.png"
    )
    raster_wordmark(view, fill=DEEP_FOREST, bg=IVORY, height=256, padding=32).save(
        BRAND / "back-wordmark-warm-earth.png"
    )
    raster_wordmark(view, fill=IVORY, bg=DEEP_FOREST, height=256, padding=32).save(
        BRAND / "back-wordmark-forest.png"
    )
    raster_wordmark(view, fill=SOFT_SAGE, bg=IVORY, height=256, padding=32).save(
        BRAND / "back-wordmark-soft-sage.png"
    )
    raster_wordmark(view, fill=DEEP_FOREST, bg=IVORY, height=28, padding=8).save(
        BRAND / "back-wordmark-small.png"
    )

    master = load_approved_icon()
    master.save(BRAND / "app-icon-master.png")

    for px in (180, 120, 60, 40, 29):
        downscale(master, px).save(PREVIEWS / f"icon-{px}.png")

    splash = master
    fg = adaptive_foreground(master)
    bg = Image.new("RGB", (MASTER, MASTER), hex_rgb(IVORY))
    mono = monochrome_icon()
    favicon = downscale(master, 48)

    fg.save(BRAND / "adaptive-icon-foreground.png")
    bg.save(BRAND / "adaptive-icon-background.png")
    mono.save(BRAND / "monochrome-icon.png")
    splash.save(BRAND / "splash-mark.png")

    shutil.copyfile(BRAND / "app-icon-master.png", IMAGES / "icon.png")
    shutil.copyfile(BRAND / "app-icon-master.png", STORE_ICON)
    splash.save(IMAGES / "splash-icon.png")
    fg.save(IMAGES / "android-icon-foreground.png")
    bg.save(IMAGES / "android-icon-background.png")
    mono.save(IMAGES / "android-icon-monochrome.png")
    favicon.save(IMAGES / "favicon.png")
    shutil.copyfile(IMAGES / "favicon.png", LANDING / "favicon.png")

    landing_favicon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="{IVORY}"/>
{breathing_svg(32, 32, 18.5, on_dark=False)}
</svg>
'''
    (LANDING / "favicon.svg").write_text(landing_favicon)

    downscale(master, 256).save(LANDING / "logo-mark.png")

    write_comparison_board()

    # Sanity: opaque RGB 1024, no alpha.
    check = Image.open(BRAND / "app-icon-master.png")
    assert check.size == (MASTER, MASTER), check.size
    assert check.mode == "RGB", check.mode
    print("wordmark viewBox", view["viewBox"])
    print("icon", check.size, check.mode)
    print("exported brand assets to", BRAND)


if __name__ == "__main__":
    main()
