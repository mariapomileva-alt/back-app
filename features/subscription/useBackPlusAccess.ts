import { useCallback, useEffect, useState } from 'react';

import {
  resolveBackPlusAccess,
  type ResolvedBackPlusAccess,
} from '@/features/subscription/resolveBackPlusAccess';

const initial: ResolvedBackPlusAccess = {
  accessState: 'loading',
  hasPaidAccess: false,
  plan: null,
  renewalOrExpirationDate: null,
  storePurchasesAvailable: false,
};

export function useBackPlusAccess(): ResolvedBackPlusAccess & { refresh: () => void } {
  const [value, setValue] = useState<ResolvedBackPlusAccess>(initial);

  const refresh = useCallback(() => {
    void resolveBackPlusAccess().then(setValue);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void resolveBackPlusAccess().then((result) => {
      if (!cancelled) {
        setValue(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...value, refresh };
}

export { accessStateHasPaidAccess } from '@/features/subscription/resolveBackPlusAccess';
