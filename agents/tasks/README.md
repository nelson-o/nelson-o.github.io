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

Spec
agents/specs/<spec-file>.md, if needed

Constraints
- <Known limits, exclusions, or risks>
```

Small issues may omit the `Spec` section. Larger changes should link a spec from
`agents/specs/`.

## Lifecycle

1. Human creates or refines an issue and labels it `agent:todo`.
2. Human manually dispatches the agent workflow with the issue number.
3. Workflow marks the issue `agent:wip`.
4. Agent implements on `agent/<issue-number>-<short-slug>`.
5. Successful verification leads to a draft PR and `agent:done`.
6. Failed or unclear work leads to `agent:blocked` or `agent:needs-human`.

GitHub Projects can mirror these labels into a visual board, but Projects are
not required for V1.
