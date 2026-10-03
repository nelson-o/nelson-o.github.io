# Site Redesign: Landing and Entry Routes

Tracking: [#139](https://github.com/nelson-o/nelson-o.github.io/issues/139) (5.1),
part of Epic 5 [#138](https://github.com/nelson-o/nelson-o.github.io/issues/138).
Baseline: [`docs/reviews/site-redesign-baseline/`](../../docs/reviews/site-redesign-baseline/README.md) (#140).

## Status

**All seven blocks approved by the owner on 2026-10-04** ([#139 comment](https://github.com/nelson-o/nelson-o.github.io/issues/139#issuecomment-5971105715)).
The mockup image and the hero copy in zh-tw, zh-cn and ja are still to come.

- The owner shared the mockup on 2026-10-03: the landing page, the Engineering
  section index and an article page, each in dark and light. This spec now
  follows it. Where the mockup differs from the epic's text, the mockup wins
  unless the owner has decided otherwise; each difference is listed in
  [Mockup Reconciliation](#mockup-reconciliation).
- The mockup image is not yet attached to #139. It is a single composite image;
  its sample posts, tags and series are placeholders, not content decisions.
- Colours and sizes were read by eye from a downscaled copy of the mockup.
  They are **provisional** until checked against the source file.

## Summary

After Epic 5, the landing page, section indexes and article pages share one
header and footer. The header has the `NELSON` wordmark, localized nav, a search
slot and a round theme button. The landing page has a tagline hero with an
image, tabs, post rows (cover, mono date, title, summary, tag chips) and a
sidebar of about 300px on wide screens. Posts gain optional `tags`, `series`
and `cover` frontmatter, which power Popular topics, the Series block, and the
topic and series archives.

## Decisions

### D1. Information architecture

Sections and URLs stay as they are: `systems`, `work`, `ideas`, `digests` at
`/<locale>/<section>/<slug>/`. New routes are additive only.

| Nav (zh-tw) | en | zh-cn | ja | Target |
| --- | --- | --- | --- | --- |
| 關於 | About | 关于 | プロフィール | `/<locale>/profile/` |
| 工程 | Engineering | 工程 | エンジニアリング | `/<locale>/systems/` |
| 專案 | Projects | 项目 | プロジェクト | `/<locale>/work/` |
| 文章 | Posts | 文章 | 記事 | `/<locale>/posts/` (new, all posts) |
| 想法 | Ideas | 想法 | アイデア | `/<locale>/ideas/` |
| 聯絡 | Contact | 联系 | 連絡先 | `#contact` (footer, same page) |

New routes, all statically generated per locale:

| Route | Content | Issue |
| --- | --- | --- |
| `/<locale>/posts/` | Every published post, newest first | #150 |
| `/<locale>/topics/` | Every tag with its post count | #150 |
| `/<locale>/topics/<tag>/` | Posts with that tag, newest first | #150 |
| `/<locale>/series/` | Every series with its post count ("View all series") | #150 |
| `/<locale>/series/<id>/` | Posts in that series, in reading order | #150 |

- `digests` has no nav item. It is reached through the landing page's Digests
  tab (D5), `/<locale>/posts/` and its section index.
- The footer repeats a shorter nav: About, Projects, Posts, Ideas, Contact.
- **聯絡** is an in-page link to the footer's `id="contact"` block, so it needs
  no route and works on every page.
- The nav labels change; the section slugs do not. Section index headings
  follow the nav labels (工程, 專案, 想法) so the link text matches the page it
  opens. They switch when #152 moves the section indexes (owner, 2026-10-03).
- The 2026 profile keeps its own frame and is out of scope. The 關於 link opens
  the active edition at `/<locale>/profile/`.
- Locales: en, zh-tw, zh-cn and ja. Topic and series pages exist only for tags
  and series that have at least one published post in that locale.

### D2. Colour tokens (provisional values)

One blue accent replaces the four section accents in site chrome. Existing
variable names in `app/globals.css` are kept where they mean the same thing, so
5.5 (#143) changes values rather than call sites.

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--color-bg` | `#0b1220` (navy) | `#fbfcfe` (near-white) | Page background |
| `--color-surface-strong` | `#111a2e` | `#ffffff` | Search dialog, menus |
| `--color-panel` (new) | `#111a2e` | `#f1f4f9` | Sidebar blocks, tab bar, search field |
| `--color-chip` (new) | `#1a2540` | `#e4e9f1` | Neutral chips (Popular topics) |
| `--color-chip-tag` (new) | `#16264a` | `#e8effc` | Tag chips on rows (accent text) |
| `--color-border` | `#24304a` | `#dfe5ee` | Dividers, row separators |
| `--color-text` | `#e6ebf5` | `#0f172a` | Titles, body |
| `--color-text-muted` | `#a3b0c6` | `#475569` | Summaries, secondary text |
| `--color-text-subtle` | `#8794ad` | `#5f6b7e` | Dates, captions, counts |
| `--color-accent` | `#5b9dff` | `#1f5fe0` | Links, active nav and tab, tag text, focus |
| `--color-accent-fill` (new) | `#2563eb` | `#1f5fe0` | Primary button fill |
| `--color-on-accent` (new) | `#ffffff` | `#ffffff` | Text on accent fills |
| `--color-chip-text` (new) | `#c9d6ee` | `#334155` | Chip labels |

WCAG AA contrast pairs, computed with the WCAG 2.x relative-luminance formula:

| Pair | Dark | Light | Requirement |
| --- | ---: | ---: | --- |
| text on bg | 15.66 | 17.39 | 4.5 |
| text on surface | 14.51 | 17.85 | 4.5 |
| muted on bg | 8.54 | 7.38 | 4.5 |
| muted on surface | 7.91 | 7.58 | 4.5 |
| subtle on bg | 6.12 | 5.26 | 4.5 |
| subtle on surface | 5.67 | 5.40 | 4.5 |
| accent on bg | 6.88 | 5.42 | 4.5 (text), 3 (focus ring) |
| accent on surface | 6.37 | 5.57 | 4.5 |
| muted on panel | 7.91 | 6.87 | 4.5 |
| subtle on panel | 5.67 | 4.90 | 4.5 |
| accent on panel | 6.37 | 5.05 | 4.5 |
| on-accent on accent-fill | 5.17 | 5.57 | 4.5 |
| accent-fill against bg | 3.62 | 5.42 | 3 (button boundary) |
| chip-text on chip | 10.37 | 8.49 | 4.5 |
| accent on chip-tag | 5.47 | 4.82 | 4.5 |

- The mockup's dark primary button looks brighter (about `#3b82f6`), but white
  text on it reaches only 3.68:1, so the fill is darkened to `#2563eb`.
- Borders (1.42 dark, 1.23 light) are decorative separators. Interactive
  controls must not rely on them: the theme button, search button and tabs
  also carry a filled or text state that meets 3:1.
- `--section-*` colours stop being used by new components. They stay defined
  until the old section cards are removed in #152, then 5.5's follow-up deletes
  them and their `[data-section]` rules.
- `docs/design-tokens.json` and its test (`lib/design-tokens.test.ts`) are
  updated in the same PR as `app/globals.css`.

### D3. Typography (provisional sizes)

- No new web fonts. The Latin stack stays `var(--font-sans)` and
  `var(--font-mono)`; the landing JS and font budget (baseline + 10KB gzip)
  leaves no room for a CJK font download.
- CJK stacks are set with `:lang()` rules in `app/globals.css`, Latin first so
  embedded English and code keep the Latin face. 5.5 (#143) splits today's
  `--font-sans` into its Latin families (`--font-sans-latin`) and the generic
  fallbacks:

```css
:lang(zh-TW) { --font-cjk: "PingFang TC", "Noto Sans TC", "Microsoft JhengHei"; }
:lang(zh-CN) { --font-cjk: "PingFang SC", "Noto Sans SC", "Microsoft YaHei"; }
:lang(ja)    { --font-cjk: "Hiragino Sans", "Noto Sans JP", "Yu Gothic"; }
body { font-family: var(--font-sans-latin), var(--font-cjk, sans-serif), sans-serif; }
```

- CJK body text uses line-height 1.75; Latin keeps 1.6. Headings keep 1.25 in
  every locale.
- Scale (existing tokens kept, two added):

| Role | Size (≥1024px) | Size (<640px) | Weight |
| --- | --- | --- | --- |
| Hero title (`--font-size-5xl`, new) | 44px | 30px | 700 |
| Page title (`--font-size-4xl`) | 36px | 28px | 700 |
| Hero subtitle (`--font-size-lg`) | 16px | 16px | 400 |
| Hero image quote (`--font-size-md`) | 14px | 13px | 400 |
| Row title (`--font-size-xl`) | 18px | 16px | 600 |
| Body (`--font-size-lg`) | 16px | 16px | 400 |
| Summary, sidebar (`--font-size-md`) | 14px | 14px | 400 |
| Chip, caption (`--font-size-sm`) | 13px | 13px | 500 |

- **Mono date:** `var(--font-mono)`, 13px, `font-variant-numeric: tabular-nums`,
  `--color-text-subtle`, ISO format `2026-10-02` in every locale, in a `<time>`
  element with `datetime`.
- **Latest tab label is localized** (owner, 2026-10-03), from `lib/i18n-*.ts`:
  Latest (en), 最新 (zh-tw), 最新 (zh-cn), 最新 (ja). The mockup has no eyebrow
  above the hero; "Latest" appears only as the first tab.
- **Wordmark:** `NELSON`, 20px, weight 500, `letter-spacing: 0.12em`, the same
  in every locale. It is a link to `/<locale>/` with the accessible name of the
  site title.

### D4. Layout grid

- Container: `--max-width: 72rem`, centred.
- Side gutter: 16px below 640px, 24px from 640px, 32px from 1024px.
- **≥1024px:** two columns, `minmax(0, 1fr) 300px` with a 48px gap. The sidebar
  is an `<aside>` after `<main>` content in source order.
- **<1024px:** one column; the sidebar blocks stack after the main column.
- **Section indexes** are one column with no sidebar, as in the mockup: page
  title, one-line description, then rows.
- Articles at ≥1024px use the same grid: prose (`--prose-width: 44rem`) in the
  main column and a sticky TOC in the sidebar. Below 1024px the TOC becomes a
  closed `<details>` above the prose. The mockup crop does not show the TOC;
  it stays because #153 requires it.
- No horizontal page scroll at 320px or wider. Tab rows scroll horizontally
  inside their own container instead.
- One `<main>` landmark per page (kept from #171).

### D5. Component inventory

| Block | Component | Issue | Contract |
| --- | --- | --- | --- |
| Header | `components/layout/site-shell.tsx` (rebuilt) | #145 | Wordmark, D1 nav with `aria-current="page"` (accent text), search slot, round theme button with a sun or moon icon (reuses `theme-toggle.tsx`). At ≥1024px on the landing and section pages the search slot looks like a field ("Search posts…" on `--color-panel`); it is a button that opens the dialog. On articles and below 1024px it is an icon button. Below 768px the nav collapses into a disclosure menu. |
| Hero | `components/layout/landing-hero.tsx` (new) | #147 | Left: a localized three-line tagline as `h1` ("Build systems. Ship ideas. Document the journey."), a one-line subtitle, a primary button "Explore posts" (`/<locale>/posts/`) and an outlined "Learn more" (`/<locale>/profile/`). Right: a landscape image with a short quote over its lower edge ("A quieter web, a brighter tomorrow."). Below 768px the image stacks under the text. The image is the likely LCP element, so it is served at its display size as WebP/AVIF, eager, `fetchpriority="high"`, with explicit `width`/`height`. |
| Tabs | `components/ui/landing-tabs.tsx` (new) | #149 | A row of links on a `--color-panel` bar, active tab underlined in the accent: Latest, Engineering, Projects, Ideas, Digests (owner, 2026-10-04; see Mockup Reconciliation 1). Links, not a JS tab widget; the current one has `aria-current="page"`. No client JS. |
| Entry row | `components/ui/entry-row.tsx` (new, replaces `entry-card.tsx` use) | #148 | Cover at `aspect-ratio: 1 / 0.618` (owner, 2026-10-03): 160×99 at ≥640px and 112×69 below; covers show on mobile too. Then mono date, title link, one-line summary, and up to 3 tag chips (`#tag`, accent text on `--color-chip-tag`). No trailing arrow (none in the mockup). Rows are separated by a border. Covers use explicit `width`/`height` and `loading="lazy"` except the first row. Section indexes use the same row without chips. |
| Sidebar | `components/layout/site-sidebar.tsx` (new) | #151 | Three `--color-panel` blocks, each a `<section>` with an `h2`: **About** (two-line intro and "Learn more →" to the profile); **Popular topics** (top 4 tags as neutral chips with counts, `#tag (n)`; owner, 2026-10-03); **Series** (each series with an icon and post count, then "View all series →" to `/<locale>/series/`). |
| Footer | `components/layout/site-footer.tsx` (new) | #146 | `id="contact"`. Left: wordmark and tagline ("Build a kinder internet."). Middle: GitHub, LinkedIn and RSS icon links with accessible names; the RSS icon appears only once #158 ships feeds. Right: the short footer nav (D1) and a round back-to-top link to `#top` (no JS). |
| Article header | `components/layout/article-header.tsx` (new) | #153 | Section pill (accent text on `--color-chip-tag`, links to the section) and mono date on one line, title `h1`, the summary as a dek, then a full-width cover banner. Tag chips and the series banner sit under the dek; the mockup does not show them. |
| TOC | `components/ui/article-toc.tsx` (new) | #153 | Built at build time from `h2`/`h3` ids. Hidden when the article has fewer than 3 headings. |
| Series banner | inside article header | #153 | "Part n of m" with a link to `/<locale>/series/<id>/`. |
| Prev/next | `components/ui/article-pager.tsx` (new) | #153 | Within the series when the post has one, otherwise within its section by date. |
| More posts | inside the landing post list | #148 | Link to `/<locale>/posts/` after the first 10 rows (the mockup does not show it; kept from the epic). |
| Search | header slot, lazy dialog | #154 | Code and index load only when search opens. |

Shared rules:

- Server components by default. Client code is limited to the theme button,
  the mobile nav disclosure and the search dialog.
- Every new component gets a CSS Module; `app/globals.css` gains tokens and
  `:lang()` rules only.
- All visible strings come from `lib/i18n-*.ts`.

### D6. Tags and series

Frontmatter (validated in `lib/mdx/content-frontmatter.ts` by #141):

```yaml
tags: [agents, code-review]   # optional, 1–3 ids from the registry
series: agentic-delivery      # optional, one id from the registry
cover: ./cover.webp           # optional; otherwise a fallback cover (#144)
```

- Tag and series ids are lowercase kebab-case ASCII, defined in one registry
  module (`lib/taxonomy.ts`, #141) with labels for all four locales. An unknown
  id fails the build.
- Series order is ascending `date`, then slug. No part numbers in frontmatter.
- Translations of one post carry the same `tags` and `series`; the locale
  parity test checks this.

Initial tag vocabulary (5.4, #142, assigns them):

| Id | zh-tw | en | zh-cn | ja |
| --- | --- | --- | --- | --- |
| `agents` | AI Agent | AI agents | AI Agent | AIエージェント |
| `code-review` | 程式碼審查 | Code review | 代码审查 | コードレビュー |
| `platform` | 平台工程 | Platform engineering | 平台工程 | プラットフォームエンジニアリング |
| `delivery` | 交付與 CI | Delivery and CI | 交付与 CI | デリバリーとCI |
| `observability` | 可觀測性 | Observability | 可观测性 | オブザーバビリティ |
| `web-infra` | 網頁基礎設施 | Web infrastructure | 网页基础设施 | Webインフラ |
| `devices` | 裝置與即時資料 | Devices and real-time data | 设备与实时数据 | デバイスとリアルタイムデータ |
| `teams` | 團隊與領導 | Teams and leadership | 团队与领导 | チームとリーダーシップ |

Initial series:

| Id | zh-tw | en | zh-cn | ja | Posts (by slug) |
| --- | --- | --- | --- | --- | --- |
| `agentic-delivery` | Agent 交付實務 | Agentic delivery | Agent 交付实务 | エージェント開発の実践 | `250610-agentic-delivery-loop`, `agent-loops`, `260506-codex-goal-primitive-shift`, `260511-code-review-context-engineering`, `260727-developer-role-after-code-abundance`, `261002-reviewing-agent-written-ui` (en draft; joins when published) |
| `device-frontend` | 裝置前端 | Frontend for devices | 设备前端 | デバイスのフロントエンド | `160901-cloud-interfaces-moving-assets`, `180615-event-pipelines-ux-infrastructure`, `181119-configuration-uis-distributed-systems`, `190920-frontend-edge-of-hardware`, `191002-device-status-product-surface` |

Unpublished posts (`published: false`) keep their tags but are excluded from
counts, archives and series navigation.

### D7. Quick notes (隨手筆記)

- 隨手筆記 **is** the `digests` section. No new section, folder or route.
- Labels: 隨手筆記 (zh-tw), Quick notes (en), 随手笔记 (zh-cn), メモ (ja). The
  Digests tab, the `digests` index heading and the `/posts/` filter use this
  label; the URL stays `/<locale>/digests/`. (The mockup's tab reads "Digsts",
  a typo.)
- The mockup has no 隨手筆記 sidebar block (see Mockup Reconciliation 2).

### D8. Out of scope

- The 2026 profile and its frame.
- Changing section slugs, entry URLs or the `content/<locale>/<section>/`
  layout.
- Locales beyond en, zh-tw, zh-cn and ja.
- Comments, analytics and consent behaviour (owned by #159 and #160).
- RSS feeds (#158) and the root redirect for ja and zh-cn (#157).

## Implementation Notes

- Static export only: every new route uses `generateStaticParams`, with no API
  routes or runtime server behaviour. Images stay unoptimized.
- Shell and article work (#145, #146, #153) starts after the privacy changes
  merge, since they edit `site-shell.tsx`, `article-page.tsx` and
  `app/layout.tsx`.
- Performance budgets, measured on the production export at mobile settings
  and compared by #156 against the #140 baseline:
  - LCP ≤2.5s, CLS ≤0.1, INP ≤200ms.
  - Landing JS ≤ baseline + 10KB gzip.
  - Search code and its index load only when search opens.
- Covers and fallback art are generated at build time (#144) and sized so the
  rows reserve space before load (no CLS).
- Each implementation PR runs `bun run test`, `bun run typecheck`,
  `bun run lint` and `bun run build`, plus the relevant
  `bun run test:e2e:preview`, and posts before/after screenshots at 1280px and
  390px, light and dark, zh-tw and en.

## Owner Answers (2026-10-03)

Folded into the decisions above:

1. The Latest label is localized through i18n (D3).
2. Section index headings switch to the new nav labels (D1).
3. Covers use a 1 : 0.618 ratio and show on mobile (D5 Entry row).
4. Popular topics shows the top 4 tags (D5 Sidebar). The landing tabs answer
   (top 3 tags) was superseded on 2026-10-04 by section tabs: see Mockup
   Reconciliation 1.

## Mockup Reconciliation

Where the mockup differs from the epic's text:

1. **Tabs are sections, not tags.** The mockup's tabs are Latest, Engineering,
   Projects, Ideas, Digests. The epic said tabs run on tags, and the owner
   answered "top 3 tags". **Decided (owner, 2026-10-04): Latest plus the four
   sections**, as in the mockup. Tags are surfaced through Popular topics and
   the topic routes.
2. **No 隨手筆記 sidebar block.** The mockup's sidebar is About, Popular topics
   and Series. **Decided (owner, 2026-10-04):** no 隨手筆記 block; quick notes
   are reached through the Digests tab.
3. **Hero is a fixed tagline with an image**, not the latest post with a pull
   quote. This adds an LCP image, which #156 must measure against the 2.5s
   budget. The tagline, subtitle and quote need zh-tw, zh-cn and ja copy from
   the owner.
4. **About block** in the sidebar and **"View all series"** are new; the second
   adds the `/<locale>/series/` route (D1).
5. **RSS icon** in the footer depends on #158.
6. **Not shown in the mockup**, kept from the epic: TOC, series banner,
   prev/next, the "more posts" link and article tag chips.

## Approval

Approve one block at a time with a comment on #139. Each block is a region of
the page in the mockup plus the spec rules for it. Open the mockup next to the
spec section and check the points listed. A comment such as
`Approve: Header` is enough, or `Approve: Tabs with changes: …`.

| Block | Where in the mockup | Spec | Check | Status |
| --- | --- | --- | --- | --- |
| Header | Top bar of every page | D1, D2, D3, D5 Header | Nav labels and targets, search field vs icon, theme button, mobile menu | [Approved 2026-10-04](https://github.com/nelson-o/nelson-o.github.io/issues/139#issuecomment-5971105715) |
| Hero | Landing, top: tagline, buttons, image | D3, D5 Hero, Reconciliation 3 | Tagline copy per locale, button targets, image and quote, stacking on mobile | [Approved 2026-10-04](https://github.com/nelson-o/nelson-o.github.io/issues/139#issuecomment-5971105715) |
| Tabs | Landing, row above the posts | D3, D5 Tabs, Reconciliation 1 | Sections (a) or tags (b), localized Latest label | [Approved 2026-10-04](https://github.com/nelson-o/nelson-o.github.io/issues/139#issuecomment-5971105715) |
| Rows | Landing post list; section index rows | D3, D5 Entry row, D4 section indexes | 1:0.618 cover, date, summary, `#tag` chips, no arrow | [Approved 2026-10-04](https://github.com/nelson-o/nelson-o.github.io/issues/139#issuecomment-5971105715) |
| Sidebar | Landing, right column | D4, D5 Sidebar, D6, D7, Reconciliation 2 | About, Popular topics (4), Series, no 隨手筆記 block | [Approved 2026-10-04](https://github.com/nelson-o/nelson-o.github.io/issues/139#issuecomment-5971105715) |
| Footer | Bottom bar | D5 Footer, Reconciliation 5 | Tagline, icons, RSS after #158, footer nav, back-to-top | [Approved 2026-10-04](https://github.com/nelson-o/nelson-o.github.io/issues/139#issuecomment-5971105715) |
| Article | Article page header and cover | D4, D5 Article header to Prev/next, Reconciliation 6 | Section pill, date, dek, cover banner, TOC and series parts not in the mockup | [Approved 2026-10-04](https://github.com/nelson-o/nelson-o.github.io/issues/139#issuecomment-5971105715) |

Colour and type values (D2, D3) were approved with the Header block. They
are re-checked against the source file once it is attached; any change goes
back to the owner.

## Acceptance Criteria

- The mockup image is attached to #139, and every provisional value is
  confirmed or corrected against the source file.
- The hero copy exists for all four locales.
- ~~Mockup Reconciliation items 1 and 2 have an owner decision.~~ Done
  2026-10-04.
- ~~Each block in [Approval](#approval) links an owner approval comment.~~ Done
  2026-10-04.
- Later Epic 5 issues cite the decision they implement (for example
  "implements D5 Entry row").
- Documentation-only change: the rendered markdown is reviewed. No build is
  required.
