import AsyncStorage from '@react-native-async-storage/async-storage';

import { storageKeys } from './keys';

export async function isHomeNamePromptDismissed(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(storageKeys.homeNamePromptDismissed);
  return raw === '1';
}

export async function dismissHomeNamePrompt(): Promise<void> {
  await AsyncStorage.setItem(storageKeys.homeNamePromptDismissed, '1');
}
