#!/usr/bin/env python3
"""
Generate distinct seamless Listen environment loops (offline, no external samples).

License: original synthetic audio generated in-repo; safe to bundle in the app.

Outputs (45 s, mono 16-bit PCM @ 22050 Hz):
  audio/sounds/soft-rain-placeholder.wav
  audio/sounds/ocean-placeholder.wav
  audio/sounds/forest-placeholder.wav
  audio/sounds/fan-placeholder.wav
  audio/sounds/brown-noise-placeholder.wav
"""

from __future__ import annotations

import wave
from collections.abc import Callable
from pathlib import Path

import numpy as np

RATE = 22050
DURATION_S = 45
N = RATE * DURATION_S
ROOT = Path(__file__).resolve().parent.parent / "audio/sounds"

TARGET_RMS = 780.0
PEAK_LIMIT = 0.36 * 32767.0


def write_wav(path: Path, samples: np.ndarray) -> None:
    clipped = np.clip(samples, -32768, 32767).astype(np.int16)
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(RATE)
        wf.writeframes(clipped.tobytes())


def seamless_crossfade(x: np.ndarray, fade_ms: float = 180.0) -> np.ndarray:
    fade = max(4, int(RATE * fade_ms / 1000))
    if fade * 2 >= len(x):
        return x
    y = x.astype(np.float64, copy=True)
    t = np.linspace(0.0, 1.0, fade, dtype=np.float64)
    w = 0.5 - 0.5 * np.cos(np.pi * t)
    tail = y[-fade:]
    head = y[:fade]
    y[-fade:] = tail * (1.0 - w) + head * w
    y[-1] = y[0]
    return y


def one_pole_lowpass(x: np.ndarray, cutoff_hz: float) -> np.ndarray:
    dt = 1.0 / RATE
    rc = 1.0 / (2.0 * np.pi * max(cutoff_hz, 1.0))
    alpha = dt / (rc + dt)
    y = np.empty_like(x, dtype=np.float64)
    y[0] = float(x[0])
    for i in range(1, len(x)):
        y[i] = y[i - 1] + alpha * (float(x[i]) - y[i - 1])
    return y


def one_pole_highpass(x: np.ndarray, cutoff_hz: float) -> np.ndarray:
    low = one_pole_lowpass(x, cutoff_hz)
    return x.astype(np.float64) - low


def bandpass(x: np.ndarray, low_hz: float, high_hz: float) -> np.ndarray:
    y = one_pole_highpass(x, low_hz)
    y = one_pole_lowpass(y, high_hz)
    return y


def normalize(x: np.ndarray, rms_scale: float = 1.0) -> np.ndarray:
    y = np.nan_to_num(x.astype(np.float64, copy=True), nan=0.0, posinf=0.0, neginf=0.0)
    rms = float(np.sqrt(np.mean(y**2)))
    if rms > 1e-9:
        y *= (TARGET_RMS * rms_scale) / rms
    peak = float(np.max(np.abs(y)))
    if peak > PEAK_LIMIT:
        y *= PEAK_LIMIT / peak
    return y


def white_noise(rng: np.random.Generator, n: int) -> np.ndarray:
    return rng.standard_normal(n).astype(np.float64)


def brown_noise(rng: np.random.Generator, n: int) -> np.ndarray:
    w = white_noise(rng, n)
    b = np.cumsum(w)
    b -= np.mean(b)
    b = one_pole_highpass(b, 18.0)
    b = one_pole_lowpass(b, 420.0)
    return b


def soft_rain(rng: np.random.Generator) -> np.ndarray:
    t = np.arange(N, dtype=np.float64) / RATE
    bed = bandpass(white_noise(rng, N), 900.0, 6200.0)
    bed *= 0.55 + 0.12 * np.sin(2.0 * np.pi * t / 11.0 + 0.4)

    droplets = np.zeros(N, dtype=np.float64)
    rate = 38.0
    positions = rng.poisson(rate, size=int(DURATION_S * rate) + 8)
    idx = 0
    for count in positions:
        idx += max(1, int(RATE / rate))
        if idx >= N:
            break
        for _ in range(count):
            pos = min(N - 1, idx + int(rng.integers(0, int(RATE / rate))))
            decay = np.exp(-np.arange(180, dtype=np.float64) / (RATE * 0.011))
            tick = rng.standard_normal(180) * decay
            tick = bandpass(tick, 1200.0, 9000.0)
            end = min(N, pos + len(tick))
            droplets[pos:end] += tick[: end - pos] * float(rng.uniform(0.35, 0.9))

    splashes = np.zeros(N, dtype=np.float64)
    splash_times = rng.uniform(0, DURATION_S, size=14)
    for st in splash_times:
        pos = int(st * RATE)
        if pos >= N - 400:
            continue
        env = np.exp(-np.arange(900, dtype=np.float64) / (RATE * 0.09))
        burst = bandpass(rng.standard_normal(900), 400.0, 5000.0) * env
        end = min(N, pos + len(burst))
        splashes[pos:end] += burst[: end - pos] * 0.55

    x = 0.62 * bed + 0.28 * droplets + 0.18 * splashes
    x = seamless_crossfade(x, fade_ms=220.0)
    return normalize(x)


