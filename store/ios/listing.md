# App Store Connect pack — Back: You're Here

Upload assets and paste copy in App Store Connect. This file is the listing text and the fill-in checklist.

Companion how-to (zip, build branch, what **not** to upload): **`store/ios/SHARE-WITH-COMPANION.md`**.

**Copyright (Connect):** 2026 Tatjana Fedorkova  
**Bundle ID:** `app.back.selfhelp`  
**Version:** 1.0.0  
**SKU suggestion:** `back-ios-1` (set once in Connect)  
**Branch for app + this pack:** `cursor/active-session-foundation`  
**Pack updated:** 21 September 2026

**Nothing in this folder auto-uploads to Apple.** A human uploads the **production binary** (EAS / Xcode) and these PNGs separately.

---

## Production build (developer — not in this folder)

| Item | Instruction |
| --- | --- |
| Git branch | `cursor/active-session-foundation` after QA (not an stale `main` archive unless confirmed current) |
| Profile | EAS **production** (or Xcode Archive → App Store Connect) |
| Bundle ID | `app.back.selfhelp` |
| Companion | Selects the uploaded build on version **1.0** in Connect — this pack does not contain the `.ipa` |

---

## Files for Connect

| Asset | Path | Spec | Notes |
| --- | --- | --- | --- |
| App icon (master) | `store/ios/icon-1024.png` | 1024×1024 RGB opaque PNG | Same as `assets/images/icon.png` |
| Screenshots | `store/ios/screenshots/` | iPhone **6.9"** **1320×2868** portrait | Six PNGs; full-bleed UI (not a 3D phone frame) |

Upload order (**6.9"** well — not 6.5"):

1. `01-home.png` — Home  
2. `02-breathe.png` — Breathe  
3. `03-ground.png` — Ground  
4. `04-listen.png` — Listen (**confirm matches TestFlight** — picker + session chrome)  
5. `05-distract.png` — Distract  
6. `06-extra-support.png` — Extra support  

**Do not upload:** `screenshots/compose.html`, anything under repo `verification-screenshots/` (QA sizes only).

No iPad, Watch, or preview video.

---

## URLs (App Information + Review notes)

**Do not paste Privacy or Support into Connect until each URL returns HTTP 200 in a browser.**

GitHub Pages for **backapp.live** deploys from **`main`**. Files live in `landing/` on this branch; they may 404 on the live site until merged/deployed to **`main`**.

| URL | Role |
| --- | --- |
| https://backapp.live/ | Marketing (optional) — usually live |
| https://backapp.live/privacy.html | **Privacy Policy URL** (required) |
| https://backapp.live/support.html | **Support URL** (required) |
| https://backapp.live/subscriptions.html | Back Plus / billing transparency |
| https://backapp.live/terms.html | Terms of use |
| https://mariapomileva-alt.github.io/back-app/… | **Not a fallback** — custom domain redirects |

After deploy, paste:

- **Support URL:** https://backapp.live/support.html  
- **Privacy Policy URL:** https://backapp.live/privacy.html  
- **Marketing URL (optional):** https://backapp.live/  

Use subscriptions + terms URLs in **Review notes** and in-app; Connect may not require separate fields.

**Site footer:** © Back App. **App Store copyright field** may still list **2026 Tatjana Fedorkova** — that is intentional.

