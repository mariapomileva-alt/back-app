export type SnakePoint = {
  x: number;
  y: number;
};

export type SnakeDir = 'up' | 'down' | 'left' | 'right';

export const SNAKE_COLS = 10;
export const SNAKE_ROWS = 12;
export const SNAKE_MAX_LENGTH = 16;
export const SNAKE_DOT_COUNT = 5;
const RECENT_LIMIT = 10;

const delta: Record<SnakeDir, SnakePoint> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const opposite: Record<SnakeDir, SnakeDir> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function sameCell(a: SnakePoint, b: SnakePoint): boolean {
  return a.x === b.x && a.y === b.y;
}

export function turnSnake(current: SnakeDir, next: SnakeDir): SnakeDir {
  return opposite[current] === next ? current : next;
}

export function wrapCell(point: SnakePoint, cols = SNAKE_COLS, rows = SNAKE_ROWS): SnakePoint {
  return {
    x: ((point.x % cols) + cols) % cols,
    y: ((point.y % rows) + rows) % rows,
  };
}

export function stepHead(head: SnakePoint, dir: SnakeDir, cols = SNAKE_COLS, rows = SNAKE_ROWS): SnakePoint {
  const move = delta[dir];
  return wrapCell({ x: head.x + move.x, y: head.y + move.y }, cols, rows);
}

export function occupied(cells: SnakePoint[], point: SnakePoint): boolean {
  return cells.some((cell) => sameCell(cell, point));
}

export function spawnDot(
  blocked: SnakePoint[],
  recent: SnakePoint[] = [],
  cols = SNAKE_COLS,
  rows = SNAKE_ROWS,
): SnakePoint {
  const prefer: SnakePoint[] = [];
  const fallback: SnakePoint[] = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const point = { x, y };
      if (occupied(blocked, point)) {
        continue;
      }
      if (occupied(recent, point)) {
        fallback.push(point);
      } else {
        prefer.push(point);
      }
    }
  }

  const open = prefer.length > 0 ? prefer : fallback;
  return open[Math.floor(Math.random() * open.length)] ?? { x: 0, y: 0 };
}

export function initialSnake(): SnakePoint[] {
  const startX = 2 + Math.floor(Math.random() * 4);
  const startY = 3 + Math.floor(Math.random() * 6);
  return [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];
}

export function initialDots(snake: SnakePoint[]): SnakePoint[] {
  const dots: SnakePoint[] = [];
  for (let i = 0; i < SNAKE_DOT_COUNT; i += 1) {
    dots.push(spawnDot([...snake, ...dots]));
  }
  return dots;
}

export type SnakeGame = {
  snake: SnakePoint[];
  dots: SnakePoint[];
  recent: SnakePoint[];
};

export function createSnakeGame(): SnakeGame {
  const snake = initialSnake();
  return { snake, dots: initialDots(snake), recent: [] };
}

export function advanceSnake(game: SnakeGame, dir: SnakeDir): SnakeGame {
  const head = game.snake[0];
  if (!head) {
    return game;
  }

  const nextHead = stepHead(head, dir);
  const collected = game.dots.find((dot) => sameCell(dot, nextHead));
  const grew = Boolean(collected) && game.snake.length < SNAKE_MAX_LENGTH;
  const nextSnake = grew ? [nextHead, ...game.snake] : [nextHead, ...game.snake.slice(0, -1)];
  const remaining = game.dots.filter((dot) => !sameCell(dot, nextHead));

  if (!collected) {
    return { snake: nextSnake, dots: remaining, recent: game.recent };
  }

  const recent = [...game.recent, collected].slice(-RECENT_LIMIT);
  remaining.push(spawnDot([...nextSnake, ...remaining], recent));
  return { snake: nextSnake, dots: remaining, recent };
}
