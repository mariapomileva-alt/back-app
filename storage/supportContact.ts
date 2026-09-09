import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SupportContact } from '@/types';

import { storageKeys } from './keys';

function parseContact(value: string): SupportContact | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    const name = typeof record.name === 'string' ? record.name.trim() : '';
    if (!name) {
      return null;
    }
    const phone =
      typeof record.phoneNumber === 'string' ? record.phoneNumber.trim() : '';
    return {
      id: typeof record.id === 'string' && record.id ? record.id : 'local',
      name,
      phoneNumber: phone || undefined,
    };
  } catch {
    return null;
  }
}

export async function loadSupportContact(): Promise<SupportContact | null> {
  try {
    const raw = await AsyncStorage.getItem(storageKeys.supportContact);
    if (!raw) {
      return null;
    }
    return parseContact(raw);
  } catch {
    return null;
  }
}

export async function saveSupportContact(contact: SupportContact): Promise<void> {
  try {
    const name = contact.name.trim();
    if (!name) {
      return;
    }
    const stored: SupportContact = {
      id: contact.id || 'local',
      name,
      phoneNumber: contact.phoneNumber?.trim() || undefined,
    };
    await AsyncStorage.setItem(storageKeys.supportContact, JSON.stringify(stored));
  } catch {
    // Keep using in-memory values if local storage is unavailable.
  }
}

export async function clearSupportContact(): Promise<void> {
  try {
    await AsyncStorage.removeItem(storageKeys.supportContact);
  } catch {
    // Ignore storage failures.
  }
}
