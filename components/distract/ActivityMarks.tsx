import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { DistractMark } from '@/components/marks/DistractMark';
import { MarkFrame } from '@/components/marks/MarkFrame';
import { markViewBox } from '@/components/marks/markLanguage';
import type { DistractActivityId } from '@/features/distract/activities';
import { useTheme } from '@/hooks/useTheme';

export function ShapesActivityMark() {
  return <DistractMark />;
}

export function BlocksActivityMark() {
  const { theme } = useTheme();
  const filled = [theme.colors.markPrimary, theme.colors.markWarmAccent, theme.colors.markSecondary];
  const empty = theme.colors.markMuted;
  const pattern = [1, 0, 1, 0, 1, 0, 1, 0, 1];

  return (
    <MarkFrame>
      <View style={styles.blocks} accessible={false}>
        {pattern.map((on, index) => (
          <View
            key={index}
            style={[
              styles.block,
              {
                backgroundColor: on ? filled[index % filled.length] : empty,
                opacity: on ? 0.82 : 0.38,
              },
            ]}
          />
        ))}
      </View>
    </MarkFrame>
  );
}

export function SnakeActivityMark() {
  const { theme } = useTheme();
  const beads = [
    { cx: 22, cy: 48, r: 5.5, opacity: 0.42 },
    { cx: 34, cy: 38, r: 6, opacity: 0.5 },
    { cx: 48, cy: 30, r: 6.5, opacity: 0.62 },
    { cx: 64, cy: 26, r: 7, opacity: 0.74 },
    { cx: 82, cy: 32, r: 7.5, opacity: 0.88 },
  ];

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        <Path
          d="M18 50 C30 36 46 24 70 26 C86 28 96 40 102 50"
          stroke={theme.colors.markSecondary}
          strokeWidth={1.2}
          fill="none"
          opacity={0.28}
        />
        {beads.map((bead) => (
          <Circle
            key={`${bead.cx}-${bead.cy}`}
            cx={bead.cx}
            cy={bead.cy}
            r={bead.r}
            fill={theme.colors.markPrimary}
            opacity={bead.opacity}
          />
        ))}
      </Svg>
    </MarkFrame>
  );
}

export function CatchActivityMark() {
  const { theme } = useTheme();
  const core = theme.colors.markPrimary;

  return (
    <MarkFrame>
      <View style={styles.catchStage} accessible={false}>
        <View style={[styles.catchRing, styles.catchOuter, { backgroundColor: theme.colors.markMuted }]} />
        <View
          style={[
            styles.catchRing,
            styles.catchMid,
            { backgroundColor: theme.colors.markSecondary },
          ]}
        />
        <View style={[styles.catchRing, styles.catchCore, { backgroundColor: core }]} />
        <View style={[styles.dot, styles.dotA, { backgroundColor: theme.colors.markWarmAccent }]} />
        <View style={[styles.dot, styles.dotB, { backgroundColor: theme.colors.markSecondary }]} />
        <View style={[styles.dot, styles.dotC, { backgroundColor: theme.colors.markPrimary }]} />
      </View>
    </MarkFrame>
  );
}

export function DistractActivityMark({ id }: { id: DistractActivityId }) {
  switch (id) {
    case 'blocks':
      return <BlocksActivityMark />;
    case 'snake':
      return <SnakeActivityMark />;
    case 'catch':
      return <CatchActivityMark />;
    default:
      return <ShapesActivityMark />;
  }
}

const styles = StyleSheet.create({
  blocks: {
    width: 54,
    height: 54,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    alignContent: 'center',
    justifyContent: 'center',
  },
  block: {
    width: 15,
    height: 15,
    borderRadius: 3,
  },
  catchStage: {
    width: 64,
    height: 56,
  },
  catchRing: {
    position: 'absolute',
    borderRadius: 999,
  },
  catchOuter: {
    width: 48,
    height: 48,
    top: 4,
    left: 8,
    opacity: 0.42,
  },
  catchMid: {
    width: 34,
    height: 34,
    top: 11,
    left: 15,
    opacity: 0.5,
  },
  catchCore: {
    width: 18,
    height: 18,
    top: 19,
    left: 23,
    opacity: 0.86,
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.7,
  },
  dotA: {
    top: 2,
    left: 4,
  },
  dotB: {
    top: 6,
    right: 2,
  },
  dotC: {
    bottom: 2,
    left: 18,
  },
});
