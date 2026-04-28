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

## Content and routing conventions

- Top-level sections are `systems`, `work`, `ideas`, and `lab`.
- Content is stored as MDX under `content/<section>/`.
- Filenames define slugs.
- Published entry URLs should resolve as `/<section>/<slug>/`.
- Frontmatter is validated in `lib/mdx/content.ts`.
- Required frontmatter is `title`, `date`, and `summary`.

## Editing guidance

- Keep the content model lightweight unless the task explicitly expands it.
- Preserve the current separation of concerns:
  - routes in `app/`
  - shared UI in `components/`
  - content loading and rendering in `lib/`
- Avoid adding infrastructure that assumes a server runtime.
- If you change content loading, routing, or export behavior, run tests, typecheck, and a fresh production build.

## Deployment note

GitHub Actions deploys the exported `out/` artifact from pushes to `main`. Changes that only work in development but not in `bun run build` are not valid for this repo.
