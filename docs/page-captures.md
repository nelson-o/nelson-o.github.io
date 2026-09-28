# Page Captures

`bun run capture` saves stable full-page PNGs of the static export, in light
and dark themes, at desktop and phone widths. Use it for PR before/after
screenshots, design reviews, or any time a real full-page image is needed.

## Why not the browser's full-page screenshot

The profile page has effects timed to scrolling or playback. Chrome DevTools'
"Capture full size screenshot" and a plain Playwright `fullPage` capture don't
scroll the page, so results vary between runs:

- Section artwork (the approach mountains, project card backgrounds) waits
  until its section nears the viewport (#133), so it can be missing.
- Sections below the hero fade in with a scroll-driven animation, so they can
  be captured transparent.
- The sticky header can be caught mid-page or in its pinned state.
- The hero tagline animation can be caught half-drawn.

Dark mode needs JavaScript, because a script applies the theme, so turning
JavaScript off only works around this in light mode.

## What the script does

For every route × theme × width it:

1. Serves the export through `scripts/preview-export.ts` on a free port (or uses
   `--base`).
2. Opens the page with `?theme=<theme>`, which wins over any saved preference
   and is never saved, plus a matching `prefers-color-scheme`.
3. Emulates `prefers-reduced-motion: reduce`, which turns off the section
   fade-in and shows the tagline fully drawn.
4. Scrolls to the top, marks deferred artwork ready, loads lazy images, and
   waits for fonts, images and network idle.
5. Takes a full-page screenshot with animations disabled and the caret hidden.

Three runs over the same export give byte-identical PNGs.

## Usage

```bash
bun run build
bun run capture                              # /en/profile/, light + dark, 1280 + 390
bun run capture -- --theme dark --width 1280
bun run capture -- --route /ja/profile/,/en/profile/2025/ --out ~/Desktop/captures
bun run capture -- --base https://nelson-o.github.io   # the deployed site; no build needed
bun run capture -- --help
```

| Option | Default | Meaning |
| --- | --- | --- |
| `--route` | `/en/profile/` | Route to capture. Repeat or comma-separate. |
| `--theme` | `both` | `light`, `dark` or `both`. |
| `--width` | `1280,390` | Viewport widths in CSS pixels. Repeat or comma-separate. |
| `--scale` | `2` | Device scale factor. |
| `--out` | new folder under the system temp dir | Where the PNGs go. Keep them out of the repo. |
| `--dir` | `./out` | Export folder to serve. |
| `--base` | none | Capture a running site instead of serving an export. |

Files are named `<route>-<theme>-<width>.png`, for example
`en-profile-dark-1280.png`; the root route is `home`. The script prints each
path and exits non-zero if a page returns an error status.

## Before/after for UI PRs

Capture both sides with the same options, then crop and compose the pair as
`AGENTS.md` describes:

```bash
# before: main's export, built in a separate worktree and copied out of it
bun run capture -- --dir /path/to/main-out --out /tmp/pr-123/before --route /en/profile/
# after: this branch's export
bun run build
bun run capture -- --out /tmp/pr-123/after --route /en/profile/
```

Never commit captures. Host them on the `pr-assets/<PR>` branch as `AGENTS.md`
describes.

## Manual captures in Chrome DevTools

When capturing by hand, open the Rendering panel (`Cmd+Shift+P` → "Show
Rendering"), set `prefers-reduced-motion` to `reduce` and `prefers-color-scheme`
to the theme you want. Then press `Home` and run "Capture full size
screenshot". Keep JavaScript on in dark mode.

## Known limits

- The header nav highlights whichever section its scroll tracking picked, not
  necessarily the first one.
- Captures show the reduced-motion state: the tagline appears as its static,
  fully drawn image rather than the playing animation.
- Open-by-default disclosures are captured as they render; the script does not
  expand collapsed sections.
