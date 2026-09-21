# Profile 2026 performance baseline — issue #89

Captured 2026-09-21 against commit `36210c581c7817ea4df013a9825f01e11256ae7f`.
Tracking: [#89](https://github.com/nelson-o/nelson-o.github.io/issues/89), parent
[#81](https://github.com/nelson-o/nelson-o.github.io/issues/81).
This is the before-change audit, not closure of #89 or release acceptance.
This audit changes no production code, images, dependencies or hosting configuration.
The working tree was clean at the initial build. By handoff, concurrent edits
appeared in `components/layout/profile-hero-tagline.tsx` and
`e2e/profile-hero.spec.ts`; both were left untouched. The baseline verification
does not validate those later edits.
PR #91 subsequently added the English hero animation. Before performance fixes,
capture a fresh baseline on current main, including animation and reduced-motion
states; the static-image measurements here remain historical evidence.

## Measurement conditions

Production static export served by `PORT=4391 bun run preview`; measured URL
`http://localhost:4391/en/profile/2026/`. Chrome 153 on macOS; DevTools isolated
context `issue89-baseline`. Desktop: 1440×900, DPR 1, CPU 1×, no network throttle.
Mobile emulation: 390×844, DPR 3, CPU 4×, DevTools Slow 4G preset. Both load
traces use light theme and a reload; caches were not explicitly cleared.
The external font stylesheet was cached in the mobile trace. These are single
diagnostic samples, not a cold-cache benchmark, repeat-run median, or real phone.
The desktop sample overlapped the route suite, so it is not an isolated benchmark.

| Sample | LCP | CLS | Interaction observation |
| --- | ---: | ---: | --- |
| Desktop reload | 100 ms | 0.00 | Not a controlled interaction measurement |
| Throttled mobile reload | 2,980 ms | 0.00 | No interaction in load sample |
| Mobile interaction trace | N/A | 0.00 | 209 ms longest observed interaction |

Interaction sequence after load: open Settings, select Dark, expand full history.
The longest pointerdown had 8 ms input delay, 16 ms processing and 185 ms
presentation delay. The summary does not identify its target; do not attribute
the latency to a specific control without a narrower repeat trace.

[DevTools evidence](devtools-evidence.md) preserves tool summaries and detailed
insights. Raw trace export was denied by the tool's workspace-root configuration,
including for this repository; no raw trace artifact is available.

These observations do not establish field Core Web Vitals. No production CrUX
dataset was retrieved; localhost's unavailable CrUX result says nothing about
production coverage. Thresholds are LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at the
75th percentile in field data. See [Web Vitals](https://web.dev/articles/vitals).

## Export, JavaScript and hydration

- `bun run build`: 156 generated pages; profile route reports 124 kB first-load
  JS, including the shared 103 kB framework/runtime baseline.
- `bun run metrics:build`: 109 published MDX entries, 148 exported index.html
  files, total export 38.5 MiB. These counts differ because sitemap/metadata and
  framework outputs are not all index.html routes.
- English 2026 HTML: 78,358 bytes. Its 11 unique linked JS files total 526,189
  raw bytes / 165,836 gzip bytes; three CSS files total 43,170 raw / 9,698 gzip.
  This file inventory includes the conditional legacy script and is not the
  same accounting as Next's first-load estimate or browser transfer bytes.
- All profile-2026 composition modules remain server components. Client work is
  concentrated in settings/theme, Next Link/Image and framework hydration.
  History/project/activity disclosures use native details; no animation library.
- The mobile resource list contains about 412 kB of initial raw JS before home
  prefetch resources. Local preview does not compress text; production transfers
  must be measured separately before drawing network conclusions from raw bytes.
- Home-link prefetch fetched a 22,299-byte RSC document plus home JS and CSS.
  Two unused CSS-preload warnings followed; informational, not broken assets.

## Findings and follow-up order

1. **Hero request priority and delivery.** The hero is the mobile LCP image:
   79,824 bytes, initially Low priority then High. It is preloaded and not lazy,
   but has no explicit fetchpriority=high. LCP breakdown: 1 ms TTFB, 639 ms load
   delay, 2,299 ms load duration, 40 ms render delay. First experiment: explicit
   high fetch priority, followed by matched repeat measurements. Investigate
   build-time responsive sources while preserving static export/unoptimized images.
   `sizes` alone does not provide smaller sources with the current unoptimized
   image configuration. See [LCP guidance](https://web.dev/articles/optimize-lcp).
2. **Employer images.** Four PNGs total 344,733 bytes: momo 43,463; SWAG 55,368;
   foodpanda 89,278; ViewSonic 156,624. Mobile image boxes are 64×44 CSS pixels.
   DevTools estimates roughly 339 kB savings across these logos and 431.5 kB
   across all flagged images. These are heuristic estimates, not achieved savings.
   Compare lossless WebP/resized variants at appropriate DPR; preserve official
   colors, shape, transparency and provenance, coordinating with #86.
3. **Early decorative downloads.** CSS backgrounds div-a/b/c/mt total 190,116
   bytes and load without scrolling, although their sections are below the fold.
   Evaluate source compression and deferred delivery without layout changes.
4. **Unused profile font stylesheet.** Root layout requests Google Unica One.
   Computed 2026 families are IBM Plex/system fallbacks, Arial and Georgia;
   Unica One is used by the 2025 profile stylesheet. Investigate scoping its
   request to consumers, retaining 2025 appearance. Do not claim the cached
   0.5 ms request caused this sample's mobile LCP delay.
5. **Interaction presentation cost.** Repeat each settings/theme/history action
   independently under 4× CPU, including reduced motion, to locate the 185 ms
   presentation delay. Current sample is only 9 ms over the lab target.
6. **CSS, prefetch and legacy code.** DevTools flags render-blocking CSS and
   43.8 kB potential legacy JS waste. Measure route-specific CSS and polyfill
   needs before changing framework/browsers support. Consider home prefetch
   tradeoffs only after comparing navigation benefit and initial-load contention.

No before/after improvement is claimed: this phase deliberately captures the
baseline before implementation. Findings remain open for measured follow-up.
The design proposal deleted earlier is not used as an implementation direction.

## Hosting and console findings

Local preview is HTTP/1.1 without compression/cache headers in these responses;
its document/cache warnings cannot be treated as GitHub Pages defects.
Read-only production HEAD checks returned 200 for the profile and hero over
HTTP/2, with `cache-control: max-age=600` and `vary: Accept-Encoding`.
HEAD alone does not establish negotiated compressed GET size. No hosting change
or new analytics service is proposed.

The Chromium route suite passed 148 checks: root, fallback, dev-mode, four locale
homes, profile aliases and both editions, footprints, section indexes and articles.
No external-failure attachments were emitted. The intentional unknown-route 404
is expected. The suite observes through load; it does not certify delayed
third-party behavior or later interactions. Direct DevTools profile inspection
found only the two informational prefetched-CSS warnings, no console errors.

## Verification and limitations

- `bun run test`: passed, 144 tests in 43 files.
- `bun run typecheck`: passed after build.
- `bun run build`: passed, static export completed.
- `bun run metrics:build`: passed, figures above.
- `bun run lint`: failed on pre-existing ignored
  `tmp/experience-review/capture.cjs:1`, no-require-imports. Left untouched.
- `E2E_TARGET=preview E2E_PREVIEW_PORT=4391 bun run test:e2e e2e/console-validation.spec.ts --project=chromium --workers=4`:
  passed, 148 checks in 57.1 s. Initial sandbox attempt could not access/start
  preview; authorized outside-sandbox rerun passed.
- Manual review of this markdown and `git diff --check`: performed for handoff.
- Not run: full behavioral e2e, Firefox, production browser suite, Lighthouse,
  eight-language visual acceptance, controlled cold-cache repetitions or field
  measurements. None is implied by the baseline results.

Tools: Bun, Next build metrics, Python standard-library file/gzip inventory,
Chrome DevTools MCP tracing/insights/DOM inspection, Playwright Chromium, curl
HEAD, and the repository
[validating-static-routes-console skill](../../../.agents/skills/validating-static-routes-console/SKILL.md).
Primary documentation consulted: web.dev Web Vitals and Optimize LCP above.
No modern-web skill was installed or assumed available.

To compare a future change: rebuild the same export, repeat the exact viewport,
CPU/network/cache conditions and interaction sequence, record at least three
isolated runs per condition, and compare medians plus resource bytes. Add fresh
context/cold-cache and production samples as separate series; do not compare
those directly to this reload baseline. Preserve this before-change evidence.
