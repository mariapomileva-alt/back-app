# Back Guides cloud publisher

GitHub Actions runs `.github/workflows/back-guides.yml` from main. It checks Monday, Wednesday and Friday during a UTC range covering 15:00–18:00 Europe/Riga, including daylight-saving changes. The Python schedule remains authoritative: never early, never outside the date/window, no duplicate published article. GitHub may delay scheduled jobs.

Only a hash-matching owner-approved article can publish. Telegram feedback is advisory. New/revised drafts still require owner approval saved to main before their slot; GitHub does not create articles or grant approvals. No Telegram token or personal access token is needed on the runner. App and store files are not staged by the publisher.

Manual workflow dispatch defaults to checks only (`execute=false`). Actual publication uses real time; `--now` with `--execute` is rejected. A push race fails safely (no force push). Publisher jobs are serialized. Publication writes the article, hub, sitemap and navigation, commits and pushes main, then explicitly calls the Pages workflow because GITHUB_TOKEN pushes do not trigger push workflows. Later ticks retry deployment if publication succeeded but deployment failed.

Review runs in GitHub Actions. Failed approvals/checks are reported as failed runs; enable GitHub Actions email notifications for failures. The Mac is not needed. Disable the local BG01 publisher heartbeat after the cloud dry run succeeds. Do not manually run both publishers.
