# Profile 2026 light-theme review — 2026-09-22

The light theme now carries the mockup's white/navy/blue palette, daylight hero,
mountain quote panel, pale project artwork and contact treatments **on the dark
theme's layout and type scale**. An earlier revision of this branch also changed
light-mode geometry and typography — `font-family: Arial`, a shorter header, a
re-aligned nav, tighter hero spacing, smaller section type, a rebuilt approach
panel and different card metrics. Those overrides are removed: light and dark now
measure the same, and only colour, shadow, outline, blend, filter and artwork
differ. Dark artwork, copy, metrics, links, disclosures and locale routes are
unchanged.

## Screenshots

Chromium, local production export, English, reduced motion, closed disclosures:

- [Light at the mockup width (937px)](en-light-937.png)
- [Light desktop (1440px)](en-light-1440.png)
- [Light mobile (390px)](en-light-390.png)
- [Dark before (1440px)](en-dark-before-1440.png)
- [Dark after (1440px)](en-dark-1440.png)

Light and dark full-page captures at 1440px are now both **1440 × 1930**; before
the parity fix light was 1440 × 1878. The dark after/before images have **zero
changed pixels** when comparing decoded RGB buffers, re-verified after the parity
fix against the copy committed earlier in this branch. All five original dark
photographs and illustrations remain byte-identical after relocation.

## Theme parity

Two checks keep the rule enforced rather than reviewed by eye:

- `lib/profile-2026-theme-parity.test.ts` parses every theme-scoped rule in
  `components/layout/profile-2026/*.module.css` and fails on any property outside
  colour, background, `border-color`, shadow, filter, blend, opacity, mask and the
  profile/project custom properties. The hero's portrait swap is the one named
  exemption.
- `e2e/profile-2026-light-theme.spec.ts` loads the exported page in both themes at
  390/937/1440px and compares rounded bounding boxes, computed font family, size,
  weight, line height and letter spacing for sixteen selector groups, plus the
  document scroll height.

The approach panel's light frame uses `border-color: transparent` rather than
`border: 0`, so removing the visible outline does not shrink the panel by the
border's two pixels.

## Animated English tagline

`hero/tagline.en.webm` is the only asset without an alpha channel: its background
is an opaque `rgb(2, 0, 2)`, which disappears against the dark hero but inverted
into an opaque white card in light mode. The blend that hides it now sits on the
tagline group (`.animatedTag`, the element dark already screens) instead of the
inner artwork wrapper. The wrapper is inside the tag's own stacking context, so
its `multiply` had no page backdrop to blend against and the video's background
stayed opaque. Light multiplies where dark screens; the still fallbacks and the
three localized tagline images all carry real alpha and are unaffected.

`e2e/profile-2026-light-theme.spec.ts` guards this: it asserts the blend mode per
theme and that the decoded video frame is still opaque, so the guard stays honest
if the video is ever re-encoded with alpha.

## Known shared behaviour

At 937px the hero tagline artwork overruns the right edge of the portrait frame
and the hero topic list clips slightly. This is existing dark-theme behaviour that
light now shares exactly; it is not introduced here and is left for a separate
hero-width fix rather than re-introducing a light-only override.

## Artwork

`projects/waves.light.webp` and `projects/signals.light.webp` are re-derived from
their dark originals by `bun run assets:light`, so their contours are identical to
the dark artwork — the observability card keeps its dashboard frame and the wave
geometry matches. `hero/portrait.light.webp`, `approach/mountains.light.webp` and
`projects/developer-tools.light.webp` already tracked their dark counterparts and
are unchanged. See the [asset inventory](../../profile-2026-assets.md) for
filenames, module ownership, the derivation recipe, generation prompts and legacy
asset retention.

## Verification

- `bun run test`: **162 passed**, 45 files (149/44 before the parity gate).
- `bun run typecheck`: **passed**.
- `bun run build`: **passed**, 156 static pages generated and export completed.
- `bun run lint`: **fails only on** the pre-existing untracked
  `tmp/experience-review/capture.cjs` (`@typescript-eslint/no-require-imports`),
  which is outside this PR and was left untouched.
  `bunx eslint . --ignore-pattern "tmp/**"`: **passed**. This is a scoped
  verification exception, not a change to lint policy.
- `git diff --check`: **passed**.

Full profile/theme browser command, **126 passed** in Chromium and Firefox:

```bash
E2E_TARGET=preview E2E_PREVIEW_PORT=4391 bun run test:e2e \
  e2e/profile-2026-light-theme.spec.ts e2e/profile-hero.spec.ts \
  e2e/profile-experience.spec.ts e2e/profile-approach.spec.ts \
  e2e/profile-footer-artwork.spec.ts e2e/profile-2026-projects-footer.spec.ts \
  e2e/profile-versions.spec.ts e2e/theme.spec.ts --workers=4
```

Responsive coverage includes all four locales at 320/390/768/937/1280/1440px,
theme persistence and system changes, keyboard disclosures, asset loading and
animation fallbacks. No deployment or production smoke check was performed.

## Branch and workspace

The branch was rebased onto `main` after #92 merged, dropping the duplicated
animation-speed commit; the hero tagline keeps `main`'s `playbackRate = 3`. The
unrelated untracked `docs/reviews/profile-performance-baseline/` copy that
predated #93 was moved aside for the rebase and is preserved outside the
repository; `main`'s committed version of those files is what the branch carries.
The existing temporary review script under `tmp/` was left untouched.
