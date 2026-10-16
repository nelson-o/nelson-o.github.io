# Entry covers

Issue #144 implements the approved D5/D6 build-time cover contract. Run
`bun run assets:covers`; `bun run build` also runs it before static export.
Commit generated `public/covers/` assets alongside source changes so tests
can verify every referenced asset before the build. Generation is deterministic.

Explicit `cover` sources use the validated #141 resolver: `/` means public/;
`./` means the MDX file's directory, including nested slugs. Missing sources
and symlink escapes fail generation. Sharp rotates and crops them to the
approved 1:0.618 ratio and writes 640, 960 and 1200px WebP. Explicit covers
retain their original appearance in both themes. Authors must supply provenance
for any new explicit source alongside that source; none are added here.

Fallback art is original geometric artwork defined in
`scripts/generate-entry-covers.ts`, created for this repository. It uses no
external images, fonts or licensed stock. A stable primary-tag seed (or section
when untagged) chooses an orbital pattern. Both light and dark versions use the
approved palette; CSS follows the site's explicit theme class, including URL
and saved-user settings, without image-selection JavaScript. 640px fallback
assets are checked below 40KB. Existing OG metadata images stay unchanged.

`OgHeroImage` renders responsive covers with reserved dimensions. Article covers
are eager; current cards are lazy. #148 owns final entry-row sizing and first-row
priority when it replaces cards. TopicVisual now chooses its first supplied
image on the server rather than selecting random art after hydration.

The advisory file-count exception keeps generation, selection, presentation,
provenance and regression coverage separate; no unrelated components are refactored.
