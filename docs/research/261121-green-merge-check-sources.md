# Combined merge checks: source and scope ledger

Checked November 21, 2026. Four editions remain unpublished.

- [GitHub July 12, 2023 GA announcement](https://github.blog/changelog/2023-07-12-pull-request-merge-queue-is-now-generally-available/) supports historical release status, not a new announcement.
- [Current GitHub queue documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue) distinguishes merge limits from validation builds and documents Actions merge_group requirements.
- [Current GitLab train documentation](https://docs.gitlab.com/ci/pipelines/merge_trains/) describes cumulative candidates and recomputation after removal. No claim of identical platform behavior or cost guarantees.

The storefront is explicitly hypothetical and unexecuted. A removes acceptance
of legacy; B independently adds a consumer. Tests against the original base may
pass; the combined behavior should violate B's focused assertion. No real
incident, platform experiment or repository feature activation is claimed.

The proposed accounting example totals 19 runner-minutes: 4 actionable failure,
3+2 superseded work, 5+5 replacement execution. Superseded subtotal is 5, not 9.
It is invented illustration, not observed timing, billing or savings. Queue wait
and elapsed time are separate. No throughput/incident improvement asserted.
All editions preserve these numbers, links, failure diagnosis and caveats.

## Originality and timing

Current main 83bbc314348b59fa518dbd9b3fe8673913446763 includes #276–279 unpublished.
Reviewed existing delivery/governance, review-capacity, release-owner and Vite
articles; no combined-revision/merge-queue topic found. This concerns the exact
integration candidate and resource accounting, not review admission or rollout
approval. No maintenance defect or unrelated code change is included.

Before writing at 2026-11-21T07:05:46Z /15:05:46 Taipei, zero posts existed today;
latest #279 was created 2026-11-20T01:01:28Z, 30h04m18s earlier. Refresh main and
all-author chronology immediately before creation; reconcile actual timestamp,
count and interval in final evidence. At most one this run, two per Taipei day,
three elapsed hours apart. Independent main base, no stack dependency.
