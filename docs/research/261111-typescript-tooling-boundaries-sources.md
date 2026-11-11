# TypeScript compiler integration — source ledger

Checked 2026-11-11. Four locale editions remain unpublished. This is a proposed
integration evaluation, not an executed migration, API demonstration or benchmark.
No dependency, toolchain, hosting or publication setting changes accompany it.

| Primary source | Supported boundary |
| --- | --- |
| [TypeScript 7.1 beta announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/), October 20, 2026 | Preview API; the explicit-input compilation example and resource-disposal requirements. Claims are scoped to this beta, not a future stable release. |
| [TypeScript homepage](https://www.typescriptlang.org/), checked November 11, 2026 | Current beta status; recheck before adoption or publication. |
| [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), July 8, 2026 | Earlier API gap and TypeScript 6 compatibility route; not a claim that every third-party tool supports a particular configuration. |

Dependency inventory, configuration ownership, failure/interruption tests,
request generations, acceptance matrix and reversible rollout are original
engineering recommendations. No example implementation is presented as tested.
No vendor performance figures are reused. The documentation's sample limitation
is not described as a limitation of every possible API integration.

Current main, recent content, open issues and recent/open PRs contain no matching
compiler-API migration article. Existing Node.js, Python lazy-import and Vite
release-boundary drafts are distinct; preserved Playwright/Bun work is untouched.
The article evaluates a currently available beta rather than presenting an older
release as new. Owner review and refreshed release-status checks are required
before any future publication decision.
