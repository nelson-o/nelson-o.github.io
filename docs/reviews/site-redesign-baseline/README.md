# Site redesign baseline — issue #140

Captured 2026-09-29 (UTC) against `main` at
[`07351de`](https://github.com/nelson-o/nelson-o.github.io/commit/07351ded717207bb19174594434d8c276da436fa).
Tracking: [#140](https://github.com/nelson-o/nelson-o.github.io/issues/140), part of
Epic 5 [#138](https://github.com/nelson-o/nelson-o.github.io/issues/138). The
comparison against these numbers belongs to 5.18
([#156](https://github.com/nelson-o/nelson-o.github.io/issues/156)).
This is a measurement only: no source, content or config changed.

## Routes

| Route | Why |
| --- | --- |
| `/zh-tw/` | Primary-locale landing page |
| `/en/` | English landing page |
| `/zh-tw/systems/` | Section index, with the random post-hydration topic image |
| `/zh-tw/ideas/agent-loops/` | Longest published zh-tw article (9.7 KB MDX, 5 Mermaid diagrams) |

The longest zh-tw MDX file, `260727-popular-agent-skills-modern-development`, has
`published: false` and is not exported, so it was skipped.

## Environment

- Apple M4, macOS 26.6.2, Google Chrome 154.0.8037.58 (headless), Bun, Lighthouse 13.5.0.
- `bun run build` output copied to a scratch folder and served with
  `EXPORT_DIR=<copy> PORT=4640 bun run preview`.
- **The preview server sends no compression.** Byte counts from Lighthouse below
  are uncompressed, and the simulated mobile LCP is worse than GitHub Pages, which
  gzips text. Compare 5.18 against the same local setup, not against production.
- Lighthouse, performance category only, 3 runs per route and form factor, medians reported:
  - **Mobile** (default): 412×823 at DPR 1.75, simulated throttling with 150 ms RTT,
    1.6 Mbps, 4× CPU.
  - **Desktop** (`--preset=desktop`): 1350×940 at DPR 1, 40 ms RTT, 10 Mbps, 1× CPU.

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  bunx --bun lighthouse http://localhost:4640/<route>/ [--preset=desktop] \
  --only-categories=performance --chrome-flags="--headless=new" --output=json
```

## Lighthouse (median of 3)

| Route | Form | Score | FCP | LCP | CLS | TBT | Speed Index |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/zh-tw/` | mobile | 85 | 1,953 ms | 4,203 ms | 0 | 0 ms | 1,953 ms |
| `/zh-tw/` | desktop | 99 | 482 ms | 842 ms | 0 | 0 ms | 482 ms |
| `/en/` | mobile | 85 | 1,952 ms | 4,202 ms | 0 | 0 ms | 1,952 ms |
| `/en/` | desktop | 99 | 482 ms | 842 ms | 0 | 0 ms | 482 ms |
| `/zh-tw/systems/` | mobile | 75 | 2,049 ms | 6,453 ms | 0.030 | 0 ms | 2,049 ms |
| `/zh-tw/systems/` | desktop | 98 | 483 ms | 1,167 ms | 0 | 0 ms | 483 ms |
| `/zh-tw/ideas/agent-loops/` | mobile | 69 | 2,252 ms | 4,851 ms | 0.033 | 312 ms | 3,628 ms |
| `/zh-tw/ideas/agent-loops/` | desktop | 99 | 522 ms | 962 ms | 0 | 0 ms | 930 ms |

CLS is the worst of the 3 runs. Outliers are kept in the raw runs but excluded by the median:
`/zh-tw/` mobile run 1 hit Lighthouse's "loaded too slowly" warning (LCP 5,924 ms), and
the article's mobile run 1 measured LCP 9,594 ms.

LCP elements (mobile): the hero `h1` on `/zh-tw/`, the hero description `p` on `/en/`,
the topic-visual `img` on `/zh-tw/systems/`, and the article hero `img`.
CLS culprits: the topic-visual frame on `/zh-tw/systems/`, and the article prose block.

## Interaction latency (lab INP)

Lighthouse navigation runs do not measure INP. For a lab proxy, Playwright with
Chrome opened each page (light theme), waited for network idle, then tapped the
settings button, chose **Dark**, and pressed Escape. The value is the longest
Event Timing entry (`durationThreshold: 16`). This is not field INP.

- Mobile: 390×844, DPR 3, touch, CDP CPU throttling 4×.
- Desktop: 1280×800, DPR 1, no throttling.

| Route | Mobile runs | Mobile median | Desktop runs | Desktop median |
| --- | --- | ---: | --- | ---: |
| `/zh-tw/` | 192, 40, 40 | 40 ms | 40, 48, 40 | 40 ms |
| `/en/` | 40, 40, 56 | 40 ms | 48, 48, 48 | 48 ms |
| `/zh-tw/systems/` | 40, 40, 40 | 40 ms | 48, 48, 48 | 48 ms |
| `/zh-tw/ideas/agent-loops/` | 328, 496, 352 | 352 ms | 112, 104, 104 | 104 ms |

On the article, the slow interaction is choosing Dark (about 280 ms on mobile, 96 ms on
desktop in a per-entry rerun). `components/ui/mermaid-block.tsx` watches theme
attributes and re-renders every diagram on a theme change.

## JavaScript and CSS bytes

`bun run build`: first-load JS is 107 kB for `/[locale]` and `/[locale]/[section]`, and
120 kB for articles, including 103 kB of shared chunks. `bun run metrics:build`: 109
published MDX entries, 164 exported `index.html` files, 44.3 MB export.

Files linked from each exported HTML (raw / gzip -9 bytes):

| Route | HTML | JS files | JS | CSS files | CSS |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/zh-tw/` | 45,977 / 10,907 | 11 | 520,185 / 164,484 | 5 | 26,199 / 7,135 |
| `/en/` | 46,814 / 10,317 | 11 | 520,185 / 164,484 | 5 | 26,199 / 7,135 |
| `/zh-tw/systems/` | 47,652 / 11,125 | 11 | 520,761 / 164,893 | 5 | 26,199 / 7,135 |
| `/zh-tw/ideas/agent-loops/` | 73,541 / 20,412 | 12 | 534,108 / 170,875 | 3 | 21,103 / 5,408 |

What the browser actually fetched on load (Lighthouse mobile run 2, uncompressed KiB):

| Route | Script | Stylesheet | Font | Fetch (RSC prefetch) | Image | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/zh-tw/` | 424.6 (14) | 59.6 (7) | 68.4 (1) | 163.2 (5) | — | 761.4 |
| `/en/` | 424.6 (14) | 59.6 (7) | 68.4 (1) | 167.2 (5) | — | 766.1 |
| `/zh-tw/systems/` | 436.2 (14) | 59.6 (7) | 68.4 (1) | 225.4 (7) | 32.2 (1) | 869.1 |
| `/zh-tw/ideas/agent-loops/` | 1,304.7 (24) | 131.9 (8) | 223.1 (2) | 205.5 (6) | 23.1 (1) | 1,960.8 |

The article's extra script is mostly lazy-loaded Mermaid chunks (about 660 KiB), plus the
158 KiB Font Awesome solid font. Every route loads `unica-one.ttf` (68 KiB).

## Screenshots

`bun run capture` from the same export (reduced motion, fonts loaded, scale 2). Images
live on the orphan branch `review-assets/140` at
[`19d048f`](https://github.com/nelson-o/nelson-o.github.io/tree/19d048fcf5ba749cc46595e4133f245151ab3a79).

| Route | Light 1280 | Dark 1280 | Light 390 | Dark 390 |
| --- | --- | --- | --- | --- |
| `/zh-tw/` | [png][zl1] | [png][zd1] | [png][zl3] | [png][zd3] |
| `/en/` | [png][el1] | [png][ed1] | [png][el3] | [png][ed3] |
| `/zh-tw/systems/` | [png][sl1] | [png][sd1] | [png][sl3] | [png][sd3] |
| `/zh-tw/ideas/agent-loops/` | [png][al1] | [png][ad1] | [png][al3] | [png][ad3] |

The systems banner image differs between captures because `TopicVisual` picks one at
random after hydration, so 5.18 should not expect a pixel match there.

## Observations for the redesign

These are recorded, not fixed (measure only):

1. **Mobile LCP is 4.2–6.5 s under simulated Slow 4G** on every route, while desktop
   stays under 1.2 s. Lighthouse estimates about 1 s of render-blocking savings per route.
2. **The section index LCP waits for hydration.** `TopicVisual` picks its image in
   `useEffect`, so the LCP image cannot be discovered from HTML. It also causes the
   0.03 CLS.
3. **Theme switching on Mermaid articles is slow** (352 ms mobile median, above the
   200 ms INP threshold), because every diagram re-renders.
4. **Mermaid diagrams need horizontal scrolling on phones.** At 390px the flowchart sits
   in an `overflow-x: auto` frame with a 42rem minimum width, so only its left part
   shows until the reader scrolls.
5. **Next Link prefetch** fetches 160–225 KiB of RSC payloads during load on each route.

## Verification

- `bun run test`: 357 passed (55 files).
- `bun run typecheck`, `bun run lint`: clean.
- `bun run build`: static export succeeded. `bun run metrics:build`: figures above.
- Screenshots: all 16 viewed before upload; raw URLs return HTTP 200.
- Not run: production (GitHub Pages) samples, field data, cold-cache series,
  devices other than emulation.

[zl1]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-light-1280.png
[zl3]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-light-390.png
[zd1]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-dark-1280.png
[zd3]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-dark-390.png
[el1]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/en-light-1280.png
[el3]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/en-light-390.png
[ed1]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/en-dark-1280.png
[ed3]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/en-dark-390.png
[sl1]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-systems-light-1280.png
[sl3]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-systems-light-390.png
[sd1]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-systems-dark-1280.png
[sd3]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-systems-dark-390.png
[al1]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-ideas-agent-loops-light-1280.png
[al3]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-ideas-agent-loops-light-390.png
[ad1]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-ideas-agent-loops-dark-1280.png
[ad3]: https://raw.githubusercontent.com/nelson-o/nelson-o.github.io/19d048fcf5ba749cc46595e4133f245151ab3a79/zh-tw-ideas-agent-loops-dark-390.png
