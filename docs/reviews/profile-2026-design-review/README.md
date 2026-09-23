# Profile 2026 — design review, section by section

Tracking: [#82](https://github.com/nelson-o/nelson-o.github.io/issues/82) ·
Epic [#81](https://github.com/nelson-o/nelson-o.github.io/issues/81) ·
Top epic [#42](https://github.com/nelson-o/nelson-o.github.io/issues/42)

Reviewed 2026-09-23 against `main` at `864dbae`
("fix: stop the skip link ringing the whole profile landmark (#96)").

## What this document is

#82 asks for reviewable designs per section before implementation proceeds.
The design artifacts its body referenced — `docs/design/profile-2026/header-hero.html`
and `docs/design/profile-2026/review.md` — were prepared locally and never
committed; they are absent from every branch in this repository. Meanwhile the
sections they were meant to propose have already been implemented and merged
(#76, #77, #78, #79, #80, #91, #92, #94, #95, #96).

So this review inverts the original plan. Rather than propose designs against a
blank page, it inventories **the implementation as merged**, names the gaps per
block, and hands each gap to its downstream issue. The per-block owner decisions
#82 requires are still outstanding; nothing below is an approval.

**No block is approved by this document.** Each section ends with an explicit
decision the owner still has to make.

## Summary of findings

| # | Block | Finding | Severity | Goes to |
| --- | --- | --- | --- | --- |
| 1 | Experience / approach | Unverified mockup metrics (`15+`, `10+`, `4`) ship as fact, contradicting the recorded content audit | **Blocker** | #69, #86 |
| 2 | Experience / approach | The editorial statement is attributed `— NELSON`, reversing a recorded decision | **Blocker** | #69 |
| 3 | Contact / footer | View options are still in the header; footer has none | Gap | #84 |
| 4 | Header / hero | Hero degrades visibly with JavaScript disabled | Defect | #83 |
| 5 | Experience | Employer marks have no recorded provenance and no light variant | Gap | #86 |
| 6 | Projects | Category labels and card artwork are positional, not data-driven | Fragility | #87 |
| 7 | All | Long-translation headroom is reserved with fixed pixel values | Fragility | #85 |
| 8 | All | No `::selection` treatment; nav has no current-section feedback | Gap | #87, #88 |
| 9 | Contact | The contact heading is baked artwork, not text | Gap | #88 |
| 10 | Header / hero, experience | Light theme leaks hardcoded dark-palette colours | Polish | #83 |

Findings 1 and 2 are the only ones that gate release. They are content-accuracy
regressions, not styling, and they are live in the deployed preview today.

---

## 1. Header and hero

`components/layout/profile-2026/header.tsx`, `hero.tsx`, `hero-tagline.tsx`

### As built

A non-sticky flex header: `NELSON` wordmark, five in-page anchors, theme toggle.
The hero is a two-column composition — a 46% copy column over an absolutely
positioned portrait panel inset from 30%, with a narrow artwork rail at the
right carrying the localized tagline, four topic words, and `Since 2010`.
English and both Chinese locales get a stroke-reveal WebM tagline at 3× playback
with a still-image fallback; Japanese gets the still directly
(`lib/profile-2026-assets.ts:14`).

### Gaps

**Finding 4 — the hero degrades visibly without JavaScript.** `Defect.`
The theme class is applied by a blocking inline script (`app/layout.tsx:57`),
so `.theme-light` / `.theme-dark` is always present in a normal browser. But the
base state — no theme class — is internally inconsistent, and that is what
renders when scripting is off:

- `hero.module.css` sets `.visual { background: #0b1115 }` (dark) while
  `page.module.css` sets the *light* palette as the class-free default.
- `.lightPortrait { display: block }` is the base, so the **light** portrait
  paints over that **dark** panel.
- `.visual::after` fades `var(--profile-bg)` — white — across the dark panel.

The result is a light page with a dark rectangle behind a daylight portrait.
Every other section reads acceptably without the class; only the hero inverts.
The site as a whole has no `prefers-color-scheme` fallback anywhere in
`app/globals.css`, which is a pre-existing site-wide choice and out of scope
here — but the hero's breakage is specific to this section and fixable within it.

*Suggested resolution:* make the class-free base state match the light palette
the tokens already declare (dark panel under `.theme-dark`, not as the default),
so the no-JS rendering is merely unthemed rather than contradictory.

**Finding 7 — long-translation headroom is pixel-reserved.** `Fragility.`
`.copy { width: 46% }` is a fixed share, and `.nav { margin: 0 auto 0 120px }`
hardcodes the wordmark offset. The current four locales fit. German arrives in
#85, and German headline and nav strings run substantially longer than the
English they replace ("Build better web experiences." → a considerably longer
phrase; "About/Experience/Projects/Talks/Contact" likewise). The 761–1000px
band already drops `.hero h1` to a flat 38px to cope, which suggests the column
share is near its limit before German is added.

*Suggested resolution:* decide this before #85 lands, not after — either the copy
column becomes content-driven (`minmax`/`fit-content` rather than a percentage),
or #85 accepts a per-locale type-scale override. The first is preferable; the
second re-opens the light/dark parity rule in `docs/profile-2026.md` that says a
theme may not change typography, by introducing a *locale* axis that can.

**Finding 8a — the nav gives no current-section feedback.** `Gap.`
`header.tsx:14` renders five plain `<a href="#…">` anchors with no `aria-current`
and no active styling. The page is a single scrolling document with five landing
targets, so "where am I" is unanswered both visually and for assistive
technology. Belongs with #87 (restrained motion and interaction feedback).

**Finding 10a — light theme leaks dark-palette colours.** `Polish.`
`.tag { color: #bac8d3 }` is overridden under `.theme-light`, but
`.since::before { background: #78909f }` is not — the rule beside "Since 2010"
keeps its dark-theme blue-grey on white. Small, but it is exactly the class of
defect #83 exists to sweep.

### Decision required

- Accept the two-column hero proportions as the reference layout, or re-cut the
  copy column before German lands (#85).
- Accept or reject the no-JS rendering as shipped.

---

## 2. Capabilities

`components/layout/profile-2026/capabilities.tsx`

### As built

Three equal columns separated by hairline rules, each an icon plus title and
first highlight, bounded above and below by `border-block`. Collapses to a
single stacked column under 760px with the divider moving from left to top.

### Gaps

This is the most settled block on the page. Two notes, neither blocking:

- The section has no visible heading. Its accessible name comes from
  `dictionary.profilePage.capabilitiesTitle`, which is never rendered. That is a
  deliberate-looking choice consistent with the mockup, and it is defensible —
  but it means the three capability titles are `<h2>`s sitting directly under the
  hero `<h1>` with no grouping label a sighted reader can see.
- Icons are selected by `index % 3`, so a fourth capability would silently reuse
  the first icon. There are exactly three today. Same positional-coupling class
  as finding 6; lower stakes because the icons are decorative.

### Decision required

- Confirm the section stays visually unlabelled.

---

## 3. Experience and approach

`components/layout/profile-2026/experience.tsx`, `approach.tsx`

### As built

A 1.5fr/1fr split: a dotted-rule career timeline on the left, the mountain quote
panel on the right. The timeline shows the four most recent roles with year
ranges, an employer mark, company, title and summary; the remaining six roles sit
behind a `View full history` disclosure positioned absolutely at the heading's
right edge. The approach panel carries a three-line editorial statement over
mountain artwork, a four-word motto rail, and a four-cell statistics row.

### Gaps

**Finding 1 — unverified mockup metrics ship as fact.** `Blocker.`

`approach.tsx:18` hardcodes the statistics values:

```tsx
<dt>{label}</dt><dd>{["15+", "10+", "4", "∞"][index]}</dd>
```

against the labels `Years Experience`, `Projects Shaped`, `Major Companies`,
`Still Learning`. `docs/profile-2026.md` records the opposite disposition for
every one of these:

| Item | Mockup | Recorded disposition |
| --- | --- | --- |
| Experience | Both 14+ and 15+ | *Omitted; tenure counting and gaps need confirmation.* |
| Project/company counts | 10+ / 4 | *Omitted; definitions and evidence absent.* |

The repository data does not support the numbers as rendered:

- **`15+` years.** The earliest role is Elan Microelectronics, `2010-09`. Elapsed
  calendar time to today is sixteen years, but the data contains a gap of roughly
  two years nine months between `2012-01` and `2014-09`. Continuous employment
  across the listed roles is closer to thirteen years. "15+" is defensible only
  under a calendar-span reading that the doc explicitly flagged as needing
  confirmation.
- **`10+` projects shaped.** `data/profile/2026/nelson.json5` defines **three**
  projects. "10+" has no definition recorded anywhere and no visible support on
  the page.
- **`4` major companies.** The data holds ten roles across eight distinct
  employers. `4` matches exactly the number of entries in the `companyLogos` map
  in `experience.tsx:10` — that is, the count of employers for which a logo file
  happens to exist, which is not a criterion for "major".

`lib/profile-2026-approach.test.ts:15` asserts these exact strings, so the values
are locked in by a passing test. That makes this deliberate rather than
accidental — but the decision was never reflected back into
`docs/profile-2026.md`, and it reverses a gate that #53 and #69 were opened to
hold.

**Finding 2 — the editorial statement is attributed.** `Blocker.`

`approach.tsx:11` renders `<figcaption><span aria-hidden="true">— </span>NELSON</figcaption>`
beneath a `<blockquote>`. `docs/profile-2026.md` records:

| Quote | Attributed to Nelson | *Omitted as a quote; no claim of prior authorship.* |

and, in prose: *"The mockup's unverified quote/metrics are replaced with an
unattributed editorial statement of direction."* The current markup is a
`blockquote` with an attribution line — which is precisely the attributed quote
that decision removed. `lib/profile-2026-approach.test.ts:14` asserts
`NELSON</figcaption>`, again locking it in.

Both regressions entered in **#77** ("feat: refresh 2026 profile artwork and
mountain quote panel"), which reproduced the mockup's quote panel faithfully —
including the two elements the original implementation had deliberately dropped.
They are live on the deployed preview now.

*Suggested resolution:* one of —
1. **Revert to the recorded decision.** Drop the statistics row and the
   `figcaption`, keeping the editorial lines unattributed. Smallest change,
   restores the documented state, unblocks nothing else.
2. **Confirm and define.** The owner states the counting rule for each metric
   (calendar span vs. continuous tenure; what "project shaped" and "major
   company" mean), those definitions go into `docs/profile-2026.md`, and the
   attribution is confirmed as intended. Then the numbers stay and #69 records
   the confirmation.

Option 2 is the right one if the numbers are true; it just has not been done.
Either way `docs/profile-2026.md` must stop contradicting the page.

**Finding 5 — employer marks have no provenance and no light variant.** `Gap.`

Four raster logos live at `public/profile/2026/brands/{momo,swag,foodpanda,viewsonic}.png`.
Two problems:

- `docs/profile-2026.md` states *"Employer names use text rather than unverified
  logo files."* That is no longer true. `docs/profile-2026-assets.md` lists the
  `brands/` folder but records no origin for these files — unlike every other
  asset family, which carries explicit provenance and, where generated, the exact
  prompt. These are third-party marks; where they came from should be written down.
- Every other asset family ships `.light` / `.dark` variants under the stated rule
  that "light and dark are one layout with two palettes." The logos ship one
  raster each with no theme handling and no filter in `experience.module.css`.
  Whether they hold up on both grounds is unverified.

Also minor: `<Image … width={80} height={60}>` is declared for all four, but the
intrinsic sizes range from 558×242 to 458×378. `object-fit: contain` saves the
rendering, but the declared box reserves the wrong aspect ratio.

**Finding 5b — the empty mark column.** `Gap.`
`experience.tsx:22` renders the `.brand` wrapper unconditionally and the `<Image>`
only when a logo exists. Six of the ten roles have no logo, so they reserve an
empty 72px column (64px on mobile) — visible as a ragged gutter once
`View full history` is expanded.

**Finding 7b — the disclosure is pixel-fitted.** `Fragility.`
`.history summary` is absolutely positioned at the heading's right edge, and the
heading reserves space for it with `padding-right: 145px` (135px under 600px,
where the summary is further clamped to `max-width: 125px; font-size: 11px`).
The current strings fit inside that box. German (#85) is not guaranteed to, and
the failure mode is overlap rather than reflow.

**Finding 10b — hardcoded accent glow.** `Polish.`
`.timeline > li::before` uses `box-shadow: 0 0 12px #80cef525` in both themes —
that is the *dark* accent. In light theme the dot is `#0069ee` with a pale-blue
dark-theme halo.

**Timeline starting year.** #82 asks for the starting-year treatment. `Since 2010`
in the hero rail is supported by the Elan role at `2010-09` — but that role is
inside the collapsed disclosure, so the claim has no visible support until the
reader expands six roles. Worth a decision: either surface the span in the
timeline heading, or accept that the hero states it and the history proves it.

### Decision required

- **Findings 1 and 2: choose revert or confirm-and-define.** Nothing else in
  Epic 4 should merge ahead of this.
- Record brand-mark provenance, or drop the marks back to text.
- Accept or reject the empty mark column.

---

## 4. Projects and activities

`components/layout/profile-2026/projects.tsx`, `activities.tsx`

### As built

A 3fr/0.95fr split: a three-up project card grid on the left, the
`Beyond work` activities rail on the right. Each card carries a category
eyebrow, name, summary, and an `Explore the work` disclosure over a decorative
artwork background with a theme-specific overlay. Activities are four native
disclosures — talks, side projects, hackathons, certifications — with `+` / `−`
affordances.

### Gaps

**Finding 6 — category labels and artwork are positional.** `Fragility.`

```tsx
{profile.projects.map((project, index) => <article data-art={index % 3} …>
  <span className={styles.category}>{copy.categories[index % 3]}</span>
```

Both the label and the background art derive from array position, not from the
project. With exactly three projects this currently lands two of three sensibly —
`AI-Enhanced Developer Tooling` gets "Developer tools", `Observability-First Web
Platform` gets "Observability" — but the first, `AI Agent Spec Pipeline`, is
labelled "Platform", which is a coincidence of ordering rather than a description.
Add a fourth project or reorder the file and every label shifts silently, with no
test to catch it.

*Suggested resolution:* move `category` (and the art key) onto the project record
in `data/profile/2026/nelson*.json5`, translated alongside the rest of the entry.
This is a content-model change, so it needs explicit scope — `AGENTS.md` asks to
keep the content model lightweight unless the task expands it. Worth doing before
a fourth project exists rather than after.

**Activities rail.** No findings. The disclosure pattern, the 44px targets and the
`+` / `−` affordance are consistent with the rest of the page, and the rail
reflows to a full-width block with a top rule under 1050px.

### Decision required

- Approve moving project category and artwork selection into content data, or
  accept the positional coupling as a known constraint with a fixed project count.

---

## 5. Contact and footer

`components/layout/profile-2026/contact.tsx`, `footer.tsx`

### As built

The contact section is a wrapping flex row: a localized signature image as the
`<h2>`, two icon-only social links, and a pill CTA to LinkedIn. The footer is a
single rule-topped row — wordmark, current title, motto, and a link back to the
site.

### Gaps

**Finding 3 — view options are not in the footer.** `Gap.`
This is the substance of #84, and #82 lists "footer settings" as in scope for the
design. As built, `ThemeToggle` is rendered only in the header (`header.tsx:16`)
and `footer.tsx` contains no controls at all. The target arrangement — what moves
down, whether the header keeps a control, how language and theme sit together —
has not been designed. #84 cannot start from this.

**Finding 9 — the contact heading is baked artwork.** `Gap.`
`contact.tsx:17` puts a localized `signature.<locale>.webp` inside the `<h2>` with
no text alternative in the DOM beyond `alt={copy.manifesto.join(" ")}`. It reads
correctly to a screen reader and it is the most distinctive moment on the page, so
the intent is clear. The costs are real though: the heading does not reflow, does
not scale with user font settings, cannot be selected or translated in-browser,
and is the page's largest text rendered as pixels. Under #88 this deserves an
explicit accept-or-replace decision rather than inheritance.

Related: contact and the hero tagline both apply
`filter: invert(1) hue-rotate(180deg) saturate(1.5)` at runtime for the light
theme, while `docs/profile-2026-assets.md` states the project artwork moved to
asset-time light variants specifically so "the card background needs no runtime
filter." Two conventions coexist. Consistency here is cosmetic, but it should be
a choice.

**Finding 8b — no `::selection` treatment.** `Gap.`
There is no `::selection` rule in `app/globals.css` or in any profile-2026 module,
so selection falls back to the browser default — which on the dark theme's
`#0b1115` ground is the one place a default highlight is least likely to read
well. Named in #88; recorded here as confirmed absent.

**Focus and reduced motion — no findings.** Both are in good shape and should be
recorded as such rather than re-litigated downstream:

- `page.module.css` gives every interactive element a single
  `:focus-visible` treatment (`2px solid var(--profile-accent)`, `5px` offset),
  and the skip link resolves to a `tabIndex={-1}` main landmark whose own ring is
  suppressed so the outline does not box the whole region (#96).
- Reduced motion is handled in three places that agree: a blanket
  `transition: none !important; animation: none !important` for the page, a
  `@media (prefers-reduced-motion: reduce)` branch in `hero-tagline.module.css`,
  and live `matchMedia` handling in `hero-tagline.tsx:15` that tears the video
  source down rather than merely pausing it — including on a *change* to
  reduced-motion while the page is open, which is more than most implementations do.

### Decision required

- Design the footer's view-options arrangement before #84 starts.
- Accept the signature-as-heading, or commit to a text heading with the signature
  as decoration (#88).

---

## Recommended sequence

1. **Resolve findings 1 and 2** (#69). These are content-accuracy regressions
   against a recorded decision and they are live. Everything else can wait; this
   should not.
2. **Reconcile `docs/profile-2026.md`** with whatever that resolution is, so the
   audit table and the page stop disagreeing.
3. **Record brand-mark provenance** in `docs/profile-2026-assets.md` (#86), or
   revert to text marks.
4. **Design the footer view-options arrangement** (#84) — currently unstarted and
   unblocked by nothing.
5. **Decide the long-translation strategy** before German lands (#85): flexible
   copy column and disclosure, or per-locale type overrides.
6. **Sweep the light-theme leaks and add interaction feedback** (#83, #87, #88):
   hardcoded `#80cef525` / `#78909f`, `::selection`, nav `aria-current`.
7. **Move project category and art into content data** (#87), before a fourth
   project exists.

## Verification

Documentation only. Per `AGENTS.md`, documentation-only changes require manual
review of the affected markdown and no production build; no commands, hosting
rules or contribution policy meaning change here.

- Reviewed by reading the merged implementation at `672c026`: all nine section
  components and ten CSS Modules under `components/layout/profile-2026/`,
  `components/layout/profile-2026.tsx`, `lib/profile-2026-copy.ts`,
  `lib/profile-2026-assets.ts`, `lib/theme.ts`, `app/globals.css`,
  `app/layout.tsx`, `data/profile/2026/nelson.json5`,
  `lib/profile-2026-approach.test.ts`, and the four files in
  `public/profile/2026/brands/`. `git diff 672c026..864dbae` was reviewed so the
  findings reflect #95 and #96 as merged.
- No production build, test run or browser session was performed, and none is
  claimed. Findings 4, 5 and 10 are read from source and have **not** been
  confirmed in a rendered browser; findings 1, 2, 3, 6, 8 and 9 are established
  by the source and data alone.
- Findings 1 and 2 were cross-checked against `docs/profile-2026.md`, against
  `data/profile/2026/nelson.json5`, and against `git log -S` to establish that
  both entered in #77 and are present on `main`.

No approval is recorded by this document. Every block above remains open pending
the owner decisions named in its section.
