# Lock Screen, widgets, and App Intents

Phase 6 plan. Native Apple surfaces that open Back in one tap.

## Approach

Back is a managed Expo 57 app. The generated `/ios` folder is gitignored. Widgets are Swift/WidgetKit, not JavaScript.

Use [`@bacons/apple-targets`](https://github.com/EvanBacon/expo-apple-targets) (Expo SDK ≥53, CocoaPods ≥1.16.2, Xcode 16). Source lives in `targets/` outside generated `/ios`, so Continuous Native Generation keeps the widget after `npx expo prebuild -p ios --clean`.

Do not use a hand-maintained Xcode project. Do not commit `/ios`.

| Surface | Implementation | Opens |
| --- | --- | --- |
| Home Screen widget (small) | `targets/widget/widget.swift` | `back:///breathe` |
| Lock Screen (circular, rectangular, inline) | same widget, accessory families | `back:///breathe` |
| Control Center (iOS 18+) | `targets/widget/_shared/intents.swift` `BackControl` | `back:///breathe` |
| Siri / Shortcuts / Action button | App Intents in `_shared` | `back:///` or `back:///breathe` |

`_shared` is required so App Intents with `openAppWhenRun = true` link to both the app and the widget extension.

Deep links are handled by Expo Router plus `app/+native-intent.ts`, which maps `back:` URLs to `/` or `/breathe`.

## EAS / prebuild

1. Plugin is already listed in `app.json`: `@bacons/apple-targets`.
2. Production and development iOS builds run `expo prebuild`, which creates the widget target and signs it with the app.
3. First time only: create the App Store Connect capability / provisioning for the widget bundle `app.back.selfhelp.BackWidget` (or the sanitized default). EAS usually provisions this on the next iOS build.
4. Widget deployment target is iOS 17. Control Center code is `@available(iOS 18.0, *)`.
5. No App Group is required. The widget does not read app data.

`eas.json` profiles do not need extra keys for this plugin. A development client (`eas build --profile development --platform ios`) is the practical way to try widgets on a device.

## What Expo Go can test

| Piece | Expo Go | Development / EAS build |
| --- | --- | --- |
| Outcome-screen Lock Screen card | Yes | Yes |
| Locale strings | Yes | Yes |
| `back:///breathe` if opened from Safari / Notes | Partial (scheme may not be registered the same way) | Yes |
| Home / Lock Screen widget | No | Yes, after prebuild |
| Control Center control | No | Yes, iOS 18 device |
| Siri / Shortcuts / Action button | No | Yes |

There is no way to preview WidgetKit or Control Center inside Expo Go. The JS card is the only Phase 6 surface that can be checked without a native build.

## Outcome card

After the first completed session that is not Worse, show one dismissible card:

> Add Back to your Lock Screen, so next time it is one tap away

Shown at most once. Stored on-device (`back.lockScreenHintShown`). Never after Worse. If the first outcome is Worse, the flag stays unset so a later Better or Same can still show it. Dismiss continues to alternatives. No paywall, no rating, no tracking.
