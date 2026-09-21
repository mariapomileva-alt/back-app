import { useEffect, useMemo, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { useBindSessionAppState } from '@/hooks/useActiveSession';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { ThemeProvider, useTheme } from '@/providers/ThemeProvider';
import { motion } from '@/theme/motion';

SplashScreen.preventAutoHideAsync();

function ThemedGestureRoot({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {children}
    </GestureHandlerRootView>
  );
}

function RootNavigation() {
  const { theme, reduceMotion } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: (reduceMotion ? 'none' : 'fade') as 'none' | 'fade',
      animationDuration: motion.screen,
      contentStyle: { backgroundColor: theme.colors.background },
      gestureEnabled: true,
    }),
    [reduceMotion, theme.colors.background],
  );

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <Stack screenOptions={screenOptions} />
    </>
  );
}

export default function RootLayout() {
  useBindSessionAppState();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider>
      <ThemedGestureRoot>
        <LocaleProvider>
          <RootNavigation />
        </LocaleProvider>
      </ThemedGestureRoot>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
