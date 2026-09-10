import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';
import type { ToolId } from '@/types';

type IconProps = {
  color?: string;
  size?: number;
};

const strokeWidth = 1.25;

function useIconColor(color?: string): string {
  const { theme } = useTheme();
  return color ?? theme.colors.icon;
}

export function BreatheIcon({ color, size = 32 }: IconProps) {
  const stroke = useIconColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Circle cx="16" cy="16" r="9.2" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function DistractIcon({ color, size = 32 }: IconProps) {
  const stroke = useIconColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Circle cx="11" cy="13" r="4.2" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      <Circle cx="21" cy="11" r="2.6" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      <Circle cx="19.5" cy="20.5" r="3.4" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      <Circle cx="8.5" cy="21.5" r="1.5" fill={stroke} />
    </Svg>
  );
}

export function GroundIcon({ color, size = 32 }: IconProps) {
  const stroke = useIconColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Ellipse
        cx="16"
        cy="22.2"
        rx="8.2"
        ry="3.4"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Ellipse
        cx="16"
        cy="16.4"
        rx="6.2"
        ry="2.9"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Ellipse
        cx="16"
        cy="11.2"
        rx="4.4"
        ry="2.5"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

export function MoveIcon({ color, size = 32 }: IconProps) {
  const stroke = useIconColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Circle cx="18.2" cy="8.4" r="2.1" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      <Path
        d="M12.2 24.6l3.4-6.1 3.1 3.2 2.4 5.1"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.6 14.2l2.2 4.3 4.8-1.6 3.2 2"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ListenIcon({ color, size = 32 }: IconProps) {
  const stroke = useIconColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Line x1="10" y1="13" x2="10" y2="19" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="14.2" y1="9.5" x2="14.2" y2="22.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="18.4" y1="11.5" x2="18.4" y2="20.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="22.6" y1="8.8" x2="22.6" y2="23.2" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ReadIcon({ color, size = 32 }: IconProps) {
  const stroke = useIconColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="M8 22.5C8 14 12 8 18 6"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line x1="16" y1="12" x2="25.5" y2="12" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="16" y1="16.2" x2="24" y2="16.2" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="16" y1="20.4" x2="22.2" y2="20.4" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function CallIcon({ color, size = 32 }: IconProps) {
  const stroke = useIconColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Circle cx="16" cy="11.2" r="4.1" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      <Path
        d="M8.8 24.2c.8-4.4 3.5-6.6 7.2-6.6s6.4 2.2 7.2 6.6"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SettingsIcon({ color, size = 18 }: IconProps) {
  const stroke = useIconColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"
        fill="none"
        stroke={stroke}
        strokeWidth={1.3}
      />
      <Path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1.03 1.56V21.2a2 2 0 1 1-4 0v-.24A1.7 1.7 0 0 0 8.94 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H2.8a2 2 0 1 1 0-4h.24A1.7 1.7 0 0 0 4.6 8.94a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 8.94 4.6 1.7 1.7 0 0 0 10 3.04V2.8a2 2 0 1 1 4 0v.24A1.7 1.7 0 0 0 15.06 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 8.94 1.7 1.7 0 0 0 20.96 10H21.2a2 2 0 1 1 0 4h-.24A1.7 1.7 0 0 0 19.4 15z"
        fill="none"
        stroke={stroke}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const toolIcons = {
  breathe: BreatheIcon,
  distract: DistractIcon,
  ground: GroundIcon,
  move: MoveIcon,
  listen: ListenIcon,
  read: ReadIcon,
  call: CallIcon,
} as const;

export function ToolIcon({ name, color, size = 32 }: IconProps & { name: ToolId }) {
  const Icon = toolIcons[name];
  if (!Icon) {
    return null;
  }
  return <Icon color={color} size={size} />;
}
