import { Linking } from 'react-native';

function digitsForDialing(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

export function canPlaceLocalCall(number: string | null | undefined): boolean {
  return Boolean(number && digitsForDialing(number).length > 0);
}

export async function openPhoneCall(number: string): Promise<void> {
  const digits = digitsForDialing(number);
  if (!digits) {
    return;
  }
  await Linking.openURL(`tel:${digits}`);
}

export async function openSmsMessage(number: string): Promise<void> {
  const digits = digitsForDialing(number);
  if (!digits) {
    return;
  }
  await Linking.openURL(`sms:${digits}`);
}
