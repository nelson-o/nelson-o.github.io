# Node.js 26 LTS runtime-image article: source ledger

Research checked on 2026-11-08 UTC. All four localized editions remain `published: false`.

| Source | Verified facts used | Boundaries |
| --- | --- | --- |
| [Node.js 26.13.0 official release](https://nodejs.org/en/blog/release/v26.13.0) | Released 2026-10-28; 26.x enters LTS as Lithium, updates planned through April 2029; LTS metadata is the only change from 26.12.1; official Linux binaries link libatomic starting with Node 25. | A dated release analysis, not a claim that 26.13.0 is the latest patch or an upgrade recommendation for a particular application. |
| [BUILDING.md at v26.13.0](https://github.com/nodejs/node/blob/v26.13.0/BUILDING.md#official-binary-platforms-and-toolchains) | Runtime libatomic availability requirement; common distribution package names `libatomic`/`libatomic1`; distinct supported-platform and official-build-toolchain documentation. | No claim that all images are missing the library or that every Linux distribution needs the same installation command. |
| [Node-API documentation at v26.13.0](https://nodejs.org/docs/v26.13.0/api/n-api.html#implications-of-abi-stability) | Node-API ABI guarantee does not automatically cover other Node.js APIs or external libraries used by native addons. | No claim that Node-API makes an arbitrary binary portable across OS/architecture combinations. |

The staged startup/import/behavior gates, compact CI matrix, static-frontend distinction, and complete-artifact rollback review are engineering analysis. The multi-stage-image scenario is explicitly hypothetical. No runtime migration, container failure reproduction, or speed benchmark was performed for this article. No private project or personal experience is represented.

Distinctness check: current main `1c4edbe98491a4e45b78a657658371a9c331385a` has no Node.js 26/runtime-image article. This topic does not repeat the preserved Playwright 1.65/Bun draft or the existing UI-review-evidence draft.
