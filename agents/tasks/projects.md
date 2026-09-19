# Optional GitHub Projects View

## Decision

Keep GitHub Projects optional. Issues and their `agent:*` labels remain the
canonical task state. The manual Agent Task workflow must work without a
Project, Project permissions, or a synchronization service.

A board can help a human scan a larger backlog and group related tasks. For
this repository, making it required would add setup and reconciliation work
without improving task execution or locking. Reconsider automation only when
manual board maintenance becomes a demonstrated problem; specify permissions,
failure handling and reconciliation before implementing it.

## Recommended Fields

| Field | Suggested type | Meaning |
| --- | --- | --- |
| Status | Single select | Backlog, Todo, WIP, Done, or Untriaged; mirrors the canonical state label. |
| Agent | Single select | Assigned runner, such as Codex or Claude; assignment alone does not mean a runner is supported or starts a run. |
| Spec | Text | Repository path or link to a spec; empty for small tasks that do not need one. |
| Risk | Single select | Low, Medium, High; human assessment alongside the issue's scope budget. |
| Last agent run | Text | Link to the latest Actions run, including failed runs. |
| Needs human | Single select | Yes when `agent:needs-human` is present; otherwise No. |
| Blocked | Single select | Yes when `agent:blocked` is present; otherwise No. |

Done means a verified draft PR exists, not that it has merged or deployed.
Blocked and Needs human are separate flags because they may coexist with a
canonical state label. If no canonical state label exists, use Untriaged. If
multiple state labels exist, correct the issue before updating the board.

## Human Maintenance

1. Optionally create a board grouped by Status and add repository issues.
2. Populate fields from the issue, linked spec, and latest Actions run. Leave
   unknown values blank rather than inferring readiness or risk.
3. Change lifecycle labels on the issue first, then mirror them to the board.
   Dragging a card does not authorize execution or change issue state.
4. On disagreement, reconcile the board from the issue labels. Use a filtered
   view for closed issues; retain the PR and run links for audit history.

No Project or sync automation is provisioned by this decision. A future sync
must treat labels as authoritative, avoid board-to-label feedback loops, and
leave manual issue-number dispatch usable when synchronization fails. Project
field edits must never dispatch an agent, merge a PR, or bypass human review.
