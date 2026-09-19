# Profile editions and 2026 preview

Tracking: [top epic #19](https://github.com/nelson-o/nelson-o.github.io/issues/19),
[routing #20](https://github.com/nelson-o/nelson-o.github.io/issues/20),
[layout/content #25](https://github.com/nelson-o/nelson-o.github.io/issues/25),
[visual review/release #33](https://github.com/nelson-o/nelson-o.github.io/issues/33).

GitHub denied native subissue attachment because the connected account has no
triage/write permission on the upstream repository. The epics use linked issue
checklists instead. Keep issues open until their acceptance evidence is complete;
a code implementation does not establish factual accuracy or deployment.

## Routes and ownership

Every supported locale (`en`, `zh-tw`, `zh-cn`, `ja`) exports:

- `/profile/`: shared renderer for `activeProfileVersion`, initially `2025`.
- `/profile/2025/`: existing profile presentation and legacy `data/profile/` data.
- `/profile/2026/`: new frame, independent `data/profile/2026/` content and localized
  interface copy in `lib/profile-2026-copy.ts`.

There is no year redirect, browser-only version resolution, or runtime API.
Ordinary pages retain the site frame through the `(site)` route group. Profile
routes select their own frame, so promotion also selects the correct frame.
The 2025 edition preserves the existing build-time GitHub location/bio behavior;
it is a preserved presentation edition, not a historical employment snapshot.
The 2026 edition reads local data and assets without a GitHub fetch.

The active edition canonicalizes to `/profile`. While 2026 is a preview, it has a
visible label, `noindex, follow`, and is omitted from sitemaps. On promotion, the
old edition becomes independently canonical and appears in sitemaps. Locale
switching preserves the year for all four languages.

## Design adaptations

The user-supplied mockup defines the hierarchy and visual direction. Native HTML
implements navigation, hero, capability columns, experience timeline, project
cards, activities and contact/footer. CSS Modules provide both light and dark
palettes. Existing settings provide persistent light/dark/system preferences.

Mobile uses visible wrapping navigation and stacked sections, without a hidden
menu. Native `details` controls expose older roles, project highlights and
activities. Each page has one main landmark and a keyboard skip link.

The mockup's unverified quote/metrics are replaced with an unattributed editorial
statement of direction. Project cards expand existing highlights instead of
linking to nonexistent case studies. LinkedIn is the contact destination.
There is no resume download or availability badge until supplied/confirmed.

## Content audit and outstanding review

Repository content is the baseline, not independent verification. The 2026 copy
retains its facts while separating future edits from 2025. Structural tests check
employment dates, companies, activity dates and social links across locales.
New interface copy is translated in all four languages; owner/native-speaker
editorial acceptance remains tracked in #31.

| Item | Mockup | Preview baseline / disposition |
| --- | --- | --- |
| SWAG.live | 2023–2025 | Repository says 2024–2024; retained pending owner confirmation. |
| foodpanda | 2021–2023 | Repository says 2022-03–2023-12; retained. |
| ViewSonic | 2018–2021 | Repository says 2021–2022; retained. |
| Current role | Frontend/Web Architect | Existing localized Principal Web Architect wording retained. |
| Experience | Both 14+ and 15+ | Omitted; tenure counting and gaps need confirmation. |
| Project/company counts | 10+ / 4 | Omitted; definitions and evidence absent. |
| Availability | Open to opportunities | Omitted; not confirmed. |
| Quote | Attributed to Nelson | Omitted as a quote; no claim of prior authorship. |
| Portrait | Photorealistic hero image | Existing GitHub avatar served locally. |
| Interests | Swimming, family, travel | Omitted; not established by repository data. |
| Resume / case studies | Download and action links | Omitted or replaced with native content disclosures. |
| Career start | Since 2010 | Earliest existing role remains visible in full history; no continuous-tenure claim. |

#30 tracks factual confirmation. Original titles and project descriptions still
need the owner's evidence review before promotion. This preview introduces no
new performance numbers, employers, employment periods or credentials.

## Asset provenance

- `public/profile/2026/portrait.png`: existing public avatar downloaded from
  `https://github.com/nelson-o.png?size=800` on 2026-09-19; 361×361 pixels. No generated
  portrait or identity alteration. Its illustrative appearance is intentional.
- `mountains.svg`, `waves.svg`, `grid.svg`, `signals.svg`: original decorative
  vector artwork created for this implementation; no factual information.
- UI icons: original inline SVG strokes. Existing GitHub/LinkedIn icons are reused.
- Employer names use text rather than unverified logo files.

A supplied real hero photograph, approved employer marks and verified case-study
URLs can be added in a follow-up under #35 without blocking the usable preview.

## Release and rollback

Do not promote while #30 (facts), #31 (editorial acceptance) or release review
findings remain unresolved. Promotion is tracked separately in #39.

After acceptance, change `activeProfileVersion` in `lib/profile-versions.ts` to
`2026` and update the test asserting the default edition. The shared renderer,
preview label, robots metadata, canonical URLs and sitemap paths derive from that
constant. Run the full verification set and review both year routes and the alias.
Revert that constant and its default-edition test to roll back; neither year URL
is deleted. A promotion requires a production rebuild and deployment.

The small ESLint ignore addition excludes existing `.worktrees/` checkouts and
their generated bundles from the repository lint run. No worktree was modified.

## Verification

Required: `bun run test`, `bun run typecheck`, `bun run lint`, `bun run build`,
`bun run test:e2e:preview`. Browser coverage includes edition equivalence,
metadata, 404s, year-preserving language changes, theme persistence/system changes,
keyboard disclosures, skip navigation, image loading and responsive widths
320/390/768/1280 in all four languages. Console route coverage includes both years.

Production smoke must run after this branch is deployed; a local preview cannot
establish that the new routes are already live on GitHub Pages.

### Implementation verification — 2026-09-19

- `bun run test`: 124 tests passed across 39 files.
- `bun run typecheck`: passed after regenerating stale Next route types.
- `bun run lint`: passed after excluding unrelated local worktrees.
- `bun run build`: passed; 148 generated pages, including eight explicit year routes.
- `E2E_PREVIEW_PORT=4362 bun run test:e2e:preview --workers=4`: 388 passed in Chromium
  and Firefox; includes console/network validation of 140 routes per browser.
- Chrome DevTools: no console errors or same-origin failures on the 2026 preview;
  unused-prefetch CSS warnings are informational. All inspected profile images,
  CSS, scripts and documents returned 200.
- Lighthouse: accessibility 100 and best practices 100 for desktop English dark
  and mobile Japanese light. The only failed audit was the intentional `noindex`
  preview policy (SEO 69).
- Responsive screenshots generated for all four locales and both themes at
  390/768/1280px; automated overflow checks also cover 320px.
- `bun run test:e2e:prod:smoke`: not run against the new implementation because it
  has not been merged/deployed. Remains a release gate in #38.

Initial checks exposed stale generated route types, lint traversal into ignored
worktrees, test assumptions about canonical trailing slashes/text normalization,
and Firefox's navigation-cancellation code. All were resolved before the final
passing run. No unrelated worktree content was modified.
