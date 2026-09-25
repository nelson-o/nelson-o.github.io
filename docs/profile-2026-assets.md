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

### The contact heading is artwork — accepted 2026-09-26

The contact `<h2>` renders `contact/signature.<language>.webp` rather than text,
with the manifesto as its alternative text. This was reviewed under
[#103](https://github.com/nelson-o/nelson-o.github.io/issues/103) and kept
deliberately; it is the page's most distinctive moment. The accepted costs:

- The heading does not reflow, and does not scale with the reader's font size.
- Its text cannot be selected, copied, or machine-translated in the browser.
- The page's largest text is delivered as pixels rather than glyphs.

It reads correctly to assistive technology, which is why the tradeoff is
acceptable rather than merely tolerated. `contact.tsx` keeps a live-text path
(`.manifestoLine`) for any locale whose `artworkLanguage` entry is `null`; all
eight current locales map to artwork, so that path is the fallback for a future
language rather than dead code. Treat this as settled: accessibility work under
[#88](https://github.com/nelson-o/nelson-o.github.io/issues/88) should not
reopen it without new evidence.

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

## Light variants

Light and dark are one layout with two palettes, so a light variant must keep its
dark counterpart's contours. Where a variant is derived, that is guaranteed by
construction; where it was generated, the edit preserved the dark composition.

Two conventions coexist deliberately, decided under
[#103](https://github.com/nelson-o/nelson-o.github.io/issues/103):

- **Photographic and illustrative artwork ships a light file.** The portrait,
  mountains and the three project backgrounds each have a `.light` counterpart
  resolved at asset time, so no runtime filter is needed and each variant can be
  composed independently of its dark original.
- **Handwritten artwork keeps a runtime filter.** The contact signature and the
  hero taglines are white ink on transparency, so light adapts them with
  `filter: invert(1) hue-rotate(180deg) saturate(1.5)` rather than shipping a
  second file per language. At eight locales that would be sixteen near-identical
  assets for no visual gain, and the ink is a single colour, so the filter is
  exact rather than approximate.

Light is the class-free base in both cases: the filter sits on the unscoped rule
and the dark theme resets it, so a render without the theme script matches the
light palette that `page.module.css` already declares.

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
