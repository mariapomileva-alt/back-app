import * as Haptics from 'expo-haptics';

import { useTheme } from '@/hooks/useTheme';

async function safeImpact(style: Haptics.ImpactFeedbackStyle): Promise<void> {
  try {
    await Haptics.impactAsync(style);
  } catch {
    // Haptics are unavailable on some platforms, including web.
  }
}

async function safeSelection(): Promise<void> {
  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics are unavailable on some platforms, including web.
  }
}

export function useHaptics() {
  const { hapticsEnabled } = useTheme();

  return {
    light: () => {
      if (!hapticsEnabled) {
        return;
      }
      void safeImpact(Haptics.ImpactFeedbackStyle.Light);
    },
    selection: () => {
      if (!hapticsEnabled) {
        return;
      }
      void safeSelection();
    },
  };
}
