import { pick, shuffle } from './shuffle';

export const BLOCK_COLS = 6;
export const BLOCK_ROWS = 7;
export const BLOCK_COUNT = BLOCK_COLS * BLOCK_ROWS;
export const TRAY_SIZE = 3;

export type BlockColor = 'forest' | 'sage' | 'sand' | 'cool';

export type Cell = {
  row: number;
  col: number;
};

export type PieceKind = 'twin' | 'bar' | 'elbow' | 'tile' | 'arch';

export type PlacedCell = {
  color: BlockColor;
} | null;

export type Board = PlacedCell[];

export type TrayItem = {
  id: number;
  kind: PieceKind;
  rotation: 0 | 1 | 2 | 3;
  color: BlockColor;
};

const KINDS: PieceKind[] = ['twin', 'bar', 'elbow', 'tile', 'arch'];
const COLORS: BlockColor[] = ['forest', 'sage', 'sand', 'cool'];

const SHAPES: Record<PieceKind, Cell[]> = {
  twin: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
  ],
  bar: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ],
  elbow: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ],
  tile: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ],
  arch: [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
  ],
};

let nextPieceId = 1;

function nextId(): number {
  nextPieceId += 1;
  return nextPieceId;
}

export function emptyBoard(): Board {
  return Array.from({ length: BLOCK_COUNT }, () => null);
}

export function indexOf(row: number, col: number): number {
  return row * BLOCK_COLS + col;
}

export function rotateCells(cells: Cell[], turns: number): Cell[] {
  const count = ((turns % 4) + 4) % 4;
  let next = cells;
  for (let step = 0; step < count; step += 1) {
    next = next.map((cell) => ({ row: cell.col, col: -cell.row }));
  }
  const minRow = Math.min(...next.map((cell) => cell.row));
  const minCol = Math.min(...next.map((cell) => cell.col));
  return next.map((cell) => ({ row: cell.row - minRow, col: cell.col - minCol }));
}

export function pieceCells(kind: PieceKind, rotation: number): Cell[] {
  return rotateCells(SHAPES[kind], rotation);
}

export function pieceBounds(cells: Cell[]): { rows: number; cols: number } {
  return {
    rows: Math.max(...cells.map((cell) => cell.row)) + 1,
    cols: Math.max(...cells.map((cell) => cell.col)) + 1,
  };
}

function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

function shapeKey(cells: Cell[]): string {
  return cells.map(cellKey).sort().join('|');
}

export function uniqueRotations(kind: PieceKind): (0 | 1 | 2 | 3)[] {
  const seen = new Set<string>();
  const rotations: (0 | 1 | 2 | 3)[] = [];
  for (const turn of [0, 1, 2, 3] as const) {
    const key = shapeKey(pieceCells(kind, turn));
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    rotations.push(turn);
  }
  return rotations;
}

export function nextRotation(kind: PieceKind, rotation: 0 | 1 | 2 | 3): 0 | 1 | 2 | 3 {
  const options = uniqueRotations(kind);
  const index = options.indexOf(rotation);
  return options[(index + 1) % options.length] ?? 0;
}

export function canPlace(board: Board, cells: Cell[], row: number, col: number): boolean {
  return cells.every((cell) => {
    const nextRow = row + cell.row;
    const nextCol = col + cell.col;
    if (nextRow < 0 || nextCol < 0 || nextRow >= BLOCK_ROWS || nextCol >= BLOCK_COLS) {
      return false;
    }
    return board[indexOf(nextRow, nextCol)] == null;
  });
}

export function placedIndices(cells: Cell[], row: number, col: number): number[] {
  return cells.map((cell) => indexOf(row + cell.row, col + cell.col));
}

export function placePiece(
  board: Board,
  cells: Cell[],
  row: number,
  col: number,
  color: BlockColor,
): Board {
  const next = [...board];
  for (const cell of cells) {
    next[indexOf(row + cell.row, col + cell.col)] = { color };
  }
  return next;
}

