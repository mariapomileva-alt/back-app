import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import {
  nextCatchTarget,
  targetFitsField,
  type CatchTarget,
  type CatchTone,
} from '@/features/distract/catch';
import { useHaptics } from '@/hooks/useHaptics';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { brand, hexToRgba, mixHex } from '@/theme/colors';
import { serif } from '@/theme/fonts';
import { spacing, touch } from '@/theme/spacing';

const APPEAR_FROM = 0.88;

type TargetColors = {
  fill: string;
  rim: string;
  center: string;
  halo: string;
};

function CatchDisc({
  target,
  colors,
}: {
  target: CatchTarget;
  colors: TargetColors;
}) {
  const rim = {
    borderColor: colors.rim,
    backgroundColor: colors.fill,
  };

  return (
    <View accessible={false} style={styles.disc}>
      <View
        style={[
          styles.layer,
          styles.halo,
          {
            backgroundColor: colors.halo,
            borderColor: hexToRgba(colors.rim, 0.55),
          },
        ]}
      />
      {target.style === 'rings' ? (
        <>
          <View
            style={[
              styles.layer,
              styles.ringBody,
              { borderColor: colors.rim, backgroundColor: hexToRgba(colors.fill, 0.22) },
            ]}
          />
          <View style={[styles.layer, styles.core, rim]} />
        </>
      ) : null}
      {target.style === 'soft' ? (
        <>
          <View
            style={[
              styles.layer,
              styles.body,
              { backgroundColor: hexToRgba(colors.fill, 0.92), borderColor: colors.rim },
            ]}
          />
          <View style={[styles.layer, styles.center, { backgroundColor: colors.center }]} />
        </>
      ) : null}
      {target.style === 'filled' ? (
        <>
          <View style={[styles.layer, styles.body, rim]} />
          <View style={[styles.layer, styles.center, { backgroundColor: colors.center }]} />
        </>
      ) : null}
    </View>
  );
}

type Props = {
  onCatchTap?: () => void;
};

export function CatchPlay({ onCatchTap }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const reduceMotion = useReduceMotion();
  const [field, setField] = useState({ width: 0, height: 0 });
  const [recent, setRecent] = useState<CatchTarget[]>([]);
  const [target, setTarget] = useState(() => nextCatchTarget(280, 360));
  const [busy, setBusy] = useState(false);
  const [opacity] = useState(() => new Animated.Value(APPEAR_FROM));

  const tones = useMemo((): Record<CatchTone, string> => {
    if (theme.name === 'deepGreen') {
      return {
        forest: theme.colors.secondaryGreen,
        sage: theme.colors.muted,
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

  const colors = useMemo((): TargetColors => {
    const fill = tones[target.tone];
    const dark = theme.name === 'deepGreen';
    const rim = dark ? mixHex(fill, brand.warmIvory, 0.42) : mixHex(fill, brand.deepForest, 0.4);
    const center = dark ? mixHex(fill, brand.warmIvory, 0.2) : mixHex(fill, brand.deepForest, 0.28);
    return {
      fill,
      rim,
      center,
      halo: hexToRgba(fill, dark ? 0.28 : 0.18),
    };
  }, [target.tone, theme.name, tones]);

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
      opacity.setValue(APPEAR_FROM);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    };

    if (reduceMotion || target.delayMs === 0) {
      appear();
      return () => {
        cancelled = true;
      };
    }

    opacity.setValue(APPEAR_FROM);
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

  const width = Math.max(target.size, touch.min);
  const height = Math.max(target.size * target.stretch, touch.min);

  return (
    <View style={styles.root}>
      <AppText style={styles.instruction}>{t('distract.catch.instruction')}</AppText>
      <View
        style={styles.field}
        onLayout={(event) => {
          const { width: nextWidth, height: nextHeight } = event.nativeEvent.layout;
          if (nextWidth < 48 || nextHeight < 48) {
            return;
          }
          setField((current) => {
            if (Math.abs(current.width - nextWidth) < 2 && Math.abs(current.height - nextHeight) < 2) {
              return current;
            }
            return { width: nextWidth, height: nextHeight };
          });
          setTarget((current) =>
            targetFitsField(current, nextWidth, nextHeight)
              ? current
              : nextCatchTarget(nextWidth, nextHeight, recent),
          );
        }}
      >
        <Animated.View
          style={[
            styles.target,
            {
              left: target.x - width / 2,
              top: target.y - height / 2,
              width,
              height,
              opacity,
              pointerEvents: 'box-none',
            },
          ]}
        >
          <AccessiblePressable
            accessibilityRole="button"
            accessibilityLabel={t('distract.catch.target')}
            accessibilityHint={t('distract.catch.targetHint')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => {
              if (busy) {
                return;
              }
              setBusy(true);
              haptics.light();
              onCatchTap?.();
              if (reduceMotion) {
                showNext();
                return;
              }
              Animated.timing(opacity, {
                toValue: 0,
                duration: 220,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: Platform.OS !== 'web',
              }).start(({ finished }) => {
                if (finished) {
                  showNext();
                } else {
                  setBusy(false);
                }
              });
            }}
            style={styles.hit}
          >
            <CatchDisc target={target} colors={colors} />
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
  disc: {
    width: '100%',
    height: '100%',
  },
  layer: {
    position: 'absolute',
    borderRadius: 999,
  },
  halo: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1.5,
  },
  body: {
    top: '9%',
    left: '9%',
    right: '9%',
    bottom: '9%',
    borderWidth: 2,
  },
  ringBody: {
    top: '8%',
    left: '8%',
    right: '8%',
    bottom: '8%',
    borderWidth: 3,
  },
  center: {
    top: '34%',
    left: '34%',
    right: '34%',
    bottom: '34%',
  },
  core: {
    top: '28%',
    left: '28%',
    right: '28%',
    bottom: '28%',
    borderWidth: 2,
  },
});
