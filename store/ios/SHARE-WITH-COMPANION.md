# Share with companion / Передать компаньону

This folder is the **only** iOS App Store pack. Zip it, send it, or open it on GitHub.

Эта папка — **единственный** пакет для App Store. Сожмите, отправьте, или откройте на GitHub.

**App / Приложение:** Back: You're Here  
**Copyright:** 2026 Tatjana Fedorkova  
**Branch / Ветка:** `cursor/active-session-foundation`  
**Repo path:** `store/ios`

---

## 1. How to share / Как передать

**English**

1. Zip the folder `store/ios` (icon + `screenshots/` + `listing.md` + this file).
2. Send the zip via iCloud Drive, Google Drive, or email.
3. Or both people open the GitHub repo on branch `cursor/active-session-foundation` and go to `store/ios`.
4. Companion pastes copy from `listing.md` into App Store Connect (map below).
5. Companion still clicks Age Rating, App Privacy, EU trader, and their own Review phone/email — those cannot be done from this pack.

**Русский**

1. Сожмите папку `store/ios` (иконка + `screenshots/` + `listing.md` + этот файл).
2. Отправьте zip через iCloud Drive, Google Drive или почту.
3. Или оба открывают репозиторий на ветке `cursor/active-session-foundation` и папку `store/ios`.
4. Компаньон копирует тексты из `listing.md` в App Store Connect (карта ниже).
5. Компаньон сам отмечает Age Rating, App Privacy, статус EU trader и свой телефон/email для App Review — из пакета это не нажать.

Do not send secrets, Apple IDs, or certificates. / Не пересылайте секреты, Apple ID и сертификаты.

---

## 2. What lives where / Где что лежит

| Item / Что | Path / Путь | Upload? / Загружать? |
| --- | --- | --- |
| App icon 1024×1024 (tactile forest disc) | `icon-1024.png` | Yes → App Information / App Icon if the build did not already include it |
| Home | `screenshots/01-home.png` | Yes → 6.9" Display, first |
| Breathe | `screenshots/02-breathe.png` | Yes → 6.9" |
| Ground | `screenshots/03-ground.png` | Yes → 6.9" |
| Listen | `screenshots/04-listen.png` | Yes → 6.9" |
| Distract | `screenshots/05-distract.png` | Yes → 6.9" |
| Extra support | `screenshots/06-extra-support.png` | Yes → 6.9" |
| Paste-ready listing + Connect checklist | `listing.md` | No — copy/paste only |
| This how-to | `SHARE-WITH-COMPANION.md` | No |
| Screenshot compositor | `screenshots/compose.html` | **No** — generator, not an App Store asset |

All six screenshots are **1320×2868** (iPhone 6.9" portrait). Not 6.5". No iPad, no Watch, no preview video.

---

## 3. App Store Connect map / Куда что вставить

Use `listing.md` as the source of truth. / Источник текстов — `listing.md`.

| Connect field | From |
| --- | --- |
| Name | Back: You're Here |
| Subtitle | `Quiet help for one minute` (25 / 30) |
| Description | Description block in `listing.md` |
| Keywords | Keywords block (100 / 100, no competitor names) |
| Promotional text (optional) | Promotional block |
| What's New | `First release.` |
| Support URL | https://backapp.live/support.html — **only after it 200s** (see below) |
| Privacy Policy URL | https://backapp.live/privacy.html — **only after it 200s** |
| Marketing URL (optional) | https://backapp.live/ (this one is live) |
| Category | Health & Fitness (not Medical) |
| Screenshots | The six PNGs into **6.9" Display** |
| Review notes | Review Information block in `listing.md` |
| Demo account | Leave blank |
| IAP / subscription product | **Do not enable** |

---

## 4. URLs — honest status / Честный статус ссылок

Checked 15 September 2026.

| URL | Status |
| --- | --- |
| https://backapp.live/ | **Live / живой** — HTTPS 200. DNS is set. Certificate is issued. |
| https://backapp.live/privacy.html | **404.** File is in the repo (`landing/privacy.html`) on this branch, **not** on `main`. Pages deploys from `main`. |
| https://backapp.live/support.html | **404.** Same. |
| github.io copies | **Not a fallback.** They redirect to `backapp.live` (same 404). |

**Before Submit:** merge `landing/privacy.html` and `landing/support.html` onto `main` (or run the GitHub Pages workflow on a branch that has them), then open both URLs in a browser. Paste into Connect only when they load.

**До Submit:** выложить эти две страницы на `main` (или запустить workflow Pages с ветки, где они есть), открыть обе ссылки в браузере. Вставлять в Connect только когда страницы открываются.

In-app Settings → Privacy already points at the privacy URL; that button will 404 until Pages is updated.

В приложении Настройки → Privacy уже ведёт на этот URL; кнопка будет 404, пока Pages не обновится.

---

## 5. Companion still clicks / Компаньон всё ещё нажимает сам

Submit stays grey until a human does these in App Store Connect:

Submit остаётся серым, пока человек не сделает это в Connect:

1. **Age Rating** — questionnaire in `listing.md` (aim 12+ guidance; do **not** check Medical Treatment).
2. **App Privacy** — select **Data Not Collected**.
3. **EU trader / DSA** — trader vs non-trader; legal name/address (copyright holder: Tatjana Fedorkova).
4. **Review contact** — companion’s own phone and email for App Review (not in this repo).
5. Export compliance: encryption **No** (`ITSAppUsesNonExemptEncryption` is already false).
6. Upload a **production** build (EAS). This pack is listing assets only.
7. **Do not** turn on In-App Purchases.

---

## 6. Do not / Не делать

- Do not enable IAP or attach a $9.99 / subscription product.
- Do not invent a support mailbox.
- Do not tell Review that Listen/Ground audio or stills are licensed originals — they are still placeholders (see `listing.md` Reject risk).
- Do not upload `compose.html`.
- Do not send certificates, API keys, or Apple passwords.

---

## 7. Not needed / Не нужно

iPad screenshots, preview video, demo account, Apple Watch.
