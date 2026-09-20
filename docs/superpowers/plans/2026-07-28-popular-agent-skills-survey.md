# Popular Agent Skills Survey Implementation Plan

**Goal:** Create a source-backed, unpublished English structural draft of an `ideas` post surveying popular developer agent skills observed from April 27 through July 27, 2026. Stop at the user review gate before polishing, localization, or publication.

## Global Constraints

- Preserve static export and GitHub Pages compatibility.
- Work only on `content/popular-agent-skills`; do not touch the unrelated `next-env.d.ts` change in the main checkout.
- Use primary sources for factual claims and cite them near the relevant prose.
- Treat popularity as triangulated visibility, maintenance, recurrence, and reuse; do not present stars as usage or publish a numeric ranking.
- Inspect third-party skill instructions before any hands-on test. Use only temporary, credential-free fixtures and avoid side effects outside the fixture.
- Keep the English article at `content/en/ideas/260727-popular-agent-skills-modern-development.mdx` with `published: false`.
- This execution stops after the English structural draft and its verification. Polishing, four-locale translation, and changing `published` to `true` require later user approval.

## Task 1: Build the primary-source research ledger

Create `docs/research/2026-07-27-agent-skills-survey.md`.

- Record the cutoff date and observation window.
- Survey official product documentation and catalogs, maintained public skill repositories, releases, cross-client support, and registries only where registry claims can be traced to repositories.
- Capture evidence for six workflow groups: framing/specification, planning/context, implementation discipline, debugging/recovery, review/quality, and verification/shipping.
- Capture the separate rise of narrow vendor/framework domain skills.
- Select five representative hands-on candidates: framing, implementation discipline, debugging, review/verification, and domain knowledge. Apply the evidence rubric; break ties in favor of active maintenance, inspectability, and cross-client portability.
- Inspect each selected skill and run safe fixture-based observations where feasible. Record trigger model, context cost, workflow constraints, expected benefit, friction, and safety concerns. If direct execution is not reliable or safe, document inspection-only evidence rather than simulating a result.
- Cite every externally verifiable claim with a direct primary-source link.

## Task 2: Draft the unpublished English article

Create `content/en/ideas/260727-popular-agent-skills-modern-development.mdx` with title `What Popular Agent Skills Reveal About Modern Development`, date `2026-07-27`, a concise summary, appropriate `llm` disclosure, and `published: false`.

Write a structural draft, not final polished prose, using this reader journey:

1. Skills became a development layer: define agent skills briefly and state the thesis that recurring workflow patterns are more useful than a leaderboard.
2. How the survey was built: disclose the April 27–July 27 window, sources, signals, and limits.
3. The workflow map: framing, planning/context, implementation discipline, debugging, review, and verification/shipping. For each, cover recurring pain, representative examples, popularity evidence, one grounded observation, and a limitation.
4. The parallel rise of domain skills: distinguish narrow source-backed knowledge packages from process skills.
5. What hands-on use changed: synthesize the five representative observations without benchmark scoring.
6. What popularity reveals: reusable process infrastructure, portability, constrained freedom at fragile moments, and supply-chain/context-cost risks.
7. A starter stack: recommend five capabilities—framing, planning/context, TDD, debugging, and verification/review—plus previewing, pinning, inspecting, incremental adoption, trigger testing, and removing duplication.
8. Closing: ask which parts of an engineering process deserve to become explicit, reusable, and inspectable.

Keep paragraphs compact and preserve the site's first-person practitioner voice. Clearly distinguish sourced facts, inference, and personal judgment.

## Task 3: Review and verify the draft checkpoint

- Review the research ledger and article together for structural logic, unsupported claims, citation accuracy, contradictions, overclaiming, and MDX/frontmatter validity.
- Confirm the article remains unpublished and no localized files or parity exceptions have been added yet.
- Run `bun run test`, `bun run typecheck`, and `bun run build`.
- Commit the research ledger, plan, and English draft on the content branch.
- Stop and ask the user to review the structural draft before polishing, translating to zh-TW/zh-CN/ja, or publishing.
