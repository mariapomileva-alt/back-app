# Back Plus subscription audit

Date: 17 September 2026. Scope: correct subscription model (S2). **No purchase activation (S3).**

## Business model (final)

- **No permanent free tier** for Breathe, Distract, Ground, Move, Listen, Read, My patterns, or themes.
- **Annual:** 7-day store trial when eligible; then renews at localized annual price unless cancelled.
- **Monthly:** no trial; renews until cancelled.
- **Safety / account routes** never gated: Extra support, emergency info, Call/Message my person, Privacy, Terms, Subscription info, Restore, Manage subscription, Support, and accessibility needed for those screens.

## Central config

- `config/backPlus.ts`: `subscriptionsPubliclyAvailable: false`, `paidToolIds`, `freeForeverRouteIds`, `devPreviewEntitlement`, planned EUR reference for website State A only.
- `landing/subscriptions-config.js`: mirror of `subscriptionsPubliclyAvailable`.

## Entitlement layer (S2 stub)

- `features/subscription/resolveBackPlusAccess.ts` + `useBackPlusAccess.ts`
- Production without RevenueCat / products: `unavailable` for store UI, **tools locked** (`hasPaidAccess: false`).
- `__DEV__`: `devPreviewEntitlement` defaults to `subscribed` (tools open); override with `none` | `trialActive` | `expired` | `null` to preview paywall or production stub.
- `entitlementCache.ts`: structure for last verified entitlement — **does not unlock** without store verification.

## Routing

- Home: six cards unchanged visually; tap without entitlement → `/settings/subscription`.
- Paid tool screens: `usePaidToolGate()` (not on safety routes).
- Active session: no paywall on close; no paywall after “Worse” (`useActiveSession`, session alternatives).

## RevenueCat / IAP

- No `react-native-purchases` in dependencies.
- `config/production.ts`: null API keys, null `annualProductId` / `monthlyProductId`.

## Production TODOs (S3+)

- Create App Store / Play subscription products; set product IDs in `production.ts`.
- RevenueCat project, entitlements, public SDK keys.
- Wire `resolveBackPlusAccess` to CustomerInfo; populate entitlement cache after verification.
- Legal review of regional pricing and trial disclosures.
- Monitored support email on `landing/support.html`.
- Set `subscriptionsPubliclyAvailable: true` only when products are approved and `hasConfiguredStoreProducts()` is true.

## Consistency test (website + app)

| Claim | Status |
| --- | --- |
| No permanent free tier for six tools | Yes |
| Annual 7-day trial when eligible | Yes (copy; store not live) |
| Subscription required after trial for six tools | Yes |
| Safety routes without payment | Yes |
