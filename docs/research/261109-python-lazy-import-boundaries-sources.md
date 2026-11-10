# Python 3.15 lazy-import article: public source ledger

Research checked 2026-11-09 UTC. All four locale editions remain `published: false`.

| Primary source | Verified facts used | Limits |
| --- | --- | --- |
| [Python 3.15.0 release](https://www.python.org/downloads/release/python-3150/) | Stable release dated October 9, 2026; explicit lazy imports listed among the additions. | Historical release date, not a claim that 3.15.0 is the newest patch or a fresh announcement. |
| [Python 3.15 language reference: lazy imports](https://docs.python.org/3.15/reference/simple_stmts.html#lazy) | `lazy import` and `lazy from` bind proxies; first use loads the module; from-style imports load the whole module; scope restrictions; loading errors arise on use. The following compatibility section documents `__lazy_modules__`. | Canonical 3.15 documentation consulted after PEP 810 points readers there; no claim of running a Python 3.15 migration or example. |
| [PEP 810: import-time side effects](https://peps.python.org/pep-0810/#how-do-lazy-imports-affect-modules-with-import-time-side-effects) | Side effects defer until first use; explicit initialization is recommended over reliance on import order. | Historical design explanation. The article does not quote the PEP's benchmark percentages or claim those results apply to an application. |

CLI help/export scenarios, broad-exception review, fresh-process registration tests, controlled comparisons, and latency-budget decisions are engineering analysis and proposed checks. No Python example, migration, startup experiment, benchmark, or private project experience is presented as executed. The article uses inline syntax descriptions, not a purported runnable demonstration.

Distinctness checked against main `fc05d9704e326e147636387b7ae29c06ba5615d8`: no existing lazy-import article; independent of the unpublished Node.js 26 runtime-image article and the preserved Playwright/Bun draft. Existing drafts remain untouched.

Prewriting check on November 9 at 01:06:45 UTC (09:06:45 Asia/Taipei), refreshed immediately before authoring: zero post PRs on the Taipei day, no open PRs, latest post PR #255 created November 8 at 07:15:31 UTC (over 17 hours earlier). Recheck immediately before opening the one permitted post PR for this run.
