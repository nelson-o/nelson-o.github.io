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
- Current top-level sections are `systems`, `work`, `ideas`, and `digests`.
- Slugs come from filenames.
- Frontmatter must keep validating through the build.
- Do not add server-only behavior or API routes.

### Static 404 Recovery

GitHub Pages serves one shared `404.html` for missing paths. Its initial and
JavaScript-disabled fallback is English, with direct links to every supported
reading-language homepage. After hydration, the first URL segment is resolved
with the existing site locale normalizer: supported locales select translated
copy, recovery links, and document language; absent or unsupported prefixes use
English. Query parameters do not select the language. The requested missing URL
is retained; this is client-side recovery, not server-side locale routing.

## Incremental Site Upkeep

Keep improvements small and evidence-led, across the whole site as well as the
profile. Prioritize clear design, usable navigation, accessibility, and measured
performance gains. Before starting:

1. Read these notes and `AGENTS.md`, inspect current changes, and check open
   issues and pull requests for overlapping work.
2. Browse the deployed site to reproduce the problem. Record the route, locale,
   viewport, theme, and observable behavior; separate live evidence from local
   measurements and inferred problems.
3. Reuse an existing issue where it fits. Create a focused issue when useful,
   with evidence, acceptance criteria, a small scope budget, and verification.
   Respect the design decisions and dependencies already tracked in the backlog.
4. Make one independently reviewable improvement, add focused regression
   coverage, and follow the verification and screenshot rules in `AGENTS.md`.
5. Every change, including documentation and content, goes through a scoped
   branch and draft pull request. Include before/after visual comparisons when
   possible; state any capture limits. Stacked PRs are allowed when useful to
   avoid conflicts: name the base PR and intended merge order. Merge and
   deployment require separate owner approval; a draft PR is not a deployed
   improvement.

### Frontend Writing

- Effective **November 7, 2026, in Asia/Taipei**, research and propose substantive
  posts about AI, software developments, technology libraries, and programming
  languages, including useful frontend and agentic-development topics.
- Aim for one well-supported post; propose a second only when a distinct topic
  merits it. The ceiling is **two new post PRs per Taipei calendar day** and
  **at most one new post PR per run**. These are ceilings, not quotas: skip weak,
  recycled, or insufficiently sourced topics instead of creating filler.
- Leave **at least three elapsed hours between new post PRs**, counting actual
  creation times across all runs and manual work. A delayed earlier run does not
  waive this interval. A later run may propose the optional second post only
  after checking both the interval and the day's count.
- Before writing **and again immediately before opening each post PR**, reread
  current main, recent content, existing drafts/issues, and all recent/open post
  PRs. Check for duplicate topics, verify actual PR creation timestamps, and
  recount the Asia/Taipei day. Skip if timing cannot be established or if the cap,
  spacing, or originality checks fail; MDX `date` values are not timing evidence.
- Record the count, previous post PR timestamp, timing check, and actual new PR
  creation timestamp with timezone and PR URL in the review evidence. Reconcile
  the result after creation rather than treating a proposed timestamp as actual.
- Each proposed post gets its own **draft PR**. Keep **`published: false` in every
  locale edition**, preserve the site's content schema and editorial style, and
  verify exclusion from production exports. Research, PR creation, or merging an
  unpublished draft does not authorize publishing it. Merge, publication, and
  deployment require separate owner approval; do not push directly to main or
  enable auto-merge.
- Use dated primary sources such as official release notes, documentation,
  repositories, and original research. Verify exact versions, release status,
  dates, and technical/performance claims; distinguish vendor claims from
  independently verified results. Explain practical implications and tradeoffs,
  link sources, and avoid unsupported claims that a topic is trending.
- Never fabricate personal experience or disclose private work details. Preserve
  pending drafts and owner review decisions; do not recreate blocked work.
- These post limits do **not** cap useful maintenance PRs. There is no fixed
  daily maintenance PR quota; keep changes meaningful, independent, tested, and
  reviewable rather than splitting work merely to increase the count. All changes,
  including repository guidance, still require draft PRs and exact-head CI checks.

### Article Dates

- `date` remains the original publication date. It drives archive, series and
  publication-feed ordering; do not change it to make an older article look new.
- An optional `updated: "2026-11-08"` records the date of an explicitly reviewed,
  substantive revision to that edition. Use a **quoted** `YYYY-MM-DD` calendar
  date; timestamps, impossible dates, unquoted YAML dates, and dates before
  publication fail validation. Quoting prevents YAML from normalizing invalid days.
- The header labels publication in every locale. It shows Updated only when
  `updated` differs from `date`; social `modifiedTime` uses `updated` when present
  and otherwise retains `date`. An equal date is allowed but adds no Updated row.
- Each translated edition records its own substantive revision date. Do not copy
  an update date to translations that have not been revised. Leave it absent when
  there is no reviewed evidence; never infer it from build time, file timestamps,
  blanket Git changes, or routine formatting. Historical backfills require a
  reviewed source in their PR. This field does not change feed publication dates.

## External Service And Asset References

Use these links when updating or troubleshooting external setup.

- Giscus comments:
  - Setup/config generator: <https://giscus.app/>
  - GitHub App installation: <https://github.com/settings/installations> > `giscus`
  - Repository discussions: <https://github.com/nelson-o/nelson-o.github.io/discussions>
  - Current site config lives in `components/ui/giscus-comments.tsx`.
- Google Search Console:
  - Sitemap status: <https://search.google.com/search-console/sitemaps/info-drilldown?resource_id=https:%2F%2Fnelson-o.github.io%2F&sitemap=https:%2F%2Fnelson-o.github.io%2Fsitemap.xml>
  - Sitemap index source lives in `app/sitemap.xml/route.ts`; locale child sitemaps live under `app/sitemaps/`; shared sitemap helpers live in `lib/sitemap.ts`; robots metadata points to the index from `app/robots.ts`.
- SVG world maps:
  - Source/reference site: <https://www.worldatlas.com/>
  - Current map rendering uses `components/ui/world-map.tsx` and `lib/world-land-path.ts`.

## Verification

For any meaningful content, routing, or styling change:

1. `bun run test`
2. `bun run typecheck`
3. `bun run build`

Treat `bun run build` as the final gate because it exercises the static export path GitHub Pages serves.
