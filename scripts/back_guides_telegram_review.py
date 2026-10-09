#!/usr/bin/env python3
"""Send and collect Back Guides editorial reviews through a private Telegram bot.

The bot token is read from BACK_GUIDES_TELEGRAM_BOT_TOKEN for temporary sessions,
or from the local macOS Keychain for normal use. A product-editor approval needs the
exact hash prefix shown in the review message, preventing an accidental generic
"approve BG01" reply.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
import subprocess
import sys
import uuid
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
SCHEDULE = ROOT / "content" / "back_guides" / "publication_schedule.json"
STATE = ROOT / "var" / "back_guides_publisher" / "telegram_updates.json"
KEYCHAIN_SERVICE = "back-app-guides-telegram-bot-token"
KEYCHAIN_ACCOUNT = "back-guides-publisher"
DEFAULT_CHAT_ID = "849710803"


def keychain_token() -> str | None:
    """Return the local Keychain token without ever printing it."""
    try:
        result = subprocess.run(
            ["security", "find-generic-password", "-s", KEYCHAIN_SERVICE, "-a", KEYCHAIN_ACCOUNT, "-w"],
            text=True,
            capture_output=True,
            check=False,
        )
    except FileNotFoundError:
        return None
    return result.stdout.strip() if result.returncode == 0 and result.stdout.strip() else None


def config() -> tuple[str, str]:
    token = os.getenv("BACK_GUIDES_TELEGRAM_BOT_TOKEN") or keychain_token()
    chat_id = os.getenv("BACK_GUIDES_TELEGRAM_CHAT_ID", DEFAULT_CHAT_ID)
    if not token:
        raise RuntimeError(
            "Telegram is not configured. Save the bot token in macOS Keychain under "
            f"service '{KEYCHAIN_SERVICE}' and account '{KEYCHAIN_ACCOUNT}'."
        )
    return token, chat_id


def schedule_item(article_id: str) -> dict:
    data = json.loads(SCHEDULE.read_text(encoding="utf-8"))
    for item in data["articles"]:
        if item["id"] == article_id:
            return item
    raise RuntimeError(f"Unknown article: {article_id}")


def api_url(token: str, method: str) -> str:
    return f"https://api.telegram.org/bot{token}/{method}"


def multipart(fields: dict[str, str], filename: str, body: bytes) -> tuple[bytes, str]:
    boundary = "----back-guides-" + uuid.uuid4().hex
    chunks: list[bytes] = []
    for key, value in fields.items():
        chunks.extend([f"--{boundary}\r\n".encode(), f'Content-Disposition: form-data; name="{key}"\r\n\r\n'.encode(), value.encode(), b"\r\n"])
    mime = mimetypes.guess_type(filename)[0] or "text/html"
    chunks.extend([f"--{boundary}\r\n".encode(), f'Content-Disposition: form-data; name="document"; filename="{filename}"\r\n'.encode(), f"Content-Type: {mime}\r\n\r\n".encode(), body, b"\r\n", f"--{boundary}--\r\n".encode()])
    return b"".join(chunks), boundary


def send(article_id: str) -> None:
    token, chat_id = config()
    item = schedule_item(article_id)
    source = ROOT / (item.get("source_path") or "")
    if item.get("status") != "ready_for_review" or not source.is_file() or not item.get("source_sha256"):
        raise RuntimeError(f"{article_id} is not a hash-locked review draft")
    code = item["source_sha256"][:8]
    caption = (
        f"Back Guides review: {article_id}\n\n{item['title']}\nScheduled: {item['publish_at']}\n\n"
        f"Reply exactly: approve {article_id} {code}\n"
        f"or: changes {article_id} {code}\n\n"
        "This is a private editorial draft. Please review tone, lived-experience fit, app accuracy, and any safety concern."
    )
    payload, boundary = multipart({"chat_id": chat_id, "caption": caption}, source.name, source.read_bytes())
    request = Request(api_url(token, "sendDocument"), data=payload, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}, method="POST")
    with urlopen(request, timeout=20) as response:
        result = json.loads(response.read().decode())
    if not result.get("ok"):
        raise RuntimeError(f"Telegram rejected review packet: {result}")
    print(f"Sent {article_id} review packet.")


def state() -> dict:
    return json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {"offset": 0}


def save_state(value: dict) -> None:
    STATE.parent.mkdir(parents=True, exist_ok=True)
    STATE.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def collect() -> None:
    token, chat_id = config()
    saved = state()
    query = urlencode({"offset": saved.get("offset", 0), "timeout": 0, "allowed_updates": json.dumps(["message"])})
    with urlopen(api_url(token, "getUpdates") + "?" + query, timeout=20) as response:
        result = json.loads(response.read().decode())
    if not result.get("ok"):
        raise RuntimeError(f"Telegram update request failed: {result}")
    for update in result.get("result", []):
        saved["offset"] = max(saved.get("offset", 0), update["update_id"] + 1)
        message = update.get("message", {})
        if str(message.get("chat", {}).get("id")) != str(chat_id):
            continue
        text = message.get("text", "").strip()
        match = re.fullmatch(r"(approve|changes)\s+(BG\d{2})\s+([a-f0-9]{8})", text, flags=re.I)
        if not match:
            continue
        action, article_id, prefix = match.groups()
        item = schedule_item(article_id.upper())
        if not item.get("source_sha256", "").startswith(prefix.lower()):
            continue
        if action.lower() == "approve":
            process = subprocess.run([sys.executable, str(ROOT / "scripts" / "back_guides_publisher.py"), "approve", article_id.upper(), "--role", "product_editor"], cwd=ROOT, text=True, capture_output=True)
            if process.returncode:
                raise RuntimeError(process.stderr.strip() or process.stdout.strip())
            print(process.stdout.strip())
        else:
            print(f"{article_id.upper()} marked for changes by product editor; no approval was recorded.")
    save_state(saved)


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    send_cmd = sub.add_parser("send")
    send_cmd.add_argument("article_id")
    sub.add_parser("collect")
    args = parser.parse_args()
    try:
        if args.command == "send":
            send(args.article_id.upper())
        else:
            collect()
    except RuntimeError as error:
        print(f"BLOCKED: {error}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
