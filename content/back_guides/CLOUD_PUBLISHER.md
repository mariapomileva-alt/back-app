# Back Guides local publisher

Back Guides are released from the local `back-guides-release` branch. The owner reviews a hash-locked draft locally and explicitly approves it. Telegram feedback is advisory.

The normal release command runs only on Monday, Wednesday and Friday in the schedule's 15:00–18:00 Europe/Riga window, including daylight-saving changes. It validates the owner approval and source hash, then writes only the Guides page, hub, sitemap and navigation before pushing to `main` for GitHub Pages deployment.

If an owner explicitly authorizes an already approved article after its slot has been missed, the separate `publish-approved <ID> --execute` command may be used. It has the same hash and owner-approval gates but never changes the draft or schedule. No other article is released as a side effect.
