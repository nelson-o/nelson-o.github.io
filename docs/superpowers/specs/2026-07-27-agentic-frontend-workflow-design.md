# Frontend Development as Agentic Engineering Takes Shape — Writing Design

## Purpose

Develop a multilingual `ideas` article about the early stage of agentic engineering. Agents already participate in software delivery, but teams are still reshaping scope, ownership, review, release, and daily routines around them.

The article should give developers, product managers, designers, and engineering leads a practical picture of work already changing. It should avoid presenting agentic engineering as either a distant future or a finished era.

## Audience

- Software engineers adapting their individual delivery workflow.
- Product managers and designers working with agent-assisted engineering teams.
- Engineering leads improving team guardrails and review systems.

The article should connect these roles through one delivery workflow rather than discussing each profession in isolation.

## Central Argument

Teams already have one foot in agentic engineering. Agents can gather repository context, draft cross-file changes, and accelerate iteration, but they do not remove the need to define outcomes, settle trade-offs, verify behavior, and own production consequences.

The immediate work is to rebuild the delivery loop around this capability:

```text
user outcome and acceptance criteria
  -> bounded agent task
  -> small reviewable diff
  -> design and implementation review
  -> targeted automated evidence
  -> shared preview
  -> controlled rollout
  -> production feedback
```

Production evidence should improve the acceptance criteria, fixtures, contracts, component APIs, and repository guidance used by later changes.

## Narrative Approach

Use **workflow under construction** as the main narrative.

Follow an “add one filter” request through product definition, interaction design, frontend state, API contracts, tests, preview, rollout, and production feedback. Keep the work recognizable to people who ship software.

Avoid broad abstractions such as “implementation scarcity,” “control plane,” and “center of gravity” when a concrete engineering term can carry the argument.

## Article Structure

### 1. Add one filter

Open with a small request that immediately exposes product and engineering decisions: target users, defaults, URL state, API shape, empty and error states, analytics, rollout, and rollback.

Introduce **agentic engineering** as an early practice already entering daily work, not as a completed “Agent era.”

### 2. What agents already change

Describe current capabilities: repository search, finding comparable implementations, tracing components and clients, making bounded cross-file edits, drafting tests, and revising a diff from review feedback.

Balance the speed with present failure modes: copying existing mistakes, choosing unnecessary abstractions, encoding unverified assumptions in tests, and breaking adjacent workflows.

### 3. The routine is being rebuilt

Define a practical loop from change contract through production feedback. Explain the purpose of contract, component, accessibility, and end-to-end tests, preview environments, feature flags, telemetry, and rollback paths.

### 4. Ownership changes, but does not disappear

Give concrete ownership to product management, design, frontend, backend, full-stack, and platform engineering. Show where those responsibilities overlap during delivery.

Product management is a co-owner of the workflow through user outcomes, priority, acceptance criteria, success metrics, rollout, and follow-up decisions.

### 5. Guardrails are part of feature delivery

Connect platform investment to individual feature quality through component APIs, typed clients, schemas, fixtures, repository instructions, CI, previews, observability, and reversible releases.

Keep guardrails proportional to risk and acknowledge that noisy tests and vague instructions require maintenance.

### 6. One foot in the new workflow

Close with the mixed reality of current teams. Manual implementation, agent-generated diffs, and agent-assisted investigation can all occur in the same sprint.

Emphasize that teams are still learning how to scope tasks, size generated changes, choose human intervention points, and distinguish useful evidence from ceremony.

## Editorial Rules

- Use short paragraphs, with a target maximum of 240 characters per paragraph.
- Prefer concrete software-development and product-management terms.
- In localized editions, write native prose rather than literal translations.
- Retain standard technical terms such as API, CI, PR, schema, rollout, and rollback where practitioners commonly use them.
- Introduce the English term “agentic engineering” once in each localized article, then use a natural local short form.
- Keep all four locales aligned in argument, examples, section order, publication state, slug, and `translationKey`.

## Publication

- Shared slug and `translationKey`: `260727-agentic-frontend-workflow`.
- Locales: English, Japanese, Simplified Chinese, and Traditional Chinese.
- Publication state: `published: true` in every locale.
- The old `260727-frontend-development-pre-agentic-era` slug was never published and requires no redirect.

The production build is the final publication gate because it validates the static export served by GitHub Pages.
