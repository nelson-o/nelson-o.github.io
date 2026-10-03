# Site Redesign: Landing and Entry Routes

Tracking: [#139](https://github.com/nelson-o/nelson-o.github.io/issues/139) (5.1),
part of Epic 5 [#138](https://github.com/nelson-o/nelson-o.github.io/issues/138).
Baseline: [`docs/reviews/site-redesign-baseline/`](../../docs/reviews/site-redesign-baseline/README.md) (#140).

## Status

**Draft. No block is approved yet.**

- The owner mockup (2026-09-28, landing, section and article routes in dark and
  light) is **not attached** to this spec or to #139 yet. This draft is written
  from the epic's description of that mockup.
- Values marked **provisional** (colours, sizes, cover ratio) must be checked
  against the mockup when it is attached. Structural decisions (routes, grid,
  component boundaries, content model) come from the epic's agreed boundaries.
- The owner records approval block by block in #139 comments, in this order:
  header → hero → tabs → rows → sidebar → footer → article. See
  [Approval](#approval).

## Summary

After Epic 5, the landing page, section indexes and article pages share one
layout: a header with a spaced `NELSON` wordmark, localized nav, a search slot
and a round theme button; a main column with a sidebar of about 300px on wide
screens; post rows with a cover, mono date, title, summary and tag chips; and a
footer with social links and back-to-top. Posts gain optional `tags`, `series`
and `cover` frontmatter, which power topic tabs, topic and series archives, and
the sidebar.

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
| `/<locale>/series/<id>/` | Posts in that series, in reading order | #150 |

- `digests` has no nav item. It is reached through the 隨手筆記 sidebar block
  (D7), `/<locale>/posts/` and its section index.
- **聯絡** is an in-page link to the footer's `id="contact"` block, so it needs
  no route and works on every page.
- The nav labels change; the section slugs do not. Proposed: section index
  headings follow the nav labels (工程, 專案, 想法) so the link text matches the
  page it opens, switching when #152 moves the section indexes (open
  question 2).
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
| `--color-surface-strong` | `#111a2e` | `#ffffff` | Sidebar blocks, cards, dialog |
| `--color-chip` (new) | `#1a2540` | `#eef2f8` | Tag chips, active tab |
| `--color-border` | `#24304a` | `#dfe5ee` | Dividers, row separators |
| `--color-text` | `#e6ebf5` | `#0f172a` | Titles, body |
| `--color-text-muted` | `#a3b0c6` | `#475569` | Summaries, secondary text |
| `--color-text-subtle` | `#8794ad` | `#5f6b7e` | Dates, captions, counts |
| `--color-accent` | `#5b9dff` | `#1f5fe0` | Links, eyebrow, active nav, focus |
| `--color-on-accent` (new) | `#0b1220` | `#ffffff` | Text on accent fills |
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
| on-accent on accent | 6.88 | 5.57 | 4.5 |
| chip-text on chip | 10.37 | 9.22 | 4.5 |
| accent on chip (active tab) | 5.58 | 4.96 | 4.5 |

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
| Pull quote (`--font-size-3xl`) | 28px | 22px | 500 |
| Row title (`--font-size-xl`) | 18px | 16px | 600 |
| Body (`--font-size-lg`) | 16px | 16px | 400 |
| Summary, sidebar (`--font-size-md`) | 14px | 14px | 400 |
| Chip, caption (`--font-size-sm`) | 13px | 13px | 500 |

- **Mono date:** `var(--font-mono)`, 13px, `font-variant-numeric: tabular-nums`,
  `--color-text-subtle`, ISO format `2026-10-02` in every locale, in a `<time>`
  element with `datetime`.
- **Eyebrow** (`LATEST`, section labels): mono, 12px, uppercase,
  `letter-spacing: 0.16em`, `--color-accent`. CJK eyebrows are not uppercased or
  letter-spaced.
- **Wordmark:** `NELSON`, 15px, weight 600, `letter-spacing: 0.32em`, the same
  in every locale. It is a link to `/<locale>/` with the accessible name of the
  site title.

### D4. Layout grid

- Container: `--max-width: 72rem`, centred.
- Side gutter: 16px below 640px, 24px from 640px, 32px from 1024px.
- **≥1024px:** two columns, `minmax(0, 1fr) 300px` with a 48px gap. The sidebar
  is an `<aside>` after `<main>` content in source order.
- **<1024px:** one column; the sidebar blocks stack after the main column.
- Articles at ≥1024px use the same grid: prose (`--prose-width: 44rem`) in the
  main column and a sticky TOC in the sidebar. Below 1024px the TOC becomes a
  closed `<details>` above the prose.
- No horizontal page scroll at 320px or wider. Tab rows scroll horizontally
  inside their own container instead.
- One `<main>` landmark per page (kept from #171).

### D5. Component inventory

| Block | Component | Issue | Contract |
| --- | --- | --- | --- |
| Header | `components/layout/site-shell.tsx` (rebuilt) | #145 | Wordmark, D1 nav with `aria-current="page"`, search slot button, round theme button (reuses `theme-toggle.tsx`). Below 768px the nav collapses into a disclosure menu. |
| Hero | `components/layout/landing-hero.tsx` (new) | #147 | `LATEST` eyebrow, the newest published post's title as an `h1` link, and its summary set as the pull quote. No new frontmatter field. No hero image, so the LCP element stays text. |
| Topic tabs | `components/ui/topic-tabs.tsx` (new) | #149 | A `<nav>` of links, not a JS tab widget: "All" plus the top 6 tags by post count, each linking to `/<locale>/topics/<tag>/`. The current page has `aria-current="page"`. No client JS. |
| Entry row | `components/ui/entry-row.tsx` (new, replaces `entry-card.tsx` use) | #148 | Cover (4:3, 160×120 at ≥640px, 96×72 below; provisional), mono date, title link, summary clamped to 2 lines, up to 3 tag chips, trailing arrow. The whole row is one link target via the title link; chips are separate links. Covers use explicit `width`/`height` and `loading="lazy"` except the first row. |
| Sidebar | `components/layout/site-sidebar.tsx` (new) | #151 | Three blocks, each a `<section>` with an `h2`: 熱門主題 (top 8 tags as chips), 系列文章 (series with post counts), 隨手筆記 (latest 5 digests, D7). |
| Footer | `components/layout/site-footer.tsx` (new) | #146 | `id="contact"`, GitHub and LinkedIn icon links with accessible names, back-to-top link to `#top` (no JS), the current GitHub Pages line. |
| Article header | `components/layout/article-header.tsx` (new) | #153 | Section breadcrumb, title `h1`, mono date, tag chips, series banner, cover. |
| TOC | `components/ui/article-toc.tsx` (new) | #153 | Built at build time from `h2`/`h3` ids. Hidden when the article has fewer than 3 headings. |
| Series banner | inside article header | #153 | "Part n of m" with a link to `/<locale>/series/<id>/`. |
| Prev/next | `components/ui/article-pager.tsx` (new) | #153 | Within the series when the post has one, otherwise within its section by date. |
| More posts | inside the landing post list | #148 | Link to `/<locale>/posts/` after the first 10 rows. |
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
  sidebar block, the `digests` index heading and the `/posts/` filter use this
  label; the URL stays `/<locale>/digests/`.
- The sidebar block lists the 5 newest published digests (mono date and title)
  and links to `/<locale>/digests/`.

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

## Open Questions for the Owner

1. Does the mockup's `LATEST` eyebrow stay English in every locale, or is it
   localized (最新, 最新, 最新, Latest)? This draft keeps `LATEST` visible and
   localizes only the accessible name.
2. Should the section index headings switch to the new nav labels (D1), or
   keep 系統, 工作, 觀點 with only the nav renamed?
3. Is 4:3 the mockup's cover ratio, and does the cover show on mobile rows?
4. Is "top 6 tags" right for the landing tabs, and "top 8" for 熱門主題?

## Approval

The owner approves each block in a #139 comment. Record the comment link here
when it lands. A block can be implemented once it is approved; colour and type
values also need the mockup check.

| Block | Decisions | Status |
| --- | --- | --- |
| Header | D1, D2, D3, D5 Header | Pending |
| Hero | D3, D5 Hero, open question 1 | Pending |
| Tabs | D5 Topic tabs, D6, open question 4 | Pending |
| Rows | D3, D5 Entry row, open question 3 | Pending |
| Sidebar | D4, D5 Sidebar, D6, D7 | Pending |
| Footer | D5 Footer | Pending |
| Article | D4, D5 Article header to Prev/next | Pending |

## Acceptance Criteria

- The mockup is attached to this spec or to #139, and every provisional value
  is confirmed or corrected against it.
- Each block in [Approval](#approval) links an owner approval comment.
- The open questions are answered, and the answers are folded into the
  decisions above.
- Later Epic 5 issues cite the decision they implement (for example
  "implements D5 Entry row").
- Documentation-only change: the rendered markdown is reviewed. No build is
  required.
