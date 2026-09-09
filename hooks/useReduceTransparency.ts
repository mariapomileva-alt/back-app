import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReduceTransparency(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const apply = (value: boolean) => {
      if (!cancelled) {
        setEnabled(value);
      }
    };

    void AccessibilityInfo.isReduceTransparencyEnabled?.().then(apply);
    const subscription = AccessibilityInfo.addEventListener?.(
      'reduceTransparencyChanged',
      apply,
    );

    return () => {
      cancelled = true;
      subscription?.remove?.();
    };
  }, []);

  return enabled;
}
