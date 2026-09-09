import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo } from 'react-native';
import * as SystemUI from 'expo-system-ui';

import {
  defaultPreferences,
  loadPreferences,
  saveHapticsEnabled,
  saveReduceMotionOverride,
  saveThemeName,
} from '@/storage/preferences';
import { defaultThemeName, themes, type AppTheme, type ThemeName } from '@/theme/themes';

type ThemeContextValue = {
  theme: AppTheme;
  themeName: ThemeName;
  hapticsEnabled: boolean;
  reduceMotionOverride: boolean;
  systemReduceMotion: boolean;
  reduceMotion: boolean;
  setThemeName: (name: ThemeName) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setReduceMotionOverride: (enabled: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [themeName, setThemeNameState] = useState<ThemeName>(defaultPreferences.themeName);
  const [hapticsEnabled, setHapticsEnabledState] = useState(defaultPreferences.hapticsEnabled);
  const [reduceMotionOverride, setReduceMotionOverrideState] = useState(
    defaultPreferences.reduceMotionOverride,
  );
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void loadPreferences().then((preferences) => {
      if (cancelled) {
        return;
      }
      setThemeNameState(preferences.themeName);
      setHapticsEnabledState(preferences.hapticsEnabled);
      setReduceMotionOverrideState(preferences.reduceMotionOverride);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const apply = (enabled: boolean) => {
      if (!cancelled) {
        setSystemReduceMotion(enabled);
      }
    };

    void AccessibilityInfo.isReduceMotionEnabled().then(apply);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', apply);

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  const theme: AppTheme = themes[themeName] ?? themes[defaultThemeName];

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  const setThemeName = useCallback((name: ThemeName) => {
    setThemeNameState(name);
    void saveThemeName(name);
  }, []);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setHapticsEnabledState(enabled);
    void saveHapticsEnabled(enabled);
  }, []);

  const setReduceMotionOverride = useCallback((enabled: boolean) => {
    setReduceMotionOverrideState(enabled);
    void saveReduceMotionOverride(enabled);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeName,
      hapticsEnabled,
      reduceMotionOverride,
      systemReduceMotion,
      reduceMotion: reduceMotionOverride || systemReduceMotion,
      setThemeName,
      setHapticsEnabled,
      setReduceMotionOverride,
    }),
    [
      theme,
      themeName,
      hapticsEnabled,
      reduceMotionOverride,
      systemReduceMotion,
      setThemeName,
      setHapticsEnabled,
      setReduceMotionOverride,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}
