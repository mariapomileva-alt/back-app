import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { useBindSessionAppState } from '@/hooks/useActiveSession';
import { ThemeProvider, useTheme } from '@/providers/ThemeProvider';
import { motion } from '@/theme/motion';

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { theme, reduceMotion } = useTheme();

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: reduceMotion ? 'none' : 'fade',
          animationDuration: motion.screen,
          contentStyle: { backgroundColor: theme.colors.background },
          gestureEnabled: true,
        }}
      />
    </>
  );
}

export default function RootLayout() {
  useBindSessionAppState();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
