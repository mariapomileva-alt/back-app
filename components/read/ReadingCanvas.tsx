import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/typography/AppText';
import { fragmentDelayMs, isFocalWord } from '@/features/read/reveal';
import type { ReadRevealSpeed, RevealFragment } from '@/features/read/types';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing, touch } from '@/theme/spacing';

const FADE_IN_MS = 380;
const FADE_OUT_MS = 480;
const REDUCE_FADE_MS = 200;
const SCROLL_MS = 520;
const ENTER_RISE_PX = 6;
const ESTIMATED_LINE = 48;
const MAX_ON_CANVAS = 8;
const TOP_RATIO = 0.22;
const BOTTOM_RATIO = 0.88;
const EASE_OUT = Easing.bezier(0.4, 0, 0.2, 1);
const CSS_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const USE_CSS_FADE = Platform.OS === 'web';

type Props = {
  fragments: RevealFragment[];
  revealedCount: number;
  onReveal: () => void;
  speed: ReadRevealSpeed;
  paused?: boolean;
};

type PlacedFragment = {
  fragment: RevealFragment;
  top: number;
  recency: number;
  leaving: boolean;
};

type LineMotion = {
  fragment: RevealFragment;
  recency: number;
  newest: boolean;
  reduceMotion: boolean;
  leaving: boolean;
};

function recencyOpacity(indexFromNewest: number): number {
  if (indexFromNewest <= 0) {
    return 1;
  }
  if (indexFromNewest === 1) {
    return 0.9;
  }
  if (indexFromNewest === 2) {
    return 0.74;
  }
  if (indexFromNewest === 3) {
    return 0.54;
  }
  if (indexFromNewest === 4) {
    return 0.38;
  }
  return 0.24;
}

function recencyShiftY(indexFromNewest: number, leaving: boolean): number {
  if (leaving) {
    return -8;
  }
  if (indexFromNewest <= 0) {
    return 0;
  }
  return -Math.min(4 + (indexFromNewest - 1) * 2, 10);
}

function fadeDurationMs(leaving: boolean, newest: boolean, reduceMotion: boolean): number {
  if (reduceMotion) {
    return REDUCE_FADE_MS;
  }
  if (leaving || !newest) {
    return FADE_OUT_MS;
  }
  return FADE_IN_MS;
}

function scrollDurationMs(reduceMotion: boolean): number {
  return reduceMotion ? 0 : SCROLL_MS;
}

function cssScrollStyle(durationMs: number) {
  if (durationMs <= 0) {
    return null;
  }
  return {
    transitionProperty: 'top',
    transitionDuration: `${durationMs}ms`,
    transitionTimingFunction: CSS_EASE,
  };
}

function lineHeight(heights: Record<string, number>, id: string): number {
  return heights[id] ?? ESTIMATED_LINE;
}

function pickVisible(
  fragments: RevealFragment[],
  revealedCount: number,
  heights: Record<string, number>,
  canvasHeight: number,
): { items: RevealFragment[]; filled: boolean } {
  const revealed = fragments.slice(0, Math.min(Math.max(revealedCount, 1), fragments.length));
  if (canvasHeight <= 0) {
    return { items: revealed.slice(-1), filled: false };
  }

  const available = canvasHeight * (BOTTOM_RATIO - TOP_RATIO);
  const items: RevealFragment[] = [];
  let used = 0;

  for (let index = revealed.length - 1; index >= 0; index -= 1) {
    const fragment = revealed[index];
    if (!fragment) {
      continue;
    }
    const height = lineHeight(heights, fragment.id);
    if (items.length > 0 && (used + height > available || items.length >= MAX_ON_CANVAS)) {
      break;
    }
    items.unshift(fragment);
    used += height;
  }

  return { items, filled: items.length < revealed.length };
}

function cssFadeStyle(opacity: number, translateY: number, durationMs: number, move: boolean) {
  return {
    opacity,
    transform: [{ translateY }],
    transitionProperty: move ? 'opacity, transform' : 'opacity',
    transitionDuration: `${durationMs}ms`,
    transitionTimingFunction: CSS_EASE,
  };
}

