# Profile 2026 asset inventory

Production assets live in `public/profile/2026/`, grouped by their consuming
section. Names describe content, followed by optional `.light` / `.dark` or
language suffixes. Japanese uses `ja`; the supplied handwritten Chinese artwork
is intentionally shared by `zh-tw` and `zh-cn` as `zh`.

## Ownership and organization

| Folder | Assets | Consumer |
| --- | --- | --- |
| `hero/` | `portrait.{light,dark}.webp`, `tagline.{en,zh,ja,ko,th,vi,de}.webp`, `tagline.{en,zh}.webm` | Hero and animated taglines |
| `approach/` | `mountains.{light,dark}.webp` | Decorative quote-panel background |
| `projects/` | `{waves,developer-tools,signals}.{light,dark}.webp` | Decorative project-card backgrounds |
| `contact/` | `signature.{en,zh,ja,ko,th,vi,de}.webp` | Localized contact heading |
| `brands/` | `{momo,foodpanda,viewsonic}.png`, `{swag,ampos,lilee}.svg` | Experience timeline; see [Employer marks](#employer-marks-86) |
| `legacy/` | `avatar.jpg`, `{mountains,waves,grid,signals}.svg`, `footer-tagline.{en,zh,ja}.webp` | Retained prior assets; no current renderer references |

The former `hero.webp`, `div-mt.webp`, and `div-{a,b,c}.webp` map respectively to
`hero/portrait.dark.webp`, `approach/mountains.dark.webp`, and
`projects/{waves,developer-tools,signals}.dark.webp`. Existing artwork and logos
were moved without re-encoding. Original `hero-tag.*`, `signature.*`, and
`*-logo.png` names now follow the folders above. The existing English video
(formerly `public/profile/ideas-to-impact-small.webm`) is grouped with its fallback.
Historical review documents retain the paths used at the time of those reviews.

## Rendering and accessibility

- Page components and colocated CSS Modules live in
  `components/layout/profile-2026/`. The parent `profile-2026.tsx` composes sections.
- Header, hero, capabilities, experience, approach, projects, activities, contact,
  and footer own their markup and styles. Only section headings share a module;
  palette tokens and page-wide rules live in `page.module.css`.
- `lib/profile-2026-assets.ts` owns localized artwork mappings. Decorative CSS
  backgrounds are declared only in the owning section's CSS Module.
- Theme classes select the portrait and decorative artwork. Only one portrait
  is displayed and exposed to assistive technology at a time; both reserve the
  same frame and intrinsic dimensions. No new client theme state is introduced.
- Handwritten images retain their transparent backgrounds; the tagline videos
  have no alpha channel, so the tagline group blends their opaque background
  out of the page — screen in dark, multiply in light.
- Handwritten assets retain their transparent backgrounds. Light-mode CSS
  adapts their ink; dark originals remain visually unchanged. Tagline videos
  retain reduced-motion, unsupported-playback, and no-JavaScript fallbacks,
  falling back to the still artwork that the animation was drawn from.
- `lib/profile-2026-assets.ts` decides which locales have an animation. Japanese
  currently has none and renders its still artwork directly.
- Portrait and handwritten artwork have localized accessible descriptions;
  backgrounds and employer marks are decorative beside equivalent HTML text.

## Animated taglines

| Asset | Origin | Size | Bytes |
| --- | --- | --- | ---: |
| `hero/tagline.en.webm` | supplied handwriting animation | 312 × 234, 8s | 33,040 |
| `hero/tagline.zh.webm` | derived from `tagline.zh.webp` | 312 × 234, 8s | 85,512 |

`scripts/animate-hero-tagline.ts` (`bun run assets:tagline`) animates a still
tagline into the English video's shape: same 312 × 234 frame and 8s length, so
the hero's existing `playbackRate = 3` gives both the same pacing.

The script opens the artwork in headless Chromium, finds the baseline angle that
most cleanly separates the two handwritten lines, orders every ink pixel along
that baseline, and reveals them line by line with a soft leading edge — the
underline last, then a short hold on the finished artwork. Frames are recorded
from a canvas with `MediaRecorder` as VP9 at 24fps. Like the supplied English
video the result has no alpha channel, so it paints white strokes on the same
near-black ground and relies on the tagline group's blend.

Both Chinese locales share `tagline.zh.webm`, matching how they already share the
still `tagline.zh.webp`.

## Rendered handwriting

Only en/zh/ja have supplied handwriting. The profile-only languages (`ko`, `th`,
`vi`, `de`) use artwork from `scripts/render-handwritten-artwork.ts`
(`bun run assets:handwriting`), so no language falls back to plain live text.

The script sets the copy from `lib/profile-2026-copy-profile-only.ts` in an
open-licence (SIL OFL) handwriting typeface. Fonts load from Google Fonts in
headless Chromium, and only the rendered WebPs are committed:

| Locale | Typeface |
| --- | --- |
| `ko` | Nanum Pen Script |
| `th` | Sriracha |
| `vi`, `de` | Dancing Script 500 |

The composition matches the supplied artwork:

- The tagline is 580 × 435, two lines at −14°.
- The signature is 1120 × 373, two lines at −3°: the first manifesto line, then
  the other two joined.
- Both use pale ink on a transparent ground, with a tapered cyan brush underline
  below the second line's descenders. Light mode reuses the same CSS ink filter.
- Each image is set at the largest size whose ink stays 18px inside the frame,
  then encoded as WebP at quality 85, effort 6.

The script fails if the typeface is missing any glyph, or if a tagline's line
break no longer matches the copy. Re-run it whenever that copy changes. These
images are typeset, not Nelson's own handwriting, and have no stroke animation.

## Employer marks (#86)

Each mark is the one the employer serves on its own site, retrieved on
2026-09-26 and shipped unaltered, except where noted. `lib/profile-2026-assets.ts`
maps company names to files with their intrinsic sizes, and
`lib/profile-2026-employer-marks.test.ts` checks both. Marks are decorative
(`alt=""`, `aria-hidden`) beside the company name as text.

| File | Employer | Source | Size | Bytes | Notes |
| --- | --- | --- | --- | ---: | --- |
| `momo.png` | momoshop.tw | `https://corp.momo.com.tw/img/logo.png` (corporate site header) | 2000 × 388 | 30,835 | Unaltered. |
| `swag.svg` | SWAG.live | `https://swag.live/favicon.svg` | 64 × 64 | 18,163 | Unaltered. Owner chose the favicon badge; it reads on both themes. Replaces the earlier blocky wordmark, which was not SWAG's mark. |
| `viewsonic.png` | ViewSonic | `https://www.viewsonic.com/static/…/images/viewsonic-logo.svg` (site header) | 480 × 79 | 29,478 | Derived: the official SVG wraps a 4.3 MB bitmap, so it was rasterised at 480px wide on a transparent ground with no other change. |
| `ampos.svg` | Ampos HRM (AMPOS Solutions) | `https://www.ampostech.com/_app/immutable/assets/logo.8777a889.svg` (site header) | 140 × 34 | 3,731 | Unaltered. The current AMPOS mark; owner confirmed the employer on 2026-09-26. |
| `lilee.svg` | Lilee Systems | `https://www.lileesystems.com/wp-content/uploads/2021/11/LILEE-logo-color-version.svg` (site header) | 180 × 80.64 | 9,882 | Unaltered. |
| `foodpanda.png` | foodpanda | Owner-supplied in #75; origin unrecorded | 457 × 294 | 90,400 | Derived: the supplied 518 × 403 file cropped to its ink bounds (transparent margin only). Owner-approved exception on 2026-09-26: foodpanda.com and its logo page (`/foodpanda-logos/`) returned HTTP 403 to every retrieval route available. Replace it with the official file when one can be downloaded. |

No mark, text only:

- **Elan Microelectronics**: `emc.com.tw` returned HTTP 403 to every retrieval route.
- **Owlstand**: `owlstand.com` no longer resolves, and no official source remains.

Marks range from a square badge to 6:1 wordmarks, so `markDisplaySize` sizes
each to about the same visual area (1500 CSS px²) inside an 88 × 36 box instead
of fitting all of them to the box. Wide wordmarks still meet the box width first.

SVGs from third parties are checked for scripts, event handlers and external
references before they ship. In dark theme every mark sits on the same light
tile, so a mark with no reverse variant (Lilee's grey, AMPOS's black) shows as
published instead of being recoloured. Light theme keeps the same box with no fill.

## Light variants

Light and dark are one layout with two palettes, so a light variant must keep its
dark counterpart's contours. Where a variant is derived, that is guaranteed by
construction; where it was generated, the edit preserved the dark composition.

| Asset | Origin | Dimensions | Bytes |
| --- | --- | --- | ---: |
| `hero/portrait.light.webp` | generated edit of `portrait.dark.webp` | 1122 × 1402 | 83,910 |
| `approach/mountains.light.webp` | generated edit of `mountains.dark.webp` | 1200 × 900 | 123,192 |
| `projects/developer-tools.light.webp` | generated edit of `developer-tools.dark.webp` | 960 × 720 | 14,178 |
| `projects/waves.light.webp` | derived from `waves.dark.webp` | 960 × 720 | 53,766 |
| `projects/signals.light.webp` | derived from `signals.dark.webp` | 960 × 720 | 15,554 |

### Derived variants

`scripts/derive-light-artwork.ts` (`bun run assets:light`) rebuilds the two
illustration variants from their dark originals with Sharp: invert, rotate the
hue to 190 at 1.1 saturation, lift onto a near-white ground with
`linear(0.95, 14)`, then encode WebP at quality 85, effort 6. This is the same
idea the CSS already applies to handwritten artwork
(`filter: invert(1) hue-rotate(180deg) saturate(1.5)`), resolved once at asset
time so the card background needs no runtime filter. Re-running the script
reproduces the shipped bytes; the dark sources are never rewritten.

The earlier separately generated `waves` and `signals` variants were replaced
because their contours drifted from the dark originals — the observability card
had lost its dashboard frame, and the wave geometry differed.

### Handwritten artwork (#103)

Handwritten artwork (`hero/tagline.*` and `contact/signature.*`) deliberately
keeps the **runtime** ink filter instead of shipping `.light.webp` variants.
Illustrations are asset-time; handwriting is runtime. The reasons:

- The taglines animate. An asset-time rule would need light `.webm` variants
  too, doubling the video payload, while one CSS filter covers the still and
  the video identically.
- The artwork is pale ink plus a cyan underline on a transparent ground.
  `invert(1) hue-rotate(180deg)` turns the ink dark and brings the underline
  back to roughly its original hue. A filter changes colour only, so contours
  cannot drift, which is the risk that made the illustrations asset-time.
- The ko/th/vi/de handwriting regenerates from
  `scripts/render-handwritten-artwork.ts`. One output per locale keeps that
  pipeline simple, and the supplied en/zh/ja artwork has no light original.

`lib/profile-2026-assets.test.ts` fails if a handwritten `.light` file appears
or a handwritten module loses its light-theme filter.

**The signature stays the contact heading.** The `<h2>` is the localized
signature image, and its accessible name is the manifesto (`alt`). This is a
recorded choice, not an oversight. It keeps the page's most distinctive moment,
and it is the only heading set as artwork. Accepted costs: the heading does not
reflow or follow user font-size settings, cannot be selected or
machine-translated in the browser, and is the page's largest text set as pixels.
A locale without artwork would fall back to live text lines, though every
locale currently has artwork. Revisit this if a text-first heading is designed
and approved.

### Generated variants — 2026-09-21

The portrait and the two remaining illustrations were produced with the built-in
image generation tool, using their existing dark counterparts as edit references
and the supplied mockup as visual direction. The portrait edit requested
preservation of identity, pose, clothing, and framing. These are generated
artwork, not new documentary photos. Selected outputs were converted with Sharp
to WebP (quality 85, effort 6). Generation drafts remain outside `public/`.
Existing dark-image provenance is inherited from the repository; this change does
not establish new claims about the origin of older artwork.

#### Exact generation prompts

#### `hero/portrait.light.webp`

Edit this portrait into a bright daylight light-theme website hero. Preserve the exact same man's identity, face, smile, pose, gray shirt, laptop, plant, camera perspective and framing. Relight the room with soft natural daylight, white airy walls and pale blue window light. Natural skin tones. Bright pale desk, gray laptop. No text, no graphics, no new objects. Keep portrait composition and substantial pale background space at top. This is the light companion to the original dark photo.

#### `approach/mountains.light.webp`

Edit this mountain background into the light-theme companion. Preserve the mountainous composition with tallest snowy peak on the right and layered ridges below. Bright airy pale blue sky with soft warm dawn light and white snow, pastel blue mountains, light atmospheric haze. Leave the upper left mostly clear sky for separately rendered navy quote text. No text, no frame, no symbols. Refined photorealistic mountain landscape for a white and blue editorial website. Keep 4:3 landscape.

#### `projects/developer-tools.light.webp`

Edit into a light-theme decorative developer-tools project card background. Preserve the angled browser/editor window concept in the lower right. White near-white background, delicate pale blue outlines, faint cyan and pastel dots, abstract horizontal code lines with NO readable text. Top half almost empty white. Very subtle low-contrast airy technical illustration to sit behind navy body copy on a white website. No logos, no labels, no border framing the entire image. 4:3 landscape.
