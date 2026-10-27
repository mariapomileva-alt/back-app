#!/usr/bin/env python3
"""Conservative publisher for Back Guides.

Nothing is published by default. Publication requires a due, hash-locked, owner-approved
article and an explicit --execute. The script only ever stages the files listed in
ALLOWED_MUTATIONS and leaves store/android untouched.
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import html
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[1]
PUBLISH_BRANCH = "back-guides-release"
CONTENT = ROOT / "content" / "back_guides"
SCHEDULE_PATH = CONTENT / "publication_schedule.json"
HUB_TEMPLATE = CONTENT / "hub_template.html"
LANDING = ROOT / "landing"
GUIDES = LANDING / "guides"
STATE_DIR = ROOT / "var" / "back_guides_publisher"
ALLOWED_UNTRACKED_PREFIXES = ("store/android/", "var/back_guides_publisher/")
ALLOWED_RELEASE_PATHS = (
    ".gitignore",
    "content/back_guides/",
    "scripts/back_guides_publisher.py",
    "scripts/back_guides_telegram_review.py",
    "tests/test_back_guides_publisher.py",
    "landing/guides/",
    "landing/index.html",
    "landing/sitemap.xml",
    "landing/robots.txt",
)
BASE_SITEMAP_URLS = ("/", "/privacy.html", "/terms.html", "/support.html", "/subscriptions.html", "/guides/")
TITLE_SUFFIX = " | Back"
TITLE_LIMIT = 60
BANNED_CLAIMS = (
    r"\bcure[sd]?\b",
    r"\bguarantee[sd]?\b",
    r"\bjust panic\b",
    r"\bstop (a )?panic attack\b",
    r"\bmedical advice\b",
)


class GateError(RuntimeError):
    pass


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def html_text(value: str) -> str:
    return html.escape(value, quote=False)


def html_attr(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def page_title(title: str) -> str:
    if len(title) + len(TITLE_SUFFIX) > TITLE_LIMIT:
        return title
    return f"{title}{TITLE_SUFFIX}"


def upsert_meta(text: str, tag: str, pattern: str) -> str:
    if re.search(pattern, text, flags=re.I):
        return re.sub(pattern, tag, text, count=1, flags=re.I)
    return text.replace("</title>", f"</title>\n    {tag}", 1)


def load_schedule() -> dict:
    return json.loads(SCHEDULE_PATH.read_text(encoding="utf-8"))


def save_schedule(schedule: dict) -> None:
    SCHEDULE_PATH.write_text(json.dumps(schedule, indent=2) + "\n", encoding="utf-8")


def find_article(schedule: dict, article_id: str) -> dict:
    for article in schedule["articles"]:
        if article["id"] == article_id:
            return article
    raise GateError(f"Unknown article id: {article_id}")


def source_path(article: dict) -> Path:
    if not article.get("source_path"):
        raise GateError(f"{article['id']} has no staged source yet")
    path = ROOT / article["source_path"]
    if not path.is_file() or CONTENT / "staged" not in path.parents:
        raise GateError(f"Unsafe or missing staged source: {article.get('source_path')}")
    return path


def check_slug(slug: str) -> None:
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        raise GateError(f"Unsafe guide slug: {slug!r}")


def validate_source(article: dict, require_hash: bool = True) -> str:
    check_slug(article["slug"])
    path = source_path(article)
    text = path.read_text(encoding="utf-8")
    checks = {
        "one_h1": len(re.findall(r"<h1(?:\s[^>]*)?>", text, flags=re.I)) == 1,
        "title": bool(re.search(r"<title>[^<]{12,}</title>", text, flags=re.I)),
        "description": bool(re.search(r'<meta name="description" content="[^\"]{30,}"', text, flags=re.I)),
        "noindex_source": 'name="robots" content="noindex,nofollow"' in text,
        "safety_panel": 'class="urgent"' in text,
        "references": "Further reading" in text and "https://www." in text,
        "support_link": "support.html" in text,
        "not_template": "TODO" not in text,
    }
    failed = [name for name, ok in checks.items() if not ok]
    if failed:
        raise GateError(f"{article['id']} source failed: {', '.join(failed)}")
    for pattern in BANNED_CLAIMS:
        if re.search(pattern, text, flags=re.I):
            raise GateError(f"{article['id']} contains prohibited claim pattern: {pattern}")
    digest = sha256(path)
    if require_hash and article.get("source_sha256") != digest:
        raise GateError(f"{article['id']} source hash is not locked to current draft")
    return digest


def article_time(article: dict) -> dt.datetime:
    return dt.datetime.fromisoformat(article["publish_at"])


def now_in(schedule: dict, override: str | None = None) -> dt.datetime:
    zone = ZoneInfo(schedule["timezone"])
    if override:
        parsed = dt.datetime.fromisoformat(override)
        return parsed.astimezone(zone) if parsed.tzinfo else parsed.replace(tzinfo=zone)
    return dt.datetime.now(zone)


def due_article(schedule: dict, now: dt.datetime) -> dict | None:
    for article in schedule["articles"]:
        if article["status"] == "published":
            continue
        published_at = article_time(article).astimezone(now.tzinfo)
        start = published_at.replace(hour=15, minute=0, second=0, microsecond=0)
        end = published_at.replace(hour=18, minute=0, second=0, microsecond=0)
        if start <= now <= end:
            return article
    return None


def require_publishable(article: dict) -> None:
    if article.get("status") != "approved":
        raise GateError(f"{article['id']} is {article.get('status')}, not approved")
    if not article.get("approvals", {}).get("owner"):
        raise GateError(f"{article['id']} is missing a required human approval")
    validate_source(article, require_hash=True)


def run_git(*args: str, check: bool = True) -> str:
    result = subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=True)
    if check and result.returncode:
        raise GateError(result.stderr.strip() or result.stdout.strip())
    return result.stdout


def check_git_clean() -> None:
    if run_git("branch", "--show-current").strip() != PUBLISH_BRANCH:
        raise GateError(f"Publisher only runs from {PUBLISH_BRANCH}")
    if not run_git("remote", "get-url", "origin").strip():
        raise GateError("origin remote is missing")
    remote_only, _local_only = (int(value) for value in run_git("rev-list", "--left-right", "--count", "origin/main...HEAD").split())
    if remote_only:
        raise GateError("Guides release branch is behind origin/main. Update it before a Guide release.")
    release_delta = run_git("diff", "--name-only", "origin/main...HEAD").splitlines()
    unsafe_release_delta = [path for path in release_delta if not any(path == allowed or path.startswith(allowed) for allowed in ALLOWED_RELEASE_PATHS)]
    if unsafe_release_delta:
        raise GateError("Guides branch contains unrelated release work: " + "; ".join(unsafe_release_delta))
    unexpected = []
    for line in run_git("status", "--porcelain").splitlines():
        path = line[3:]
        if path.startswith(ALLOWED_UNTRACKED_PREFIXES):
            continue
        unexpected.append(line)
    if unexpected:
        raise GateError("Working tree is not clean outside allowed local paths: " + "; ".join(unexpected))


def raw_meta_description(text: str) -> str:
    match = re.search(r'<meta name="description" content="([^\"]+)"', text, flags=re.I)
    return match.group(1) if match else "Read this Back Guide."


def read_meta_description(text: str) -> str:
    return html.escape(raw_meta_description(text))


def render_hub(schedule: dict) -> str:
    cards = []
    for article in schedule["articles"]:
        if article["status"] != "published":
            continue
        source = source_path(article).read_text(encoding="utf-8")
        cards.append(
            '<article class="guide-card"><p class="eyebrow">Back Guide</p>'
            f'<h2>{html.escape(article["title"])}</h2><p>{read_meta_description(source)}</p>'
            f'<a href="{html.escape(article["slug"])}/">Read the Guide →</a></article>'
        )
    if not cards:
        raise GateError("Refusing to render a public Guides hub with no published articles")
    return HUB_TEMPLATE.read_text(encoding="utf-8").replace("{{GUIDE_CARDS}}", "\n".join(cards))


def git_file_date(path: Path, *, first: bool = False) -> str:
    rel = str(path.relative_to(ROOT))
    args = ["log", "--format=%cs", "--", rel]
    if first:
        args = ["log", "--diff-filter=A", "--format=%cs", "--", rel]
    lines = [line for line in run_git(*args, check=False).splitlines() if line]
    if first:
        return lines[-1] if lines else dt.date.today().isoformat()
    dirty = run_git("status", "--porcelain", "--", rel, check=False).strip()
    if dirty:
        return dt.date.today().isoformat()
    return lines[0] if lines else dt.date.today().isoformat()


def app_store_url(campaign: str) -> str:
    return f"https://apps.apple.com/app/id6811918141?mt=8&ct={campaign}"


def render_article(article: dict) -> str:
    text = source_path(article).read_text(encoding="utf-8")
    text = text.replace('content="noindex,nofollow"', 'content="index,follow"')
    title = article["title"]
    slug = article["slug"]
    source = source_path(article)
    published = git_file_date(source, first=True)
    modified = git_file_date(source)
    description = raw_meta_description(text)
    if description == "Read this Back Guide.":
        description = title
    canonical = f"https://backapp.live/guides/{slug}/"
    text = re.sub(r"<title>[^<]*</title>", f"<title>{html_text(page_title(title))}</title>", text, count=1)
    text = upsert_meta(
        text,
        f'<meta property="og:title" content="{html_attr(title)}" />',
        r'<meta property="og:title" content="[^"]*"\s*/?>',
    )
    text = upsert_meta(
        text,
        '<meta property="og:type" content="article" />',
        r'<meta property="og:type" content="[^"]*"\s*/?>',
    )
    text = upsert_meta(
        text,
        f'<meta property="og:url" content="{html_attr(canonical)}" />',
        r'<meta property="og:url" content="[^"]*"\s*/?>',
    )
    text = upsert_meta(
        text,
        f'<meta property="og:description" content="{html_attr(description)}" />',
        r'<meta property="og:description" content="[^"]*"\s*/?>',
    )
    text = upsert_meta(
        text,
        '<meta name="twitter:card" content="summary" />',
        r'<meta name="twitter:card" content="[^"]*"\s*/?>',
    )
    text = upsert_meta(
        text,
        f'<meta name="twitter:title" content="{html_attr(title)}" />',
        r'<meta name="twitter:title" content="[^"]*"\s*/?>',
    )
    text = upsert_meta(
        text,
        f'<meta name="twitter:description" content="{html_attr(description)}" />',
        r'<meta name="twitter:description" content="[^"]*"\s*/?>',
    )
    json_ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "datePublished": published,
        "dateModified": modified,
        "author": {"@type": "Organization", "name": "Back"},
    }
    json_ld_tag = f'<script type="application/ld+json">{json.dumps(json_ld, ensure_ascii=False)}</script>'
    if "application/ld+json" in text:
        text = re.sub(r'<script type="application/ld\+json">.*?</script>', json_ld_tag, text, count=1, flags=re.S)
    else:
        text = text.replace("</title>", f"</title>\n    {json_ld_tag}", 1)
    text = re.sub(r"<h1(?:\s[^>]*)?>.*?</h1>", f"<h1>{html_text(title)}</h1>", text, count=1, flags=re.S)
    if "guide-updated" not in text:
        text = re.sub(
            r"(<h1(?:\s[^>]*)?>.*?</h1>)",
            rf'\1\n      <p class="guide-updated">Updated {html.escape(modified)}</p>',
            text,
            count=1,
            flags=re.S,
        )
    # TODO(Maria): set article["reviewed_by"] to a real reviewer name before rendering a byline.
    reviewer = (article.get("reviewed_by") or "").strip()
    if reviewer and "guide-reviewer" not in text:
        text = re.sub(
            r'(<p class="guide-updated">.*?</p>)',
            rf'\1\n      <p class="guide-reviewer">Reviewed by {html.escape(reviewer)}</p>',
            text,
            count=1,
            flags=re.S,
        )
    if "guide-app-close" not in text:
        store = app_store_url(f"guide_{slug}")
        closing = (
            '<section class="guide-download guide-app-close">'
            "<p>Back works offline and needs no account. Open it when the next minute feels hard.</p>"
            f'<a class="btn forest" href="{html.escape(store)}" aria-label="Download Back on the App Store">'
            "Download on the App Store</a>"
            "</section>"
        )
        text = text.replace("</main>", f"      {closing}\n    </main>")
    return text


def render_sitemap(schedule: dict) -> str:
    entries = [("/", "landing/index.html"), ("/privacy.html", "landing/privacy.html"), ("/terms.html", "landing/terms.html"), ("/support.html", "landing/support.html"), ("/subscriptions.html", "landing/subscriptions.html"), ("/guides/", "landing/guides/index.html")]
    for article in schedule["articles"]:
        if article["status"] == "published":
            entries.append((f"/guides/{article['slug']}/", article["source_path"]))
    nodes = []
    for path, file_path in entries:
        lastmod = git_file_date(ROOT / file_path) if (ROOT / file_path).exists() else dt.date.today().isoformat()
        nodes.append(f"  <url><loc>https://backapp.live{path}</loc><lastmod>{lastmod}</lastmod></url>")
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(nodes) + "\n</urlset>\n"


def update_landing_nav(text: str) -> str:
    marker = '<li data-back-guides-nav><a href="guides/">Guides</a></li>'
    if marker in text:
        return text
    needle = '<li><a href="#tools">Tools</a></li>'
    if needle not in text:
        raise GateError("Main landing navigation marker is missing")
    return text.replace(needle, needle + "\n            " + marker, 1)


def write_public_release(schedule: dict, article: dict) -> list[Path]:
    check_slug(article["slug"])
    destination = GUIDES / article["slug"] / "index.html"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(render_article(article), encoding="utf-8")
    (GUIDES / "index.html").write_text(render_hub(schedule), encoding="utf-8")
    (LANDING / "sitemap.xml").write_text(render_sitemap(schedule), encoding="utf-8")
    (LANDING / "robots.txt").write_text("User-agent: *\nAllow: /\nSitemap: https://backapp.live/sitemap.xml\n", encoding="utf-8")
    landing_index = LANDING / "index.html"
    landing_index.write_text(update_landing_nav(landing_index.read_text(encoding="utf-8")), encoding="utf-8")
    return [destination, GUIDES / "index.html", LANDING / "sitemap.xml", LANDING / "robots.txt", landing_index, SCHEDULE_PATH]


def relative(paths: list[Path]) -> list[str]:
    return [str(path.relative_to(ROOT)) for path in paths]


def register(article_id: str) -> None:
    schedule = load_schedule()
    article = find_article(schedule, article_id)
    digest = validate_source(article, require_hash=False)
    article["source_sha256"] = digest
    article["status"] = "ready_for_review"
    article["approvals"] = {"owner": False, "product_editor": False}
    save_schedule(schedule)
    print(json.dumps({"id": article_id, "status": "ready_for_review", "source_sha256": digest}, indent=2))


def approve(article_id: str, role: str) -> None:
    if role not in {"owner", "product_editor"}:
        raise GateError("role must be owner or product_editor")
    schedule = load_schedule()
    article = find_article(schedule, article_id)
    validate_source(article, require_hash=True)
    article["approvals"][role] = True
    if role == "owner":
        article["status"] = "approved"
    save_schedule(schedule)
    print(json.dumps({"id": article_id, "status": article["status"], "approvals": article["approvals"]}, indent=2))


def request_changes(article_id: str, role: str) -> None:
    """Invalidate a human approval when that reviewer asks for changes."""
    if role not in {"owner", "product_editor"}:
        raise GateError("role must be owner or product_editor")
    schedule = load_schedule()
    article = find_article(schedule, article_id)
    validate_source(article, require_hash=True)
    article["approvals"][role] = False
    if role == "owner":
        article["status"] = "needs_changes"
    save_schedule(schedule)
    print(json.dumps({"id": article_id, "status": article["status"], "approvals": article["approvals"]}, indent=2))


def preflight(now_override: str | None) -> int:
    schedule = load_schedule()
    now = now_in(schedule, now_override)
    article = due_article(schedule, now)
    if article is None:
        future = next((a for a in schedule["articles"] if a["status"] != "published"), None)
        print(json.dumps({"status": "no_due", "now": now.isoformat(), "next": future and future["publish_at"]}, indent=2))
        return 0
    try:
        require_publishable(article)
        check_git_clean()
    except GateError as error:
        print(json.dumps({"status": "blocked", "id": article["id"], "reason": str(error)}, indent=2))
        return 2
    print(json.dumps({"status": "ready", "id": article["id"], "slug": article["slug"]}, indent=2))
    return 0


def publish_due(now_override: str | None, execute: bool) -> int:
    if execute and now_override:
        raise GateError("Simulated time cannot be used for publication")
    schedule = load_schedule()
    now = now_in(schedule, now_override)
    article = due_article(schedule, now)
    if article is None:
        print("No due article.")
        return 0
    require_publishable(article)
    check_git_clean()
    if not execute:
        print(f"Dry run: would publish {article['id']} ({article['slug']}).")
        return 0
    article["status"] = "published"
    paths = write_public_release(schedule, article)
    save_schedule(schedule)
    run_git("add", "--", *relative(paths))
    run_git("diff", "--cached", "--check")
    run_git("commit", "-m", f"Publish Back Guide {article['id']}")
    try:
        run_git("push", "origin", "HEAD:main")
    except GateError as error:
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        (STATE_DIR / "requires_manual_action.json").write_text(json.dumps({"id": article["id"], "reason": str(error)}, indent=2) + "\n", encoding="utf-8")
        raise
    print(f"Published {article['id']}.")
    return 0


def refresh_published() -> int:
    """Regenerate public HTML for already published guides without a release."""
    schedule = load_schedule()
    published = [article for article in schedule["articles"] if article["status"] == "published"]
    if not published:
        raise GateError("No published articles to refresh")
    for article in published:
        validate_source(article, require_hash=True)
        destination = GUIDES / article["slug"] / "index.html"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(render_article(article), encoding="utf-8")
    (GUIDES / "index.html").write_text(render_hub(schedule), encoding="utf-8")
    (LANDING / "sitemap.xml").write_text(render_sitemap(schedule), encoding="utf-8")
    print(json.dumps({"status": "refreshed", "ids": [article["id"] for article in published]}, indent=2))
    return 0


def publish_approved(article_id: str, execute: bool) -> int:
    """Publish one named owner-approved article outside its normal schedule.

    This is deliberately separate from publish-due: it never infers approval from
    time, and it refuses to act without an explicit --execute supplied by the
    owner after a missed slot or an intentional exception.
    """
    if not execute:
        raise GateError("Manual publication requires --execute")
    schedule = load_schedule()
    article = find_article(schedule, article_id)
    require_publishable(article)
    check_git_clean()
    article["status"] = "published"
    paths = write_public_release(schedule, article)
    save_schedule(schedule)
    run_git("add", "--", *relative(paths))
    run_git("diff", "--cached", "--check")
    run_git("commit", "-m", f"Publish Back Guide {article['id']}")
    try:
        run_git("push", "origin", "HEAD:main")
    except GateError as error:
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        (STATE_DIR / "requires_manual_action.json").write_text(json.dumps({"id": article["id"], "reason": str(error)}, indent=2) + "\n", encoding="utf-8")
        raise
    print(f"Published {article['id']}.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("register").add_argument("article_id")
    approval = sub.add_parser("approve")
    approval.add_argument("article_id")
    approval.add_argument("--role", required=True)
    changes = sub.add_parser("request-changes")
    changes.add_argument("article_id")
    changes.add_argument("--role", required=True)
    manual = sub.add_parser("publish-approved")
    manual.add_argument("article_id")
    manual.add_argument("--execute", action="store_true")
    sub.add_parser("refresh-published")
    for name in ("preflight", "publish-due"):
        command = sub.add_parser(name)
        command.add_argument("--now", help="ISO datetime for a read-only simulation")
        if name == "publish-due":
            command.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    try:
        if args.command == "register":
            register(args.article_id)
            return 0
        if args.command == "approve":
            approve(args.article_id, args.role)
            return 0
        if args.command == "request-changes":
            request_changes(args.article_id, args.role)
            return 0
        if args.command == "publish-approved":
            return publish_approved(args.article_id, args.execute)
        if args.command == "refresh-published":
            return refresh_published()
        if args.command == "preflight":
            return preflight(args.now)
        return publish_due(args.now, args.execute)
    except GateError as error:
        print(f"BLOCKED: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
