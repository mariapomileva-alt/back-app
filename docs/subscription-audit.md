# Back Plus subscription audit (S1)

Date: 17 September 2026. Scope: information architecture only (S1 + S2). **No purchase activation (S3).**

## landing/subscriptions.html (before S2)

- Placeholder for Back 1.0: free app, no IAP, future “Back+” mentioned generically.
- Footer and Warm Earth / `legal-main` pattern matched other legal pages.
- Meta description stated no in-app purchase.

## App: settings & route

- `app/settings/subscription.tsx`: minimal stub (`subscription.available`, `noPaywall`, `purchasingOff`); route `/settings/subscription` exists via expo-router file layout.
- `app/settings/index.tsx`: **no** Back Plus / Subscription row (intentionally removed per `store/ios/listing.md` for 1.0 App Store).
- S2 re-adds informational **Back Plus** row only — no purchase.

## RevenueCat / IAP / billing

- **No** `react-native-purchases` / RevenueCat SDK in dependencies.
- `config/production.ts`: `revenueCatIosApiKey`, `revenueCatAndroidApiKey`, and `annualProductId` are `null`; `entitlementId: 'back_annual'` is a placeholder only.
- `hasRevenueCatConfig()` returns false until both API keys are set.
- Store docs (`store/ios/listing.md`, `SHARE-WITH-COMPANION.md`): IAP disabled for 1.0.

## Entitlement boundaries (free tools)

- Grep found **no** runtime paywall / premium checks on the six home tools.
- `hooks/useActiveSession.ts` explicitly avoids routing to a paywall from an active session.
- Extra support, Call my person, and emergency flows are not subscription-gated in code.

## Locales

- Only `locales/en.json` is loaded (`locales/i18n.ts`); other languages fall back to English.

## Legal copy consistency

- `landing/terms.html` and `landing/support.html` link to `subscriptions.html` for billing.
- Pre-S2 app copy said “nothing to buy”; website said 1.0 free — aligned on free 1.0, but did not yet describe Back Plus preparation. S2 aligns on **Back Plus being prepared** while **core tools stay free**.

## Apple / Google product IDs in repo

- **None configured.** `annualProductId` is null; no monthly product id field populated.

## Central config (S2)

- `config/backPlus.ts`: `subscriptionsPubliclyAvailable: false`, benefits released vs planned, planned EUR reference prices for website planning only, ethical rules in comments.
- `landing/subscriptions-config.js`: mirror flag for static site State A/B.

## Production TODOs (S3+, not this pass)

- Create App Store / Play subscription products; set `annualProductId` (+ monthly if offered).
- RevenueCat project, entitlements, public SDK keys in `production.ts`.
- Legal review of Back Plus copy and regional pricing disclosures.
- Monitored support email on `landing/support.html` (existing TODO).
- Enable purchases only when `hasConfiguredStoreProducts()` is true and products are approved.
