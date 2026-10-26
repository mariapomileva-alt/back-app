export type SessionFeeling = 'better' | 'same' | 'worse';

export type LockScreenHintMemory = {
  hasBeenShown(): Promise<boolean>;
  markShown(): Promise<void>;
};

async function defaultMemory(): Promise<LockScreenHintMemory> {
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  const { storageKeys } = await import('@/storage/keys');
  return {
    async hasBeenShown() {
      const raw = await AsyncStorage.getItem(storageKeys.lockScreenHintShown);
      return raw === '1';
    },
    async markShown() {
      await AsyncStorage.setItem(storageKeys.lockScreenHintShown, '1');
    },
  };
}

export function shouldShowLockScreenHint(input: {
  outcome: SessionFeeling;
  alreadyShown: boolean;
}): boolean {
  if (input.alreadyShown) {
    return false;
  }
  return input.outcome !== 'worse';
}

export async function resolveLockScreenHint(options: {
  outcome: SessionFeeling;
  memory?: LockScreenHintMemory;
}): Promise<'show' | 'skip'> {
  const memory = options.memory ?? (await defaultMemory());
  const alreadyShown = await memory.hasBeenShown();
  if (!shouldShowLockScreenHint({ outcome: options.outcome, alreadyShown })) {
    return 'skip';
  }
  await memory.markShown();
  return 'show';
}
