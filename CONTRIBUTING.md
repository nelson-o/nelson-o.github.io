# Contributing

This is the shared contribution contract for human and agent work on Nelson's
personal site. [AGENTS.md](AGENTS.md) contains agent workflow and account/commit
identity checks; [maintenance notes](docs/maintenance.md) contain architecture,
file-quality, content and post-proposal policy. Keep those specialized policies
in their existing homes rather than copying them here. Use the
[PR template](.github/pull_request_template.md) as a prompt, not a second policy.

## Working with pull requests

Read the current base, applicable guidance, issue discussions and open PRs before
editing. Preserve unrelated work and review decisions. Keep each PR independently
reviewable; do not split changes merely to increase the PR count.

- Every change requires a scoped branch and draft PR, including code, config, routing, dependencies, deployment, UI, content, and documentation. Do not push directly to `main`.
- Stacked PRs are allowed when useful to avoid conflicts. Name the base PR and intended merge order in each dependent PR.
- Branch names should be scoped and descriptive, such as `content/<slug>`, `fix/<issue>`, `ui/<area>`, `docs/<topic>`, or `chore/<task>`.
- Prefer Conventional Commit style for code and config changes: `feat:`, `fix:`, `docs:`, `content:`, `test:`, `refactor:`, `perf:`, `ci:`, or `chore:`.
- Content-only commits may use either `content: short summary` or a short imperative summary when that reads better.
- Commit subjects should be concise, imperative, and specific. Avoid vague summaries like `update files`.
- PRs should include what changed, why it changed, verification commands and results, and any skipped checks or known risks.
- Do not push or open a PR with failing required verification unless the user explicitly asks for a work-in-progress handoff.

