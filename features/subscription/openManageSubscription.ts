import { Linking, Platform } from 'react-native';

import { backPlusLegalUrls } from '@/config/backPlus';

/**
 * Opens store subscription management on native when S3 is live.
 * Web and pre-release builds use the public subscription information page.
 */
export function openManageSubscription(storePurchasesAvailable: boolean): void {
  if (storePurchasesAvailable && Platform.OS !== 'web') {
    // S3: deep link to App Store / Play subscription management for this app.
    void Linking.openURL(backPlusLegalUrls.subscriptions);
    return;
  }
  void Linking.openURL(backPlusLegalUrls.subscriptions);
}
