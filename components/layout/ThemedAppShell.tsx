import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useTheme } from '@/hooks/useTheme';
import { paperGrainOpacity } from '@/theme/screenChrome';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Home / session shell — one themed background layer (no transparent safe area). */
export function ThemedAppShell({ children, scroll = true, contentStyle }: Props) {
  const { theme, themeName } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain opacity={paperGrainOpacity(themeName)} />
      <ScreenContainer scroll={scroll} contentStyle={contentStyle}>
        {children}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
