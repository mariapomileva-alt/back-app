# Telegram review notifications

The approved product-editor Telegram destination is stored locally, never in Git. The product editor's approved chat ID is `849710803`.

```text
BACK_GUIDES_TELEGRAM_CHAT_ID=849710803
BACK_GUIDES_TELEGRAM_BOT_TOKEN=<token from the Back review bot>
```

## Recommended: macOS Keychain

In **Keychain Access**, choose **File → New Password Item** and enter:

- Keychain Item Name: `back-app-guides-telegram-bot-token`
- Account Name: `back-guides-publisher`
- Password: the token from BotFather

The review script reads this item locally and never prints, commits, or uploads the token. An environment variable can still be used for a temporary local session, but it is not needed for normal use.

The publisher must not publish merely because a Telegram notification was delivered: the `product_editor` approval is a separate, explicit gate.

To send a packet after the draft has passed automated checks:

```text
python3 scripts/back_guides_telegram_review.py send BG01
```

The product editor receives the source HTML and can reply with the exact approval code in the message. For feedback, reply in one message, for example: `changes BG01 9272f5fb: Please soften the opening paragraph.` The note is saved only in the local, Git-ignored review log and resets the product-editor approval for that hash. A periodic `collect` run accepts only these structured replies from the configured chat ID with the current source-hash prefix. Until the token is installed, review packets remain local and the publisher stays blocked. No health-related draft is sent to an external service by default.
