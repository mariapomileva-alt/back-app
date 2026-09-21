#!/usr/bin/env python3
"""Trim transparent padding from Listen premium art; write runtime copies (masters unchanged)."""

from __future__ import annotations

import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "listen" / "premium-loops"
OUT = ROOT / "assets" / "listen-art" / "runtime"
MANIFEST = OUT / "manifest.json"

ALPHA_THRESHOLD = 12
SAFE_PADDING_RATIO = 0.085
MIN_SAFE_PAD_PX = 22

SOUNDS = [
    ("rain", "soft-rain-loop-strong.webp", "soft-rain-reduce-motion.png"),
    ("ocean", "ocean-loop-strong.webp", "ocean-reduce-motion.png"),
    ("stream", "gentle-stream-loop-strong.webp", "gentle-stream-reduce-motion.png"),
    ("forest", "quiet-forest-loop-strong.webp", "quiet-forest-reduce-motion.png"),
    ("birds", "distant-birds-loop.webp", "distant-birds-reduce-motion.png"),
    ("fan", "steady-fan-loop.webp", "steady-fan-reduce-motion.png"),
    ("brown", "brown-noise-loop.webp", "brown-noise-reduce-motion.png"),
    ("white", "soft-white-noise-loop.webp", "soft-white-noise-reduce-motion.png"),
]


def alpha_bbox(rgba: Image.Image, threshold: int = ALPHA_THRESHOLD) -> tuple[int, int, int, int]:
    if rgba.mode != "RGBA":
        rgba = rgba.convert("RGBA")
    w, h = rgba.size
    alpha = np.array(rgba.getchannel("A"))
    mask = alpha > threshold
    if not mask.any():
        return (0, 0, w, h)
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    top = int(np.argmax(rows))
    bottom = int(len(rows) - np.argmax(rows[::-1]))
    left = int(np.argmax(cols))
    right = int(len(cols) - np.argmax(cols[::-1]))
    return (left, top, right, bottom)


def union_bbox(boxes: list[tuple[int, int, int, int]]) -> tuple[int, int, int, int]:
    left = min(b[0] for b in boxes)
    top = min(b[1] for b in boxes)
    right = max(b[2] for b in boxes)
    bottom = max(b[3] for b in boxes)
    return (left, top, right, bottom)


def pad_bbox(
    bbox: tuple[int, int, int, int],
    size: tuple[int, int],
    ratio: float = SAFE_PADDING_RATIO,
) -> tuple[int, int, int, int]:
    w, h = size
    left, top, right, bottom = bbox
    bw = right - left
    bh = bottom - top
    pad = max(MIN_SAFE_PAD_PX, int(max(bw, bh) * ratio))
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(w, right + pad)
    bottom = min(h, bottom + pad)
    return (left, top, right, bottom)


def first_frame_bbox(loop_path: Path) -> tuple[int, int, int, int]:
    im = Image.open(loop_path)
    im.seek(0)
    return alpha_bbox(im.convert("RGBA"))


def _atomic_replace(tmp: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    os.replace(tmp, dest)


def save_still(src: Path, box: tuple[int, int, int, int], dest: Path, canvas: tuple[int, int]) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(suffix=dest.suffix, dir=dest.parent)
    os.close(fd)
    tmp = Path(tmp_name)
    try:
        if box == full_canvas(canvas):
            shutil.copy2(src, tmp)
        else:
            im = Image.open(src).convert("RGBA")
            im.crop(box).save(tmp, optimize=True)
        _atomic_replace(tmp, dest)
    finally:
        if tmp.exists():
            tmp.unlink(missing_ok=True)


def full_canvas(size: tuple[int, int]) -> tuple[int, int, int, int]:
    return (0, 0, size[0], size[1])


def save_loop(src: Path, box: tuple[int, int, int, int], dest: Path, canvas: tuple[int, int]) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(suffix=".webp", dir=dest.parent)
    os.close(fd)
    tmp = Path(tmp_name)
    try:
        if box == full_canvas(canvas):
            shutil.copy2(src, tmp)
        else:
            im = Image.open(src)
            n = getattr(im, "n_frames", 1)
            frames: list[Image.Image] = []
            durations: list[int] = []
            for i in range(n):
                im.seek(i)
                frame = im.convert("RGBA").crop(box)
                frames.append(frame)
                durations.append(int(im.info.get("duration", 40) or 40))
            if len(frames) == 1:
                frames[0].save(tmp, format="WEBP", quality=92, method=4)
            else:
                frames[0].save(
                    tmp,
                    format="WEBP",
                    save_all=True,
                    append_images=frames[1:],
                    duration=durations,
                    loop=0,
                    quality=92,
                    method=4,
                )
        _atomic_replace(tmp, dest)
    finally:
        if tmp.exists():
            tmp.unlink(missing_ok=True)


def inspect_pair(sound_id: str, loop_name: str | None, still_name: str) -> dict:
    still_path = SRC / still_name
    still_im = Image.open(still_path)
    canvas_w, canvas_h = still_im.size
    still_box = alpha_bbox(still_im.convert("RGBA"))
    boxes = [still_box]
    if loop_name:
        boxes.append(first_frame_bbox(SRC / loop_name))
    crop = pad_bbox(union_bbox(boxes), (canvas_w, canvas_h))
    cw = crop[2] - crop[0]
    ch = crop[3] - crop[1]
    return {
        "soundId": sound_id,
        "sourceCanvas": {"width": canvas_w, "height": canvas_h},
        "visibleBounds": {
            "left": still_box[0],
            "top": still_box[1],
            "width": still_box[2] - still_box[0],
            "height": still_box[3] - still_box[1],
        },
        "cropBox": {"left": crop[0], "top": crop[1], "width": cw, "height": ch},
        "aspectRatio": round(cw / ch, 4) if ch else 1.6667,
    }


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict = {"paddingRatio": SAFE_PADDING_RATIO, "sounds": {}}

    for sound_id, loop_name, still_name in SOUNDS:
        meta = inspect_pair(sound_id, loop_name, still_name)
        still_path = SRC / still_name
        still_im = Image.open(still_path)
        canvas = still_im.size
        boxes = [alpha_bbox(still_im.convert("RGBA"))]
        if loop_name:
            boxes.append(first_frame_bbox(SRC / loop_name))
        crop = pad_bbox(union_bbox(boxes), canvas)

        still_out = OUT / f"{sound_id}-still.png"
        save_still(still_path, crop, still_out, canvas)

        if loop_name:
            loop_out = OUT / f"{sound_id}-loop.webp"
            save_loop(SRC / loop_name, crop, loop_out, canvas)
        else:
            loop_out = OUT / f"{sound_id}-loop.png"
            save_still(still_path, crop, loop_out, canvas)

        meta["files"] = {
            "still": still_out.relative_to(ROOT).as_posix(),
            "loop": loop_out.relative_to(ROOT).as_posix(),
        }
        manifest["sounds"][sound_id] = meta
        print(
            f"{sound_id}: canvas {canvas[0]}x{canvas[1]} "
            f"visible ~{meta['visibleBounds']['width']}x{meta['visibleBounds']['height']} "
            f"runtime {meta['cropBox']['width']}x{meta['cropBox']['height']}"
        )

    aspects = [m["aspectRatio"] for m in manifest["sounds"].values()]
    manifest["defaultAspectRatio"] = round(sum(aspects) / len(aspects), 4)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"defaultAspectRatio={manifest['defaultAspectRatio']}")
    print(f"Wrote {MANIFEST}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
