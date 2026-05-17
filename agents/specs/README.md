# Agent Specs

Specs capture decisions that are too important or too broad to live only in an
issue comment. A spec should map cleanly to one or more GitHub Issues.

## Naming

Use a short dated filename:

```text
YYYY-MM-DD-short-topic.md
```

Example:

```text
2026-05-17-agent-kanban-workflow.md
```

## Structure

Use this shape unless the task clearly needs less:

```markdown
# <Spec Title>

## Summary
<What will exist after this work.>

## Decisions
- <Decision and rationale>

## Implementation Notes
- <Interfaces, files, commands, or constraints that matter>

## Acceptance Criteria
- <Observable behavior>
- <Verification command>
```

## Policy

- Keep specs decision complete for the task they describe.
- Prefer links to GitHub Issues for execution state.
- Keep long-term design rationale here, not in workflow logs.
- Update the spec when implementation changes invalidate an assumption.
