import { Stack } from 'expo-router';

import { usePaidToolGate } from '@/hooks/usePaidToolGate';

function DistractPaidAccessGate() {
  usePaidToolGate();
  return null;
}

export default function DistractLayout() {
  return (
    <>
      <DistractPaidAccessGate />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
