import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import {
  SNAKE_COLS,
  SNAKE_ROWS,
  advanceSnake,
  createSnakeGame,
  turnSnake,
  type SnakeDir,
} from '@/features/distract/snake';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { hexToRgba, mixHex } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';
import type { AppTheme } from '@/theme/themes';

const KEY = touch.comfortable;
const PAD_GAP = spacing.xxs;
const FIELD_INSET = 10;
const TICK_MS = 580;
const TICK_REDUCED_MS = 1000;
const WEB_FOCUS: ViewStyle | null = Platform.OS === 'web' ? { outlineWidth: 0 } : null;

const chevronPath: Record<SnakeDir, string> = {
  up: 'M6 13.2 L11 8 L16 13.2',
  down: 'M6 8.8 L11 14 L16 8.8',
  left: 'M13.2 6 L8 11 L13.2 16',
  right: 'M8.8 6 L14 11 L8.8 16',
};

function gridMetrics(width: number, height: number) {
  const innerW = width - FIELD_INSET * 2;
  const innerH = height - FIELD_INSET * 2;
  if (innerW < 8 || innerH < 8) {
    return null;
  }
  // Separate axes so 10 columns span the field width and 16 rows span the field height.
  // A single square cell was width-capped, then vertically centered — the snake sat on a mid-band.
  return { cellW: innerW / SNAKE_COLS, cellH: innerH / SNAKE_ROWS, cell: Math.min(innerW / SNAKE_COLS, innerH / SNAKE_ROWS) };
}

function slotStyle(col: number, row: number, cellW: number, cellH: number, size: number) {
  return {
    left: FIELD_INSET + col * cellW + (cellW - size) / 2,
    top: FIELD_INSET + row * cellH + (cellH - size) / 2,
    width: size,
    height: size,
  };
}

