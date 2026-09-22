# Profile 2026 asset inventory

Production assets live in `public/profile/2026/`, grouped by their consuming
section. Names describe content, followed by optional `.light` / `.dark` or
language suffixes. Japanese uses `ja`; the supplied handwritten Chinese artwork
is intentionally shared by `zh-tw` and `zh-cn` as `zh`.

## Ownership and organization

| Folder | Assets | Consumer |
| --- | --- | --- |
| `hero/` | `portrait.{light,dark}.webp`, `tagline.{en,zh,ja}.webp`, `tagline.en.webm` | Hero and animated English tagline |
| `approach/` | `mountains.{light,dark}.webp` | Decorative quote-panel background |
| `projects/` | `{waves,developer-tools,signals}.{light,dark}.webp` | Decorative project-card backgrounds |
| `contact/` | `signature.{en,zh,ja}.webp` | Localized contact heading |
| `brands/` | `{momo,swag,foodpanda,viewsonic}.png` | Experience timeline |
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
- Handwritten images retain their transparent backgrounds; the English video
  has no alpha channel, so the tagline group blends its opaque background out
  of the page — screen in dark, multiply in light.
- Handwritten assets retain their transparent backgrounds. Light-mode CSS
  adapts their ink; dark originals remain visually unchanged. The English video
  retains reduced-motion, unsupported-playback, and no-JavaScript fallbacks.
- Portrait and handwritten artwork have localized accessible descriptions;
  backgrounds and employer marks are decorative beside equivalent HTML text.

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
