import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { GroundPremiumVisual } from '@/components/ground/GroundPremiumVisual';
import {
  groundPremiumVisual,
  groundPremiumVisualKey,
} from '@/features/ground/premiumVisuals';
import type { GroundSequenceId } from '@/features/ground/steps';
import { groundInstructionInk } from '@/features/ground/groundInstructionInk';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';

const VIEWBOX = '0 0 220 118';

export type GroundVisualKind =
  | 'feet'
  | 'toes'
  | 'weight'
  | 'support'
  | 'hands'
  | 'shoulders'
  | 'stay'
  | 'senseSee'
  | 'senseTouch'
  | 'senseHear'
  | 'senseSmell'
  | 'senseTaste'
  | 'lookSee'
  | 'lookFar'
  | 'lookStill'
  | 'lookObject'
  | 'textureNotice'
  | 'textureFind'
  | 'textureCool'
  | 'textureTemp';

const STEP_TO_VISUAL: Record<string, GroundVisualKind> = {
  'ground.steps.feet': 'feet',
  'ground.steps.toes': 'toes',
  'ground.steps.weight': 'weight',
  'ground.steps.support': 'support',
  'ground.steps.hands': 'hands',
  'ground.steps.shoulders': 'shoulders',
  'ground.steps.stay': 'stay',
  'ground.fiveSenses.see': 'senseSee',
  'ground.fiveSenses.touch': 'senseTouch',
  'ground.fiveSenses.hear': 'senseHear',
  'ground.fiveSenses.smell': 'senseSmell',
  'ground.fiveSenses.taste': 'senseTaste',
  'ground.lookAround.see': 'lookSee',
  'ground.lookAround.farthest': 'lookFar',
  'ground.lookAround.still': 'lookStill',
  'ground.lookAround.object': 'lookObject',
  'ground.texture.notice': 'textureNotice',
  'ground.texture.find': 'textureFind',
  'ground.texture.cool': 'textureCool',
  'ground.texture.temp': 'textureTemp',
};

export function resolveGroundVisual(stepKey: string): GroundVisualKind {
  return STEP_TO_VISUAL[stepKey] ?? 'stay';
}

type Props = {
  sequenceId: GroundSequenceId;
  stepKey: string;
};

function floor(primary: string, sage: string, mound: string) {
  return (
    <>
      <Ellipse cx="110" cy="98" rx="72" ry="7" fill={mound} opacity={0.55} />
      <Path
        d="M44 94 C78 88, 142 88, 176 94"
        stroke={sage}
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
        opacity={0.42}
      />
      <Path d="M38 96 H182" stroke={primary} strokeWidth={1.1} strokeLinecap="round" opacity={0.28} />
    </>
  );
}

function FeetVisual({ primary, sage, sand, mound }: Ink) {
  return (
    <>
      {floor(primary, sage, mound)}
      <Ellipse cx={88} cy={90} rx={16} ry={5} fill={sand} opacity={0.55} />
      <Ellipse cx={132} cy={90} rx={16} ry={5} fill={sand} opacity={0.55} />
      <Path d="M88 90 V68 M132 90 V68" stroke={primary} strokeWidth={2} strokeLinecap="round" opacity={0.72} />
    </>
  );
}

function ToesVisual({ primary, sage, sand, mound }: Ink) {
  return (
    <>
      {floor(primary, sage, mound)}
      <Path
        d="M82 92 L78 86 M88 92 L86 84 M94 92 L94 84 M100 92 L102 84"
        stroke={primary}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.65}
      />
      <Path
        d="M118 92 L122 86 M124 92 L126 84 M130 92 L130 84 M136 92 L134 84"
        stroke={primary}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.65}
      />
      <Ellipse cx={110} cy={92} rx={28} ry={4} fill={sand} opacity={0.35} />
    </>
  );
}

function WeightVisual({ primary, sage, sand, mound }: Ink) {
  return (
    <>
      {floor(primary, sage, mound)}
      <Ellipse cx={110} cy={88} rx={36} ry={8} fill={sand} opacity={0.5} />
      <Path d="M110 52 V88" stroke={sage} strokeWidth={1.4} strokeLinecap="round" opacity={0.45} />
      <Path d="M92 72 H128" stroke={primary} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />
    </>
  );
}

