# Agent Tasks

GitHub Issues are the required source of truth for agent task state. The folders
in this directory are intentionally not used as kanban columns in V1 because file
based task state is harder to lock and review across automated runs.

## Kanban State

Use these labels on GitHub Issues:

- `agent:backlog`: long-term candidate work.
- `agent:todo`: refined and ready for an agent.
- `agent:wip`: an agent run is currently working on it.
- `agent:done`: the agent has opened or updated a draft pull request.
- `agent:blocked`: the agent cannot proceed without a missing dependency,
  permission, or decision.
- `agent:needs-human`: a non-interruptive human response is needed.
- `agent:spec-required`: the task needs a spec before implementation.

Only one of `agent:backlog`, `agent:todo`, `agent:wip`, and `agent:done` should
be active on an issue at a time.

## Issue Format

Agent-ready issues should be written as one focused task:

```text
Title: <imperative task summary>

Goal
<What should change and why.>

Acceptance Criteria
- <Observable result>
- <Required verification>

Scope Budget
Expected files touched: <number or range>
Expected LOC changed: <number or range>
Risk surface: docs | content | UI | lib | routing | config | deploy
Split if larger than: <threshold>

Spec
agents/specs/<spec-file>.md, if needed

Constraints
- <Known limits, exclusions, or risks>
```

Small issues may omit the `Spec` section. Larger changes should link a spec from
`agents/specs/`.

Use these default scope bands:

- Small: 1-10 files, under 1000 LOC, one behavior surface.
- Medium: 11-20 files, 1000-2000 LOC, precise acceptance criteria required.
- Large: more than 21 files, more than 2000 LOC, or multiple risky surfaces; add
  a spec or split the work.

## Lifecycle

1. Human creates or refines an issue and labels it `agent:todo`.
2. Human manually dispatches the agent workflow with the issue number, or omits
   the issue number to select the oldest open `agent:todo` issue.
3. Workflow marks the issue `agent:wip`.
4. Agent implements on `agent/<issue-number>-<short-slug>`.
5. Successful verification leads to a draft PR and `agent:done`.
6. Failed or unclear work leads to `agent:blocked` or `agent:needs-human`.

GitHub Projects can mirror these labels into a visual board, but Projects are
not required for V1.

## Workflow Stages

GitHub Actions behavior by task state:

- `agent:backlog`: no workflow runs; this is long-term inventory.
- `agent:todo`: eligible for a human to run the manual `Agent Task` workflow.
  If manual dispatch omits an issue number, the workflow selects the oldest open
  issue with this label.
- `agent:wip`: set by `Agent Task` while Codex is running.
- `agent:done`: set after the workflow verifies changes and opens or updates a
  draft pull request.
- `agent:blocked`: set when the workflow fails before a verified draft pull
  request exists.
- `agent:needs-human`: set when the workflow needs asynchronous human review or
  no repository changes were produced.

Blocked and human-needed issues do not retry automatically in V1. A human should
inspect the issue comment and workflow run, adjust the issue or environment, and
rerun `Agent Task` manually.

## After Merge

Branch pushes do not deploy the site. Open a pull request for the branch that
adds or changes agent workflow files; the existing GitHub Pages workflow runs
verification on the pull request.

After the pull request merges to `main`, the existing deploy workflow builds and
deploys the static site. The `Agent Task` workflow also becomes available for
manual dispatch because GitHub only exposes `workflow_dispatch` workflows once
the workflow file exists on the default branch.

Backlog enrichment is optional before testing. To exercise the system:

1. Create or choose one small GitHub Issue.
2. Label it `agent:todo`.
3. Optionally create or link an `agents/specs/*.md` spec.
4. Manually run `Agent Task`; pass `issue_number` for a specific issue, or
   leave it blank to use the oldest open `agent:todo` issue.
5. Pass the spec path as `spec_path` when a separate spec exists.
6. Leave `agent_timeout_minutes` at the default `40` unless the task has a
   documented scope budget that justifies a different Codex execution limit.