def ocean_swell(rng: np.random.Generator) -> np.ndarray:
    t = np.arange(N, dtype=np.float64) / RATE
    wave_period = 9.0
    swell_env = (
        0.62
        + 0.28 * np.sin(2.0 * np.pi * t / wave_period)
        + 0.12 * np.sin(2.0 * np.pi * t / (wave_period * 0.5) + 1.1)
        + 0.06 * np.sin(2.0 * np.pi * t / (wave_period * 1.7) + 2.4)
    )
    swell_env = np.clip(swell_env, 0.05, 1.0)

    surf = one_pole_lowpass(white_noise(rng, N), 180.0)
    surf *= swell_env**1.35

    foam = bandpass(white_noise(rng, N), 450.0, 2100.0)
    foam_gate = np.clip((swell_env - 0.76) / 0.24, 0.0, 1.0) ** 2
    foam *= foam_gate * 0.24

    undertone = 0.14 * np.sin(2.0 * np.pi * 48.0 * t + 0.2)
    undertone *= 0.85 + 0.15 * swell_env

    x = surf + foam + undertone
    x = seamless_crossfade(x, fade_ms=260.0)
    return normalize(x)


def forest_ambience(rng: np.random.Generator) -> np.ndarray:
    t = np.arange(N, dtype=np.float64) / RATE
    wind = one_pole_lowpass(white_noise(rng, N), 520.0)
    wind *= 0.35 + 0.25 * np.sin(2.0 * np.pi * t / 17.0 + 0.6)
    wind *= 0.4 + 0.6 * (0.5 + 0.5 * np.sin(2.0 * np.pi * t / 31.0 + 1.3))

    leaves = bandpass(white_noise(rng, N), 1400.0, 4200.0)
    leaves *= 0.18 + 0.14 * np.sin(2.0 * np.pi * t / 6.5 + 0.9)
    leaves *= 0.5 + 0.5 * np.sin(2.0 * np.pi * t / 23.0 + 2.0)

    birds = np.zeros(N, dtype=np.float64)
    chirp_times = rng.uniform(0, DURATION_S, size=22)
    for ct in chirp_times:
        start = int(ct * RATE)
        length = max(48, int(RATE * rng.uniform(0.08, 0.22)))
        if start + length >= N:
            continue
        local_t = np.arange(length, dtype=np.float64) / RATE
        span = local_t[-1]
        if span <= 0:
            continue
        f0 = rng.uniform(1800.0, 3400.0)
        f1 = f0 * rng.uniform(1.08, 1.45)
        freq = f0 + (f1 - f0) * (local_t / span)
        phase = np.cumsum(2.0 * np.pi * freq / RATE)
        env = np.clip(np.sin(np.pi * local_t / span), 0.0, 1.0) ** 1.4
        chirp = np.sin(phase) * env * rng.uniform(0.08, 0.16)
        birds[start : start + length] += chirp

    x = 0.55 * wind + 0.35 * leaves + birds
    x = seamless_crossfade(x, fade_ms=200.0)
    return normalize(x)


def fan_hum(rng: np.random.Generator) -> np.ndarray:
    t = np.arange(N, dtype=np.float64) / RATE
    blade_hz = 6.4
    hum = (
        0.56 * np.sin(2.0 * np.pi * 120.0 * t)
        + 0.24 * np.sin(2.0 * np.pi * 240.0 * t + 0.35)
        + 0.09 * np.sin(2.0 * np.pi * 360.0 * t + 0.8)
    )
    whoosh = bandpass(white_noise(rng, N), 260.0, 720.0)
    blade = 0.78 + 0.22 * np.sin(2.0 * np.pi * blade_hz * t)
    whoosh *= blade
    whir = one_pole_lowpass(white_noise(rng, N), 2200.0) * 0.012
    x = hum + 0.34 * whoosh + whir
    x = seamless_crossfade(x, fade_ms=160.0)
    return normalize(x, rms_scale=0.92)


def brown_warm(rng: np.random.Generator) -> np.ndarray:
    t = np.arange(N, dtype=np.float64) / RATE
    x = brown_noise(rng, N)
    x *= 0.92 + 0.08 * np.sin(2.0 * np.pi * t / DURATION_S + 0.5)
    x = seamless_crossfade(x, fade_ms=240.0)
    return normalize(x, rms_scale=1.05)


def stats(samples: np.ndarray) -> tuple[float, float, float]:
    x = samples.astype(np.float64)
    rms = float(np.sqrt(np.mean(x**2)))
    peak = float(np.max(np.abs(x)))
    spec = np.abs(np.fft.rfft(x))
    freqs = np.fft.rfftfreq(len(x), 1.0 / RATE)
    centroid = float(np.sum(freqs * spec) / np.sum(spec))
    return rms, peak, centroid


def main() -> None:
    jobs: list[tuple[str, Path, np.random.Generator, Callable[[np.random.Generator], np.ndarray]]] = [
        ("rain", ROOT / "soft-rain-placeholder.wav", np.random.default_rng(2026091701), soft_rain),
        ("ocean", ROOT / "ocean-placeholder.wav", np.random.default_rng(2026091702), ocean_swell),
        ("forest", ROOT / "forest-placeholder.wav", np.random.default_rng(2026091703), forest_ambience),
        ("fan", ROOT / "fan-placeholder.wav", np.random.default_rng(2026091704), fan_hum),
        ("brown", ROOT / "brown-noise-placeholder.wav", np.random.default_rng(2026091705), brown_warm),
    ]
    for label, path, rng, fn in jobs:
        samples = fn(rng)
        write_wav(path, samples)
        rms, peak, cent = stats(samples)
        seam = int(samples[-1] - samples[0])
        print(f"{label:7} -> {path.name} rms={rms:.0f} peak={peak:.0f} centroid={cent:.0f}Hz seam={seam}")


if __name__ == "__main__":
    main()
