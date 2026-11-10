# Vite chunk import maps — source ledger

Checked 2026-11-10. This is an engineering evaluation of an existing experimental
feature, not a claim of a new November release. No Vite build, migration, CDN
change, browser-support matrix or performance benchmark was executed for the article.
All four locale editions remain unpublished.

| Primary source | Supported claim / boundary |
| --- | --- |
| [Vite 8.1 announcement](https://vite.dev/blog/announcing-vite8-1), June 23, 2026 | Dated introduction of experimental chunk import maps and its renderBuiltUrl incompatibility warning, explicitly scoped to that announcement. No download figures or benchmark claims reused. |
| [Rolldown experimental chunk import maps](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap) | Content-independent keys map to generated URLs; reduces hash-driven invalidation. This is mechanism documentation, not measured benefit. |
| [Vite build.chunkImportMap](https://vite.dev/config/build-options#build-chunkimportmap) | Experimental, boolean, default false, requires import.meta.resolve support. No browser-version compatibility claim. |
| [Vite feature guide](https://vite.dev/guide/features#chunk-import-map-optimization) | CSS/assets are outside the full optimization; direct referring chunks can change without propagation through their importers. |
| [Vite production guide](https://vite.dev/guide/build#load-error-handling) | Prior assets disappearing can break dynamic loads; HTML revalidation guidance. Verified in the [official documentation source](https://github.com/vitejs/vite/blob/main/docs/guide/build.md#load-error-handling) after the website retrieval timed out. No third-party article claims used. |

The two-build comparison, acceptance matrix, host inspection, safe old-tab
recovery and retained-file/rollback review are the article's proposed engineering
analysis, not measurements or facts about a specific host. They do not change this
repository's Next.js stack, deployment settings, permissions or publication state.

Duplicate review found no Vite/import-map post in main or recent/open post PRs.
The Node.js 26 image draft, Python lazy-import draft and preserved Playwright/Bun
work address different boundaries and remain unchanged. The old edge-preview
article concerns preview routing/environment, not chunk cache invalidation.
