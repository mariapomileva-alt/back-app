import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, View } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import {
  BLOCK_COLS,
  BLOCK_ROWS,
  canPlace,
  clearCells,
  completedAreaCells,
  createTray,
  emptyBoard,
  itemFitsBoard,
  pieceBounds,
  pieceCells,
  placedIndices,
  placePiece,
  refreshTray,
  reliefCells,
  replaceTrayItem,
  rotateTrayItem,
  type BlockColor,
  type Board,
  type Cell,
  type TrayItem,
} from '@/features/distract/blocks';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { hexToRgba } from '@/theme/colors';
import { serif } from '@/theme/fonts';
import { spacing, touch } from '@/theme/spacing';

const BOARD_GAP = 5;
const TRAY_GAP = 4;
const TRAY_CELL = 16;
const CLEAR_MS = 420;

type DragState = {
  itemId: number;
  pageX: number;
  pageY: number;
  row: number;
  col: number;
  valid: boolean;
};

type PageBox = {
  x: number;
  y: number;
};

function PieceGlyph({
  cells,
  color,
  cellSize,
  gap,
}: {
  cells: Cell[];
  color: string;
  cellSize: number;
  gap: number;
}) {
  const bounds = pieceBounds(cells);
  const occupied = new Set(cells.map((cell) => `${cell.row}:${cell.col}`));

  return (
    <View
      accessible={false}
      style={{
        width: bounds.cols * cellSize + gap * Math.max(0, bounds.cols - 1),
        gap,
      }}
    >
      {Array.from({ length: bounds.rows }, (_, row) => (
        <View key={row} style={[styles.glyphRow, { gap }]}>
          {Array.from({ length: bounds.cols }, (_, col) => (
            <View
              key={col}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: Math.max(3, Math.round(cellSize * 0.2)),
                backgroundColor: occupied.has(`${row}:${col}`) ? color : 'transparent',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function originFromPage(
  pageX: number,
  pageY: number,
  board: PageBox,
  cell: number,
  cells: Cell[],
): { row: number; col: number } {
  const stride = cell + BOARD_GAP;
  const bounds = pieceBounds(cells);
  return {
    col: Math.round((pageX - board.x) / stride - bounds.cols / 2),
    row: Math.round((pageY - board.y) / stride - bounds.rows / 2),
  };
}

function TrayPiece({
  item,
  cells,
  color,
  selected,
  surface,
  border,
  label,
  hint,
  onSelect,
  onDragBegin,
  onDragMove,
  onDragEnd,
  onDragCancel,
}: {
  item: TrayItem;
  cells: Cell[];
  color: string;
  selected: boolean;
  surface: string;
  border: string;
  label: string;
  hint: string;
  onSelect: (id: number) => void;
  onDragBegin: (id: number, pageX: number, pageY: number) => void;
  onDragMove: (pageX: number, pageY: number) => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
}) {
  const moved = useRef(false);
  const actions = useRef({
    onSelect,
    onDragBegin,
    onDragMove,
    onDragEnd,
    onDragCancel,
  });

  useEffect(() => {
    actions.current = { onSelect, onDragBegin, onDragMove, onDragEnd, onDragCancel };
  }, [onSelect, onDragBegin, onDragMove, onDragEnd, onDragCancel]);

  // Stable responder: callbacks live in a ref so drag setState does not remount the gesture.
  /* eslint-disable react-hooks/refs */
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          moved.current = false;
        },
        onPanResponderMove: (event, gesture) => {
          if (!moved.current && Math.hypot(gesture.dx, gesture.dy) > 12) {
            moved.current = true;
            actions.current.onDragBegin(item.id, event.nativeEvent.pageX, event.nativeEvent.pageY);
            return;
          }
          if (moved.current) {
            actions.current.onDragMove(event.nativeEvent.pageX, event.nativeEvent.pageY);
          }
        },
        onPanResponderRelease: () => {
          if (moved.current) {
            actions.current.onDragEnd();
            return;
          }
          actions.current.onSelect(item.id);
        },
        onPanResponderTerminate: () => {
          if (moved.current) {
            actions.current.onDragCancel();
          }
        },
      }),
    [item.id],
  );
  /* eslint-enable react-hooks/refs */

  return (
    <View
      {...pan.panHandlers}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ selected }}
      style={[
        styles.trayPiece,
        {
          borderColor: selected ? color : border,
          backgroundColor: selected ? hexToRgba(color, 0.16) : surface,
        },
      ]}
    >
      <PieceGlyph cells={cells} color={color} cellSize={TRAY_CELL} gap={TRAY_GAP} />
    </View>
  );
}

type Props = {
  onAreaClear?: () => void;
};

export function BlocksPlay({ onAreaClear }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const rootRef = useRef<View>(null);
  const boardRef = useRef<View>(null);
  const dragRef = useRef<DragState | null>(null);
  const [filled, setFilled] = useState<Board>(emptyBoard);
  const [tray, setTray] = useState(() => createTray(emptyBoard()));
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [clearing, setClearing] = useState<number[]>([]);
  const [cell, setCell] = useState<number | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [pageOrigin, setPageOrigin] = useState({ rootX: 0, rootY: 0, boardX: 0, boardY: 0 });

  const latest = useRef({ filled, tray, selectedId, clearing, cell, pageOrigin });
  useEffect(() => {
    latest.current = { filled, tray, selectedId, clearing, cell, pageOrigin };
  }, [filled, tray, selectedId, clearing, cell, pageOrigin]);

  const palette = useMemo((): Record<BlockColor, string> => {
    if (theme.name === 'deepGreen') {
      return {
        forest: theme.colors.muted,
        sage: theme.colors.secondaryGreen,
        sand: theme.colors.clay,
        cool: theme.colors.cool,
      };
    }
    return {
      forest: theme.colors.forest,
      sage: theme.colors.secondaryGreen,
      sand: theme.colors.clay,
      cool: theme.colors.cool,
    };
  }, [theme]);

  const selected = tray.find((item) => item.id === selectedId) ?? null;
  const dragItem = drag ? (tray.find((item) => item.id === drag.itemId) ?? null) : null;
  const dragCells = dragItem ? pieceCells(dragItem.kind, dragItem.rotation) : [];
  const preview =
    drag && dragItem
      ? { cells: dragCells, row: drag.row, col: drag.col, valid: drag.valid, color: dragItem.color }
      : null;

  const measurePages = () => {
    rootRef.current?.measureInWindow((rootX, rootY) => {
      boardRef.current?.measureInWindow((boardX, boardY) => {
        setPageOrigin((current) => {
          if (
            current.rootX === rootX &&
            current.rootY === rootY &&
            current.boardX === boardX &&
            current.boardY === boardY
          ) {
            return current;
          }
          return { rootX, rootY, boardX, boardY };
        });
      });
    });
  };

  const beginClear = (indices: number[], nextBoard: Board, nextTray: TrayItem[]) => {
    onAreaClear?.();
    setFilled(nextBoard);
    setTray(nextTray);
    setClearing(indices);
    setSelectedId(null);
    dragRef.current = null;
    setDrag(null);
  };

  const settle = (nextBoard: Board, nextTray: TrayItem[]) => {
    const complete = completedAreaCells(nextBoard);
    if (complete.length > 0) {
      beginClear(complete, nextBoard, nextTray);
      return;
    }

    const playable = refreshTray(nextTray, nextBoard);
    if (playable.every((item) => !itemFitsBoard(nextBoard, item))) {
      const relief = reliefCells(nextBoard);
      if (relief.length > 0) {
        beginClear(relief, nextBoard, playable);
        return;
      }
    }

    setFilled(nextBoard);
    setTray(playable);
    setSelectedId(null);
    dragRef.current = null;
    setDrag(null);
  };

  useEffect(() => {
    if (clearing.length === 0) {
      return;
    }
    const id = setTimeout(() => {
      const next = clearCells(latest.current.filled, latest.current.clearing);
      setClearing([]);
      settle(next, latest.current.tray);
    }, CLEAR_MS);
    return () => clearTimeout(id);
  }, [clearing]);

  const tryPlace = (item: TrayItem, row: number, col: number) => {
    const state = latest.current;
    if (state.clearing.length > 0) {
      return false;
    }
    const cells = pieceCells(item.kind, item.rotation);
    if (!canPlace(state.filled, cells, row, col)) {
      return false;
    }
    haptics.light();
    const nextBoard = placePiece(state.filled, cells, row, col, item.color);
    const nextTray = replaceTrayItem(state.tray, item.id, nextBoard);
    settle(nextBoard, nextTray);
    return true;
  };

  const updateDrag = (itemId: number, pageX: number, pageY: number) => {
    const state = latest.current;
    const item = state.tray.find((entry) => entry.id === itemId);
    if (!item || !state.cell) {
      return;
    }
    const cells = pieceCells(item.kind, item.rotation);
    const origin = originFromPage(
      pageX,
      pageY,
      { x: state.pageOrigin.boardX, y: state.pageOrigin.boardY },
      state.cell,
      cells,
    );
    const next = {
      itemId,
      pageX,
      pageY,
      row: origin.row,
      col: origin.col,
      valid: canPlace(state.filled, cells, origin.row, origin.col),
    };
    dragRef.current = next;
    setDrag(next);
  };

  return (
    <View ref={rootRef} style={styles.root} onLayout={measurePages}>
      <AppText style={styles.instruction}>{t('distract.blocks.instruction')}</AppText>
      <View style={styles.stage}>
        <View
          style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            const next = Math.floor(
              Math.min(
                (width - BOARD_GAP * (BLOCK_COLS - 1)) / BLOCK_COLS,
                (height - BOARD_GAP * (BLOCK_ROWS - 1)) / BLOCK_ROWS,
              ),
            );
            setCell((current) => (next > 0 && next !== current ? next : current));
          }}
        />
        {cell ? (
          <View
            ref={boardRef}
            collapsable={false}
            onLayout={measurePages}
            style={[styles.board, { width: cell * BLOCK_COLS + BOARD_GAP * (BLOCK_COLS - 1) }]}
            accessible={false}
          >
            {Array.from({ length: BLOCK_ROWS }, (_, row) => (
              <View key={row} style={styles.row}>
                {Array.from({ length: BLOCK_COLS }, (_, col) => {
                  const index = row * BLOCK_COLS + col;
                  const occupant = filled[index];
                  const isClearing = clearing.includes(index);
                  const previewHit =
                    preview &&
                    placedIndices(preview.cells, preview.row, preview.col).includes(index);
                  const previewColor = preview ? palette[preview.color] : null;
                  const fillColor = occupant
                    ? palette[occupant.color]
                    : previewHit && preview?.valid && previewColor
                      ? previewColor
                      : theme.colors.surface;

                  return (
                    <Pressable
                      key={index}
                      accessibilityRole="button"
                      accessibilityLabel={
                        selected
                          ? t('distract.blocks.cellPlace', {
                              piece: t(`distract.blocks.pieces.${selected.kind}`),
                              row: row + 1,
                              col: col + 1,
                            })
                          : occupant
                            ? t('distract.blocks.cellFilled', { row: row + 1, col: col + 1 })
                            : t('distract.blocks.cellEmpty', { row: row + 1, col: col + 1 })
                      }
                      onPress={() => {
                        if (!selected) {
                          return;
                        }
                        tryPlace(selected, row, col);
                      }}
                      style={[
                        styles.cell,
                        {
                          width: cell,
                          height: cell,
                          backgroundColor: fillColor,
                          borderColor: theme.colors.border,
                          opacity: isClearing ? 0.28 : previewHit && preview && !preview.valid ? 0.7 : 1,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        ) : null}
      </View>
      <View style={styles.trayBlock}>
        <View style={styles.tray} accessibilityLabel={t('distract.blocks.tray')}>
          {tray.map((item) => {
            const cells = pieceCells(item.kind, item.rotation);
            const color = palette[item.color];
            const isSelected = item.id === selectedId;
            return (
              <TrayPiece
                key={item.id}
                item={item}
                cells={cells}
                color={color}
                selected={isSelected}
                surface={theme.colors.surface}
                border={theme.colors.border}
                label={t(`distract.blocks.pieces.${item.kind}`)}
                hint={isSelected ? t('distract.blocks.placeHint') : t('distract.blocks.selectHint')}
                onSelect={(id) => {
                  if (latest.current.clearing.length > 0) {
                    return;
                  }
                  if (latest.current.selectedId === id) {
                    haptics.selection();
                    setTray((current) => rotateTrayItem(current, id));
                    return;
                  }
                  haptics.selection();
                  setSelectedId(id);
                }}
                onDragBegin={(id, pageX, pageY) => {
                  if (latest.current.clearing.length > 0) {
                    return;
                  }
                  measurePages();
                  setSelectedId(id);
                  updateDrag(id, pageX, pageY);
                }}
                onDragMove={(pageX, pageY) => {
                  const itemId = dragRef.current?.itemId;
                  if (itemId == null) {
                    return;
                  }
                  updateDrag(itemId, pageX, pageY);
                }}
                onDragEnd={() => {
                  const current = dragRef.current;
                  const item = current
                    ? (latest.current.tray.find((entry) => entry.id === current.itemId) ?? null)
                    : null;
                  if (!current || !item) {
                    dragRef.current = null;
                    setDrag(null);
                    return;
                  }
                  const placed = tryPlace(item, current.row, current.col);
                  if (!placed) {
                    dragRef.current = null;
                    setDrag(null);
                  }
                }}
                onDragCancel={() => {
                  dragRef.current = null;
                  setDrag(null);
                }}
              />
            );
          })}
        </View>
        <AccessiblePressable
          accessibilityRole="button"
          accessibilityLabel={t('distract.blocks.turn')}
          accessibilityHint={t('distract.blocks.turnHint')}
          disabled={!selected}
          onPress={() => {
            if (!selected) {
              return;
            }
            haptics.selection();
            setTray((current) => rotateTrayItem(current, selected.id));
          }}
          style={[
            styles.turn,
            {
              borderColor: selected ? theme.colors.border : 'transparent',
              backgroundColor: selected ? theme.colors.surface : 'transparent',
              opacity: selected ? 1 : 0.45,
            },
          ]}
        >
          <AppText variant="secondary">{t('distract.blocks.turn')}</AppText>
        </AccessiblePressable>
      </View>
      {drag && dragItem && cell ? (
        <View
          style={[
            styles.ghost,
            {
              left: drag.pageX - pageOrigin.rootX - (pieceBounds(dragCells).cols * cell) / 2,
              top: drag.pageY - pageOrigin.rootY - (pieceBounds(dragCells).rows * cell) / 2,
            },
          ]}
        >
          <PieceGlyph cells={dragCells} color={palette[dragItem.color]} cellSize={cell} gap={BOARD_GAP} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
  },
  instruction: {
    flexShrink: 0,
    fontFamily: serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '500',
    marginBottom: spacing.md,
    maxWidth: 340,
  },
  stage: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  board: {
    gap: BOARD_GAP,
  },
  row: {
    flexDirection: 'row',
    gap: BOARD_GAP,
  },
  cell: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  trayBlock: {
    flexShrink: 0,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  tray: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: touch.min,
  },
  trayPiece: {
    flex: 1,
    minWidth: touch.min,
    minHeight: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 2,
    paddingVertical: spacing.xs,
  },
  glyphRow: {
    flexDirection: 'row',
  },
  turn: {
    alignSelf: 'flex-start',
    minHeight: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  ghost: {
    position: 'absolute',
    zIndex: 4,
    pointerEvents: 'none',
  },
});