Support is described on the support page: **support@backapp.live** (also linked from https://backapp.live/support.html).

---

## Listing copy (English, US)

### Name
Back: You're Here

### Subtitle (25 / 30 characters)
```
Quiet help for one minute
```

### Description
```
Back is a private self-help tool for the next minute of anxiety, panic, or overload.

You’re here. What feels possible right now?

Six quiet tools on your phone:

Breathe — a gentle rhythm you can follow.
Distract — simple activities that give your mind a smaller thing to hold.
Ground — slow attention to your body and the room.
Move — small, quiet movement.
Listen — rain, ocean, forest, fan, or brown noise, on this device.
Read — short lines that appear at a pace you choose.

Back Plus

The six core tools are part of Back Plus — a subscription with a planned 7-day trial on the annual plan for eligible subscribers, then monthly or annual renewal. Final prices and trial eligibility are determined by the App Store in your region when Back Plus is available for purchase.

In this release, Back Plus is information only: there is nothing to buy in the App Store yet. Open Settings → Back Plus to read what is planned. Purchases and Restore will appear in a later update when subscriptions are activated.

Always available without a subscription: Extra support, emergency information, Call my person, Privacy, Terms, and subscription information. Back does not place calls for you.

Private. No account. Nothing you save is sent to Back. Your “my person” contact stays on this device.

Back is not therapy, not a diagnosis, and not an emergency service. It is not a medical device.

Subscription details: https://backapp.live/subscriptions.html
Privacy: https://backapp.live/privacy.html
Terms: https://backapp.live/terms.html
```

### Keywords (100 / 100 characters)
```
anxiety,panic,breathe,grounding,overload,stress,self-help,quiet,breathing,ground,relief,minute,tools
```

No competitor names. No “Calm”, “Headspace”, or similar.

### Promotional text (optional)
```
Six quiet tools for difficult minutes. Private. No account. Back Plus details in Settings.
```

### What's New
```
First release.
```

---

## Category, age, privacy, agreements

### Category
**Health & Fitness** (primary). Do **not** choose Medical.

Secondary (optional): Lifestyle.

### Age Rating — walk the form

Recommended store age: **12+** because the app names anxiety/panic and Extra support talks about urgent help. Do **not** check Medical Treatment / Medical or Treatment Information.

| Question | Answer |
| --- | --- |
| Unrestricted Web Access | No (Privacy opens one URL; calls/SMS open system apps) |
| Gambling and Contests | None |
| Mature/Suggestive Themes | None |
| Medical or Treatment Information | **None** |
| Alcohol, Tobacco, or Drug Use | None |
| Simulated Gambling | None (Distract games are not gambling) |
| Sexual Content or Nudity | None |
| Profanity or Crude Humor | None |
| Horror/Fear Themes | None |
| Cartoon or Fantasy Violence | None |
| Realistic Violence | None |
| Guns or Weapons | None |

If the form shows **4+** without Medical Treatment, that can be honest; Extra support carries an on-screen disclaimer. Prefer **12+** if Connect allows without checking Medical Treatment.

### App Privacy (nutrition label)

Select **Data Not Collected**.

Do **not** check Health & Fitness, Health, Health Records, Contact Info, Identifiers, Usage Data, Diagnostics, Location, or Sensitive Info.

The “my person” number and preferences stay on-device only; Back does not receive them.

### Review Information — Notes (paste)

Paste **only after** legal URLs return HTTP 200. Replace `[REVIEWER PHONE]` if Maria adds a dedicated line in Notes elsewhere; companion still sets Review contact in Connect.

```
Back is an offline-first self-help app. There is no account and no demo login.

SUBSCRIPTION (THIS BUILD)
- Back Plus is shown in Settings and when tapping a core tool on Home.
- In-app purchases are NOT enabled in App Store Connect for this submission. The Back Plus screen states that there is nothing to buy yet and that final prices will appear in the App Store before purchase.
- Do not expect a working Subscribe button or Sandbox purchase in this build.
- Planned model (documented on https://backapp.live/subscriptions.html ): 7-day trial on Back Plus Annual for eligible subscribers, then monthly or annual auto-renewing subscription for the six core tools.

WHAT REVIEWERS CAN OPEN WITHOUT A PURCHASE
- Home → Call my person (on-device contact the user chooses).
- Settings → Extra support (emergency information; not subscription-gated).
- Settings → Privacy, Terms, Back Plus (information), Language, accessibility toggles.

CORE TOOLS (Breathe, Distract, Ground, Move, Listen, Read)
- Tapping a tool on Home opens the Back Plus information screen instead of starting a session until store subscriptions are activated in a later release.
- For UI review of a tool screen, use an internal TestFlight build if Maria provided one with tools unlocked; otherwise describe that session UI is present in the binary but gated until Back Plus purchases launch.

AUDIO
- Listen uses bundled on-device loops (synthetic placeholders generated in-repo, not a licensed commercial sound library). Ground optional narration is also a placeholder. If asked about rights: temporary generated assets until studio/licensed files ship in a later update.
- Listen may continue quiet sound with the screen locked when a session is active (background audio mode).

SAFETY
- Back is not a medical device, not therapy, not a diagnosis, and not an emergency service. Extra support does not place calls; it can open Phone or Messages.

ATTACHMENTS
- Maria may attach a screen recording captured on a physical iPhone showing Home, Settings → Back Plus, Settings → Extra support, and Call my person.

Privacy Policy: https://backapp.live/privacy.html
Support: https://backapp.live/support.html
Subscriptions: https://backapp.live/subscriptions.html
Terms: https://backapp.live/terms.html
```

### Demo account
None. Leave username/password blank.

### Advertising Identifier
No. Do not enable LAT / IDFA.

### Content rights
You own or have rights to ship the UI. Listen/Ground **audio and some stills are placeholders** — see **Still placeholder — reject risk**. Do not claim licensed commercial music or commissioned field recordings if asked.

### Paid Apps Agreement / In-App Purchases

**This submission (1.0 review build):**

- **Do not** create or attach subscription IAP products in Connect yet (`subscriptionsPubliclyAvailable: false` in app; no RevenueCat product IDs in production config).
- **Do not** tell Review to complete a Sandbox purchase in this build.
- **Free Apps** agreement / tax as Connect requires for distributing a free download.

**Later (S3 — when Maria / developer confirms):**

- Complete **Paid Apps Agreement**, banking, and tax if not already done.
- Create Back Plus subscription group + products in Connect; wire RevenueCat + `config/production.ts`; enable purchases in app; submit a **new version** with updated Review notes and Sandbox test steps.

### EU trader status (Digital Services Act)
Complete in App Store Connect (trader vs non-trader; legal name/address — copyright holder: Tatjana Fedorkova). Submit for Review stays disabled until this is done.

---

## Manual clicks in App Store Connect

1. App record: bundle `app.back.selfhelp`, name **Back: You're Here**.  
2. Upload **production** iOS build from branch `cursor/active-session-foundation`.  
3. Version **1.0**: select that build.  
4. Upload six **1320×2868** screenshots → **6.9" Display**.  
5. Paste subtitle, description, keywords, What’s New.  
6. Support + Privacy URLs (200 OK).  
7. Category: Health & Fitness.  
8. Age Rating (table above).  
9. App Privacy: Data Not Collected.  
10. Review notes (block above) + Review phone/email.  
11. EU trader / DSA.  
12. Export compliance: encryption **No**.  
13. **Leave IAP off** for this version.

---

## What this pack matches in the app (21 Sep 2026)

- **Back Plus** row in Settings; `/settings/subscription` explains planned trial/subscription; **no live store prices** in UI.  
- **Production:** core tools on Home route to Back Plus info (`hasPaidAccess: false`; store products not configured).  
- **Safety routes** (Extra support, emergency info, Call my person, Privacy, Terms, subscription info) remain reachable without purchase.  
- **Listen:** 9 on-device loops — synthetic placeholders (`environmentAudioReady: false`).  
- **Icon:** `store/ios/icon-1024.png` / `assets/images/icon.png` (tactile forest disc).  
- **Landing:** `privacy.html`, `support.html`, `subscriptions.html`, `terms.html` in repo — deploy from **`main`** before Connect URLs must work.

---

## Still placeholder — reject risk

Do **not** tell Review these sounds or photos are original commissioned or licensed library assets.

| Slot | Status | If asked |
| --- | --- | --- |
| Listen loops (`audio/sounds/*-placeholder.wav`) | Generated placeholders; `environmentAudioReady: false` | Temporary in-repo loops; licensed/studio files planned in a later update. |
| Ground narration (`audio/grounding/english-placeholder.wav`) | Placeholder; `groundingAudioReady: false` | On-screen instructions work without it. |
| Listen stills (`listen-*-placeholder.jpg`) | Bundled placeholders; license not cleared for store | Documented in `assets/docs/production-asset-manifest.txt`. |
| Ground/Move stills (`*-placeholder.png`) | Bundled placeholders | Same. |
| Fan / brown visuals | Original in-app graphics | OK. |

Extra support disclaimer stays in app and listing.

---

## Later updates (not this submission)

| Change | Action |
| --- | --- |
| Licensed Listen audio | Replace WAVs, update `SOUND_ASSET_LICENSES.md`, `environmentAudioReady: true`, new build |
| Fresh App Store screenshots | Replace `store/ios/screenshots/01–06`, re-upload in Connect |
| Back Plus purchases live | S3: Connect products + RevenueCat + new Review notes with Sandbox Apple ID steps |

---

## Character counts (approximate)

- Subtitle: 25 / 30  
- Keywords: 100 / 100  
- Promotional text: under 170  
- Description: within App Store limit; includes subscription disclosure for planned Back Plus  