function LineCopy({ fragment, newest, leaving }: { fragment: RevealFragment; newest: boolean; leaving: boolean }) {
  const focal = isFocalWord(fragment.text);
  return (
    <AppText
      variant="instruction"
      accessibilityLiveRegion={newest && !leaving ? 'polite' : 'none'}
      style={[styles.phrase, focal ? styles.focal : null]}
    >
      {fragment.text}
    </AppText>
  );
}

function WebFade({ fragment, recency, newest, reduceMotion, leaving }: LineMotion) {
  const targetOpacity = leaving ? 0 : recencyOpacity(recency);
  const targetY = reduceMotion ? 0 : recencyShiftY(recency, leaving);
  const duration = fadeDurationMs(leaving, newest, reduceMotion);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPainted(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  const opacity = painted ? targetOpacity : newest && !leaving ? 0 : targetOpacity;
  const translateY = painted || reduceMotion ? targetY : newest && !leaving ? ENTER_RISE_PX : targetY;

  return (
    <View style={cssFadeStyle(opacity, translateY, duration, !reduceMotion)}>
      <LineCopy fragment={fragment} newest={newest} leaving={leaving} />
    </View>
  );
}

function NativeFade({ fragment, recency, newest, reduceMotion, leaving }: LineMotion) {
  const opacity = useSharedValue(0);
  const shift = useSharedValue(reduceMotion || !newest ? 0 : ENTER_RISE_PX);

  useEffect(() => {
    const target = leaving ? 0 : recencyOpacity(recency);
    const duration = fadeDurationMs(leaving, newest, reduceMotion);
    opacity.value = withTiming(target, { duration, easing: EASE_OUT });
    shift.value = withTiming(reduceMotion ? 0 : recencyShiftY(recency, leaving), {
      duration,
      easing: EASE_OUT,
    });
  }, [leaving, newest, opacity, recency, reduceMotion, shift]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: shift.value }],
  }));

  return (
    <Animated.View style={style}>
      <LineCopy fragment={fragment} newest={newest} leaving={leaving} />
    </Animated.View>
  );
}

function WebScrollLine({
  top,
  reduceMotion,
  onHeight,
  children,
}: {
  top: number;
  reduceMotion: boolean;
  onHeight: (height: number) => void;
  children: ReactNode;
}) {
  const previousTop = useRef<number | null>(null);
  const [scrollMs, setScrollMs] = useState(0);

  useLayoutEffect(() => {
    const duration =
      previousTop.current !== null && previousTop.current !== top ? scrollDurationMs(reduceMotion) : 0;
    previousTop.current = top;
    setScrollMs(duration);
  }, [reduceMotion, top]);

  return (
    <View
      collapsable={false}
      style={[styles.line, { top }, cssScrollStyle(scrollMs)]}
      onLayout={(event) => onHeight(event.nativeEvent.layout.height)}
    >
      {children}
    </View>
  );
}

function NativeScrollLine({
  top,
  reduceMotion,
  onHeight,
  children,
}: {
  top: number;
  reduceMotion: boolean;
  onHeight: (height: number) => void;
  children: ReactNode;
}) {
  const animatedTop = useSharedValue(top);
  const previousTop = useRef<number | null>(null);

  useEffect(() => {
    const duration =
      previousTop.current !== null && previousTop.current !== top ? scrollDurationMs(reduceMotion) : 0;
    previousTop.current = top;
    if (duration <= 0) {
      animatedTop.value = top;
      return;
    }
    animatedTop.value = withTiming(top, { duration, easing: EASE_OUT });
  }, [animatedTop, reduceMotion, top]);

  const scrollStyle = useAnimatedStyle(() => ({
    top: animatedTop.value,
  }));

  return (
    <Animated.View
      collapsable={false}
      style={[styles.line, scrollStyle]}
      onLayout={(event) => onHeight(event.nativeEvent.layout.height)}
    >
      {children}
    </Animated.View>
  );
}

function ReadLine({
  fragment,
  recency,
  top,
  newest,
  reduceMotion,
  leaving,
  onHeight,
}: LineMotion & {
  top: number;
  onHeight: (id: string, height: number) => void;
}) {
  const fade = USE_CSS_FADE ? (
    <WebFade
      fragment={fragment}
      recency={recency}
      newest={newest}
      reduceMotion={reduceMotion}
      leaving={leaving}
    />
  ) : (
    <NativeFade
      fragment={fragment}
      recency={recency}
      newest={newest}
      reduceMotion={reduceMotion}
      leaving={leaving}
    />
  );

  const onLineHeight = useCallback(
    (height: number) => onHeight(fragment.id, height),
    [fragment.id, onHeight],
  );

  if (USE_CSS_FADE) {
    return (
      <WebScrollLine top={top} reduceMotion={reduceMotion} onHeight={onLineHeight}>
        {fade}
      </WebScrollLine>
    );
  }

  return (
    <NativeScrollLine top={top} reduceMotion={reduceMotion} onHeight={onLineHeight}>
      {fade}
    </NativeScrollLine>
  );
}

