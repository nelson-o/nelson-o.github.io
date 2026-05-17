# Agent Skills

This directory is reserved for repo-local agent skills, prompts, and small
workflow helpers.

## Policy

- Keep skills focused on repeatable repository work.
- Prefer short Markdown instructions over large prompt frameworks.
- Reference existing repo commands instead of redefining them.
- Do not store secrets, access tokens, or private environment details here.
- Keep runner-specific details isolated so a skill can be reused by Codex,
  Claude, or another compatible agent.

## Suggested Shape

Use one directory per skill:

```text
agents/skills/
  <skill-name>/
    README.md
    prompt.md
```

`README.md` should explain when to use the skill. `prompt.md` may contain the
runner-facing instructions.

## Current Status

V1 does not require any custom skills. The manual workflow loads the repository
contract from `AGENTS.md`, `docs/maintenance.md`, and `agents/`.
