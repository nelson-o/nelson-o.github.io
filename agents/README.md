# Agent Workspace

This directory defines how automated coding agents may work in this repository.
It is not part of the static site output. It is an operating contract for agents
running locally or in GitHub Actions.

## Operating Model

Agents work from GitHub Issues. The repository keeps durable policies, reusable
prompts, and specs under `agents/`; GitHub Issues keep task state; GitHub
Projects may provide an optional kanban view.

The first supported workflow is manual-only:

1. A human selects an issue.
2. A human starts the agent workflow with `workflow_dispatch`.
3. The agent creates or updates a scoped branch.
4. The agent implements the requested change and runs verification.
5. The agent opens or updates a draft pull request.
6. A human reviews and merges.

Agents must not merge pull requests or push directly to `main`.

## GitHub Actions Setup

The manual workflow uses Codex CLI credentials from a GitHub Actions secret,
not `OPENAI_API_KEY`.

Create the secret from a local Codex login:

```bash
jq -c . ~/.codex/auth.json
```

Store the resulting single-line JSON payload as the repository secret
`CODEX_AUTH_JSON`. Treat this value like a password: do not commit it, paste it
into issues or pull requests, or print it in workflow logs.

After this workflow is merged to `main`, it appears in the GitHub Actions tab as
`Agent Task`. A human can run it manually with an issue number and optional spec
path.

## Repository Constraints

Agents must follow `AGENTS.md` and `docs/maintenance.md`. The most important
constraints are:

- Keep the site compatible with static export.
- Do not add API routes or server-dependent runtime behavior.
- Preserve GitHub Pages compatibility.
- Use Bun for scripts and dependency management.
- Run `bun run build` before claiming route, content, UI, config, or export
  behavior is complete.
- Preserve unrelated user work.

## Human Interaction

Agents should avoid interrupting humans synchronously. When help is needed, the
agent should comment on the issue or draft pull request and apply
`agent:needs-human`.

Use `agent:blocked` when progress is impossible without a missing secret,
external permission, unclear product decision, or repeatedly failing verification.

## Runner Contract

Agent runners must:

- Read this directory, `AGENTS.md`, and `docs/maintenance.md` before editing.
- Work only on the issue selected by the workflow input.
- Link any relevant spec from `agents/specs/`.
- Use a branch named `agent/<issue-number>-<short-slug>`.
- Open or update a draft pull request.
- Include verification commands and results in the pull request body.
- Leave a comment when no changes are produced.

Codex is the first implemented runner. Claude or other agents can be added later
if they honor the same issue, spec, branch, verification, and draft PR contract.
