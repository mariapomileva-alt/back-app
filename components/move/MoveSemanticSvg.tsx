import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import type { MoveInk } from '@/components/move/moveInk';
import { MOVE_KINETIC_VIEWBOX } from '@/components/move/moveInk';
import type { MoveKineticAction } from '@/features/move/visualMap';
import type { MovePhase } from '@/features/move/steps';

type Props = {
  action: MoveKineticAction;
  phase: MovePhase;
  ink: MoveInk;
};

function floorLine(ink: MoveInk) {
  return (
    <Path
      d="M24 96 H176"
      stroke={ink.sage}
      strokeWidth={1.35}
      strokeLinecap="round"
      opacity={0.55}
      fill="none"
    />
  );
}

function feetGraphic(ink: MoveInk, phase: MovePhase) {
  const pressed = phase === 'press' || phase === 'hold';
  const contact = pressed ? 0.72 : 0.48;
  return (
    <>
      {floorLine(ink)}
      <Ellipse cx={78} cy={88} rx={14} ry={5 + (pressed ? 2 : 0)} fill={ink.sand} opacity={contact} />
      <Ellipse cx={122} cy={88} rx={14} ry={5 + (pressed ? 2 : 0)} fill={ink.sand} opacity={contact} />
      <Path
        d="M78 88 V72 M122 88 V72"
        stroke={ink.primary}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={pressed ? 0.85 : 0.62}
      />
    </>
  );
}

function palmsGraphic(ink: MoveInk, phase: MovePhase) {
  const pressed = phase === 'press' || phase === 'hold';
  const gap = pressed ? 36 : 48;
  return (
    <>
      <Path
        d={`M${100 - gap / 2} 58 C${100 - gap / 2 - 8} 72, ${100 - gap / 2 + 8} 86, ${100 - gap / 2} 92`}
        stroke={ink.primary}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
      <Path
        d={`M${100 + gap / 2} 58 C${100 + gap / 2 + 8} 72, ${100 + gap / 2 - 8} 86, ${100 + gap / 2} 92`}
        stroke={ink.primary}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
      <Circle cx={100} cy={64} r={pressed ? 10 : 6} fill={ink.sage} opacity={pressed ? 0.35 : 0.2} />
    </>
  );
}

function shouldersGraphic(ink: MoveInk, phase: MovePhase) {
  const rolled = phase === 'press' || phase === 'hold';
  return (
    <>
      <Path
        d="M68 78 C88 62, 112 62, 132 78"
        stroke={ink.primary}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
        opacity={0.75}
      />
      <Path
        d={`M100 78 V${rolled ? 52 : 58}`}
        stroke={ink.sage}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.5}
      />
      <Path
        d={rolled ? 'M74 70 Q100 64 126 70' : 'M76 66 Q100 60 124 66'}
        stroke={ink.sand}
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
        opacity={0.45}
      />
    </>
  );
}

function handsGraphic(ink: MoveInk, phase: MovePhase) {
  const curled = phase === 'press' || phase === 'hold';
  return (
    <>
      <Path
        d="M72 86 C78 72, 88 64, 98 68 C104 70, 108 78, 106 88"
        stroke={ink.primary}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        opacity={0.78}
      />
      <Path
        d={
          curled
            ? 'M98 68 C108 66, 118 72, 122 82 C124 88, 118 92, 112 88'
            : 'M98 68 C112 66, 124 74, 126 86 C126 92, 118 94, 112 88'
        }
        stroke={ink.sage}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        opacity={0.65}
      />
      {curled ? (
        <Path
          d="M106 78 Q112 74 116 80"
          stroke={ink.sand}
          strokeWidth={1.1}
          fill="none"
          strokeLinecap="round"
          opacity={0.5}
        />
      ) : null}
    </>
  );
}

function tenseReleaseGraphic(ink: MoveInk, phase: MovePhase) {
  const tense = phase === 'press' || phase === 'hold';
  return (
    <>
      <Path
        d="M88 88 C92 70, 108 70, 112 88"
        stroke={ink.primary}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        opacity={tense ? 0.82 : 0.58}
      />
      <Path
        d="M76 76 L124 76"
        stroke={ink.sage}
        strokeWidth={1.3}
        strokeLinecap="round"
        opacity={tense ? 0.55 : 0.35}
      />
      <Circle cx={100} cy={72} r={tense ? 8 : 11} fill={ink.sand} opacity={tense ? 0.28 : 0.14} />
    </>
  );
}

function bodyScanGraphic(ink: MoveInk) {
  return (
    <>
      <Path
        d="M100 38 V92"
        stroke={ink.primary}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.55}
      />
      <Path
        d="M82 52 H118 M84 68 H116 M86 84 H114"
        stroke={ink.sage}
        strokeWidth={1.1}
        strokeLinecap="round"
        opacity={0.4}
      />
      <Ellipse cx={100} cy={34} rx={10} ry={6} fill={ink.sand} opacity={0.22} />
    </>
  );
}

export function MoveSemanticSvg({ action, phase, ink }: Props) {
  let body: ReactNode;
  switch (action) {
    case 'pressFeet':
      body = feetGraphic(ink, phase);
      break;
    case 'pressPalms':
      body = palmsGraphic(ink, phase);
      break;
    case 'shoulders':
      body = shouldersGraphic(ink, phase);
      break;
    case 'hands':
      body = handsGraphic(ink, phase);
      break;
    case 'tenseRelease':
      body = tenseReleaseGraphic(ink, phase);
      break;
    case 'bodyScan':
      body = bodyScanGraphic(ink);
      break;
    default:
      body = null;
  }

  return (
    <Svg width="100%" height="100%" viewBox={MOVE_KINETIC_VIEWBOX} preserveAspectRatio="xMidYMid meet">
      {body}
    </Svg>
  );
}
