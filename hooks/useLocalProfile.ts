import { useCallback, useEffect, useState } from 'react';

import { clearLocalProfile, loadLocalProfile, profileSalutation, saveLocalProfile } from '@/storage/profile';
import type { LocalProfile } from '@/types/profile';

type State = {
  profile: LocalProfile | null;
  salutation: string | null;
  loading: boolean;
};

export function useLocalProfile() {
  const [state, setState] = useState<State>({
    profile: null,
    salutation: null,
    loading: true,
  });

  const refresh = useCallback(async () => {
    const profile = await loadLocalProfile();
    setState({
      profile,
      salutation: profileSalutation(profile),
      loading: false,
    });
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persist = useCallback(
    async (patch: LocalProfile) => {
      const saved = await saveLocalProfile(patch);
      setState({
        profile: saved,
        salutation: profileSalutation(saved),
        loading: false,
      });
      return saved;
    },
    [],
  );

  const clear = useCallback(async () => {
    await clearLocalProfile();
    setState({ profile: null, salutation: null, loading: false });
  }, []);

  return { ...state, refresh, persist, clear };
}
