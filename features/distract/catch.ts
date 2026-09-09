export type CatchTone = 'forest' | 'sage' | 'sand' | 'cool' | 'pale';

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

const tones: CatchTone[] = ['forest', 'sage', 'sand', 'cool', 'pale'];
const styles: CatchStyle[] = ['rings', 'filled', 'soft'];

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
  if (size < 88) {
    return 's';
  }
  if (size < 118) {
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

export function nextCatchTarget(
  width: number,
  height: number,
  recent: CatchTarget[] = [],
): CatchTarget {
  const previous = recent[recent.length - 1];
  const lastThree = recent.slice(-3);
  let chosen: CatchTarget | null = null;

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const size = between(76, 146);
    const pad = size * 0.55;
    const candidate: CatchTarget = {
      id: (previous?.id ?? 0) + 1,
      x: between(pad, Math.max(pad, width - pad)),
      y: between(pad, Math.max(pad, height - pad)),
      size,
      tone: pick(tones),
      stretch: between(0.86, 1.14),
      style: pick(styles),
      delayMs: Math.round(between(0, 720)),
    };

    const repeatsRecent = lastThree.some((item) => similar(candidate, item, width, height));
    if (!repeatsRecent) {
      chosen = candidate;
      break;
    }
    chosen = candidate;
  }

  return chosen ?? {
    id: (previous?.id ?? 0) + 1,
    x: width / 2,
    y: height / 2,
    size: 108,
    tone: 'sage',
    stretch: 1,
    style: 'rings',
    delayMs: 0,
  };
}
