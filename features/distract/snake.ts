export type SnakePoint = {
  x: number;
  y: number;
};

export type SnakeDir = 'up' | 'down' | 'left' | 'right';

export const SNAKE_COLS = 10;
export const SNAKE_ROWS = 16;
export const SNAKE_MAX_LENGTH = 16;
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

export function spawnFood(
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
  const startX = 4 + Math.floor(Math.random() * 4);
  const startY = 6 + Math.floor(Math.random() * 5);
  return [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
    { x: startX - 3, y: startY },
    { x: startX - 4, y: startY },
  ];
}

export type SnakeGame = {
  snake: SnakePoint[];
  food: SnakePoint;
  recent: SnakePoint[];
};

export function createSnakeGame(): SnakeGame {
  const snake = initialSnake();
  return { snake, food: spawnFood(snake), recent: [] };
}

export function advanceSnake(game: SnakeGame, dir: SnakeDir): SnakeGame {
  const head = game.snake[0];
  if (!head) {
    return game;
  }

  const nextHead = stepHead(head, dir);
  const collected = sameCell(game.food, nextHead);
  const grew = collected && game.snake.length < SNAKE_MAX_LENGTH;
  const nextSnake = grew ? [nextHead, ...game.snake] : [nextHead, ...game.snake.slice(0, -1)];

  if (!collected) {
    return { snake: nextSnake, food: game.food, recent: game.recent };
  }

  const recent = [...game.recent, game.food].slice(-RECENT_LIMIT);
  return { snake: nextSnake, food: spawnFood(nextSnake, recent), recent };
}