Use only the authorized `nelson-o` account and the author/committer identity
specified in [AGENTS.md](AGENTS.md#git-branch-commit-and-pr-conventions). Opening a
PR does not authorize merging, auto-merge, publication, deployment, or a push to
`main`; those require separate owner authorization.

## Issues, evidence and caveats

- Link relevant issues and map their acceptance criteria to the implemented
  behavior and evidence. For partial work, list the remaining criteria explicitly.
  If no issue applies, say so and describe the requested outcome; do not create
  a token issue solely to fill the template.
- Use `Refs #123` or an ordinary link for related/partial work. Use a closing
  keyword such as `Closes #123` only when this PR resolves the whole issue,
  including its required acceptance. Do not manually close it in anticipation
  of a merge; owner approval or deployed verification may still be outstanding.
- Link reproducible evidence: relevant source/diff, exact commands and results,
  CI run and tested head SHA, and applicable visual comparisons. Distinguish
  passed, failed, skipped, pending and blocked checks. Do not call CI verified
  using results from another commit; refresh evidence after changing the head.
- Resolve caveats within scope where possible. For each remaining limitation,
  explain its impact, why it remains, and a concrete follow-up or required owner
  decision (link an existing issue when useful). Do not hide caveats behind a
  checked box or call partially met acceptance complete.
- Report access/capture blockers honestly with the affected action and available
  evidence. Do not bypass a denied route. Exclude secrets, private conversation
  text, credentials and unrelated personal or employer data from all evidence.

## Verification

Use Bun. `bun run verify` runs unit tests, typecheck, lint and the production
build. Choose relevant browser regressions for affected behavior and report
which actually ran. The following gates apply:

- Documentation-only changes: manually review the affected markdown. No production build is required unless commands, hosting rules, or contribution policy meaning changes.
- MDX/content changes: run `bun run build`. Also run `bun run test` and `bun run typecheck` when frontmatter, routing, locale parity, or content loading is affected.
- UI, component, or styling changes: run `bun run test`, `bun run typecheck`, and `bun run build`. Run relevant Playwright tests when navigation, theme, layout, or exported-page behavior changes.
- Routing, content-loader, export, config, or deploy changes: run `bun run test`, `bun run typecheck`, `bun run build`, and relevant e2e checks.
- Dependency changes: use Bun, keep `bun.lock` aligned, and run the full verification set that covers the changed behavior.
- Treat `bun run build` as the final gate for route, content, and export behavior.

## Before/after visual evidence

Screenshots are applicable to rendered UI, component, styling, layout, content or
profile-data changes. Videos are applicable when a still image cannot adequately
show the changed behavior, such as animation, drag interactions, focus/scroll
sequences or a timing-dependent bug. Do not require a video for every UI change.
Record **both** screenshot and video applicability in the PR, with a reason for
N/A or a concrete capture blocker and substitute verification.

For applicable videos, record short before/after clips with the same steps,
route, viewport, locale, theme and input method. Identify base/head SHAs and
explain the observed behavior. Use the same production-export, review and asset
hosting rules below; do not record unrelated windows, credentials or private data.

Every PR that touches UI, components, styling, layout, rendered content or profile data gets a PR comment with labelled before/after screenshots when capture is possible. Post it once the PR is open, as part of the work. If capture is blocked, explain the concrete blocker and available verification instead; do not present structural evidence as a visual comparison.

- Capture both sides from production exports (`bun run build`): **before** from the PR's actual base (`main` or the named parent branch for a stack), **after** from the PR branch. Record both branches and commit SHAs in the comment.
- Serve each `out/` copy locally and capture both sides with identical settings: same route, locale, theme, viewport and device scale factor, with fonts loaded and animations disabled. Crop to the changed block rather than the whole page.
- Use `bun run capture` (see [page captures](docs/page-captures.md)) for full-page captures. A plain full-page screenshot can miss deferred artwork, fading sections or the tagline mid-animation; the script settles those first.
- Compose each pair into one side-by-side image labelled `Before — <base branch>` and `After — #<PR>`. Mobile widths use the same side-by-side layout.
- Cover the widths, themes and locales the change affects. Default to 1280px and 390px in light theme, and add dark theme or other locales when the change is theme- or language-sensitive.
- If the PR is meant to change structure but not appearance, show an identical normal-state pair. Then add a stress pair that shows what the change protects: for example reordered or long-string data, applied as an uncommitted local edit to both builds.
- If a PR changes no rendered output (docs, tests), say so in the comment. Screenshot the current state only when the PR records a decision about it.
- Host screenshots and short, repository-relevant video files on an orphan branch named `pr-assets/<PR>` (`review-assets/<issue>` for issue comments). Build it with `git hash-object`, `git mktree` and `git commit-tree` so the working tree is never touched, then push it with the verified `nelson-o` credential. Pushes to these branches trigger no workflows, because `deploy.yml` runs only on pull requests and pushes to `main`. Recheck this if the workflow triggers change. Link assets by commit-pinned `raw.githubusercontent.com` URLs, and check that one returns HTTP 200 before posting.
- Never commit screenshots or videos to `main` or the PR branch. Do not delete a `pr-assets/*` or `review-assets/*` branch: that breaks the images in the comment.
- View every image and watch every video before posting it, and describe only what the captures actually show. If they reveal a defect outside the PR's scope, report it in the comment rather than fixing it silently.

## Agent measurements

Include one fenced JSON report in the PR body or a linked PR comment for work
performed by an LLM agent. Update it at handoff; label partial windows explicitly.
Human-only work may use `{"scope":"Human-only contribution; no LLM agent used","agents":[]}`.
This is a small review record, not a new telemetry service or a requirement to
collect unavailable runtime data.

Use the shape below. The nulls illustrate an unavailable record, not measured
zeros; replace values only with genuine observations. Use one entry per agent
with a distinct ID and an explicit measurement scope/source.

```json
{
  "scope": "Observed work for this PR; define included and excluded activity",
  "window": { "started_at": null, "ended_at": null },
  "wall_time_seconds": null,
  "summed_agent_seconds": null,
  "agents": [
    {
      "id": "primary",
      "scope": "Define the covered agent session/window",
      "provider": null,
      "model": null,
      "reasoning_effort": null,
      "tokens": {
        "input": null,
        "output": null,
        "cached_input": null,
        "reasoning_output": null,
        "total": null
      },
      "elapsed_wall_seconds": null,
      "provenance": {
        "identity": "No exact provider/model/effort telemetry exposed",
        "tokens": "No usage counters exposed",
        "time": "No recorded start/end timestamps"
      },
      "unavailable_reasons": {
        "provider": "Not exposed",
        "model": "Not exposed",
        "reasoning_effort": "Not exposed",
        "tokens": "Not exposed",
        "elapsed_wall_seconds": "Not measured"
      }
    }
  ],
  "estimates": [],
  "notes": ["Window, wall time and summed agent time are unavailable: no timestamps recorded"]
}
```

- Report exact provider/model identifiers and reasoning effort only when exposed
  by the session or authorized usage output. Do not infer an exact model from a
  product name or guess an effort setting. Use `null` plus an unavailability
  reason for every missing measurement, including individual token fields.
  One shared reason may cover fields unavailable from the same source.
- Use authorized, available counters and clock readings. Describe their source
  and scope, including whether retries, tools or earlier turns are excluded.
  Never scrape restricted runtime files or private logs to fill the report.
- Treat token categories according to the provider's definitions. Cached input
  and reasoning output may be subsets of input/output: record that in provenance
  and do not add subsets again. Supply `total` only when the provider reports it
  or a documented non-overlapping calculation is possible; otherwise use `null`.
  Missing usage is unknown, not zero. Do not present partial counters as task totals.
- UTC start/end timestamps define the elapsed **wall** time for the stated
  window, including waits unless stated otherwise. Per-agent elapsed times can
  overlap; `summed_agent_seconds` is their sum only when all scopes are known,
  not the task's wall time or active compute time. Do not count child usage twice
  when a parent counter already includes it; state aggregate-counter coverage.
- Keep estimates separate in `estimates`, each with the field, value, unit,
  method and scope. Never label estimates as measurements. Do not infer monetary
  cost from partial usage or elapsed time; omit it unless supported by separately
  identified billing evidence.
- Keep the record proportionate: no prompts, secrets or private runtime data.
  Missing telemetry does not itself block a PR when the limitation is explicit.

## Handoff

Link the PR, tested head/base, verification and CI outcomes, relevant issue
coverage, caveats/follow-ups, visual evidence (or explained N/A), and measurement
JSON. Mention pre-existing changes left untouched. Do not claim route, content
or export work complete without a successful production build, or imply a draft
PR has been deployed.
