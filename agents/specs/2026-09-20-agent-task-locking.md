# Agent Task Pickup and Recovery

## Summary

Design for #8. This document specifies a future workflow change; it does not
claim that the current workflow implements locking. Scheduled execution stays
disabled until the implementation passes the acceptance cases below. A scheduled
review may recommend candidates without dispatching work or changing readiness.

## Decisions

- Serialize all Agent Task execution in one repository-wide Actions concurrency
  group, `agent-task-execution`, with `cancel-in-progress: false`. Both explicit
  issue-number dispatch and oldest-ready selection use this group for the whole
  workflow, through verification, PR creation and final state recording.
- Accept one active task per repository. This sacrifices throughput but avoids
  a distributed issue-lock service and duplicate work between selection paths.
  Every future execution workflow must use the same group. A local agent must
  not work an issue already owned by an Actions run.
- Labels are task state, not an atomic lock. The Actions concurrency group owns
  execution exclusion; a claim record ties an issue to a run for recovery.
- Do not depend on pending runs forming a durable queue. With default concurrency
  queuing, a newer pending run can replace an older pending run. A cancelled
  pending dispatch claims nothing and must be dispatched again by a human.
- Preserve manual `issue_number` dispatch. Omitting it selects the oldest eligible
  open `agent:todo` issue, ordered by creation time then issue number. Selection
  happens only after acquiring the execution group, never in an earlier job.

GitHub's [concurrency documentation](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)
describes the group and default pending-run behavior. The proposed group replaces
the current `agent-task-${issue_number || 'auto'}` grouping, whose two selection
paths can overlap. This spec does not itself change that YAML.

## Claim Protocol

1. Validate input as a positive issue number and confirm the target is an open
   issue in this repository, not a pull request. Automatic selection excludes
   `agent:blocked`, `agent:needs-human`, `agent:spec-required`, `agent:wip` and
   `agent:done`. It requires exactly one state label, `agent:todo`.
2. Explicit dispatch may select an open backlog or ready issue. Human dispatch
   authorizes that selection but does not override an existing claim, open task
   PR, blocked flag, missing spec, or conflicting labels. Explain the rejection
   without changing another owner's state. Recovery is a separate human action.
3. Re-read the selected issue and task PRs under the execution group. Reject an
   existing open task PR or unresolved prior claim. Recheck eligibility immediately
   before claiming; if an automatically selected issue changed, stop without work
   and let a human dispatch again. Do not silently choose a different scope.
4. Write an auditable issue comment containing a fixed claim marker, issue number,
   run ID, run attempt, run URL, actor, runner and UTC claim time. Only records
   created by the configured workflow identity count as claims; issue text or
   comments from other authors cannot confer ownership. A claim's key is
   `(repository, issue number, run ID, run attempt)`.
5. Replace the canonical state label with `agent:wip`, preserving unrelated labels.
   Re-read and verify the record and labels before checking out the task branch or
   invoking the runner. A partial API failure stops execution. Never infer success
   from a timed-out write; read it back before retrying.
6. Use the same claim key when recording final results. Only its owner can finalize
   the claim. Before push/PR creation, recheck issue eligibility and ownership;
   closure, label removal or new human-blocking flags stop publication and require
   review. Humans should cancel the owning run before changing its state.

Concurrent human edits cannot be made transactional with label writes. Minimize
that window through revalidation and cancellation; never describe labels alone
as a compare-and-swap lock. Do not replace all issue labels from a stale snapshot.

## Finalization and Stale Claims

On successful verification and confirmed draft PR creation/update, record the PR
and run links, replace `agent:wip` with `agent:done`, and mark the claim finished.
Done means ready for review, not merged. An ambiguous PR API response requires
looking up the branch's existing PR before creating another.

On failure or cancellation after claim, remove `agent:wip` and add `agent:blocked`
and `agent:needs-human`, with the run link and concrete failure. On a successful
run producing no changes, remove `agent:wip` and add `agent:needs-human`. Do not
mark done without a verified PR. Preserve partial branches and logs for review.
Cleanup must cover cancellation as well as failure, but hard interruption may
prevent cleanup; the recovery protocol handles that case.

Elapsed time is only a reason to investigate. It never releases a claim. Inspect
the exact run ID and attempt in Actions: queued, waiting, pending or in-progress
runs still own their claim. A newer run attempt is also a reason to stop recovery
and inspect current ownership. A timeout, permission error or unavailable API is
unknown state, not proof that a run stopped. Leave it blocked until confirmed.

For a completed run or an authoritatively missing run, a human must:

1. Inspect run status, branch, commits and PRs. Cancel any live owning attempt and
   wait for terminal status before recovery. A missing run requires checking for
   newer attempts and other active Agent Task runs; do not assume absence from
   a paginated listing proves deletion.
2. If a verified draft PR exists, reconcile to `agent:done` and record its evidence.
   If verification is missing or failed, keep the issue blocked for repair.
3. Otherwise record the old claim key and recovery reason, retire that claim,
   remove `agent:wip`, and retain `agent:blocked`/`agent:needs-human` until the
   underlying problem is resolved. Orphan `agent:wip` with no claim follows this
   same process; it is never automatically reclaimed.
4. When ready to retry, ensure no run remains active, remove blocking flags,
   replace canonical state with `agent:todo`, then dispatch the issue explicitly.
   A new run gets a new claim. Never force-push or delete previous work as recovery.

## Implementation and Acceptance Cases

Keep claim, eligibility and finalization rules shared across runner adapters.
Runner selection must not change lifecycle ownership. Implement the single group
and claim checks together; do not enable scheduled pickup from this design alone.

Before enabling execution changes, test with mocked API failure cases and a
small docs-only Actions canary:

| Scenario | Required result |
| --- | --- |
| Explicit and automatic dispatch target the same ready issue | Only one invokes a runner; the later run revalidates and skips claimed/done work. |
| Two explicit dispatches target different issues | They execute serially; neither cancels the active task. |
| Pending dispatch is replaced | No claim or label change from the cancelled pending run. |
| Labels change after selection | Revalidation rejects the stale selection without invoking a runner. |
| Claim write or label update times out | Read-back determines state; no runner starts with ambiguous ownership. |
| Verification passes, PR creation response is lost | Find the existing PR and reconcile; no duplicate PR. |
| Cancellation or crash before cleanup | No automatic retry; human recovery inspects the exact run and partial work. |
| Old timestamp but live run, newer attempt, or API unavailable | Do not reclaim. |
| Terminal run with verified PR | Human reconciliation marks done without rerunning implementation. |
| Missing run or orphan WIP | Human audit is required before retiring the claim and requeueing. |
| Manual retry after recovery | Explicit issue-number input still works and creates a fresh claim. |

This design PR requires manual protocol review and `bun run build` because it
defines contribution workflow policy. Implementation must additionally run the
focused lifecycle tests, repository verification, and controlled Actions canaries.
