# Telegram review notifications

The approved product-editor Telegram destination is stored locally, never in Git. The product editor's approved chat ID is `849710803`.

```text
BACK_GUIDES_TELEGRAM_CHAT_ID=849710803
BACK_GUIDES_TELEGRAM_BOT_TOKEN=<token from the Back review bot>
```

## Recommended: local owner-only token file

Run this once from the Back Guides release folder:

```text
python3 scripts/back_guides_telegram_review.py configure
```

The prompt keeps the BotFather token hidden while you type. It saves the token to `var/back_guides_publisher/telegram_bot_token`, which is Git-ignored and readable only by the current macOS account. It does not use Keychain, so scheduled review checks do not ask for a Keychain password. An environment variable or existing Keychain item remain fallbacks only.

The publisher must not publish merely because a Telegram notification was delivered: the `product_editor` approval is a separate, explicit gate.

To send a packet after the draft has passed automated checks:

```text
python3 scripts/back_guides_telegram_review.py send BG01
```

The product editor receives the source HTML and can reply with the exact approval code in the message. For feedback, reply in one message, for example: `changes BG01 9272f5fb: Please soften the opening paragraph.` The note is saved only in the local, Git-ignored review log and resets the product-editor approval for that hash. A periodic `collect` run accepts only these structured replies from the configured chat ID with the current source-hash prefix. Until the token is installed, review packets remain local and the publisher stays blocked. No health-related draft is sent to an external service by default.
