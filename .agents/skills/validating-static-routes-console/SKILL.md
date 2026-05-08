---
name: validating-static-routes-console
description: Use when asked to validate static site routes for browser console errors, same-origin network failures, external request failures, Chrome DevTools findings, or GitHub Pages export regressions
---

# Validating Static Routes Console

## Overview

Validate statically exported routes the way GitHub Pages serves them: build first, preview `out/`, inspect browser console and network behavior, classify external failures, fix same-origin issues one at a time, and commit each fix separately.

## When To Use

Use for requests like:

- "validate console errors for all routes"
- "check network access errors"
- "use Chrome DevTools on each route"
- "define routes for console validation"
- "resolve each issue one by one and commit after each fix"

Do not use for ordinary unit-only changes unless the user asks for browser route validation.

## Workflow

1. Read repo instructions and run `git status --short` before edits.
2. Define the route set from the static export surface:
   - root and 404 fallback routes
   - locale home routes
   - profile and footprint routes
   - section index routes
   - published article routes from content helpers
   - special static routes such as `/dev-mode`
3. Build the export before browser validation:
   - `bun run build`
4. Start static preview from `out/`:
   - `PORT=<free-port> bun run preview`
5. Use Chrome DevTools on representative route classes and, when feasible, every route:
   - list console errors/warnings/issues
   - list network requests
   - identify same-origin `4xx/5xx` or failed requests
   - identify external `4xx/5xx` or failed requests
6. Classify findings:
   - Same-origin route/assets/RSC failures are resolvable and should be fixed.
   - The intentional unknown-route document `404` is expected.
   - Temporary external failures may be fine to leave when the page still renders and the failure is outside the repo's control.
   - Giscus "discussion not found" `404`s are acceptable when comments create discussions on first interaction.
   - Browser preload warnings from Next static CSS are informational unless they indicate a broken user-facing asset.
7. Fix one issue at a time.
8. After each fix, rerun the narrow reproduction plus required gates, then commit only that issue.
9. Continue until no unresolved same-origin console/network issues remain.

## Automation Pattern

Prefer a Playwright spec that:

- imports route helpers/content helpers instead of hardcoding every article path
- listens for `console` messages and fails on non-external `error`s
- listens for `requestfailed` and `response`
- fails on same-origin failed requests and unexpected same-origin `4xx/5xx`
- attaches external failures as artifacts for review rather than making CI flaky
- uses `domcontentloaded` plus a short observation window instead of `networkidle` when comment widgets or other external embeds may keep requests open

Example command:

```bash
E2E_TARGET=preview E2E_PREVIEW_PORT=4362 bun run test:e2e -- e2e/console-validation.spec.ts --project=chromium
```

## Verification Gates

For this repository, run at least:

```bash
bun run test
bun run typecheck
bun run build
E2E_TARGET=preview E2E_PREVIEW_PORT=<free-port> bun run test:e2e -- e2e/console-validation.spec.ts --project=chromium
```

If `bun run typecheck` runs concurrently with `bun run build`, `.next/types` can race. Rerun typecheck after build completes before treating it as a failure.

## Commit Discipline

- Commit after each resolved issue, as soon as its verification passes.
- Stage only files for that issue.
- Leave unrelated modified files untouched.
- Use concise commits such as:
  - `test: add route console validation`
  - `fix: serve favicon for static preview`

## Final Handoff

Report:

- route coverage count
- Chrome DevTools findings and classifications
- fixed issues and commit hashes
- verification commands and results
- external failures left as acceptable, with reasons
- unrelated dirty files left untouched