function swipeDirection(dx: number, dy: number): SnakeDir | null {
  if (Math.abs(dx) < 16 && Math.abs(dy) < 16) {
    return null;
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
}

function snakePalette(theme: AppTheme) {
  const dark = theme.name === 'deepGreen';
  return {
    fieldFill: dark
      ? mixHex(theme.colors.markSurface, theme.colors.surfaceElevated, 0.35)
      : mixHex(theme.colors.surfaceSecondary, theme.colors.secondaryGreen, 0.16),
    fieldEdge: dark ? hexToRgba(theme.colors.background, 0.42) : hexToRgba(theme.colors.forest, 0.16),
    fieldBorder: dark ? hexToRgba(theme.colors.primary, 0.1) : hexToRgba(theme.colors.forest, 0.18),
    body: dark ? mixHex(theme.colors.forest, theme.colors.background, 0.48) : theme.colors.forest,
    bodyRim: dark ? hexToRgba(theme.colors.muted, 0.32) : hexToRgba(theme.colors.surface, 0.55),
    head: dark ? theme.colors.primary : mixHex(theme.colors.muted, theme.colors.surface, 0.28),
    food: theme.colors.markWarmAccent,
    foodCore: mixHex(theme.colors.markWarmAccent, dark ? theme.colors.primary : theme.colors.surface, 0.28),
    foodSheen: hexToRgba(dark ? theme.colors.primary : theme.colors.surface, 0.55),
    padSurface: dark ? theme.colors.surfaceElevated : theme.colors.surface,
    padBorder: theme.colors.border,
    padIcon: theme.colors.icon,
    padSelected: hexToRgba(theme.colors.highlight, 0.72),
    padHub: hexToRgba(theme.colors.muted, dark ? 0.35 : 0.45),
  };
}

function PadChevron({ dir, color }: { dir: SnakeDir; color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Path
        d={chevronPath[dir]}
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PadKey({
  dir,
  label,
  size,
  surface,
  border,
  selectedBorder,
  icon,
  selected,
  onPress,
}: {
  dir: SnakeDir;
  label: string;
  size: number;
  surface: string;
  border: string;
  selectedBorder: string;
  icon: string;
  selected: boolean;
  onPress: (dir: SnakeDir) => void;
}) {
  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={() => onPress(dir)}
      style={[
        styles.padKey,
        WEB_FOCUS,
        {
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          backgroundColor: surface,
          borderColor: selected ? selectedBorder : border,
          borderWidth: selected ? 1 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <PadChevron dir={dir} color={icon} />
    </AccessiblePressable>
  );
}

function Collectible({
  size,
  fill,
  core,
  sheen,
}: {
  size: number;
  fill: string;
  core: string;
  sheen: string;
}) {
  const inner = Math.max(6, size * 0.36);
  const glint = Math.max(3, size * 0.16);

  return (
    <View accessible={false} style={{ width: size, height: size, position: 'relative' }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: fill,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: (size - inner) / 2,
          left: (size - inner) / 2,
          width: inner,
          height: inner,
          borderRadius: inner,
          backgroundColor: core,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.18,
          left: size * 0.22,
          width: glint,
          height: glint,
          borderRadius: glint,
          backgroundColor: sheen,
        }}
      />
    </View>
  );
}

export function SnakePlay() {
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();
  const { height: windowHeight } = useWindowDimensions();
  const keySize = windowHeight < 760 ? touch.min : KEY;
  const palette = snakePalette(theme);
  const [game, setGame] = useState(createSnakeGame);
  const [course, setCourse] = useState<SnakeDir>('right');
  const dirRef = useRef<SnakeDir>('right');
  const [fieldBox, setFieldBox] = useState({ width: 0, height: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const snake = game.snake;
  const food = game.food;
  const grid = gridMetrics(fieldBox.width, fieldBox.height);
  const cell = grid?.cell ?? 0;

  function turn(next: SnakeDir) {
    const applied = turnSnake(dirRef.current, next);
    dirRef.current = applied;
    setCourse(applied);
  }

  useEffect(() => {
    const id = setInterval(
      () => {
        setGame((current) => advanceSnake(current, dirRef.current));
      },
      reduceMotion ? TICK_REDUCED_MS : TICK_MS,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  const beginDrag = (event: GestureResponderEvent) => {
    setDrag({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    return true;
  };

  const endDrag = (event: GestureResponderEvent) => {
    if (!drag) {
      return;
    }
    const next = swipeDirection(event.nativeEvent.pageX - drag.x, event.nativeEvent.pageY - drag.y);
    if (next) {
      turn(next);
    }
    setDrag(null);
  };

  const onStageLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setFieldBox((current) => {
      if (Math.abs(current.width - width) < 0.5 && Math.abs(current.height - height) < 0.5) {
        return current;
      }
      return { width, height };
    });
  };

  const keyProps = {
    size: keySize,
    surface: palette.padSurface,
    border: palette.padBorder,
    selectedBorder: palette.padSelected,
    icon: palette.padIcon,
    onPress: turn,
  };

  return (
    <View style={styles.root}>
      <View style={styles.stage} onLayout={onStageLayout}>
        {grid && cell > 0 ? (
          <View
            collapsable={false}
            onStartShouldSetResponder={beginDrag}
            onResponderRelease={endDrag}
            onResponderTerminate={() => setDrag(null)}
            accessible
            accessibilityRole="image"
            accessibilityLabel={t('distract.snake.field')}
            accessibilityHint={t('distract.snake.instruction')}
            style={[
              styles.field,
              {
                width: fieldBox.width,
                height: fieldBox.height,
                backgroundColor: palette.fieldFill,
                borderColor: palette.fieldBorder,
              },
            ]}
          >
            <View
              accessible={false}
              style={[styles.fieldInset, { borderColor: palette.fieldEdge, pointerEvents: 'none' }]}
            />
            <View
              accessible={false}
              style={[styles.sprite, slotStyle(food.x, food.y, grid.cellW, grid.cellH, cell * 0.84)]}
            >
              <Collectible
                size={cell * 0.84}
                fill={palette.food}
                core={palette.foodCore}
                sheen={palette.foodSheen}
              />
            </View>
            {snake.map((part, index) => {
              const isHead = index === 0;
              const size = cell * (isHead ? 0.96 : 0.8);
              return (
                <View
                  key={`s-${part.x}-${part.y}-${index}`}
                  style={[
                    styles.segment,
                    slotStyle(part.x, part.y, grid.cellW, grid.cellH, size),
                    {
                      borderRadius: isHead ? size * 0.38 : size * 0.32,
                      // Row 0 is the top of this measured field. Down increases `part.y` → `top`.
                      backgroundColor: isHead ? palette.head : palette.body,
                      borderColor: isHead ? hexToRgba(palette.head, 0.9) : palette.bodyRim,
                      zIndex: snake.length - index,
                    },
                  ]}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.stageProbe} />
        )}
      </View>
      <View style={styles.pad}>
        <PadKey dir="up" label={t('distract.snake.up')} selected={course === 'up'} {...keyProps} />
        <View style={styles.padMid}>
          <PadKey dir="left" label={t('distract.snake.left')} selected={course === 'left'} {...keyProps} />
          <View style={styles.padHub} accessible={false}>
            <View style={[styles.padPivot, { backgroundColor: palette.padHub }]} />
          </View>
          <PadKey dir="right" label={t('distract.snake.right')} selected={course === 'right'} {...keyProps} />
        </View>
        <PadKey dir="down" label={t('distract.snake.down')} selected={course === 'down'} {...keyProps} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
  },
  stage: {
    flex: 1,
    minHeight: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  stageProbe: {
    flex: 1,
  },
  field: {
    position: 'relative',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  fieldInset: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 17,
    borderWidth: 1.5,
  },
  sprite: {
    position: 'absolute',
  },
  segment: {
    position: 'absolute',
    borderWidth: 1,
  },
  pad: {
    flexShrink: 0,
    alignItems: 'center',
    alignSelf: 'center',
    gap: PAD_GAP,
    marginTop: spacing.sm,
  },
  padMid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PAD_GAP,
  },
  padHub: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padPivot: {
    width: 6,
    height: 6,
    borderRadius: radius.circle,
  },
  padKey: {
    borderRadius: radius.button,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
