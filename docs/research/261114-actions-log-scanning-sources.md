# Actions log scanning: source and evidence ledger

Checked November 14, 2026. Four editions remain `published: false`. This is a
proposed operating review, not an executed rollout, live-credential experiment,
security audit or measured risk reduction. No repository settings are changed,
and no eligibility claim is made for this personal repository.

| Primary source | Supported claims and boundaries |
| --- | --- |
| [GitHub announcement, November 9, 2026](https://github.blog/changelog/2026-11-09-secret-scanning-detects-secrets-in-github-actions-workflow-logs/) | Public preview, not GA. Eligible Enterprise Cloud enterprises need Secret Protection or GHAS; disabled by default. Alerts survive log deletion. This is a service announcement, not a versioned package release. |
| [Enterprise Cloud secret-scanning concepts](https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/secret-security/secret-scanning), checked November 14 | New workflow runs are scanned after completion; old logs are not backfilled. Provider patterns only; generic/custom/AI-detected patterns and already-masked values are excluded. No preview notifications. One alert can reference several run/job locations. |
| [Actions workflow masking](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#masking-a-value-in-a-log), checked November 14 | Register masking before output or use in other workflow commands. No claim that masking revokes a credential or that later scanning prevents earlier disclosure. |
| [Resolving secret-scanning alerts](https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-secret-scanning-alerts/resolving-alerts), checked November 14 | Update consumers of old credentials and check provider security logs where appropriate. The article directs readers to provider-specific revocation/rotation rather than claiming one universal command. |

The inventory, reviewer/cadence/backup ownership and fabricated tabletop record
are engineering recommendations. No universal adequate response interval is
claimed. The exercise would test handoff, not detector efficacy. No real secret,
private incident, account setting, notification integration or execution result
is included. All editions retain the same four sources, preview status and limits.

## Originality and timing

Before writing at 2026-11-14T01:00:21Z (09:00:21 Asia/Taipei), checked main
`14999c2ad394f7652f2cba903d90c897a11cbc33`, recent English content/source ledgers,
open issues and all-author recent/open PR chronology. Open PRs #267–270 have no
submitted reviews. This topic differs from prior CI telemetry/governance and
Cargo cooldown proposals, as well as React Fragment refs, TypeScript compiler
integration, Vite import maps, Python lazy imports, Node runtime images and the
preserved Playwright/Bun draft.

The last post PR was #269 at 2026-11-13T08:05:59Z / 16:05:59 Taipei. The November
14 Taipei day had zero new post PRs; over 16 hours had elapsed. Recheck count,
spacing, duplication and main immediately before opening; record actual creation
time in the PR evidence. At most one post is proposed by this run.

Independent stack base: #267 `ci/playwright-setup-resilience` at
`4f08097fcafabdb40a1507553178c37aadbe98d0`. Merge that prerequisite first, then
retarget/revalidate this proposal. It does not depend on #268, #269 or #270.
Screenshots and videos are N/A while all editions remain excluded from the
production export. Merging an unpublished proposal does not authorize publication.
