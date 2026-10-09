import sys
import unittest
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import back_guides_publisher as publisher  # noqa: E402


class BackGuidesPublisherTests(unittest.TestCase):
    def test_first_four_drafts_are_hash_locked_and_safe(self):
        schedule = publisher.load_schedule()
        for article_id in ("BG01", "BG02", "BG03", "BG04"):
            article = publisher.find_article(schedule, article_id)
            self.assertEqual(article["status"], "ready_for_review")
            self.assertTrue(article["source_sha256"])
            self.assertEqual(publisher.validate_source(article), article["source_sha256"])

    def test_month_has_twelve_monday_wednesday_friday_slots_at_three(self):
        schedule = publisher.load_schedule()
        self.assertEqual(len(schedule["articles"]), 12)
        self.assertEqual({publisher.article_time(item).weekday() for item in schedule["articles"]}, {0, 2, 4})
        self.assertTrue(all(publisher.article_time(item).hour == 15 for item in schedule["articles"]))

    def test_drafts_cannot_publish_without_both_approvals(self):
        article = publisher.find_article(publisher.load_schedule(), "BG01")
        with self.assertRaises(publisher.GateError):
            publisher.require_publishable(article)

    def test_request_changes_revokes_the_reviewer_approval(self):
        schedule = {
            "articles": [
                {
                    "id": "BG99",
                    "status": "approved",
                    "approvals": {"owner": True, "product_editor": True},
                }
            ]
        }
        with patch.object(publisher, "load_schedule", return_value=schedule), patch.object(publisher, "save_schedule"), patch.object(publisher, "validate_source"):
            publisher.request_changes("BG99", "product_editor")
        article = schedule["articles"][0]
        self.assertEqual(article["status"], "needs_changes")
        self.assertTrue(article["approvals"]["owner"])
        self.assertFalse(article["approvals"]["product_editor"])

    def test_register_resets_both_approvals_for_a_revised_source(self):
        schedule = {
            "articles": [
                {
                    "id": "BG99",
                    "status": "approved",
                    "approvals": {"owner": True, "product_editor": True},
                }
            ]
        }
        with patch.object(publisher, "load_schedule", return_value=schedule), patch.object(publisher, "save_schedule"), patch.object(publisher, "validate_source", return_value="new-hash"):
            publisher.register("BG99")
        article = schedule["articles"][0]
        self.assertEqual(article["status"], "ready_for_review")
        self.assertEqual(article["approvals"], {"owner": False, "product_editor": False})

    def test_unpushed_app_work_blocks_release(self):
        def git(*args, **_kwargs):
            if args == ("branch", "--show-current"):
                return "back-guides-release\n"
            if args == ("remote", "get-url", "origin"):
                return "git@example.test:back.git\n"
            if args == ("rev-list", "--left-right", "--count", "origin/main...HEAD"):
                return "0 1\n"
            if args == ("diff", "--name-only", "origin/main...HEAD"):
                return "app/index.tsx\n"
            return ""

        with patch.object(publisher, "run_git", side_effect=git):
            with self.assertRaisesRegex(publisher.GateError, "unrelated release work"):
                publisher.check_git_clean()


if __name__ == "__main__":
    unittest.main()
