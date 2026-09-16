#!/usr/bin/env python3
"""Generate a seamless ~25s calm tonal pad for Move (placeholder)."""

from __future__ import annotations

import wave
from pathlib import Path

import numpy as np

RATE = 22050
DURATION_S = 25
N = RATE * DURATION_S
OUT = Path(__file__).resolve().parent.parent / "audio/sfx/move-ambient-placeholder.wav"
SEED = 20260917


def write_wav(path: Path, samples: np.ndarray) -> None:
    clipped = np.clip(samples, -32768, 32767).astype(np.int16)
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(RATE)
        wf.writeframes(clipped.tobytes())


def seamless_crossfade(x: np.ndarray, fade_ms: float = 120.0) -> np.ndarray:
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


def soft_sine(freq: float, t: np.ndarray, phase: float = 0.0) -> np.ndarray:
    return np.sin(2.0 * np.pi * freq * t + phase)


def generate() -> np.ndarray:
    t = np.arange(N, dtype=np.float64) / RATE

    # One slow breath over the loop — no percussive edges.
    swell = 0.88 + 0.12 * np.sin(2.0 * np.pi * t / DURATION_S)

    # D minor-ish pad: root, fifth, soft octave — static harmony, gentle detune warmth.
    root = 146.83  # D3
    fifth = root * 1.498
    octave = root * 2.0
    detune_cents = 6.0

    def detuned(freq: float, cents: float, phase: float) -> np.ndarray:
        f = freq * (2.0 ** (cents / 1200.0))
        return soft_sine(f, t, phase)

    rng = np.random.default_rng(SEED)
    p0 = float(rng.uniform(0.0, 2.0 * np.pi))
    p1 = float(rng.uniform(0.0, 2.0 * np.pi))
    p2 = float(rng.uniform(0.0, 2.0 * np.pi))

    x = (
        0.42 * (detuned(root, -detune_cents, p0) + detuned(root, detune_cents, p0 + 0.4))
        + 0.22 * (detuned(fifth, -detune_cents * 0.6, p1) + detuned(fifth, detune_cents * 0.6, p1 + 0.3))
        + 0.12 * soft_sine(octave, t, p2)
    )

    # Barely moving upper shimmer — same period as loop for seamlessness.
    shimmer_freq = root * 3.01
    shimmer = 0.06 * soft_sine(shimmer_freq, t, p2 + 1.1)
    shimmer *= 0.5 + 0.5 * np.sin(2.0 * np.pi * t / DURATION_S + 0.7)
    x += shimmer

    x *= swell

    # Gentle low-pass via rolling mean (no transients).
    kernel = np.ones(5, dtype=np.float64) / 5.0
    x = np.convolve(x, kernel, mode="same")

    x = seamless_crossfade(x)

    peak = np.max(np.abs(x))
    if peak > 0:
        x *= (0.38 * 32767.0) / peak

    return x


def main() -> None:
    samples = generate()
    write_wav(OUT, samples)
    peak = int(np.max(np.abs(samples)))
    rms = float(np.sqrt(np.mean(samples.astype(np.float64) ** 2)))
    print(f"Wrote {OUT} peak={peak} rms={rms:.1f} seam={int(samples[-1] - samples[0])}")


if __name__ == "__main__":
    main()
