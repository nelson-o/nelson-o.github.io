# Scheduled Task Review

## Summary

Issue #6 adds a weekly backlog review and manual dispatch. It proposes refinement
or human review without promoting labels, starting agents, creating PRs or merging.
The existing manual Agent Task workflow is unchanged.

## Decisions

- Run Mondays at 02:17 UTC and on manual dispatch. A repository variable
  `AGENT_REVIEW_DISABLED=true` suppresses scheduled runs; manual dispatch remains
  available. GitHub schedules may be delayed; this is advisory, not a deadline.
- Read all open issues, excluding pull requests, then review `agent:backlog` in
  oldest-first order. Report blocking labels, conflicting lifecycle labels and
  missing Goal, Acceptance Criteria or Scope Budget content. Strip HTML comments
  before checking sections so template hints do not establish readiness.
- Complete-looking issues are only candidates for human review, never certified
  safe or ready. High-risk work therefore cannot start through this workflow.
  Humans inspect scope, evidence and specs, replace backlog with todo if ready,
  and explicitly dispatch Agent Task. Ignore or override a recommendation freely.
- Use a dedicated `NELSON_O_REVIEW_TOKEN` secret owned by nelson-o with repository
  metadata, contents and issues read access. Verify `/user` before authenticated
  repository reads. Missing or wrong identity fails with setup guidance. No fallback
  to another account or the Actions bot credential. Checkout also uses this token.
- Render issue numbers and fixed reasons in the Actions job summary. Do not render
  arbitrary issue Markdown, execute issue text, post comments or change labels.
  Each report is a snapshot with a generation timestamp; re-read issues before
  acting. Empty backlog produces an explicit no-candidates report.

## Implementation Notes

A pure helper classifies issue snapshots; a Bun script verifies identity, reads
paginated GitHub REST results through gh and writes the summary. The workflow
has no write permission, secrets are never printed, and review does not invoke
an LLM or the Agent Task workflow. Review needs no execution lock because it
cannot claim work; scheduled execution remains gated by the #8 locking design.

## Acceptance Criteria

Tests cover blocked/conflicting states, incomplete and comment-only templates,
PR exclusion, oldest-first ordering and a populated proposal. Run unit tests,
typecheck, lint and production build, validate workflow syntax, and exercise the
script against live read-only issue data. Hosted schedule/manual-dispatch behavior
requires merge and the dedicated secret; record that limitation in the PR.