function SupportVisual({ primary, sage, sand, mound }: Ink) {
  return (
    <>
      {floor(primary, sage, mound)}
      <Path
        d="M62 92 C78 84, 142 84, 158 92"
        stroke={sand}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
        opacity={0.35}
      />
      <Path d="M74 78 V92 M146 78 V92" stroke={primary} strokeWidth={1.8} strokeLinecap="round" opacity={0.6} />
      <Path d="M88 70 H132" stroke={sage} strokeWidth={1.2} strokeLinecap="round" opacity={0.4} />
    </>
  );
}

function HandsVisual({ primary, sage, sand, mound }: Ink) {
  return (
    <>
      {floor(primary, sage, mound)}
      <Path
        d="M78 72 C82 88, 94 96, 102 88"
        stroke={primary}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
      <Path
        d="M142 72 C138 88, 126 96, 118 88"
        stroke={primary}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
      <Circle cx={110} cy={64} r={8} fill={sand} opacity={0.25} />
    </>
  );
}

function ShouldersVisual({ primary, sage, sand, mound }: Ink) {
  return (
    <>
      {floor(primary, sage, mound)}
      <Path
        d="M72 76 C92 58, 128 58, 148 76"
        stroke={primary}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
        opacity={0.72}
      />
      <Path d="M110 76 V52" stroke={sage} strokeWidth={1.3} strokeLinecap="round" opacity={0.45} />
      <Path d="M84 66 Q110 60 136 66" stroke={sand} strokeWidth={1.1} fill="none" opacity={0.4} />
    </>
  );
}

function StayVisual({ primary, sage, sand, mound }: Ink) {
  return (
    <>
      {floor(primary, sage, mound)}
      <Circle cx={110} cy={62} r={14} fill={sand} opacity={0.22} />
      <Path
        d="M110 76 V92 M98 84 H122"
        stroke={primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.5}
      />
    </>
  );
}

function SenseEye({ primary, sage }: Pick<Ink, 'primary' | 'sage'>) {
  return (
    <>
      <Ellipse cx={110} cy={58} rx={22} ry={12} stroke={primary} strokeWidth={2} fill="none" opacity={0.7} />
      <Circle cx={110} cy={58} r={5} fill={sage} opacity={0.55} />
    </>
  );
}

function SenseEar({ primary, sage }: Pick<Ink, 'primary' | 'sage'>) {
  return (
    <Path
      d="M92 52 C88 68, 96 82, 108 78 C100 70, 98 58, 104 48"
      stroke={primary}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      opacity={0.65}
    />
  );
}

function LookVisual({ primary, sage, far }: { primary: string; sage: string; far?: boolean }) {
  return (
    <>
      <SenseEye primary={primary} sage={sage} />
      {far ? (
        <Path
          d="M138 48 L168 42 M138 54 L172 54 M138 60 L166 66"
          stroke={sage}
          strokeWidth={1.2}
          strokeLinecap="round"
          opacity={0.45}
        />
      ) : (
        <Circle cx={110} cy={58} r={far === false ? 18 : 12} stroke={sage} strokeWidth={1} fill="none" opacity={0.35} />
      )}
    </>
  );
}

function TextureVisual({ primary, sage, wavy }: { primary: string; sage: string; wavy?: boolean }) {
  return (
    <>
      <Path
        d={
          wavy
            ? 'M72 78 C88 68, 96 88, 110 76 C124 64, 132 84, 148 74'
            : 'M78 80 H142'
        }
        stroke={primary}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        opacity={0.65}
      />
      <Path d="M86 56 C98 48, 122 48, 134 56" stroke={sage} strokeWidth={1.2} fill="none" opacity={0.4} />
    </>
  );
}

type Ink = { primary: string; sage: string; sand: string; mound: string };

