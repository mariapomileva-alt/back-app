# Back localization audit (L1)

Date: 17 September 2026. Branch: `cursor/active-session-foundation`. Phases L1–L4 foundation in this pass.

## Supported locales

| Code | Native name | UI status | Read status | In selector |
|------|-------------|-----------|-------------|-------------|
| en | English | complete | complete | yes |
| es | Español | draft | draft | yes |
| de | Deutsch | draft | draft | yes |
| fr | Français | draft | draft | yes |
| pt-BR | Português (Brasil) | draft | draft | yes |
| ru | Русский | draft | draft | yes |
| it | Italiano | draft | draft | yes |
| pl | Polski | draft | draft | yes |
| nl | Nederlands | draft | draft | yes |
| tr | Türkçe | draft | draft | yes |

**Excluded from selector (never offered):** lv, ja, ko, zh and variants. Device tags map through `normalizeLocale()` and fall back to English when excluded or unknown.

## L1 — i18n inventory

### Catalog

- **Single source:** `locales/en.json` (~373 leaf keys).
- **Runtime:** `locales/i18n.ts` — `t(path, vars)` with English fallback for missing keys.
- **Before L2:** only `en` was registered; device `languageCode` was read but non-English catalogs did not exist.

### Key namespaces (en.json)

| Area | Prefix | Notes |
|------|--------|-------|
| Shell | `app`, `home`, `common`, `notFound` | Home tools, navigation |
| Settings | `settings`, `themes`, `voice` | Includes new `settings.language*` |
| Sessions | `session`, `exercise` | Outcome, share, close |
| Tools | `breathe`, `distract`, `ground`, `move`, `listen`, `read` | In-session + menus |
| Safety | `extraSupport`, `supportSetup` | **Out of scope for logic changes** |
| Legal / Plus | `privacy`, `terms`, `legal`, `subscription`, `about` | **Subscription copy untouched** |
| Patterns | `patterns` | My patterns screen |

### Hard-coded UI strings

- **Screen copy:** essentially all user-visible strings route through `t()` (~50+ call sites across `app/` and `components/`).
- **Exceptions (non-user-facing):** internal IDs, storage keys, pattern/slot ids in `features/read/patterns.ts`, emergency JSON (separate content pipeline), SVG/mark geometry in `components/marks/markLanguage.ts` (drawing language, not UI locale).
- **L3 action:** no additional hard-coded user strings found; new language settings strings added to `en.json` and mirrored in draft locale files.

### Accessibility

- Settings rows, tool cards, session controls, distract grids, listen picker, and read controls use `accessibilityLabel` / `accessibilityHint` via `t()`.
- Language picker uses native locale names for labels and translated hints.

## Read content structure (pre-L4)

```
content/read/en/
  stories.json    — micro_story (78)
  curious.json    — curious (120)
  words.json      — word (88), language-specific tokens
  observe.json    — observation (60)
  notice.json     — environment (60)
```

- **Loader (legacy):** `features/read/packs.ts` imported English only.
- **Language helpers (legacy):** `features/read/language.ts` always returned `en`.
- **Memory:** `ReadMemory.language` stored preference but did not affect pack loading.

## L2–L4 architecture (implemented)

| Piece | Location |
|-------|----------|
| Locale normalization | `locales/locale.ts` |
| Production gating | `locales/localizationStatus.ts` — **UI and Read: en only in production** |
| Preference storage | `storage/languagePreference.ts`, key `back.languagePreference` |
| Live UI locale | `providers/LocaleProvider.tsx`, `hooks/useLocale.ts` |
| Settings → Language | `app/settings/language.tsx` (native names, immediate apply, blocked during active session via `isActiveSessionVisible()`) |
| Read pack by locale | `content/read/{locale}/`, `features/read/packs.ts` |
| Read language resolution | `features/read/language.ts` + `getActiveUiLocale()` |
| Completeness | `scripts/check-locale-completeness.mjs`, npm `locales:check` |
| Draft generation | `scripts/generate-draft-localization.mjs`, npm `locales:draft` |
| Tests | `locales/locale.test.ts` (vitest) |

## Production gating rules

- **`isUiLocaleEnabled`:** only `en` when `!__DEV__`.
- **`isReadLocaleEnabled`:** only `en` when `!__DEV__` (no mixed-language Read sessions in prod).
- **Development:** all ten locales selectable; draft UI + Read packs available for QA.

## TODOs (post-draft)

1. Professional translation review for UI strings (especially safety, subscription, and legal — copy-only, no logic changes).
2. Native review of Read `words.json` per locale (capitalization, diacritics, cultural fit).
3. Expand Read draft QA: thread continuity, follow-up choices, environment lines.
4. Flip `localizationStatus.ts` per locale from `draft` → `complete` when sign-off completes; then enable in production gating.
5. Optional: sync app store listing locales with enabled set.
6. Re-run `npm run locales:check` after any `en.json` key additions.

## Review checklist

- [ ] Change language in Settings → immediate UI update (dev build).
- [ ] Start Breathe → open Settings → Language blocked with alert.
- [ ] Production build (`__DEV__` false): only English selectable; Read stays English.
- [ ] Spanish UI + Read in dev: session lines contain no English fragments.
- [ ] `npm run typecheck`, `npm run lint`, `npm run locales:check`, `npm test`.
