import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/typography/AppText';
import { fragmentDelayMs, isFocalWord } from '@/features/read/reveal';
import type { ReadRevealSpeed, RevealFragment } from '@/features/read/types';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing, touch } from '@/theme/spacing';

const FADE_MS = 860;
const MOVE_MS = 980;
const RISE_PX = 8;
const ANCHOR = 0.7;
const EASE_OUT = Easing.bezier(0.4, 0, 0.2, 1);

type Props = {
  fragments: RevealFragment[];
  revealedCount: number;
  onReveal: () => void;
  speed: ReadRevealSpeed;
};

function recencyOpacity(indexFromNewest: number): number {
  if (indexFromNewest <= 0) {
    return 1;
  }
  if (indexFromNewest === 1) {
    return 0.82;
  }
  if (indexFromNewest === 2) {
    return 0.62;
  }
  if (indexFromNewest === 3) {
    return 0.42;
  }
  return 0.24;
}

function ReadLine({
  fragment,
  recency,
  top,
  reduceMotion,
  onHeight,
}: {
  fragment: RevealFragment;
  recency: number;
  top: number;
  reduceMotion: boolean;
  onHeight: (id: string, height: number) => void;
}) {
  const opacity = useSharedValue(reduceMotion ? recencyOpacity(recency) : 0);
  const rise = useSharedValue(reduceMotion ? 0 : RISE_PX);
  const entered = useRef(false);

  useEffect(() => {
    const target = recencyOpacity(recency);
    if (reduceMotion) {
      opacity.value = target;
      rise.value = 0;
      entered.current = true;
      return;
    }
    opacity.value = withTiming(target, { duration: FADE_MS, easing: EASE_OUT });
    if (!entered.current) {
      rise.value = withTiming(0, { duration: FADE_MS, easing: EASE_OUT });
      entered.current = true;
    }
  }, [opacity, recency, reduceMotion, rise]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: rise.value }],
  }));
  const focal = isFocalWord(fragment.text);

  return (
    <View
      collapsable={false}
      style={[styles.line, { top }]}
      onLayout={(event) => onHeight(fragment.id, event.nativeEvent.layout.height)}
    >
      <Animated.View style={style}>
        <AppText variant="instruction" style={[styles.phrase, focal ? styles.focal : null]}>
          {fragment.text}
        </AppText>
      </Animated.View>
    </View>
  );
}

export function ReadingCanvas({ fragments, revealedCount, onReveal, speed }: Props) {
  const reduceMotion = useReduceMotion();
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const placed = useRef(false);
  const shown = useSharedValue(0);
  const offset = useSharedValue(0);
  const visibleCount = Math.min(Math.max(revealedCount, 1), fragments.length);
  const visible = fragments.slice(0, visibleCount);
  const current = visible[visible.length - 1];
  const complete = visibleCount >= fragments.length;

  const layout = useMemo(() => {
    const tops: Record<string, number> = {};
    let y = 0;
    for (const fragment of visible) {
      tops[fragment.id] = y;
      y += heights[fragment.id] ?? 0;
    }
    return { tops, total: y };
  }, [heights, visible]);

  const onHeight = useCallback((id: string, height: number) => {
    setHeights((currentHeights) => {
      const previous = currentHeights[id];
      if (previous !== undefined && Math.abs(previous - height) < 0.6) {
        return currentHeights;
      }
      return { ...currentHeights, [id]: height };
    });
  }, []);

  useEffect(() => {
    if (complete || !current) {
      return;
    }
    const delay = fragmentDelayMs(current.text, speed, current.kind);
    const wait = reduceMotion ? Math.round(delay * 0.55) : delay;
    const id = setTimeout(onReveal, wait);
    return () => clearTimeout(id);
  }, [complete, current, onReveal, reduceMotion, speed, visibleCount]);

  useLayoutEffect(() => {
    if (canvasHeight <= 0 || layout.total <= 0) {
      return;
    }
    const target = canvasHeight * ANCHOR - layout.total;
    if (reduceMotion || !placed.current) {
      offset.value = target;
      shown.value = 1;
      placed.current = true;
      return;
    }
    offset.value = withTiming(target, { duration: MOVE_MS, easing: EASE_OUT });
  }, [canvasHeight, layout.total, offset, reduceMotion, shown]);

  const columnStyle = useAnimatedStyle(() => ({
    opacity: shown.value,
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={current?.text ?? t('home.tools.read')}
      accessibilityHint={t('read.revealHint')}
      onPress={onReveal}
      onLayout={(event) => {
        const next = event.nativeEvent.layout.height;
        setCanvasHeight((currentHeight) => (Math.abs(currentHeight - next) < 1 ? currentHeight : next));
      }}
      style={styles.stage}
    >
      <Animated.View
        accessible={false}
        pointerEvents="box-none"
        style={[styles.stack, { height: layout.total }, columnStyle]}
      >
        {visible.map((fragment, index) => (
          <ReadLine
            key={fragment.id}
            fragment={fragment}
            recency={visible.length - 1 - index}
            top={layout.tops[fragment.id] ?? 0}
            reduceMotion={reduceMotion}
            onHeight={onHeight}
          />
        ))}
        {current?.kind === 'choice' && current.options && current.options.length > 0 ? (
          <View style={[styles.choices, { top: layout.total }]}>
            {current.options.map((option) => (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityLabel={option}
                onPress={onReveal}
                style={({ pressed }) => [styles.choice, { opacity: pressed ? 0.7 : 0.82 }]}
              >
                <AppText variant="secondary" tone="secondary" style={styles.choiceLabel}>
                  {option}
                </AppText>
              </Pressable>
            ))}
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    overflow: 'hidden',
  },
  stack: {
    position: 'relative',
    overflow: 'visible',
    width: '100%',
    maxWidth: 332,
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingBottom: spacing.sm,
  },
  phrase: {
    fontFamily: serif,
    fontWeight: '500',
    fontSize: 27,
    lineHeight: 40,
    letterSpacing: -0.2,
  },
  focal: {
    fontSize: 34,
    lineHeight: 44,
    letterSpacing: 1.4,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  choices: {
    position: 'absolute',
    left: 0,
    right: 0,
    gap: spacing.xs,
    alignItems: 'flex-start',
  },
  choice: {
    minHeight: touch.min - 8,
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  choiceLabel: {
    fontFamily: serif,
    fontSize: 18,
    lineHeight: 24,
  },
});