function renderKind(kind: GroundVisualKind, ink: Ink) {
  const { primary, sage, sand, mound } = ink;
  switch (kind) {
    case 'feet':
      return <FeetVisual {...ink} />;
    case 'toes':
      return <ToesVisual {...ink} />;
    case 'weight':
      return <WeightVisual {...ink} />;
    case 'support':
      return <SupportVisual {...ink} />;
    case 'hands':
      return <HandsVisual {...ink} />;
    case 'shoulders':
      return <ShouldersVisual {...ink} />;
    case 'stay':
      return <StayVisual {...ink} />;
    case 'senseSee':
      return (
        <>
          {floor(primary, sage, mound)}
          <SenseEye primary={primary} sage={sage} />
        </>
      );
    case 'senseTouch':
      return (
        <>
          {floor(primary, sage, mound)}
          <Path
            d="M98 72 C104 64, 116 64, 122 72 C118 82, 102 82, 98 72"
            stroke={primary}
            strokeWidth={1.8}
            fill="none"
            opacity={0.65}
          />
        </>
      );
    case 'senseHear':
      return (
        <>
          {floor(primary, sage, mound)}
          <SenseEar primary={primary} sage={sage} />
        </>
      );
    case 'senseSmell':
      return (
        <>
          {floor(primary, sage, mound)}
          <Path d="M110 78 C106 68, 114 58, 110 48" stroke={sage} strokeWidth={1.3} fill="none" opacity={0.5} />
          <Path d="M102 52 C98 44, 106 40, 110 48" stroke={primary} strokeWidth={1.2} fill="none" opacity={0.45} />
        </>
      );
    case 'senseTaste':
      return (
        <>
          {floor(primary, sage, mound)}
          <Path d="M102 68 Q110 76 118 68" stroke={primary} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.6} />
        </>
      );
    case 'lookSee':
      return (
        <>
          {floor(primary, sage, mound)}
          <LookVisual primary={primary} sage={sage} />
        </>
      );
    case 'lookFar':
      return (
        <>
          {floor(primary, sage, mound)}
          <LookVisual primary={primary} sage={sage} far />
        </>
      );
    case 'lookStill':
      return (
        <>
          {floor(primary, sage, mound)}
          <LookVisual primary={primary} sage={sage} far={false} />
        </>
      );
    case 'lookObject':
      return (
        <>
          {floor(primary, sage, mound)}
          <Circle cx={132} cy={56} r={10} stroke={primary} strokeWidth={1.8} fill={sand} opacity={0.35} />
          <SenseEye primary={primary} sage={sage} />
        </>
      );
    case 'textureNotice':
      return (
        <>
          {floor(primary, sage, mound)}
          <TextureVisual primary={primary} sage={sage} />
        </>
      );
    case 'textureFind':
      return (
        <>
          {floor(primary, sage, mound)}
          <TextureVisual primary={primary} sage={sage} wavy />
        </>
      );
    case 'textureCool':
      return (
        <>
          {floor(primary, sage, mound)}
          <Path d="M88 72 L110 52 L132 72" stroke={sage} strokeWidth={1.4} fill="none" opacity={0.45} />
          <TextureVisual primary={primary} sage={sage} wavy />
        </>
      );
    case 'textureTemp':
      return (
        <>
          {floor(primary, sage, mound)}
          <Path d="M110 48 V72" stroke={sage} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
          <TextureVisual primary={primary} sage={sage} />
        </>
      );
    default:
      return <StayVisual {...ink} />;
  }
}

export function GroundInstructionVisual({ sequenceId, stepKey }: Props) {
  const reduceMotion = useReduceMotion();
  const { theme } = useTheme();
  const premium = groundPremiumVisual(sequenceId, stepKey);

  if (premium) {
    return (
      <GroundPremiumVisual
        key={groundPremiumVisualKey(sequenceId, stepKey)}
        assets={premium}
        reduceMotion={reduceMotion}
      />
    );
  }

  const kind = resolveGroundVisual(stepKey);
  const ink: Ink = groundInstructionInk(theme);

  return (
    <Svg width="100%" height="100%" viewBox={VIEWBOX} preserveAspectRatio="xMidYMid meet">
      {renderKind(kind, ink)}
    </Svg>
  );
}
