import { shuffle } from './shuffle';

export type ShapeKind = 'circle' | 'square' | 'triangle' | 'quarter';

export type ShapeColorKey = 'forest' | 'sage' | 'sand' | 'clay' | 'cool';

export type ShapeOption = {
  shape: ShapeKind;
  colorKey: ShapeColorKey;
  correct: boolean;
};

export type ShapeRound = {
  shape: ShapeKind;
  colorKey: ShapeColorKey;
  options: ShapeOption[];
};

export type ShapeDeck = {
  round: ShapeRound;
  remaining: ShapeRound[];
};

const kinds: ShapeKind[] = ['circle', 'square', 'triangle', 'quarter'];
const colors: ShapeColorKey[] = ['forest', 'sage', 'sand', 'clay', 'cool'];

type Pair = { shape: ShapeKind; colorKey: ShapeColorKey };

function allPairs(): Pair[] {
  return kinds.flatMap((shape) => colors.map((colorKey) => ({ shape, colorKey })));
}

function samePair(a: Pair, b: Pair): boolean {
  return a.shape === b.shape && a.colorKey === b.colorKey;
}

function roundKey(round: ShapeRound): string {
  const options = round.options.map((option) => `${option.shape}:${option.colorKey}`).join('|');
  return `${round.shape}:${round.colorKey}::${options}`;
}

function sameRound(a: ShapeRound, b: ShapeRound): boolean {
  return roundKey(a) === roundKey(b);
}

export function buildShapePool(): ShapeRound[] {
  const pairs = allPairs();
  const rounds: ShapeRound[] = [];
  const seen = new Set<string>();

  for (const target of pairs) {
    const decoys = pairs.filter((pair) => !samePair(pair, target));
    for (const count of [2, 3, 4] as const) {
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const picked = shuffle(decoys).slice(0, count - 1);
        if (picked.length !== count - 1) {
          continue;
        }
        const options = shuffle([
          { ...target, correct: true },
          ...picked.map((pair) => ({ ...pair, correct: false })),
        ]);
        const round: ShapeRound = {
          shape: target.shape,
          colorKey: target.colorKey,
          options,
        };
        const key = roundKey(round);
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        rounds.push(round);
      }
    }
  }

  return shuffle(rounds);
}

function takeFirstDifferent(pool: ShapeRound[], avoid?: ShapeRound): ShapeDeck {
  if (pool.length === 0) {
    const rebuilt = buildShapePool();
    return takeFirstDifferent(rebuilt, avoid);
  }

  const first = pool[0]!;
  if (avoid && sameRound(first, avoid) && pool.length > 1) {
    const next = pool[1]!;
    return { round: next, remaining: [...pool.slice(2), first] };
  }

  return { round: first, remaining: pool.slice(1) };
}

export function createShapeDeck(avoid?: ShapeRound): ShapeDeck {
  return takeFirstDifferent(buildShapePool(), avoid);
}

export function drawShapeRound(remaining: ShapeRound[], last: ShapeRound): ShapeDeck {
  if (remaining.length === 0) {
    return createShapeDeck(last);
  }
  return takeFirstDifferent(remaining, last);
}
