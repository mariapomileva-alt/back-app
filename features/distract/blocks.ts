import { shuffle } from './shuffle';

export const BLOCK_COLS = 5;
export const BLOCK_ROWS = 7;
export const BLOCK_COUNT = BLOCK_COLS * BLOCK_ROWS;

export function emptyBoard(): boolean[] {
  return Array.from({ length: BLOCK_COUNT }, () => false);
}

export function seedBoard(): boolean[] {
  const board = emptyBoard();
  const count = 5 + Math.floor(Math.random() * 5);
  for (const index of shuffle(board.map((_, cell) => cell)).slice(0, count)) {
    if (index !== undefined) {
      board[index] = true;
    }
  }
  return board;
}

export function toggleCell(board: boolean[], index: number): boolean[] {
  return board.map((value, cell) => (cell === index ? !value : value));
}

export function completedLineCells(board: boolean[]): number[] {
  const cells = new Set<number>();

  for (let row = 0; row < BLOCK_ROWS; row += 1) {
    const indices = Array.from({ length: BLOCK_COLS }, (_, col) => row * BLOCK_COLS + col);
    if (indices.every((index) => board[index])) {
      indices.forEach((index) => cells.add(index));
    }
  }

  for (let col = 0; col < BLOCK_COLS; col += 1) {
    const indices = Array.from({ length: BLOCK_ROWS }, (_, row) => row * BLOCK_COLS + col);
    if (indices.every((index) => board[index])) {
      indices.forEach((index) => cells.add(index));
    }
  }

  return [...cells];
}

export function clearCells(board: boolean[], indices: number[]): boolean[] {
  const removing = new Set(indices);
  return board.map((value, index) => (removing.has(index) ? false : value));
}
