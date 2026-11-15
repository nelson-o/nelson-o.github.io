# React Fragment refs — source ledger

Checked 2026-11-12. All four editions remain unpublished. This evaluates an existing
stable feature; it is not a new-release announcement, executed migration, benchmark
or accessibility audit. No application dependency is upgraded.

| Primary source | Supported boundary |
| --- | --- |
| [React 19.3 announcement](https://react.dev/blog/2026/09/09/react-19-3), September 9, 2026 | Dated stable release and wrapper-free imperative access through Fragment refs. |
| [React versions](https://react.dev/versions), checked November 12 | Confirms 19.3.0 release date and current documentation version. |
| [Fragment reference](https://react.dev/reference/react/Fragment), checked November 12 | Explicit ref syntax, FragmentInstance handle, and different traversal targets for focus versus listeners/observers. No claim of one ordinary container or automatic accessibility compliance. |

The results-component scenario, responsibility inventory, explicit focus contract,
event/observer review, repeated-work checks and evidence matrix are proposed
engineering analysis, not observed results. No numerical performance claims or
third-party compatibility claims are made. Actual adoption should verify the
chosen framework and React versions and retain the necessary semantic markup.

Main and recent/open PRs were checked for duplicate topics. The existing
TypeScript, Vite, Python and Node drafts address different concerns. Preserved
Playwright/Bun and series work is untouched. The article is stacked on #267 only
to inherit its reviewed CI environment; that infrastructure PR must merge first.
