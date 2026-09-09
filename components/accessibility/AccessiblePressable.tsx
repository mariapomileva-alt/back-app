import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { touch } from '@/theme/spacing';

type Props = PressableProps & {
  style?: StyleProp<ViewStyle>;
};

export function AccessiblePressable({ style, children, ...rest }: Props) {
  return (
    <Pressable
      style={(state) => [
        {
          minWidth: touch.min,
          minHeight: touch.min,
          opacity: state.pressed ? 0.86 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
