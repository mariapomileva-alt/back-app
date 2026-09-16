#!/usr/bin/env python3
"""Generate a seamless ~20s warm air / brown bed for Breathe (placeholder)."""

from __future__ import annotations

import wave
from pathlib import Path

import numpy as np

RATE = 22050
DURATION_S = 20
N = RATE * DURATION_S
OUT = Path(__file__).resolve().parent.parent / "audio/sfx/breathe-ambient-placeholder.wav"
SEED = 20260316


def write_wav(path: Path, samples: np.ndarray) -> None:
    clipped = np.clip(samples, -32768, 32767).astype(np.int16)
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(RATE)
        wf.writeframes(clipped.tobytes())


def seamless_crossfade(x: np.ndarray, fade_ms: float = 80.0) -> np.ndarray:
    fade = max(4, int(RATE * fade_ms / 1000))
    if fade * 2 >= len(x):
        return x
    y = x.copy()
    t = np.linspace(0.0, 1.0, fade, dtype=np.float64)
    w = 0.5 - 0.5 * np.cos(np.pi * t)
    tail = y[-fade:].astype(np.float64)
    head = y[:fade].astype(np.float64)
    y[-fade:] = tail * (1.0 - w) + head * w
    y[-1] = y[0]
    return y


def generate() -> np.ndarray:
    rng = np.random.default_rng(SEED)
    freqs = np.fft.rfftfreq(N, 1.0 / RATE)

    # Warm brown bed: strong low-mids, very little treble (no bright hiss).
    amp = 1.0 / np.power(freqs + 32.0, 2.25)
    amp[0] = 0.0
    amp *= np.exp(-np.power(freqs / 720.0, 2.35))
    # Soft room hum (barely audible texture, not a tone).
    for f0, weight, width in ((56.0, 0.038, 6.5), (112.0, 0.022, 10.0)):
        amp += weight * np.exp(-np.power((freqs - f0) / width, 2.0))

    phases = rng.uniform(0.0, 2.0 * np.pi, len(freqs))
    spectrum = amp * np.exp(1j * phases)
    x = np.fft.irfft(spectrum, n=N).astype(np.float64)

    # Slow 20s swell so the file is not a static flat hiss (still steady vs in-app mod).
    t = np.arange(N, dtype=np.float64) / RATE
    swell = 1.0 + 0.06 * np.sin(2.0 * np.pi * t / DURATION_S)
    x *= swell

    x = seamless_crossfade(x)

    peak = np.max(np.abs(x))
    if peak > 0:
        # Fuller than the old placeholder but capped — app volume stays ~0.38.
        x *= (0.42 * 32767.0) / peak

    return x


def main() -> None:
    samples = generate()
    write_wav(OUT, samples)
    peak = int(np.max(np.abs(samples)))
    rms = float(np.sqrt(np.mean(samples.astype(np.float64) ** 2)))
    print(f"Wrote {OUT} peak={peak} rms={rms:.1f} seam={int(samples[-1] - samples[0])}")


if __name__ == "__main__":
    main()
