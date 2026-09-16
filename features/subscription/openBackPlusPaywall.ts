import type { Href } from 'expo-router';

type PaywallRouter = {
  push: (href: Href) => void;
};

/** Route to Back Plus information / paywall — not used from active session close or “Worse” flow. */
export function openBackPlusPaywall(router: PaywallRouter): void {
  router.push('/settings/subscription');
}
