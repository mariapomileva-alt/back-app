import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { nextCatchTarget, type CatchTarget, type CatchTone } from '@/features/distract/catch';
import { useHaptics } from '@/hooks/useHaptics';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export function CatchPlay() {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const reduceMotion = useReduceMotion();
  const [field, setField] = useState({ width: 0, height: 0 });
  const [recent, setRecent] = useState<CatchTarget[]>([]);
  const [target, setTarget] = useState(() => nextCatchTarget(280, 360));
  const [busy, setBusy] = useState(false);
  const [opacity] = useState(() => new Animated.Value(0));

  const tones = useMemo(
    (): Record<CatchTone, string> => ({
      forest: theme.colors.forest,
      sage: theme.colors.secondaryGreen,
      sand: theme.colors.clay,
      cool: theme.colors.cool,
      pale: theme.colors.muted,
    }),
    [theme],
  );

  useEffect(() => {
    let cancelled = false;
    const appear = () => {
      if (cancelled) {
        return;
      }
      if (reduceMotion) {
        opacity.setValue(1);
        return;
      }
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    if (reduceMotion || target.delayMs === 0) {
      appear();
      return () => {
        cancelled = true;
      };
    }

    opacity.setValue(0);
    const id = setTimeout(appear, target.delayMs);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [opacity, reduceMotion, target.delayMs, target.id]);

  const showNext = () => {
    setBusy(false);
    const history = [...recent, target].slice(-6);
    setRecent(history);
    setTarget(nextCatchTarget(field.width || 280, field.height || 360, history));
  };

  const core = theme.name === 'deepGreen' ? theme.colors.background : theme.colors.forest;
  const accent = tones[target.tone];

  return (
    <View style={styles.root}>
      <AppText style={styles.instruction}>{t('distract.catch.instruction')}</AppText>
      <View
        style={styles.field}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setField({ width, height });
        }}
      >
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.target,
            {
              left: target.x - target.size / 2,
              top: target.y - target.size / 2,
              width: target.size,
              height: target.size * target.stretch,
              opacity,
            },
          ]}
        >
          <AccessiblePressable
            accessibilityRole="button"
            accessibilityLabel={t('distract.catch.target')}
            disabled={busy}
            onPress={() => {
              if (busy) {
                return;
              }
              setBusy(true);
              haptics.light();
              if (reduceMotion) {
                showNext();
                return;
              }
              Animated.timing(opacity, {
                toValue: 0,
                duration: 260,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
              }).start(({ finished }) => {
                if (finished) {
                  showNext();
                }
              });
            }}
            style={styles.hit}
          >
            {target.style === 'filled' ? (
              <View accessible={false} style={[styles.ring, styles.outer, { backgroundColor: accent, opacity: 0.86 }]} />
            ) : null}
            {target.style === 'soft' ? (
              <>
                <View accessible={false} style={[styles.ring, styles.outer, { backgroundColor: theme.colors.muted }]} />
                <View accessible={false} style={[styles.ring, styles.mid, { backgroundColor: accent, opacity: 0.7 }]} />
              </>
            ) : null}
            {target.style === 'rings' ? (
              <>
                <View accessible={false} style={[styles.ring, styles.outer, { backgroundColor: theme.colors.muted }]} />
                <View accessible={false} style={[styles.ring, styles.mid, { backgroundColor: accent }]} />
                <View accessible={false} style={[styles.ring, styles.core, { backgroundColor: core }]} />
              </>
            ) : null}
          </AccessiblePressable>
        </Animated.View>
      </View>
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
    maxWidth: 320,
  },
  field: {
    flex: 1,
    minHeight: 0,
  },
  target: {
    position: 'absolute',
  },
  hit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
  },
  outer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  mid: {
    top: '14%',
    left: '14%',
    right: '14%',
    bottom: '14%',
    opacity: 0.62,
  },
  core: {
    top: '29%',
    left: '29%',
    right: '29%',
    bottom: '29%',
    opacity: 0.9,
  },
});
