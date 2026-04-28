# nelson-o.github.io

Personal engineering site built with Next.js static export and deployed to GitHub Pages.

Public site: `https://nelson-o.github.io/`

## Stack and hosting

- Next.js App Router
- TypeScript
- Local MDX content
- Bun for package management and scripts
- GitHub Actions for build and deploy
- GitHub Pages for static hosting

## Hosting constraints

This repo is built for static export only.

- `next.config.ts` uses `output: "export"`
- image optimization is disabled with `images.unoptimized`
- routes must work as plain exported HTML
- do not rely on API routes or other server-only runtime features

## Repository structure

- `app/`: route files and page composition
- `content/`: MDX content for `systems`, `work`, `ideas`, and `lab`
- `components/`: shared layout and UI building blocks
- `lib/`: MDX loading, validation, and rendering utilities
- `.github/workflows/`: GitHub Actions deploy workflow
- `public/`: static assets including `.nojekyll`

## Local commands

```bash
bun install
bun run dev
bun run test
bun run typecheck
bun run build
bun run preview
```

## Content model

Content lives under locale-prefixed directories:

- `content/en/systems/`
- `content/en/work/`
- `content/en/ideas/`
- `content/en/lab/`
- `content/zh-tw/systems/`
- `content/zh-tw/work/`
- `content/zh-tw/ideas/`
- `content/zh-tw/lab/`

Each entry is an `.mdx` file. Slugs come from filenames and are published at `/<locale>/<section>/<slug>/`.

Current frontmatter fields:

- `title`
- `date`
- `summary`
- optional `published`
- optional `featured`

Frontmatter is validated during build. Invalid or incomplete metadata should fail the build rather than silently publishing broken content.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`.

The workflow:

1. installs dependencies with Bun
2. runs the production build
3. uploads `out/` as the Pages artifact
4. deploys that artifact to GitHub Pages

If you need to validate the production artifact locally, run `bun run build` and then `bun run preview`.
The preview server serves the exported `out/` directory at `http://localhost:4321`.
