# Release decision owner: source/scope ledger

Checked November 20, 2026. All four locale editions remain unpublished.

Primary sources:
- [Google Research publication record](https://research.google/pubs/the-site-reliability-workbook/) dates The Site Reliability Workbook to 2018.
- [Canarying Releases](https://sre.google/workbook/canarying-releases/) supports limited rollout/control evaluation. The article's decision contract and checkout scenario are editorial proposals, not a reproduced Google process.

No deployment experiment, quantitative result, universal threshold or personal
incident is claimed. The checkout example is hypothetical and explicitly stops
before charge/order creation. It is not evidence for payment, inventory or order
persistence. Further testing requires separate authorization. Sparse/missing
signals mean hold; a bounded observation budget avoids indefinite exposure.
Pre-agreed recovery authorization, compatibility and absolute health limits remain
necessary. A revision marker/smoke test proves only the observed version/path.
No production action, account setting or hosting change is part of this PR.

## Originality

Read both published operations pieces and cross-linked their localized editions:
`190703-live-video-operational-pressure` and
`191004-production-fixes-without-incidents`. They establish visible validation and
ownership; this proposal focuses on the promote/hold/revert decision under
incomplete evidence. Existing Vite draft covers asset consistency and rollback
mechanics, not this operating decision. #276 review admission, #277 context and
#278 learning-time drafts remain separate and unchanged. No new series entry.

## Timing

At 2026-11-20T00:57:22Z /08:57:22 Asia/Taipei, current main was
`5ff930b5599c65f2240a50b352638a4d16b08afb`, with zero November 20 post PRs.
Latest #278 was created 2026-11-19T01:09:24Z, 23h47m58s earlier. Main/content,
all-author PR chronology and counts must be refreshed before creating this draft;
actual creation and scope measurements belong in final PR evidence. At most one
post this run, two per Taipei day, at least three elapsed hours apart.
Independent main base; no stack dependency. Owner review/publication decision
remains required.
