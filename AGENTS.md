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

## Content and routing conventions

- Top-level sections are `systems`, `work`, `ideas`, and `lab`.
- Content is stored as MDX under locale-prefixed directories in `content/<locale>/<section>/`.
- Filenames define slugs.
- Published entry URLs should resolve as `/<locale>/<section>/<slug>/`.
- Frontmatter is validated in `lib/mdx/content.ts`.
- Required frontmatter is `title`, `date`, and `summary`.
- Keep the content model lightweight unless the task explicitly expands it.

## Verification rules

- Documentation-only changes: manually review the affected markdown. No production build is required unless commands, hosting rules, or contribution policy meaning changes.
- MDX/content changes: run `bun run build`. Also run `bun run test` and `bun run typecheck` when frontmatter, routing, locale parity, or content loading is affected.
- UI, component, or styling changes: run `bun run test`, `bun run typecheck`, and `bun run build`. Run relevant Playwright tests when navigation, theme, layout, or exported-page behavior changes.
- Routing, content-loader, export, config, or deploy changes: run `bun run test`, `bun run typecheck`, `bun run build`, and relevant e2e checks.
- Dependency changes: use Bun, keep `bun.lock` aligned, and run the full verification set that covers the changed behavior.
- Treat `bun run build` as the final gate for route, content, and export behavior.

## Git, branch, commit, and PR conventions

- Identify the current branch before committing.
- Branch + PR is the default safe flow for code, config, routing, dependency, deploy, or multi-file UI/content changes.
- Direct-to-`main` is allowed only when all are true:
  - the agent explicitly states it is working directly on `main`
  - the change is small and low risk
  - verification appropriate to the change has passed
  - the user did not ask for a PR
- Branch names should be scoped and descriptive, such as `content/<slug>`, `fix/<issue>`, `ui/<area>`, `docs/<topic>`, or `chore/<task>`.
- Prefer Conventional Commit style for code and config changes: `feat:`, `fix:`, `docs:`, `content:`, `test:`, `refactor:`, `perf:`, `ci:`, or `chore:`.
- Content-only commits may use either `content: short summary` or a short imperative summary when that reads better.
- Commit subjects should be concise, imperative, and specific. Avoid vague summaries like `update files`.
- PRs should include what changed, why it changed, verification commands and results, and any skipped checks or known risks.
- Do not push or open a PR with failing required verification unless the user explicitly asks for a work-in-progress handoff.

## Completion guidance

- Final handoff must list verification commands run.
- If a required check was skipped, failed, or could not run, state that plainly.
- Do not claim route, content, or export work is complete without a successful production build.
- Mention unrelated untracked or pre-existing modified files that were left untouched.

## Deployment note

GitHub Actions deploys the exported `out/` artifact from pushes to `main`. Changes that only work in development but not in `bun run build` are not valid for this repo.
