# Go JSON contract review: sources

Checked November 16, 2026. Four editions remain unpublished. No Go code, migration, performance experiment or security assessment was executed.

- https://go.dev/blog/jsonv2 — November 4, 2026 announcement: JSON v2 and jsontext are stable in Go 1.27. This is the announcement date, not a claim that Go 1.27 first released that day.
- https://go.dev/doc/go1.27#encodingjsonv2 — Existing encoding/json remains supported with preserved behavior via the new implementation; error wording may differ. The article separates toolchain and API migration and makes no numeric performance claim.
- https://pkg.go.dev/encoding/json/v2 — Retrieved page identifies go1.27.4, published November 10, 2026. Used for default rejection of duplicate object names and invalid UTF-8; not for asserting the latest patch release. Candidate fixture cases are review recommendations, not a complete behavioral-difference table.

The synthetic corpus, boundary ownership, exception records, separate consumer checks and rollback review are engineering recommendations. They do not claim observed outcomes, universal safety or measured benefits. All locales retain matching links, status and limitations; no runnable Go example is included.

Prewriting gate at 2026-11-16T00:57:57Z / 08:57:57 Asia/Taipei: main 83ec46da37b24f7b475c0a5e665f11b543dcd686, recent content, open issues and all-author recent/open PRs checked. No JSON v2 topic overlap found. Latest post #271 created 2026-11-14T01:04:26Z; no November 16 Taipei post PRs, over 47 hours elapsed. #272 is maintenance. The preserved Playwright/Bun work is unrelated. Recheck immediately before creation and record actual timing in the PR.
