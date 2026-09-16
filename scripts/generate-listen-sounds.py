#!/usr/bin/env python3
"""
Generate distinct seamless Listen environment loops (offline, no external samples).

License: original synthetic audio generated in-repo; safe to bundle in the app.

Outputs (45 s, mono 16-bit PCM @ 22050 Hz):
  audio/sounds/soft-rain-placeholder.wav
  audio/sounds/ocean-placeholder.wav
  audio/sounds/gentle-stream-placeholder.wav
  audio/sounds/forest-placeholder.wav
  audio/sounds/distant-birds-placeholder.wav
  audio/sounds/fan-placeholder.wav
  audio/sounds/brown-noise-placeholder.wav
  audio/sounds/soft-white-noise-placeholder.wav
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


def gentle_stream(rng: np.random.Generator) -> np.ndarray:
    t = np.arange(N, dtype=np.float64) / RATE
    flow = bandpass(white_noise(rng, N), 280.0, 1800.0)
    flow *= 0.48 + 0.22 * np.sin(2.0 * np.pi * t / 7.2 + 0.3)
    flow *= 0.55 + 0.45 * (0.5 + 0.5 * np.sin(2.0 * np.pi * t / 19.0 + 1.0))

    babble = bandpass(white_noise(rng, N), 900.0, 4200.0)
    babble *= 0.12 + 0.1 * np.sin(2.0 * np.pi * t / 4.8 + 0.7)
    pebble = np.zeros(N, dtype=np.float64)
    for st in rng.uniform(0, DURATION_S, size=28):
        pos = int(st * RATE)
        if pos >= N - 120:
            continue
        tick_len = 120
        env = np.exp(-np.arange(tick_len, dtype=np.float64) / (RATE * 0.018))
        tick = bandpass(rng.standard_normal(tick_len), 1400.0, 6500.0) * env
        end = min(N, pos + tick_len)
        pebble[pos:end] += tick[: end - pos] * rng.uniform(0.15, 0.42)

    x = 0.7 * flow + 0.22 * babble + 0.35 * pebble
    x = seamless_crossfade(x, fade_ms=210.0)
    return normalize(x)


def forest_ambience(rng: np.random.Generator) -> np.ndarray:
    """Quiet forest: gentle air, sparse leaf rustle, soft melodic birds — no noise bed."""
    t = np.arange(N, dtype=np.float64) / RATE

    swell = 0.52 + 0.48 * (0.5 + 0.5 * np.sin(2.0 * np.pi * t / 26.0 + 0.45))
    swell *= 0.68 + 0.32 * (0.5 + 0.5 * np.sin(2.0 * np.pi * t / 39.0 + 1.6))
    air = (
        0.2 * np.sin(2.0 * np.pi * 48.0 * t + 0.25)
        + 0.11 * np.sin(2.0 * np.pi * 67.0 * t + 1.05)
        + 0.06 * np.sin(2.0 * np.pi * 94.0 * t + 2.1)
    )
    air *= swell

    whoosh = np.zeros(N, dtype=np.float64)
    for st in rng.uniform(0, DURATION_S, size=16):
        pos = int(st * RATE)
        wlen = max(8, int(RATE * rng.uniform(0.4, 1.05)))
        if pos + wlen >= N:
            continue
        local = np.arange(wlen, dtype=np.float64)
        env = np.clip(np.sin(np.pi * local / max(wlen - 1, 1)), 0.0, 1.0) ** 1.55
        burst = one_pole_lowpass(rng.standard_normal(wlen), rng.uniform(95.0, 240.0))
        whoosh[pos : pos + wlen] += burst * env * float(rng.uniform(0.07, 0.16))

    rustle = np.zeros(N, dtype=np.float64)
    for st in rng.uniform(0, DURATION_S, size=36):
        pos = int(st * RATE)
        rlen = max(12, int(RATE * rng.uniform(0.035, 0.12)))
        if pos + rlen >= N:
            continue
        local = np.arange(rlen, dtype=np.float64)
        decay = np.exp(-local / (RATE * rng.uniform(0.028, 0.06)))
        attack = np.clip(np.sin(np.pi * local / max(rlen - 1, 1)), 0.0, 1.0) ** 0.85
        grain = bandpass(
            rng.standard_normal(rlen),
            rng.uniform(780.0, 1600.0),
            rng.uniform(2800.0, 4800.0),
        )
        rustle[pos : pos + rlen] += grain * decay * attack * float(rng.uniform(0.1, 0.24))

    birds = np.zeros(N, dtype=np.float64)
    pentatonic = np.array([784.0, 880.0, 988.0, 1175.0, 1319.0, 1568.0], dtype=np.float64)
    t_cursor = float(rng.uniform(4.0, 8.0))
    while t_cursor < DURATION_S - 1.0:
        start = int(t_cursor * RATE)
        phrase_notes = 2 if rng.random() < 0.5 else 1
        pitch = float(rng.choice(pentatonic)) * float(rng.uniform(0.94, 1.04))
        for _ in range(phrase_notes):
            if start >= N - 160:
                break
            note_len = max(48, int(RATE * rng.uniform(0.14, 0.32)))
            if start + note_len >= N:
                break
            local_t = np.arange(note_len, dtype=np.float64) / RATE
            span = float(local_t[-1]) if note_len > 1 else 0.012
            if rng.random() < 0.62:
                f0, f1 = pitch, pitch * float(rng.uniform(1.05, 1.11))
            else:
                f0, f1 = pitch * float(rng.uniform(1.04, 1.09)), pitch
            freq = f0 + (f1 - f0) * (local_t / span)
            phase = np.cumsum(2.0 * np.pi * freq / RATE)
            env = np.clip(np.sin(np.pi * local_t / span), 0.0, 1.0) ** 2.35
            tone = 0.86 * np.sin(phase) + 0.07 * np.sin(2.0 * phase + 0.35)
            tone = one_pole_lowpass(tone, float(rng.uniform(1650.0, 2150.0)))
            birds[start : start + note_len] += tone * env * float(rng.uniform(0.038, 0.082))
            start += note_len + int(RATE * rng.uniform(0.06, 0.15))
            pitch = f1 * float(rng.uniform(0.97, 1.04))
        t_cursor += float(rng.uniform(6.5, 12.5))

    x = air + whoosh + rustle + birds
    x = seamless_crossfade(x, fade_ms=200.0)
    return normalize(x, rms_scale=0.94)


def distant_birds(rng: np.random.Generator) -> np.ndarray:
    """Sparse distant songbirds only — quiet gaps, no noise bed or wind layer."""
    birds = np.zeros(N, dtype=np.float64)
    t_cursor = float(rng.uniform(2.0, 5.0))
    chirp_times: list[float] = []
    while t_cursor < DURATION_S - 0.4:
        chirp_times.append(t_cursor)
        t_cursor += float(rng.uniform(3.0, 7.5))

    for ct in chirp_times:
        start = int(ct * RATE)
        length = max(32, int(RATE * rng.uniform(0.045, 0.13)))
        if start + length >= N:
            continue
        local_t = np.arange(length, dtype=np.float64) / RATE
        span = local_t[-1]
        if span <= 0:
            continue
        f0 = rng.uniform(1350.0, 2200.0)
        f1 = f0 * rng.uniform(1.02, 1.14)
        freq = f0 + (f1 - f0) * (local_t / span)
        phase = np.cumsum(2.0 * np.pi * freq / RATE)
        env = np.clip(np.sin(np.pi * local_t / span), 0.0, 1.0) ** 1.65
        tone = 0.88 * np.sin(phase) + 0.12 * np.sin(2.0 * phase)
        tone = one_pole_lowpass(tone, 2800.0)
        chirp = tone * env * float(rng.uniform(0.035, 0.075))
        birds[start : start + length] += chirp
        if rng.random() < 0.22:
            gap = int(RATE * rng.uniform(0.08, 0.16))
            start2 = start + length + gap
            length2 = max(28, int(RATE * rng.uniform(0.04, 0.1)))
            if start2 + length2 < N:
                local_t2 = np.arange(length2, dtype=np.float64) / RATE
                span2 = local_t2[-1]
                f0b = f0 * rng.uniform(0.92, 1.05)
                f1b = f0b * rng.uniform(1.02, 1.12)
                freq2 = f0b + (f1b - f0b) * (local_t2 / span2)
                phase2 = np.cumsum(2.0 * np.pi * freq2 / RATE)
                env2 = np.clip(np.sin(np.pi * local_t2 / span2), 0.0, 1.0) ** 1.65
                tone2 = one_pole_lowpass(0.9 * np.sin(phase2) + 0.1 * np.sin(2.0 * phase2), 2600.0)
                birds[start2 : start2 + length2] += tone2 * env2 * float(rng.uniform(0.028, 0.06))

    x = birds
    x = seamless_crossfade(x, fade_ms=200.0)
    return normalize(x, rms_scale=0.68)


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


def soft_white_noise(rng: np.random.Generator) -> np.ndarray:
    t = np.arange(N, dtype=np.float64) / RATE
    x = bandpass(white_noise(rng, N), 180.0, 6800.0)
    x = one_pole_lowpass(x, 5200.0)
    x *= 0.94 + 0.06 * np.sin(2.0 * np.pi * t / DURATION_S + 1.1)
    x = seamless_crossfade(x, fade_ms=220.0)
    return normalize(x, rms_scale=0.98)


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
        ("stream", ROOT / "gentle-stream-placeholder.wav", np.random.default_rng(2026091703), gentle_stream),
        ("forest", ROOT / "forest-placeholder.wav", np.random.default_rng(2026091704), forest_ambience),
        ("birds", ROOT / "distant-birds-placeholder.wav", np.random.default_rng(2026091705), distant_birds),
        ("fan", ROOT / "fan-placeholder.wav", np.random.default_rng(2026091706), fan_hum),
        ("brown", ROOT / "brown-noise-placeholder.wav", np.random.default_rng(2026091707), brown_warm),
        ("white", ROOT / "soft-white-noise-placeholder.wav", np.random.default_rng(2026091708), soft_white_noise),
    ]
    for label, path, rng, fn in jobs:
        samples = fn(rng)
        write_wav(path, samples)
        rms, peak, cent = stats(samples)
        seam = int(samples[-1] - samples[0])
        print(f"{label:7} -> {path.name} rms={rms:.0f} peak={peak:.0f} centroid={cent:.0f}Hz seam={seam}")


if __name__ == "__main__":
    main()