export function ReadingCanvas({ fragments, revealedCount, onReveal, speed, paused = false }: Props) {
  const reduceMotion = useReduceMotion();
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [departing, setDeparting] = useState<PlacedFragment[]>([]);
  const previousIds = useRef<string[]>([]);
  const previousTops = useRef<Record<string, number>>({});
  const visibleCount = Math.min(Math.max(revealedCount, 1), fragments.length);
  const current = fragments[visibleCount - 1];

  const fitted = useMemo(
    () => pickVisible(fragments, visibleCount, heights, canvasHeight),
    [canvasHeight, fragments, heights, visibleCount],
  );

  const layout = useMemo(() => {
    const tops: Record<string, number> = {};
    const topEdge = canvasHeight * TOP_RATIO;
    let y = topEdge;
    for (const fragment of fitted.items) {
      tops[fragment.id] = y;
      y += lineHeight(heights, fragment.id);
    }
    return { tops, topEdge };
  }, [canvasHeight, fitted.items, heights]);

  useEffect(() => {
    const nextIds = fitted.items.map((item) => item.id);
    const left = previousIds.current.filter((id) => !nextIds.includes(id));
    const leftTops = previousTops.current;
    previousIds.current = nextIds;
    previousTops.current = layout.tops;
    if (left.length === 0) {
      return;
    }

    setDeparting(
      left.map((id) => {
        const fragment = fragments.find((item) => item.id === id);
        return {
          fragment: fragment ?? { id, itemId: id, kind: 'observation' as const, text: '' },
          top: leftTops[id] ?? layout.topEdge,
          recency: 6,
          leaving: true,
        };
      }),
    );
    const hold = (reduceMotion ? REDUCE_FADE_MS : FADE_OUT_MS) + 40;
    const timer = setTimeout(() => setDeparting([]), hold);
    return () => clearTimeout(timer);
  }, [fitted.items, fragments, layout.topEdge, layout.tops, reduceMotion]);

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
    if (paused || !current || visibleCount >= fragments.length) {
      return;
    }
    const delay = fragmentDelayMs(current.text, speed, current.kind);
    const wait = reduceMotion ? Math.round(delay * 0.65) : delay;
    const timer = setTimeout(onReveal, wait);
    return () => clearTimeout(timer);
  }, [current, fragments.length, onReveal, paused, reduceMotion, speed, visibleCount]);

  const visibleIds = new Set(fitted.items.map((item) => item.id));
  const placed: PlacedFragment[] = [
    ...departing.filter((item) => !visibleIds.has(item.fragment.id)),
    ...fitted.items.map((fragment, index) => ({
      fragment,
      top: layout.tops[fragment.id] ?? layout.topEdge,
      recency: fitted.items.length - 1 - index,
      leaving: false,
    })),
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('read.canvas')}
      accessibilityHint={paused ? t('read.pausedHint') : t('read.revealHint')}
      onPress={onReveal}
      onLayout={(event) => {
        const next = event.nativeEvent.layout.height;
        setCanvasHeight((currentHeight) => (Math.abs(currentHeight - next) < 1 ? currentHeight : next));
      }}
      style={styles.stage}
    >
      <View accessible={false} style={styles.stack}>
        {placed.map((item) => (
          <ReadLine
            key={item.fragment.id}
            fragment={item.fragment}
            recency={item.recency}
            top={item.top}
            newest={!item.leaving && item.recency === 0}
            reduceMotion={reduceMotion}
            leaving={item.leaving}
            onHeight={onHeight}
          />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    overflow: 'hidden',
    minHeight: touch.min,
  },
  stack: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    maxWidth: 340,
    paddingRight: spacing.sm,
    pointerEvents: 'none',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingBottom: spacing.sm,
    pointerEvents: 'none',
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
});