export function fitsAnywhere(board: Board, cells: Cell[]): boolean {
  const bounds = pieceBounds(cells);
  for (let row = 0; row <= BLOCK_ROWS - bounds.rows; row += 1) {
    for (let col = 0; col <= BLOCK_COLS - bounds.cols; col += 1) {
      if (canPlace(board, cells, row, col)) {
        return true;
      }
    }
  }
  return false;
}

export function itemFitsBoard(board: Board, item: TrayItem): boolean {
  return uniqueRotations(item.kind).some((rotation) =>
    fitsAnywhere(board, pieceCells(item.kind, rotation)),
  );
}

export function completedAreaCells(board: Board): number[] {
  const cells = new Set<number>();

  for (let row = 0; row < BLOCK_ROWS; row += 1) {
    const indices = Array.from({ length: BLOCK_COLS }, (_, col) => indexOf(row, col));
    if (indices.every((index) => board[index])) {
      indices.forEach((index) => cells.add(index));
    }
  }

  for (let col = 0; col < BLOCK_COLS; col += 1) {
    const indices = Array.from({ length: BLOCK_ROWS }, (_, row) => indexOf(row, col));
    if (indices.every((index) => board[index])) {
      indices.forEach((index) => cells.add(index));
    }
  }

  return [...cells];
}

export function clearCells(board: Board, indices: number[]): Board {
  const removing = new Set(indices);
  return board.map((value, index) => (removing.has(index) ? null : value));
}

function filledCount(board: Board, indices: number[]): number {
  return indices.reduce((count, index) => count + (board[index] ? 1 : 0), 0);
}

export function reliefCells(board: Board): number[] {
  let best: number[] = [];
  let bestCount = 0;

  for (let row = 0; row < BLOCK_ROWS; row += 1) {
    const indices = Array.from({ length: BLOCK_COLS }, (_, col) => indexOf(row, col));
    const count = filledCount(board, indices);
    if (count > bestCount) {
      best = indices;
      bestCount = count;
    }
  }

  for (let col = 0; col < BLOCK_COLS; col += 1) {
    const indices = Array.from({ length: BLOCK_ROWS }, (_, row) => indexOf(row, col));
    const count = filledCount(board, indices);
    if (count > bestCount) {
      best = indices;
      bestCount = count;
    }
  }

  return bestCount > 0 ? best : [];
}

function makeItem(kind: PieceKind, color?: BlockColor, rotation?: 0 | 1 | 2 | 3): TrayItem {
  const turns = uniqueRotations(kind);
  return {
    id: nextId(),
    kind,
    rotation: rotation ?? pick(turns) ?? 0,
    color: color ?? pick(COLORS) ?? 'sage',
  };
}

function kindFits(board: Board, kind: PieceKind): boolean {
  return uniqueRotations(kind).some((rotation) => fitsAnywhere(board, pieceCells(kind, rotation)));
}

export function createTrayItem(board: Board, avoid: PieceKind[] = []): TrayItem {
  const preferred = shuffle(KINDS.filter((kind) => !avoid.includes(kind) && kindFits(board, kind)));
  const fallback = shuffle(KINDS.filter((kind) => kindFits(board, kind)));
  const kind = preferred[0] ?? fallback[0] ?? 'twin';
  return makeItem(kind);
}

export function createTray(board: Board = emptyBoard()): TrayItem[] {
  const tray: TrayItem[] = [];
  for (let index = 0; index < TRAY_SIZE; index += 1) {
    tray.push(createTrayItem(board, tray.map((item) => item.kind)));
  }
  return tray;
}

export function replaceTrayItem(tray: TrayItem[], id: number, board: Board): TrayItem[] {
  return tray.map((item) =>
    item.id === id ? createTrayItem(board, tray.filter((entry) => entry.id !== id).map((entry) => entry.kind)) : item,
  );
}

export function refreshTray(tray: TrayItem[], board: Board): TrayItem[] {
  const next: TrayItem[] = [];
  for (const item of tray) {
    next.push(itemFitsBoard(board, item) ? item : createTrayItem(board, next.map((entry) => entry.kind)));
  }
  return next;
}

export function rotateTrayItem(tray: TrayItem[], id: number): TrayItem[] {
  return tray.map((item) =>
    item.id === id ? { ...item, rotation: nextRotation(item.kind, item.rotation) } : item,
  );
}
