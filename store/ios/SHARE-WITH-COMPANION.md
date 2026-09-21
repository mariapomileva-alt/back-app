# Share with companion / Передать компаньону

This folder is the **only** iOS App Store pack. Zip it, send it, or open it on GitHub.

Эта папка — **единственный** пакет для App Store. Сожмите, отправьте, или откройте на GitHub.

**App / Приложение:** Back: You're Here  
**Copyright (Connect metadata):** 2026 Tatjana Fedorkova  
**Branch / Ветка:** `cursor/active-session-foundation`  
**Repo path:** `store/ios`  
**Pack updated:** 21 September 2026 — aligned with Back Plus UI (purchases **not** live yet).

---

## 0. Quick answer / Коротко

| Question | Answer |
| --- | --- |
| Is everything already in App Store Connect? | **No.** Only this folder in GitHub. Connect is filled in manually. |
| Where is the binary (.ipa)? | **Not in the repo.** Developer uploads a **production** build (EAS / Xcode) from branch `cursor/active-session-foundation`. |
| Which branch? | **`cursor/active-session-foundation`** (after QA). Do **not** ship an old archive from `main` unless Maria confirms it is up to date. |
| In-App Purchases in Connect? | **Do not enable** for this submission. App shows Back Plus **information** only; store products and RevenueCat are **S3** (later). |
| Can we submit without licensed Listen audio? | **Yes**, with honest Review notes (generated loops). Licensed audio can ship in a later update. |

---

## 1. How to share / Как передать

**English**

1. Zip the folder `store/ios` (icon + `screenshots/` + `listing.md` + this file).
2. Send the zip via iCloud Drive, Google Drive, or email.
3. Or open the GitHub repo on branch `cursor/active-session-foundation` → `store/ios`.
4. Paste copy from **`listing.md`** into App Store Connect (map in section 3).
5. You still complete Age Rating, App Privacy, EU trader, Review phone/email, and **upload the build** — nothing in this pack does that for you.

**Русский**

1. Сожмите `store/ios` (иконка + `screenshots/` + `listing.md` + этот файл).
2. Отправьте zip (Drive / iCloud / почта) или откройте репозиторий на ветке **`cursor/active-session-foundation`**.
3. Тексты — из **`listing.md`**. Билд загружает разработчик отдельно.
4. Age Rating, App Privacy, EU trader, телефон/email для Review — только в Connect.

Do not send secrets, Apple IDs, or certificates. / Не пересылайте секреты, Apple ID и сертификаты.

---

## 2. What lives where / Где что лежит

| Item / Что | Path / Путь | Upload to Connect? |
| --- | --- | --- |
| App icon 1024×1024 | `icon-1024.png` | **Yes** → App Information, if Connect asks and the build did not already embed it |
| Home | `screenshots/01-home.png` | **Yes** → **6.9" Display**, 1st |
| Breathe | `screenshots/02-breathe.png` | **Yes** → 6.9" |
| Ground | `screenshots/03-ground.png` | **Yes** → 6.9" |
| Listen | `screenshots/04-listen.png` | **Yes** → 6.9" — **verify UI matches TestFlight** (see §4) |
| Distract | `screenshots/05-distract.png` | **Yes** → 6.9" |
| Extra support | `screenshots/06-extra-support.png` | **Yes** → 6.9" |
| Listing + checklist | `listing.md` | **No** — copy/paste text only |
| This how-to | `SHARE-WITH-COMPANION.md` | **No** |
| Screenshot compositor | `screenshots/compose.html` | **No** — local tool only |

