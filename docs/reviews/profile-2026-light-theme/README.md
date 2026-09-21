# Profile 2026 light-theme review — 2026-09-22

The supplied light mockup now guides the white/navy/blue palette, daylight hero,
mountain quote panel, pale project artwork, and contact treatments. Existing
copy, metrics, links, disclosures, locale routes, and dark artwork remain.

## Screenshots

Chromium, local production export, English, reduced motion, closed disclosures:

- [Light at the mockup width (937px)](en-light-937.png)
- [Light desktop (1440px)](en-light-1440.png)
- [Light mobile (390px)](en-light-390.png)
- [Dark before (1440px)](en-dark-before-1440.png)
- [Dark after (1440px)](en-dark-1440.png)

The dark before/after images are 1440 × 1930 and have **zero changed pixels**
when comparing decoded RGB buffers. All five original dark photographs and
illustrations are also byte-identical after relocation.

Automated screenshot and overflow coverage includes all four locales at
320/390/768/937/1280/1440px in light mode. Existing profile checks cover both
modes, disclosures, theme persistence, system changes, keyboard navigation,
locale switching, and animation fallback behavior in Chromium and Firefox.
Manual review included English desktop/mobile, Japanese and Traditional Chinese
mobile, Simplified Chinese desktop, and the final mountain panel.

## Verification

- `bun run test`: **149 passed**, 44 files.
- `bun run typecheck`: **passed**.
- `bun run build`: **passed**, 156 static pages generated and export completed.
- `git diff --check`: **passed**.
- `bun run lint` in the shared workspace: **failed on a pre-existing lint error** in
  `tmp/experience-review/capture.cjs` (`@typescript-eslint/no-require-imports`).
  The unrelated script was left untouched.
- `bun run lint --ignore-pattern tmp/experience-review/capture.cjs`: **passed**.
  This is a scoped verification exception, not a change to lint policy.
- Before opening the PR, exported the staged Git index into
  `/private/tmp/profile-2026-pr-review/` with `git checkout-index --all`, linked
  the existing dependencies, and ran plain `bun run lint` there: **passed**.
  This validates the exact PR files without including unrelated untracked files.

Full profile/theme browser command: **122 passed**:

```bash
E2E_TARGET=preview E2E_PREVIEW_PORT=4391 bun run test:e2e \
  e2e/profile-2026-light-theme.spec.ts e2e/profile-hero.spec.ts \
  e2e/profile-experience.spec.ts e2e/profile-approach.spec.ts \
  e2e/profile-footer-artwork.spec.ts e2e/profile-2026-projects-footer.spec.ts \
  e2e/profile-versions.spec.ts e2e/theme.spec.ts --workers=4
```

After widening the light mountain panel's motto column, rebuilt the export and
reran the affected tests: **14 passed**. The screenshots above are from this run:

```bash
E2E_TARGET=preview E2E_PREVIEW_PORT=4391 bun run test:e2e \
  e2e/profile-2026-light-theme.spec.ts e2e/profile-approach.spec.ts \
  --workers=4 --output=/private/tmp/profile-2026-final-browser
```

Initial checks caught a mountain-panel aspect-ratio overflow at tablet widths;
explicit width containment fixed it. No maintenance size exceptions were needed:
all feature components are below 200 lines and CSS Modules below 250 lines.
No production deployment or production smoke checks were performed.

## Assets and workspace preservation

See the [asset inventory](../../profile-2026-assets.md) for filenames, module
ownership, exact generation prompts, dimensions, and legacy asset retention.
Light variants were generated with the built-in image tool, then saved as WebP.

The existing animation's `playbackRate = 1.5` and matching browser assertion were
preserved through the file moves. Unrelated untracked files under
`docs/reviews/profile-performance-baseline/` and the existing temporary review
script were left untouched. Another workspace operation changed branches during
implementation. The PR is prepared on `ui/profile-2026-light-theme-assets`,
stacked on `fix/profile-hero-animation-speed` (#92) so the existing speed change
is not included in this PR’s diff.
