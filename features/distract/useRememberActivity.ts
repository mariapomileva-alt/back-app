import { useEffect } from 'react';

import { saveLastDistractActivity } from '@/storage/preferences';

import type { DistractActivityId } from './activities';

export function useRememberDistractActivity(id: DistractActivityId) {
  useEffect(() => {
    void saveLastDistractActivity(id);
  }, [id]);
}
