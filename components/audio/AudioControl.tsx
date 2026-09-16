import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  isPlaying: boolean;
  muted?: boolean;
  onPlayPause: () => void;
  onMute?: () => void;
  onReplay?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  elapsed?: string;
  layout?: 'row' | 'stack';
};

export function AudioControl({
  isPlaying,
  muted = false,
  onPlayPause,
  onMute,
  onReplay,
  onPrevious,
  onNext,
  elapsed,
  layout = 'row',
}: Props) {
  const { theme } = useTheme();
  const color = theme.colors.icon;
  const stacked = layout === 'stack';

  const playPause = (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={isPlaying ? t('common.pause') : t('common.play')}
      accessibilityState={{ selected: isPlaying }}
      onPress={onPlayPause}
      style={[styles.control, stacked && styles.stackControl]}
    >
      {isPlaying ? (
        <Svg width={28} height={28} viewBox="0 0 28 28">
          <Path d="M9 7h3.2v14H9zM15.8 7H19v14h-3.2z" fill={color} />
        </Svg>
      ) : (
        <Svg width={28} height={28} viewBox="0 0 28 28">
          <Path d="M10 7.5v13l11-6.5-11-6.5z" fill={color} />
        </Svg>
      )}
    </AccessiblePressable>
  );

  const previous =
    onPrevious && layout !== 'stack' ? (
      <AccessiblePressable
        accessibilityRole="button"
        accessibilityLabel={t('ground.previous')}
        accessibilityHint={t('ground.previousHint')}
        onPress={onPrevious}
        style={styles.control}
      >
        <Svg width={22} height={22} viewBox="0 0 22 22">
          <Path
            d="M13.5 6L8 11l5.5 5"
            stroke={color}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </AccessiblePressable>
    ) : null;

  const nextStep =
    onNext && layout !== 'stack' ? (
      <AccessiblePressable
        accessibilityRole="button"
        accessibilityLabel={t('ground.next')}
        accessibilityHint={t('ground.nextHint')}
        onPress={onNext}
        style={styles.control}
      >
        <Svg width={22} height={22} viewBox="0 0 22 22">
          <Path
            d="M8.5 6L14 11l-5.5 5"
            stroke={color}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </AccessiblePressable>
    ) : null;

  const replay = onReplay ? (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={t('common.replay')}
      onPress={onReplay}
      style={[styles.control, stacked && styles.stackControl]}
    >
      <Svg width={26} height={26} viewBox="0 0 26 26">
        <Path
          d="M8 7v12M18 8.5v9L10 13l8-4.5z"
          fill="none"
          stroke={color}
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </AccessiblePressable>
  ) : null;

  const mute = onMute ? (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={muted ? t('common.unmute') : t('common.mute')}
      accessibilityState={{ selected: muted }}
      onPress={onMute}
      style={[styles.control, stacked && styles.stackControl]}
    >
      <Svg width={26} height={26} viewBox="0 0 26 26">
        <Path
          d="M5 11h3.2L13 7v12l-4.8-4H5v-4z"
          fill="none"
          stroke={color}
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
        {muted ? (
          <Path d="M16 10l5 6M21 10l-5 6" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
        ) : (
          <Circle cx="19" cy="13" r="3.2" stroke={color} strokeWidth={1.7} fill="none" />
        )}
      </Svg>
    </AccessiblePressable>
  ) : null;

  if (stacked) {
    return (
      <View style={styles.stack}>
        {playPause}
        {elapsed ? (
          <AppText variant="secondary" tone="secondary" accessibilityLabel={t('exercise.elapsed')}>
            {elapsed}
          </AppText>
        ) : null}
        {replay}
        {mute}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {previous}
      {replay}
      {playPause}
      {nextStep}
      {mute}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  stack: {
    alignItems: 'center',
    gap: 2,
  },
  control: {
    width: touch.min,
    height: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackControl: {
    minHeight: touch.min,
  },
});
