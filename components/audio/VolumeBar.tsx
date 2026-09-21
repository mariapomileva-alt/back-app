import { useCallback, useRef } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PointerEvent as RNPointerEvent,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  value: number;
  onChange: (value: number) => void;
  /** Listen screen — centered label and inset track. */
  listenLayout?: boolean;
};

function quantizeLevel(raw: number): number {
  return Math.round(Math.min(1, Math.max(0, raw)) * 20) / 20;
}

export function VolumeBar({ value, onChange, listenLayout = false }: Props) {
  const { theme } = useTheme();
  const trackWidth = useRef(0);
  const trackRef = useRef<View>(null);
  const dragging = useRef(false);

  const applyLevel = useCallback(
    (raw: number) => {
      onChange(quantizeLevel(raw));
    },
    [onChange],
  );

  const setLevelFromX = useCallback(
    (x: number) => {
      if (trackWidth.current <= 0) {
        return;
      }
      applyLevel(x / trackWidth.current);
    },
    [applyLevel],
  );

  const setLevelFromPageX = useCallback(
    (pageX: number) => {
      if (Platform.OS !== 'web') {
        return;
      }
      const node = trackRef.current as unknown as HTMLElement | null;
      const rect = node?.getBoundingClientRect?.();
      if (!rect || rect.width <= 0) {
        return;
      }
      applyLevel((pageX - rect.left) / rect.width);
    },
    [applyLevel],
  );

  const onTrackLayout = (event: LayoutChangeEvent) => {
    trackWidth.current = event.nativeEvent.layout.width;
  };

  const onPress = (event: GestureResponderEvent) => {
    if (Platform.OS === 'web') {
      const native = event.nativeEvent as unknown as { pageX?: number; clientX?: number };
      const pageX = native.pageX ?? native.clientX;
      if (pageX != null) {
        setLevelFromPageX(pageX);
        return;
      }
    }
    setLevelFromX(event.nativeEvent.locationX);
  };

  return (
    <View style={[styles.wrap, listenLayout && styles.wrapListen]}>
      <AppText
        variant="body"
        tone="secondary"
        style={[styles.label, listenLayout && styles.labelListen]}
      >
        {t('listen.volume')}
      </AppText>
      <Pressable
        accessibilityRole="adjustable"
        accessibilityLabel={t('listen.volume')}
        accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
        onLayout={onTrackLayout}
        onPress={onPress}
        onPressIn={() => {
          dragging.current = true;
        }}
        onPressOut={() => {
          dragging.current = false;
        }}
        {...(Platform.OS === 'web'
          ? {
              onPointerMove: (event: RNPointerEvent) => {
                if (!dragging.current) {
                  return;
                }
                const clientX = event.nativeEvent.clientX;
                if (clientX != null) {
                  setLevelFromPageX(clientX);
                }
              },
            }
          : {})}
        style={[
          styles.trackHit,
          listenLayout && styles.trackHitListen,
          Platform.OS === 'web'
            ? ({ outlineWidth: 0, cursor: 'pointer' } as ViewStyle)
            : null,
        ]}
      >
        <View
          ref={trackRef}
          style={[
            styles.track,
            listenLayout && styles.trackListen,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${Math.round(value * 100)}%`,
                backgroundColor: theme.colors.secondaryGreen,
              },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: '100%',
    gap: spacing.xxs,
  },
  wrapListen: {
    paddingHorizontal: spacing.md,
    maxWidth: 420,
    alignSelf: 'center',
  },
  label: {
    textAlign: 'center',
  },
  labelListen: {
    fontSize: 18,
    lineHeight: 22,
  },
  trackHit: {
    minHeight: touch.min,
    justifyContent: 'center',
    width: '100%',
  },
  trackHitListen: {
    paddingVertical: spacing.sm,
    minHeight: touch.min,
  },
  track: {
    height: 8,
    borderRadius: radius.circle,
    overflow: 'hidden',
    width: '100%',
  },
  trackListen: {
    height: 8,
  },
  fill: {
    height: '100%',
    borderRadius: radius.circle,
  },
});
