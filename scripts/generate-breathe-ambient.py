#!/usr/bin/env python3
"""Generate a seamless ~20s light airy bed for Breathe (placeholder)."""

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

    # Pink-ish noise: airy, not brown — minimal low energy.
    amp = 1.0 / np.sqrt(freqs + 120.0)
    amp[0] = 0.0

    # High-pass: strip rumble / room weight (gentle breath through a filter).
    amp *= 1.0 - np.exp(-np.power(freqs / 380.0, 2.6))

    # Band-pass emphasis ~600 Hz–5 kHz (soft wind / exhale texture).
    band = np.exp(-np.power((freqs - 2400.0) / 2100.0, 2.0))
    amp *= 0.55 + 0.45 * band

    # De-harsh treble; keep whisper, not bright hiss.
    amp *= np.exp(-np.power(freqs / 6800.0, 2.8))

    phases = rng.uniform(0.0, 2.0 * np.pi, len(freqs))
    spectrum = amp * np.exp(1j * phases)
    x = np.fft.irfft(spectrum, n=N).astype(np.float64)

    # One slow 20s breath swell (seamless with loop length).
    t = np.arange(N, dtype=np.float64) / RATE
    swell = 0.9 + 0.1 * np.sin(2.0 * np.pi * t / DURATION_S)
    x *= swell

    # Very soft second layer: high band only, extra air without weight.
    amp_hi = np.zeros_like(freqs)
    mask = (freqs >= 900.0) & (freqs <= 5500.0)
    amp_hi[mask] = 1.0 / np.sqrt(freqs[mask] + 200.0)
    amp_hi *= np.exp(-np.power((freqs - 3200.0) / 2400.0, 2.0))
    phases_hi = rng.uniform(0.0, 2.0 * np.pi, len(freqs))
    hi = np.fft.irfft(amp_hi * np.exp(1j * phases_hi), n=N).astype(np.float64)
    hi *= 0.22 * swell
    x += hi

    x = seamless_crossfade(x)

    peak = np.max(np.abs(x))
    if peak > 0:
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
