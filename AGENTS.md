# AGENTS.md

## Repo purpose

This repository contains Nelson Lin's personal engineering site. It is a Next.js App Router project that publishes statically exported pages to GitHub Pages.

## Non-negotiable constraints

- Keep the site compatible with static export.
- Do not introduce API routes or server-dependent runtime behavior.
- Preserve GitHub Pages compatibility.
- Keep `next.config.ts` aligned with static hosting needs, including unoptimized images.
- Validate route and content changes with a production build before claiming completion.

## Tooling and commands

Use Bun for dependency management and scripts.

```bash
bun install
bun run dev
bun run test
bun run typecheck
bun run build
```

The most important verification step for behavior changes is `bun run build`, because it exercises the static export path that GitHub Pages serves.

## Development cycle

- Inspect relevant files before editing, and run `git status --short` before making changes.
- Preserve unrelated user work. Do not overwrite, revert, or reformat files outside the task.
- Keep changes scoped to the requested behavior.
- Prefer existing repo patterns over new abstractions.
- Keep implementation boundaries clear:
  - routes and page composition in `app/`
  - shared layout and UI in `components/`
  - content loading, validation, and derived helpers in `lib/`
  - source content in `content/`
- Add or update focused tests near the changed behavior when behavior changes.
- Avoid broad refactors unless they are required to complete the requested change safely.
- Read `docs/maintenance.md` before changing source, styling, routing, content loading, or docs policy.
- Treat the file-quality rules in `docs/maintenance.md` as advisory gates: exceptions must be explicit, scoped, and verified.
- Leave unrelated over-limit files untouched unless the task directly involves them.

## Content and routing conventions

- Top-level sections are `systems`, `work`, `ideas`, and `digests`.
- Content is stored as MDX under locale-prefixed directories in `content/<locale>/<section>/`.
- Filenames define slugs.
- Published entry URLs should resolve as `/<locale>/<section>/<slug>/`.
- Frontmatter is validated in `lib/mdx/content.ts`.
- Required frontmatter is `title`, `date`, and `summary`.
- Keep the content model lightweight unless the task explicitly expands it.

## Verification rules

Follow the shared [verification gates](CONTRIBUTING.md#verification). Read
[CONTRIBUTING.md](CONTRIBUTING.md) before working; it is the single source for
PR acceptance, evidence, caveats, visual comparisons and measurement reporting.

## Git, branch, commit, and PR conventions

- Only `nelson-o` may create commits for this project. Use `nelson <7495329+nelson-o@users.noreply.github.com>` for both the Git author and committer identities.
- Before every commit, run `git var GIT_AUTHOR_IDENT` and `git var GIT_COMMITTER_IDENT`. If either identity differs, stop and correct the repository-local Git configuration or environment overrides before committing. Do not commit under another identity or change global Git identity settings.
- All operations for this project that use an account must use only `nelson-o`. This applies to authenticated reads and writes through Git, GitHub CLI, APIs, browser sessions, connectors, and other tools, including fetches, pulls, pushes, issues, PRs, reviews, comments, Actions, deployments, and repository settings.
- Before authenticated project operations, verify that the account used by the specific tool or session is `nelson-o`, including any credential or environment overrides. If the account differs, explicitly select the saved `nelson-o` credential and verify it before proceeding. If `nelson-o` credentials are unavailable, stop the affected operation and report the blocker; never fall back to another account or create a fork or records under another account to work around permissions.
- Identify the current branch before committing.

Follow the shared [PR conventions](CONTRIBUTING.md#working-with-pull-requests).

## Before/after screenshots for UI PRs

Follow [visual evidence requirements](CONTRIBUTING.md#beforeafter-visual-evidence),
including video applicability, production-export comparisons and reviewed assets.

## Completion guidance

Follow the shared [handoff checklist](CONTRIBUTING.md#handoff). Record available
agent telemetry and clock readings during the work, then include the
[measurement JSON](CONTRIBUTING.md#agent-measurements); disclose unavailable
values instead of inventing them or accessing restricted runtime files.

## Deployment note

GitHub Actions deploys the exported `out/` artifact from pushes to `main`. Changes that only work in development but not in `bun run build` are not valid for this repo.
