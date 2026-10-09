# Telegram review notifications

The approved product-editor Telegram destination is stored only in a local environment variable, never in Git. The product editor's approved chat ID is `849710803`.

```text
BACK_GUIDES_TELEGRAM_CHAT_ID=849710803
BACK_GUIDES_TELEGRAM_BOT_TOKEN=<token from the Back review bot>
```

The bot token must be created in BotFather and stored in the local keychain or `.env.local`, which is ignored by Git. The publisher must not publish merely because a Telegram notification was delivered: the `product_editor` approval is a separate, explicit gate.

To send a packet after the draft has passed automated checks:

```text
python3 scripts/back_guides_telegram_review.py send BG01
```

The product editor receives the source HTML and can reply with the exact approval code in the message. A periodic `collect` run accepts only replies from the configured chat ID with the current source-hash prefix. Until the token is installed, review packets remain local and the publisher stays blocked. No health-related draft is sent to an external service by default.
