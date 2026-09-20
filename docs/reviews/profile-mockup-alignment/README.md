# Profile mockup alignment review

Fresh Chromium captures of `/en/profile/2026/` from local production exports.
The before images use baseline commit `7c7b1a98bdd73b6236cb1115f0b07928a7df7a9d`;
the after images use the implementation in this PR. Both use device scale 1.

| Viewport | Before | After |
| --- | --- | --- |
| Desktop, 1440 × 900, dark | [Before](before-desktop.png) | [After](after-desktop.png) |
| Mobile, 390 × 844, dark | [Before](before-mobile.png) | [After](after-mobile.png) |

[Desktop after in light theme](after-light.png)

The changes align the page width, header, typography, portrait/laptop crop,
social links, and capability cards with the supplied mockup, and remove the
preview banner in every locale. Existing profile facts, the settings control,
and the Experience destination are retained: there is no resume download or
availability status in the source data. Edition routing and indexing are unchanged.

Verification:

- `bun run test`: 144 tests passed.
- `bun run typecheck`: passed.
- `bun run build`: passed, 148 pages exported.
- `E2E_PREVIEW_PORT=4328 bun run test:e2e:preview e2e/profile-hero.spec.ts e2e/profile-versions.spec.ts e2e/profile-approach.spec.ts e2e/profile-footer-artwork.spec.ts --workers=4`: 54 tests passed in Chromium and Firefox. Covers four locales, light/dark themes, responsive layouts, images, keyboard navigation, edition metadata, and working settings.
- `git diff --check`: passed.
