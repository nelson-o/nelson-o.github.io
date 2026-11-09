# Static article search

Search uses the active locale's published article list. The static export builds
`/<locale>/search-index.json`; no runtime API, external service, profile data or
cross-locale index is involved. Drafts are filtered before their bodies are parsed.

The existing MDX parser is used at build time without evaluation or a new
dependency. An allowlist collects prose, headings, list/table text, link labels,
and inline-code text. Link destinations, images, fenced code (including Mermaid),
raw HTML, JSX and its children, imports/exports, and expressions are excluded.
Unknown node types fail closed. Text uses NFKC normalization and collapsed
whitespace. This deliberately does not search executable examples or diagrams.

Matching remains literal, case-folded substring matching, including unspaced
CJK. Every whitespace-separated term must match somewhere in the entry. Per-term
scores favor title (4), localized topic (2), summary (1), then body (0.5); equal
scores retain publication-list order. There is no typo correction, stemming,
accent removal, phrase-query syntax or cross-locale expansion.

Metadata matches retain their summary. If a body term is needed, results show
up to 180 Unicode code points around the earliest body-only term, with ellipses
when clipped. Excerpts use normalized plain text and React text nodes, never
`dangerouslySetInnerHTML` or injected highlighting. The existing 20-result batches
and keyboard continuation make every ranked match reachable.

The dialog/matcher and index remain lazy: opening Search loads them. Body text
increases the deferred JSON payload, not the initial landing index request.
`bun scripts/measure-search.ts out` reports raw/gzip index sizes, warmed matcher
median/p95 over 600 mixed queries after 50 warmups, and initial landing script
bytes. Pass another export directory and matcher source to compare a base build.
Timings are local process observations, not browser or mobile benchmarks.

## Recorded comparison

Base: `fc05d9704e326e147636387b7ae29c06ba5615d8`, compared with this change
on Linux x64 / Bun 1.3.2. Bytes below are raw / gzip.

| Locale | Entries | Base index bytes | Body index bytes | Base median / p95 ms | Body median / p95 ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| en | 28 | 8709 / 2945 | 96781 / 33796 | 0.014 / 0.029 | 0.139 / 0.232 |
| zh-tw | 27 | 7954 / 3586 | 82957 / 35676 | 0.023 / 0.051 | 0.153 / 0.211 |
| zh-cn | 27 | 7938 / 3573 | 81312 / 34904 | 0.029 / 0.056 | 0.145 / 0.198 |
| ja | 27 | 11215 / 3971 | 118022 / 37086 | 0.022 / 0.050 | 0.137 / 0.205 |

All four landing routes still reference 12 initial scripts: 531,153 → 531,206
raw bytes and 170,089 → 170,117 summed gzip bytes (+53 / +28 bytes). The small
increase includes the localized search hint; the body index and matcher remain
deferred until Search opens. The repository has no numeric landing-script
budget in its build metrics script; the existing lazy-loading browser checks
remain the loading guard. Next reports the same rounded landing First Load JS.

The larger deferred index is the main tradeoff: 27–28 published entries now cost
about 34–37 KB gzip per active locale. Timings include normalization/matching and
ranking, not JSON download, parsing, excerpt rendering or device interaction.
Re-measure as the corpus grows; these results do not establish a device latency
guarantee. No search query or article text is sent to another service.
