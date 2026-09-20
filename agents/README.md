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
2. A human starts the agent workflow with `workflow_dispatch`, either with that
   issue number or by letting the workflow select the oldest open `agent:todo`
   issue.
3. The agent creates or updates a scoped branch.
4. The agent implements the requested change and runs verification.
5. The agent opens or updates a draft pull request.
6. A human reviews and merges.

Agents must not merge pull requests or push directly to `main`.

## GitHub Actions Setup

The manual workflow runs Codex CLI with credentials from a GitHub Actions
secret, not `OPENAI_API_KEY`.

Create the secret from a local Codex login:

```bash
jq -c . ~/.codex/auth.json
```

Store the resulting single-line JSON payload as the repository secret
`CODEX_AUTH_JSON`. Treat this value like a password: do not commit it, paste it
into issues or pull requests, or print it in workflow logs.

After this workflow is merged to `main`, it appears in the GitHub Actions tab as
`Agent Task`. A human can run it manually with an optional issue number and
optional spec path. When no issue number is provided, the workflow selects the
oldest open issue labeled `agent:todo`.

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
- Work only on the issue selected by the workflow input, or on the oldest open
  issue labeled `agent:todo` when no issue number is provided.
- Link any relevant spec from `agents/specs/`.
- Use a branch named `agent/<issue-number>-<short-slug>`.
- Open or update a draft pull request.
- Include verification commands and results in the pull request body.
- Leave a comment when no changes are produced.

Codex remains the default runner. Claude is an explicit alternative under the
same issue, spec, branch, verification, and draft PR contract.

## Runner Selection and Credentials

`Agent Task` defaults to `runner=codex`; select `runner=claude` explicitly for
Claude Code. Both consume the same generated policy/issue/spec prompt and pass
through the same verification, commit, draft PR and issue-state steps. Neither
runner owns publication. No scheduled execution is added.

All GitHub operations require `NELSON_O_AGENT_TOKEN`, owned by `nelson-o`, with
repository contents, issues and pull-request write access (and workflow-file
permission when the selected task changes workflows). The job verifies identity
before checkout; commits use the repository-required nelson author/committer.
This replaces the previous Actions bot credential to comply with `AGENTS.md`.
Do not substitute a bot or another saved account if setup is missing.

Codex still requires `CODEX_AUTH_JSON`. Claude requires `ANTHROPIC_API_KEY` and
uses noninteractive print mode; selecting Claude does not require Codex auth.
Store secrets in repository settings and never include their values in issues,
PRs or logs. Model and effort inputs are passed to the selected CLI, so use values
supported by that runner/model or leave them blank. The timeout accepts 1–50
minutes, default 40, leaving time inside the 60-minute job for verification.

Both invocations retain the ephemeral GitHub runner as the execution boundary:
Codex uses its existing full-access mode and Claude skips interactive permission
prompts. Only manually approved repository tasks should be dispatched. The shared
workflow verifies changes before publishing and never merges. A missing credential,
runner failure, timeout or missing final message prevents the verification/PR path.

The adapter is tested with stub CLIs for prompt delivery, argument boundaries,
output and failure handling. Hosted canaries for both runners must be run after
merge and credential setup; stubs do not establish live authentication or model
availability. Use a small docs-only task such as #5, one dispatch at a time; the
#8 execution-locking design is not implemented by this adapter.

CLI references: [Codex noninteractive mode](https://learn.chatgpt.com/docs/non-interactive-mode)
and [Claude CLI reference](https://code.claude.com/docs/en/cli-reference).

Scoped maintenance exception: the existing Agent Task YAML exceeds the file-size
advisory target. Runner-specific invocation is extracted to
`scripts/run-agent-task.sh`; shared lifecycle steps remain together to avoid
forked behavior. Further cleanup can extract context preparation independently.
