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
- SVG world maps:
  - Source/reference site: <https://www.worldatlas.com/>
  - Current map rendering uses `components/ui/world-map.tsx` and `lib/world-land-path.ts`.

## Verification

For any meaningful content, routing, or styling change:

1. `bun run test`
2. `bun run typecheck`
3. `bun run build`

Treat `bun run build` as the final gate because it exercises the static export path GitHub Pages serves.