All six store screenshots must be **1320×2868** (iPhone **6.9"** portrait). Not 6.5". No iPad, Watch, or preview video.

### Do **not** upload / Не загружать

| Path | Why |
| --- | --- |
| `verification-screenshots/` (repo root) | QA only — wrong sizes (390×844, etc.). Not App Store assets. |
| `store/ios/screenshots/compose.html` | Not a PNG. |
| Any `.env`, certificates, provisioning profiles | Secrets — never in Connect from this pack. |

When Maria or the developer replaces screenshots, they commit new PNGs under `store/ios/screenshots/` — then you re-upload those files.

---

## 3. App Store Connect map / Куда что вставить

Source of truth: **`listing.md`**.

| Connect field | From |
| --- | --- |
| Name | Back: You're Here |
| Subtitle | `Quiet help for one minute` |
| Description | Description block in `listing.md` |
| Keywords | Keywords block |
| Promotional text (optional) | Promotional block |
| What's New | `First release.` |
| Support URL | https://backapp.live/support.html — **only after HTTP 200** |
| Privacy Policy URL | https://backapp.live/privacy.html — **only after HTTP 200** |
| Marketing URL (optional) | https://backapp.live/ |
| Category | Health & Fitness (**not** Medical) |
| Screenshots | Six PNGs → **6.9" Display** |
| Review notes | **Review Information** block in `listing.md` |
| Demo account | Leave **blank** |
| In-App Purchases / subscription products | **Do not create or attach** for this submission |

---

## 4. Screenshots vs the real build / Скриншоты и билд

Before Submit:

1. Install the **same build** you will attach in Connect (TestFlight internal).
2. Compare **Listen** (`04-listen.png`) with the app: horizontal sound chips, back arrow in session header (no duplicate close control).
3. If PNGs in `store/ios/screenshots/` look older than TestFlight, **stop** — ask Maria for updated `01–06` on branch `cursor/active-session-foundation`, then upload the new files.

Optional reference (not for upload): `verification-screenshots/pre-release-qa/` and `session-chrome-qa/` show recent QA layouts at other sizes.

---

## 5. URLs — check before paste / Ссылки

GitHub Pages for **backapp.live** deploys from **`main`**. Legal HTML may exist on `cursor/active-session-foundation` before it is on `main`.

**Before Submit:** open each URL in a browser. Paste into Connect and Review notes **only when they return HTTP 200**.

| URL | Use |
| --- | --- |
| https://backapp.live/ | Marketing (usually live) |
| https://backapp.live/privacy.html | Privacy Policy URL |
| https://backapp.live/support.html | Support URL |
| https://backapp.live/subscriptions.html | Back Plus transparency (Review notes; in-app link) |
| https://backapp.live/terms.html | Terms (Review notes; in-app link) |

If Privacy or Support 404, merge/deploy `landing/*.html` to **`main`** first (Maria / developer).

In-app Settings → Privacy opens the privacy URL; it will fail until the page is live.

---

## 6. What this build does (for Review) / Поведение билда

So Review notes match the app:

| Area | Behavior in **production** build |
| --- | --- |
| Account / login | **None** |
| Home — six tools | Tap opens **Back Plus** information (Settings → subscription screen). **No purchase** yet. |
| Settings → **Back Plus** | Explains planned trial/subscription; copy says **nothing to buy until Back Plus is released**. |
| Settings → **Extra support**, Privacy, Terms | **Always** reachable (not subscription-gated) |
| Home → **Call my person** | Available without subscription (on-device contact) |
| In-App Purchases in Connect | **Not enabled** — no Sandbox purchase in this submission |
| Listen / Ground audio | In-app **generated placeholders** — not licensed commercial library (see `listing.md`) |

**Do not** paste old Review text claiming “free, all six tools work with no paywall.”

---

## 7. Companion still clicks / Компаньон нажимает сам

Submit stays grey until Connect has:

1. **Age Rating** — table in `listing.md` (do **not** check Medical Treatment).
2. **App Privacy** — **Data Not Collected**.
3. **EU trader / DSA** — legal name/address (copyright holder: Tatjana Fedorkova).
4. **Review contact** — your phone + email for App Review.
5. **Export compliance** — encryption **No** (`ITSAppUsesNonExemptEncryption` is false in the project).
6. **Production iOS build** uploaded and selected for version 1.0.
7. **IAP** — leave **off**; no subscription product attached to this version.

Maria may provide a **screen recording on a physical iPhone** for Guideline 2.1 — attach in Resolution Center if Apple asks; not stored in this folder.

---

## 8. Do not / Не делать

- Do **not** enable IAP or attach Back Plus products until Maria / developer completes **S3** (App Store products + RevenueCat + `config/production.ts`).
- Do **not** invent support email addresses.
- Do **not** tell Review that Listen/Ground audio or some card photos are licensed originals — placeholders (see `listing.md`).
- Do **not** upload `compose.html` or `verification-screenshots/`.
- Do **not** use listing copy that says “no subscriptions” if the build shows **Back Plus** in Settings.

---

## 9. Not needed / Не нужно

iPad screenshots, Apple Watch, preview video, demo account.

---

## 10. After approval / После одобрения

- **Listen licensed audio** — later app update (same bundle, new version).
- **Back Plus purchases** — separate release when S3 is ready; then Paid Apps Agreement, products in Connect, and updated Review notes for Sandbox testing.

Questions about branch, build number, or screenshot refresh → Maria or the developer, not guessed in Connect.
