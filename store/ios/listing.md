# App Store Connect pack — Back: Panic Attack Help

Upload these files in App Store Connect. This file is the listing copy and the fill-in checklist.

Companion how-to (zip, where to paste, what they still click): **`store/ios/SHARE-WITH-COMPANION.md`**.

**Copyright:** 2026 Tatjana Fedorkova  
**Bundle ID:** `app.back.selfhelp`  
**Version:** 1.0.1  
**SKU suggestion:** `back-ios-1` (set once; cannot invent Apple IDs)  
**Branch for this pack:** `cursor/active-session-foundation`

**Audit:** 15 September 2026 (icon via `sips`; URLs via `curl --max-time 8`).

---

## Files

| Asset | Path | Spec | Audit |
| --- | --- | --- | --- |
| App icon (master) | `store/ios/icon-1024.png` | 1024×1024, RGB, opaque PNG, no rounded corners, no alpha, no pre-rounded mask | **Present.** Approved tactile forest disc. `sips`: 1024×1024, RGB, `hasAlpha: no`. Same bytes as `assets/images/icon.png`. |
| App icon (Expo slot) | `assets/images/icon.png` | Same file as master | Present (identical hash). |
| Screenshots | `store/ios/screenshots/` | iPhone **6.9"** portrait **1320×2868** | **Present.** Seven PNGs, all 1320×2868. Paper frame, serif caption above the app UI. No lorem. No competitor names on captions. |

Screenshots (upload in this order, 6.9" well — not 6.5"):

1. `01-home.png` — Help in the first minute of panic
2. `02-breathe.png` — Breathe gently. Or pick another way
3. `01-home-offline.png` — No account. Works offline. Nothing leaves your phone
4. `04-listen.png` — Rain, ocean, brown noise for night panic
5. `03-ground.png` — Ground yourself in the room you are in
6. `06-extra-support.png` — Your person, one tap away
7. `05-distract.png` — Calm games with no scores

No iPad, Watch, or preview video.

---

## URLs (paste in App Information)

**Do not paste Privacy or Support URLs until they return HTTP 200.** GitHub Pages deploys from **`main`**. The HTML files exist on this branch (`landing/privacy.html`, `landing/support.html`) but **not** on `main`. Custom-domain HTTPS **is** issued.

| URL | Live status (15 Sep 2026) |
| --- | --- |
| https://backapp.live/ | **Live.** HTTPS 200. DNS (Namecheap) → GitHub Pages (`185.199.x.x`). Certificate issued (`ssl_verify_result=0`). |
| https://backapp.live/privacy.html | Confirm **200** after deploy from `main`. |
| https://backapp.live/support.html | Confirm **200** after deploy from `main`. |
| https://backapp.live/subscriptions.html | Subscriptions / billing transparency (free 1.0, no IAP). Confirm **200** after deploy. |
| https://backapp.live/terms.html | Terms of use (wellness disclaimer, not medical). Confirm **200** after deploy. |
| https://mariapomileva-alt.github.io/back-app/privacy.html | **Not a fallback.** CNAME redirects to `backapp.live`. |

After `landing/*.html` legal pages are on `main`, confirm 200 in a browser, then paste:

- **Support URL:** https://backapp.live/support.html
- **Privacy Policy URL:** https://backapp.live/privacy.html
- **Subscriptions / billing (public transparency):** https://backapp.live/subscriptions.html — use in Review notes or EU/consumer disclosures if Connect asks; not always a dedicated Connect field.
- **Terms of use (EULA-style):** https://backapp.live/terms.html — link from site footer; optional in Connect unless required by territory.
- **Marketing URL (optional):** https://backapp.live/

**Site footer brand:** © Back App (public site). **App Store Connect copyright metadata** may still list **2026 Tatjana Fedorkova** as copyright holder — that is separate from the website footer.

In-app Privacy already opens `https://backapp.live/privacy.html`. That in-app button will 404 until Pages is updated.

No product email is in the repo. Support is GitHub Issues (stated on the support page). Do not invent a mailbox.

---

## Listing copy (English, US)

### Name (23 / 30)
```
Back: Panic Attack Help
```

### Subtitle (28 / 30)
```
Anxiety SOS & calm breathing
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

Need someone? Call my person opens a contact you keep on this phone. Extra support can help you reach a person you trust, or show a public local emergency number. Back does not place the call for you.

Private. No account. Nothing you save is sent to Back. Your “my person” contact stays on this device.

Back is not therapy, not a diagnosis, and not an emergency service. It is not a medical device.
```

### Keywords (96 / 100 bytes)
```
relief,grounding,stress,overwhelm,sensory,overload,breathe,night,noise,offline,distract,selfcare
```

**No competitor names in any metadata field.** Do not use Calm, Headspace, Insight Timer, or similar.

### Promotional text (optional, 90 / 170)
```
Panic at night or on the metro? Back opens in one tap, needs no account and works offline.
```

### What's New (80 / 4000)
```
Share Back now includes a link. Breathe and Listen are always free. Small fixes.
```

---

## Category, age, privacy, agreements

### Category
**Health & Fitness** (primary). Do **not** choose Medical.

Secondary (optional): Lifestyle.

### Age Rating — walk the form

Recommended store age: **12+** because the app names anxiety/panic and Extra support talks about urgent help. Do **not** check Medical Treatment / Medical or Treatment Information.

Suggested answers (Apple’s age questionnaire):

