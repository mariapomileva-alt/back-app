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

The publisher must not publish merely because a Telegram notification was delivered. Only the owner's explicit approval authorizes publication; product-editor replies are advisory, not a gate.

To send a packet after the draft has passed automated checks:

```text
python3 scripts/back_guides_telegram_review.py send BG01
```

The product editor receives a self-contained HTML review copy with embedded CSS and images. Download it and open it in a browser; Telegram's built-in file viewer may not render HTML. The same copy is available to show the owner in `var/back_guides_publisher/BG01-review.html`. The staged article is unchanged.

For optional feedback, reply in one message, for example: `changes BG01 1522b2f3: Please soften the opening paragraph.` Use the current code from the actual message. Notes are saved only in the local Git-ignored review log. Legacy `approve` replies are recorded as positive feedback, never as publication authorization. `collect` accepts only structured replies from the configured chat ID matching the current source-hash prefix; neither response changes owner approval or publication status. Review safety concerns with the owner; if the article is revised, register the new source and obtain fresh owner approval.
