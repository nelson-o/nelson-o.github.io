# Maintenance Notes

This repo is built around static export and localized MDX content. Keep changes aligned with that shape.

## Where Things Live

- `app/` contains route composition and page-level glue only.
- `components/layout/` contains page shells and feature sections.
- `components/ui/` contains reusable UI primitives and small widgets.
- `lib/` contains data loading, validation, and derived helpers.
- `lib/mdx/` owns content discovery, parsing, and query behavior.
- `lib/profile*` owns the profile schema and derived profile data.
- `content/` contains localized MDX source content.

## CSS Rules

- `app/globals.css` should stay small.
- Keep global CSS for tokens, reset, base typography, and theme plumbing only.
- Use CSS Modules for page-specific and component-specific styling.
- Reuse a shared module only for repeated surface/card patterns.

## File Quality Rules

Treat these as advisory gates. A file can exceed a limit only when the work
names the reason, keeps the exception scoped, and leaves a small-step path to
reduce the file later.

### Line Count Targets

- Route and page composition files in `app/`: 150 LOC.
- Source helpers and data modules in `lib/`: 150 LOC.
- React components in `components/`: 200 LOC.
- CSS Modules: 250 LOC.
- Tests: 200 LOC.
- Scripts: 200 LOC.
- MDX, markdown, and long-form content: no fixed cap; split when review,
  navigation, or localized parity becomes hard.

When touching an over-limit file:

- Do not make it larger without naming why the change belongs there.
- Prefer extracting one focused helper, child component, CSS module, or test
  fixture at a time.
- Keep behavior unchanged unless the task explicitly asks for behavior change.
- Validate the smallest relevant behavior after each meaningful split.

### Naming Rules

- Source/helper files should map to their main exported subject, function,
  class, constant, or responsibility.
- React component files use kebab-case and match the component concept.
- CSS Modules pair with the page or component they style.
- Tests mirror the behavior or module under test.
- App Router convention files keep framework names such as `page.tsx`,
  `layout.tsx`, and `not-found.tsx`.

### Anti-Patterns And Small-Step Fixes

- Mixed state, DOM event handling, rendering, and data transformation in one
  component: extract pure helpers first, then child components.
- Large CSS Modules: split by component boundary, not by arbitrary selector
  groups.
- Growing global CSS: move component and page styles into CSS Modules; keep
  globals limited to tokens, reset, base typography, and theme plumbing.
- Validation mixed with loading or query logic: separate schema parsing,
  filesystem discovery, and query helpers into focused modules.
- Oversized tests: split by behavior area and keep setup helpers local until
  at least two files need them.

When improving an anti-pattern, validate the current behavior first, make one
small change, verify the relevant command, and commit a focused Conventional
Commit message when committing is part of the task.

## Content Rules

- Published content must remain available at `/<locale>/<section>/<slug>/`.
- Slugs come from filenames.
- Frontmatter must keep validating through the build.
- Do not add server-only behavior or API routes.

## External Service And Asset References

Use these links when updating or troubleshooting external setup.

- Giscus comments:
  - Setup/config generator: <https://giscus.app/>
  - GitHub App installation: <https://github.com/settings/installations> > `giscus`
  - Repository discussions: <https://github.com/nelson-o/nelson-o.github.io/discussions>
  - Current site config lives in `components/ui/giscus-comments.tsx`.
- Google Search Console:
  - Sitemap status: <https://search.google.com/search-console/sitemaps/info-drilldown?resource_id=https:%2F%2Fnelson-o.github.io%2F&sitemap=https:%2F%2Fnelson-o.github.io%2Fsitemap.xml>
  - Sitemap source lives in `app/sitemap.ts`; robots metadata points to it from `app/robots.ts`.
- SVG world maps:
  - Source/reference site: <https://www.worldatlas.com/>
  - Current map rendering uses `components/ui/world-map.tsx` and `lib/world-land-path.ts`.

## Verification

For any meaningful content, routing, or styling change:

1. `bun run test`
2. `bun run typecheck`
3. `bun run build`

Treat `bun run build` as the final gate because it exercises the static export path GitHub Pages serves.