| Question | Answer |
| --- | --- |
| Unrestricted Web Access | No (Privacy opens one URL; calls/SMS open system apps) |
| Gambling and Contests | None |
| Mature/Suggestive Themes | None |
| Medical or Treatment Information | **None** — do not mark this |
| Alcohol, Tobacco, or Drug Use | None |
| Simulated Gambling | None (Distract games are not gambling) |
| Sexual Content or Nudity | None |
| Profanity or Crude Humor | None |
| Horror/Fear Themes | None |
| Cartoon or Fantasy Violence | None |
| Realistic Violence | None |
| Guns or Weapons | None |

If the form then shows **4+**, that is the honest result without Medical Treatment. Extra support already carries an on-screen disclaimer. Prefer 12+ if Connect lets you choose a higher rating without checking Medical Treatment; otherwise submit the questionnaire result and keep the listing/disclaimer language.

### App Privacy (nutrition label)

Select **Data Not Collected**.

Do **not** check:

- Health & Fitness
- Health
- Health Records
- Contact Info (the “my person” number is on-device only; we never receive it)
- Identifiers, Usage Data, Diagnostics, Location, Sensitive Info

User-saved contact, preferences, and recent tools never leave the device.

### Review Information — Notes (paste)

```
Back is free and fully usable offline. There is no account and no demo login.

All six tools work without a network. A support contact saved as “my person” stays on the device and is never sent to us. Extra support can open the Phone or Messages app; Back does not place the call.

Listen may continue quiet sound with the screen locked (audio background mode). Ground can play optional on-device narration.

Back is not a medical device, not therapy, not a diagnosis, and not an emergency service. There are no in-app purchases or subscriptions in this version. Purchasing is disabled. Do not look for a paywall or a $9.99 product.

Privacy Policy: https://backapp.live/privacy.html
Support: https://backapp.live/support.html
Subscriptions (free, no IAP in 1.0): https://backapp.live/subscriptions.html
Terms: https://backapp.live/terms.html
```

Paste those two URLs in Review notes only after they 200 (see URLs above).

### Demo account
None. Leave username/password blank.

### Advertising Identifier
No. Do not check LAT / IDFA.

### Content rights
You own or have rights to ship the UI. Listen/Ground **audio and some stills are still placeholders** — see Reject risk below. Do not claim those files are original licensed music if asked; they are generated stand-ins.

### Paid Apps Agreement
First version is **free**. Do **not** enable In-App Purchases. Do not attach a subscription product. The in-app Subscription row is removed until RevenueCat exists. Paid Apps Agreement can remain unused for a free app; complete the **Free** apps agreement / tax/banking only as Connect requires for paid later.

### EU trader status (Digital Services Act)
You must complete this in App Store Connect. A banner about trader status (from Feb 2025) cannot be clicked from this pack. Choose trader vs non-trader, and fill the legal name/address Connect asks for (copyright holder: Tatjana Fedorkova) before Submit for Review will enable.

---

## Manual clicks still required in App Store Connect

Submit stays grey until a human does these in the UI:

1. Create the iOS app record if needed (bundle `app.back.selfhelp`, listing name **Back: Panic Attack Help**).
2. Upload `store/ios/icon-1024.png` if the build’s AppIcon is not already this file (EAS/Expo should pick `assets/images/icon.png`).
3. Upload the seven 1320×2868 screenshots into **6.9" Display** (not 6.5"), in the order listed above.
4. Paste subtitle, description, keywords, What’s New.
5. Set Support URL and Privacy Policy URL.
6. Category: Health & Fitness.
7. Complete Age Rating questionnaire (see table).
8. App Privacy: Data Not Collected.
9. Review notes + contact email/phone for App Review (your own).
10. EU trader / DSA form.
11. Encryption: `ITSAppUsesNonExemptEncryption` is already false in `app.json` — confirm the export compliance question as No.
12. Upload a production build (EAS `production`). This pack does not submit the binary.
13. Do **not** turn on IAP.

---

## What changed in the app for this pack

- Production icon is the approved tactile forest disc in `store/ios/icon-1024.png` and `assets/images/icon.png`; `productionIconReady: true`.
- Privacy screen links to https://backapp.live/privacy.html and states the app is not a medical device / not Health Records. (Page must be deployed from `main` before that URL 200s.)
- Subscription row removed from Settings. No $9.99 promise in UI or listing. `/settings/subscription` remains a dormant “nothing to buy” screen if opened by URL.
- Landing: `privacy.html`, `support.html`, `subscriptions.html`, `terms.html`; footer links (Privacy, Support, Subscriptions, Terms); site copyright © Back App.

---

## Still placeholder — reject risk

Do **not** tell Review these sounds or photos are original commissioned recordings.

| Slot | Status | Risk |
| --- | --- | --- |
| Listen loops (`audio/sounds/*-placeholder.wav`) | Generated placeholders; `environmentAudioReady: false` | If a reviewer asks about music rights, say they are temporary generated loops, not licensed commercial tracks. Replace before a later version if possible. |
| Ground narration (`audio/grounding/english-placeholder.wav`) | Generated placeholder; `groundingAudioReady: false` | Same. Tool still works with on-screen instructions. |
| Listen stills (`listen-*-placeholder.jpg`) | Bundled editorial-style photos, license unknown | Possible copyright complaint. Documented in `assets/docs/production-asset-manifest.txt`. |
| Ground/Move stills (`*-placeholder.png`) | Bundled placeholders | Same. Home Ground/Move cards use compressed crops. |
| Fan / brown visuals | Original in-app graphics | Fine. |

Extra support disclaimer is in the app and in the listing. Keep it.

---

## Character counts

- Name: 23 / 30
- Subtitle: 28 / 30
- Keywords: 96 / 100 bytes
- Promotional text: 90 / 170
- What's New: 80 / 4000

Localized name/subtitle drafts: `store/ios/localizations.md`. Keyword fields there stay empty until Maria fills them.
