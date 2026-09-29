export type CatchTone = 'forest' | 'sage' | 'sand' | 'cool';

export type CatchStyle = 'rings' | 'filled' | 'soft';

export type CatchTarget = {
  id: number;
  x: number;
  y: number;
  size: number;
  tone: CatchTone;
  stretch: number;
  style: CatchStyle;
  delayMs: number;
};

const tones: CatchTone[] = ['forest', 'sage', 'sand', 'cool'];
const styles: CatchStyle[] = ['rings', 'filled', 'soft'];

const MIN_SIZE = 92;
const MAX_SIZE = 136;

function between(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] ?? items[0]!;
}

function quadrant(x: number, y: number, width: number, height: number): string {
  return `${x < width / 2 ? 'L' : 'R'}${y < height / 2 ? 'T' : 'B'}`;
}

function sizeBucket(size: number): string {
  if (size < 104) {
    return 's';
  }
  if (size < 122) {
    return 'm';
  }
  return 'l';
}

export function catchSignature(target: CatchTarget, width: number, height: number): string {
  return `${target.tone}-${target.style}-${quadrant(target.x, target.y, width, height)}-${sizeBucket(target.size)}`;
}

function similar(next: CatchTarget, previous: CatchTarget, width: number, height: number): boolean {
  const samePlace = quadrant(next.x, next.y, width, height) === quadrant(previous.x, previous.y, width, height);
  const sameLook = next.tone === previous.tone && next.style === previous.style;
  const sameSize = sizeBucket(next.size) === sizeBucket(previous.size);
  return (samePlace && sameLook) || (sameLook && sameSize && samePlace);
}

export function targetFitsField(target: CatchTarget, width: number, height: number): boolean {
  const padX = target.size / 2;
  const padY = (target.size * target.stretch) / 2;
  return (
    width >= target.size &&
    height >= target.size * target.stretch &&
    target.x >= padX &&
    target.x <= width - padX &&
    target.y >= padY &&
    target.y <= height - padY
  );
}

export function nextCatchTarget(
  width: number,
  height: number,
  recent: CatchTarget[] = [],
): CatchTarget {
  const previous = recent[recent.length - 1];
  const lastThree = recent.slice(-3);
  const sizeMax = Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.min(width, height) * 0.42));
  const sizeMin = Math.min(MIN_SIZE, sizeMax);
  let chosen: CatchTarget | null = null;

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const size = between(sizeMin, sizeMax);
    const stretch = between(0.94, 1.06);
    const padX = size / 2;
    const padY = (size * stretch) / 2;
    const candidate: CatchTarget = {
      id: (previous?.id ?? 0) + 1,
      x: between(padX, Math.max(padX, width - padX)),
      y: between(padY, Math.max(padY, height - padY)),
      size,
      tone: pick(tones),
      stretch,
      style: pick(styles),
      delayMs: Math.round(between(0, 180)),
    };

    const repeatsRecent = lastThree.some((item) => similar(candidate, item, width, height));
    if (!repeatsRecent) {
      chosen = candidate;
      break;
    }
    chosen = candidate;
  }

  return (
    chosen ?? {
      id: (previous?.id ?? 0) + 1,
      x: width / 2,
      y: height / 2,
      size: Math.min(108, sizeMax),
      tone: 'sage',
      stretch: 1,
      style: 'filled',
      delayMs: 0,
    }
  );
}
