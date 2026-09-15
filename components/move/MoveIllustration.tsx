import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { HandsIllustration } from '@/components/move/HandsIllustration';
import { MoveVisualFrame } from '@/components/move/MoveVisualFrame';
import { PressFeetIllustration } from '@/components/move/PressFeetIllustration';
import { PressLegsIllustration } from '@/components/move/PressLegsIllustration';
import { PressPalmsIllustration } from '@/components/move/PressPalmsIllustration';
import { ShouldersIllustration } from '@/components/move/ShouldersIllustration';
import type { MovePhase, MoveSequenceId, MoveStepId } from '@/features/move/steps';
import {
  resolveMoveVisual,
  type MoveIllustrationVariant,
  type MoveVisualSpec,
} from '@/features/move/visualMap';

const FADE_OUT_MS = 220;
const FADE_IN_MS = 320;
const FADE_OUT_REDUCED_MS = 180;
const FADE_IN_REDUCED_MS = 250;
const CSS_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const USE_CSS_FADE = Platform.OS === 'web';

type Props = {
  activityId: MoveSequenceId;
  stepId: MoveStepId;
  phase: MovePhase;
  reduceMotion: boolean;
};

type MountedVisual = {
  key: string;
  spec: MoveVisualSpec | null;
};

function visualKey(activityId: MoveSequenceId, stepId: MoveStepId): string {
  return `${activityId}:${stepId}`;
}

function MoveArtwork({ variant, reduceMotion }: { variant: MoveIllustrationVariant; reduceMotion: boolean }) {
  switch (variant) {
    case 'pressFeet':
    case 'holdFeet':
    case 'releaseFeet':
    case 'noticeFeet':
      return <PressFeetIllustration variant={variant} reduceMotion={reduceMotion} />;
    case 'pressPalms':
    case 'holdPalms':
    case 'releasePalms':
    case 'noticePalms':
      return <PressPalmsIllustration variant={variant} reduceMotion={reduceMotion} />;
    case 'tenseHands':
    case 'holdTenseHands':
    case 'releaseHands':
    case 'noticeHands':
      return <HandsIllustration variant={variant} reduceMotion={reduceMotion} />;
    case 'riseShoulders':
    case 'rollShoulders':
    case 'settleShoulders':
    case 'noticeShoulders':
      return <ShouldersIllustration variant={variant} reduceMotion={reduceMotion} />;
    case 'pressLegs':
    case 'holdLegs':
    case 'releaseLegs':
    case 'noticeLegs':
      return <PressLegsIllustration variant={variant} reduceMotion={reduceMotion} />;
    default: {
      const _exhaustive: never = variant;
      void _exhaustive;
      return null;
    }
  }
}

export function MoveExerciseIllustration({ activityId, stepId, phase, reduceMotion }: Props) {
  void phase;
  const incomingKey = visualKey(activityId, stepId);
  const incomingSpec = resolveMoveVisual(stepId);
  const shownKeyRef = useRef(incomingKey);

  const [mounted, setMounted] = useState<MountedVisual>(() => ({
    key: incomingKey,
    spec: incomingSpec,
  }));
  const [webOpacity, setWebOpacity] = useState(1);
  const opacity = useSharedValue(1);
  const generation = useRef(0);

  const fadeOutMs = reduceMotion ? FADE_OUT_REDUCED_MS : FADE_OUT_MS;
  const fadeInMs = reduceMotion ? FADE_IN_REDUCED_MS : FADE_IN_MS;

  useEffect(() => {
    if (shownKeyRef.current === incomingKey) {
      return;
    }

    const token = ++generation.current;
    const nextKey = incomingKey;
    const nextSpec = incomingSpec;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let startFrame = 0;
    let frameEmpty = 0;
    let frameIn = 0;

    const fadeIn = () => {
      if (token !== generation.current) {
        return;
      }
      if (USE_CSS_FADE) {
        setWebOpacity(1);
        return;
      }
      opacity.value = 0;
      opacity.value = withTiming(1, {
        duration: fadeInMs,
        easing: Easing.out(Easing.cubic),
      });
    };

    const mountNext = () => {
      if (token !== generation.current) {
        return;
      }
      shownKeyRef.current = nextKey;
      setMounted({
        key: nextKey,
        spec: nextSpec,
      });
      frameIn = requestAnimationFrame(fadeIn);
    };

    const unmountCurrent = () => {
      if (token !== generation.current) {
        return;
      }
      setMounted({
        key: nextKey,
        spec: null,
      });
      frameEmpty = requestAnimationFrame(mountNext);
    };

    cancelAnimation(opacity);

    if (USE_CSS_FADE) {
      startFrame = requestAnimationFrame(() => {
        if (token !== generation.current) {
          return;
        }
        setWebOpacity(0);
        timeout = setTimeout(unmountCurrent, fadeOutMs);
      });
    } else {
      opacity.value = withTiming(
        0,
        { duration: fadeOutMs, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (!finished || token !== generation.current) {
            return;
          }
          runOnJS(unmountCurrent)();
        },
      );
    }

    return () => {
      generation.current += 1;
      if (timeout) {
        clearTimeout(timeout);
      }
      if (startFrame) {
        cancelAnimationFrame(startFrame);
      }
      if (frameEmpty) {
        cancelAnimationFrame(frameEmpty);
      }
      if (frameIn) {
        cancelAnimationFrame(frameIn);
      }
      cancelAnimation(opacity);
    };
  }, [fadeInMs, fadeOutMs, incomingKey, incomingSpec, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const webDuration = webOpacity === 0 ? fadeOutMs : fadeInMs;
  const webStyle = {
    opacity: webOpacity,
    transitionProperty: 'opacity',
    transitionDuration: `${webDuration}ms`,
    transitionTimingFunction: CSS_EASE,
  };
  const body = mounted.spec ? (
    <View key={mounted.key} style={styles.art} pointerEvents="none">
      <MoveArtwork variant={mounted.spec.illustration} reduceMotion={reduceMotion} />
    </View>
  ) : null;

  return (
    <MoveVisualFrame>
      {USE_CSS_FADE ? (
        <View style={[styles.stage, webStyle]}>
          {body}
        </View>
      ) : (
        <FadeStage style={animatedStyle}>{body}</FadeStage>
      )}
    </MoveVisualFrame>
  );
}

function FadeStage({ children, style }: { children: ReactNode; style: object }) {
  return (
    <Animated.View collapsable={false} style={[styles.stage, style]}>
      {children}
    </Animated.View>
  );
}

/** @deprecated Use MoveExerciseIllustration */
export const MoveIllustration = MoveExerciseIllustration;

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    height: '100%',
  },
  art: {
    width: '100%',
    height: '100%',
  },
});
