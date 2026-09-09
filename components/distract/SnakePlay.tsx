import { useEffect, useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
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
import { serif } from '@/theme/fonts';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

const padKeys: { dir: SnakeDir; label: 'left' | 'up' | 'down' | 'right' }[] = [
  { dir: 'left', label: 'left' },
  { dir: 'up', label: 'up' },
  { dir: 'down', label: 'down' },
  { dir: 'right', label: 'right' },
];

function swipeDirection(dx: number, dy: number): SnakeDir | null {
  if (Math.abs(dx) < 16 && Math.abs(dy) < 16) {
    return null;
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
}

export function SnakePlay() {
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();
  const [game, setGame] = useState(createSnakeGame);
  const [dir, setDir] = useState<SnakeDir>('right');
  const [cell, setCell] = useState(28);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const snake = game.snake;
  const dots = game.dots;

  const turn = (next: SnakeDir) => {
    setDir((current) => turnSnake(current, next));
  };

  useEffect(() => {
    const id = setInterval(
      () => {
        setGame((current) => advanceSnake(current, dir));
      },
      reduceMotion ? 900 : 460,
    );
    return () => clearInterval(id);
  }, [dir, reduceMotion]);

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

  return (
    <View style={styles.root}>
      <AppText style={styles.instruction}>{t('distract.snake.instruction')}</AppText>
      <View
        onStartShouldSetResponder={beginDrag}
        onResponderRelease={endDrag}
        onResponderTerminate={() => setDrag(null)}
        style={[styles.field, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={t('distract.snake.field')}
        accessibilityHint={t('distract.snake.instruction')}
        accessibilityActions={[
          { name: 'increment', label: t('distract.snake.right') },
          { name: 'decrement', label: t('distract.snake.left') },
        ]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') {
            turn('right');
            return;
          }
          if (event.nativeEvent.actionName === 'decrement') {
            turn('left');
          }
        }}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCell(Math.max(18, Math.min(width / SNAKE_COLS, height / SNAKE_ROWS)));
        }}
      >
        <View
          accessible={false}
          importantForAccessibility="no"
          style={{ width: cell * SNAKE_COLS, height: cell * SNAKE_ROWS }}
        >
          {dots.map((dot) => (
            <View
              key={`dot-${dot.x}-${dot.y}`}
              style={[
                styles.bead,
                {
                  width: cell * 0.34,
                  height: cell * 0.34,
                  borderRadius: cell,
                  left: dot.x * cell + cell * 0.33,
                  top: dot.y * cell + cell * 0.33,
                  backgroundColor: theme.colors.clay,
                  opacity: 0.42,
                },
              ]}
            />
          ))}
          {snake.map((part, index) => (
            <View
              key={`s-${part.x}-${part.y}-${index}`}
              style={[
                styles.bead,
                {
                  width: cell * (index === 0 ? 0.72 : 0.58),
                  height: cell * (index === 0 ? 0.72 : 0.58),
                  borderRadius: cell,
                  left: part.x * cell + cell * (index === 0 ? 0.14 : 0.21),
                  top: part.y * cell + cell * (index === 0 ? 0.14 : 0.21),
                  backgroundColor: index === 0 ? theme.colors.forest : theme.colors.secondaryGreen,
                  opacity: index === 0 ? 0.92 : 0.62,
                },
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.pad}>
        {padKeys.map((item) => (
          <AccessiblePressable
            key={item.dir}
            accessibilityRole="button"
            accessibilityLabel={t(`distract.snake.${item.label}`)}
            onPress={() => turn(item.dir)}
            style={[styles.padButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <AppText tone="secondary" style={styles.padLabel}>
              {t(`distract.snake.${item.label}`)}
            </AppText>
          </AccessiblePressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  instruction: {
    fontFamily: serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '500',
    marginBottom: spacing.md,
    maxWidth: 320,
  },
  field: {
    flex: 1,
    minHeight: 280,
    borderRadius: radius.sheet,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bead: {
    position: 'absolute',
  },
  pad: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  padButton: {
    flex: 1,
    minHeight: touch.min,
    borderRadius: radius.button,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
});
