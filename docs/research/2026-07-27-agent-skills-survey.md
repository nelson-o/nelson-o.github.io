# Agent skills survey: a primary-source research ledger

**Cutoff:** 2026-07-27 (end of day, Asia/Taipei)
**Observation window:** 2026-04-27 through 2026-07-27
**Evidence retrieved:** 2026-07-28, then limited to sources that document the format, public catalogs, or releases visible by the cutoff. This is a bounded qualitative survey, not a measure of usage or a ranking.

## Question and method

This ledger asks what recurring developer workflow patterns are being packaged as agent skills. It does not infer adoption from GitHub stars, marketplace placement, or registry installs. The sample is deliberately small: 12 first-party or repository-owner sources, plus five directly inspected skill files. A source counted as a catalog or registry is used only when it points back to a repository or its source files.

The survey uses these evidence signals:

1. **Explicit task trigger:** a description says when a skill should load.
2. **Repeatable workflow:** the source specifies a sequence, gate, or check rather than generic advice.
3. **Inspectability:** instructions and any referenced scripts can be read before use.
4. **Portability:** the format or package is documented for more than one client or surface. This is package-format portability, not a claim that one install location works everywhere.

### Required popularity-signal handling

The required signals are operationalized as source-backed proxies, not usage measurements. **Visibility** means a selected package is publicly listed in an owner or maintainer repository; **maintenance** requires a dated, immutable in-window release or commit, and is recorded as **not established** when the available evidence is a mutable branch retrieved after the cutoff; **recurrence** means the inspected instructions prescribe a repeated workflow or explicit gate; and **reuse** means the source documents a reusable package or distribution across clients, not that people actually installed it. The candidate table identifies all four for every selected pattern. It retains the no-usage/no-ranking caveat.

Ties are resolved in this order: dated maintenance evidence where available, inspectability, then cross-client portability. These signals make a candidate representative of a visible workflow pattern; they do not prove popularity or effectiveness.

## Format, distribution, and limits

The [Agent Skills specification](https://agentskills.io/specification) defines a skill as a directory with `SKILL.md` and optional scripts, references, and assets. It also specifies progressive disclosure: metadata is loaded first, the instruction body on activation, and resources only as needed. [Anthropic's overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) and [OpenAI's skills guide](https://learn.chatgpt.com/docs/build-skills) describe the same staged loading model on their respective products.

That shared shape should not be mistaken for universal runtime portability. [GitHub's Copilot guidance](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills) documents several project and personal discovery directories and says skills may bundle scripts; [Anthropic's documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) says custom skills do not automatically sync between Claude surfaces. The portable unit is therefore the inspected skill package and its conventions, not a single filesystem path.

The distribution evidence is concrete but not exhaustive: [OpenAI documents standalone skills across the ChatGPT desktop app, Codex CLI, and IDE extension](https://learn.chatgpt.com/docs/build-skills), [GitHub documents Copilot skills across its cloud agent, code review, CLI, app, and VS Code agent mode](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills), and the [Superpowers repository lists installation paths for several agent hosts](https://github.com/obra/superpowers). This supports an inference that reusable workflow packages are crossing client boundaries; it does not establish that their behavior is identical across them.

## Workflow map

| Workflow group | Primary-source evidence | What recurs in the skill model | Boundary of this finding |
| --- | --- | --- | --- |
| Framing / specification | The [Superpowers workflow](https://github.com/obra/superpowers) places `brainstorming` before writing code and describes design refinement and approval; the selected file makes that gate explicit. | Requirements discovery, alternatives, design review, and a written spec become an explicit pre-implementation workflow. | This describes one publicly inspectable collection, not a universal team practice or an in-window maintenance finding. |
| Planning / context | The same [workflow catalog](https://github.com/obra/superpowers) lists `writing-plans`, plan execution, and worktrees; the [Agent Skills specification](https://agentskills.io/specification) recommends on-demand references to control context. | Plans and repository context are separated from always-loaded instructions. | A skill can add context; it cannot guarantee that an agent will select or follow it. |
| Implementation discipline | The selected [test-driven-development skill](https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md) requires a failing test before production code; the repository places it in the implementation phase. | The implementation loop is encoded as a hard gate and repeated verification cycle. | It is procedural guidance, not evidence that the resulting tests are good. |
| Debugging / recovery | The selected [systematic-debugging skill](https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md) requires root-cause investigation before fixes; GitHub's own example skill directs an agent to inspect failed workflow logs, reproduce, and then fix. | Evidence collection and reproduction precede speculative repair. | This does not benchmark debugging accuracy. |
| Review / quality | [Superpowers lists requesting and receiving code-review skills](https://github.com/obra/superpowers); [GitHub documents that relevant skills can be used by Copilot code review](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills). | Review is a distinct, triggerable workflow rather than a generic final prompt. | Review coverage depends on the host and the skill's trigger description. |
| Verification / shipping | The selected [verification-before-completion skill](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md) makes fresh command output a precondition for completion claims. The [release notes](https://github.com/obra/superpowers/blob/main/RELEASE-NOTES.md) are a post-cutoff, mutable-branch inspection only and are not used as in-window maintenance evidence. | Completion is reframed as a claim that needs newly collected evidence. | A passing command proves only the behavior that command covers. |

### The parallel domain-skill track

Alongside process skills, repositories contain narrow packages that bring vendor or framework knowledge into a task. [Anthropic's public skills repository](https://github.com/anthropics/skills) describes examples ranging from technical tasks to document and enterprise workflows, and its platform documentation identifies an open-source Claude API skill that carries current API material and SDK guidance. [OpenAI's curated `openai-docs` skill](https://github.com/openai/skills/blob/main/skills/.curated/openai-docs/SKILL.md) is a comparable vendor-specific example: it routes an agent to first-party documentation and its docs tools rather than to general web recall.

This is evidence of a parallel **domain-knowledge package** pattern, not evidence that domain skills are replacing workflow skills. The categories are complementary: a process skill constrains how work proceeds; a domain skill constrains where the agent looks and what specialized facts it uses.

## Candidate selection

Five candidates were selected to cover the requested roles. Each meets the explicit-trigger and inspectability tests. The first four are in the same public collection, which makes their related workflow assumptions readable together; the fifth is owner-published and intentionally domain-specific. The table does not infer in-window maintenance from mutable branch URLs inspected after the cutoff.

| Candidate and role | Trigger and source evidence | Visibility / maintenance / recurrence / reuse evidence | Selection decision |
| --- | --- | --- | --- |
| [`brainstorming`](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md) — framing | Says to use before creative work that changes behavior. | **V:** publicly listed source. **M:** not established in-window; mutable branch inspected post-cutoff. **R:** explicit questions, alternatives, approval, and design gates. **Re:** [multi-host distribution is documented](https://github.com/obra/superpowers), not actual installs. | Selected for an explicit pre-code design gate. |
| [`test-driven-development`](https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md) — implementation discipline | Says to use before implementation code for features or bug fixes. | **V:** publicly listed source. **M:** not established in-window; mutable branch inspected post-cutoff. **R:** RED–GREEN–REFACTOR cycle. **Re:** same documented package distribution, not actual installs. | Selected for a concrete RED–GREEN–REFACTOR constraint. |
| [`systematic-debugging`](https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md) — debugging / recovery | Says to use on bugs, test failures, and unexpected behavior before proposing fixes. | **V:** publicly listed source. **M:** not established in-window; mutable branch inspected post-cutoff. **R:** phased reproduce–hypothesize–verify workflow. **Re:** same documented package distribution, not actual installs. | Selected for its staged root-cause workflow. |
| [`verification-before-completion`](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md) — review / verification | Says to use before claiming work complete, fixed, or passing. | **V:** publicly listed source. **M:** not established in-window; release notes are only mutable post-cutoff inspection. **R:** identify–run–read–verify gate. **Re:** same documented package distribution, not actual installs. | Selected as the final evidence gate, rather than treating a code-review prompt as equivalent to verification. |
| [`openai-docs`](https://github.com/openai/skills/blob/main/skills/.curated/openai-docs/SKILL.md) — domain knowledge | Its description targets OpenAI/Codex questions and requires official-source routing. | **V:** owner-published [catalog source](https://github.com/openai/skills). **M:** not established in-window; mutable source inspected post-cutoff. **R:** repeatable official-doc source route. **Re:** reusable catalog package; cross-client reuse was not established. | Selected as a narrow, inspectable vendor-domain skill; lower portability is expected and is part of the contrast. |

## Inspection protocol and observations

**Safety protocol.** Each candidate was inspected from its installed `SKILL.md` copy and checked against its public source. Static checks recorded line and word counts plus trigger, gates, referenced resources, and tool-affecting instructions. I did **not** invoke these skills against a fabricated development task: four can instruct an agent to write files, run commands, commit, or hand work to other agents, and the domain skill may fetch remote documentation or ask to configure a docs connection. There is no deterministic local skill runner that would make an agent's resulting behavior a reproducible fixture observation. The rows below are therefore clearly marked **inspection-only**; no simulated success or benchmark score is reported.

| Candidate | Inspection-only observation | Context cost | Expected benefit | Friction and safety concern |
| --- | --- | --- | --- | --- |
| `brainstorming` | **Inspection-only.** The 151-line / 1,494-word file makes its own description the trigger, then requires one-at-a-time questions, alternatives, a design, a committed design document, and user review before implementation. | Moderate on activation; metadata is the normal always-loaded cost, while the full body loads only after selection under the [specification's staged model](https://agentskills.io/specification). | Makes assumptions and approval gates visible before edits begin. | High interaction cost for small changes; its hard gate can conflict with a user who has already supplied an approved plan. It asks for a commit, so invocation needs normal repository authority. |
| `test-driven-development` | **Inspection-only.** The 320-line / 1,375-word file requires a failing test before production code, then a minimal fix, passing test, and refactor. | Moderate; its body includes examples and rationalization checks. | Creates an observable regression check and limits speculative implementation. | It is intentionally strict and can be poorly matched to generated files, configuration, or work that cannot be exercised safely. Running tests can be slow or mutate local caches. |
| `systematic-debugging` | **Inspection-only.** The 283-line / 1,440-word file sequences reproduction, recent-change inspection, evidence gathering, a single hypothesis, a minimal test, and a verified fix. | Moderate; the main value is the ordered checklist rather than bundled automation. | Reduces blind patching by requiring a causal explanation first. | Reproduction, logging, and diagnostic changes may expose sensitive data or create noise; urgent incidents may need a separately authorized mitigation path. |
| `verification-before-completion` | **Inspection-only.** The 120-line / 580-word file asks what command proves a claim, requires running it and reading its full output, then permits the claim. | Low among the five inspected bodies. | Separates evidence from assertion at the shipping boundary. | A narrow command can create false confidence; command choice, environment parity, and scope still need human judgment. The required command may be expensive or have side effects. |
| `openai-docs` | **Inspection-only.** The installed copy is 183 lines / 3,153 words. It uses a precise trigger, routes to official documentation and docs tools, and tells the agent to stop with bounded uncertainty when the source route cannot establish a claim. | High relative to the workflow candidates once activated; it carries product-routing detail. | Replaces stale recall with a named, first-party evidence path for a narrow domain. | Requires docs connectivity and may direct a local setup command if a docs server is unavailable. Treat that setup as a separate, permissioned action; do not grant it implicitly. |

### What the inspection supports

The five files encode constrained decision points, not autonomous expertise: define the change before implementation, write a failing test, establish a root cause, collect fresh verification evidence, or consult the authoritative domain source. That is the strongest cross-cutting observation in this sample.

The context trade-off is also visible. The [specification](https://agentskills.io/specification) recommends loading metadata first and resources later, while [OpenAI documents a bounded initial skills list](https://learn.chatgpt.com/docs/build-skills). Inference: narrow triggers and reference splitting are part of operational design, not merely documentation style. The ledger does not measure token use on a particular model.

## Gaps and non-claims

- This is not an exhaustive catalog, a marketplace scrape, or a popularity ranking. No registry install counts, star counts, or secondary directory figures are used as usage evidence.
- The retrieval date is one day after the cutoff. Source ownership and release material were checked, but this ledger cannot reconstruct every file revision exactly as it stood at the cutoff without pinned archival revisions.
- Four candidates share a repository, so the sample is deliberately strong on one coherent development methodology and weak on independent competing process packs.
- Inspection reads instructions, not an agent's hidden selection policy, tool permissions, or model behavior. A matching description does not guarantee invocation.
- No third-party executable or external script was run. This avoids unsafe simulation but leaves runtime ergonomics, host compatibility, and outcome quality unbenchmarked.
- Domain-skill evidence shows a distinct pattern of vendor/framework packages; it does not quantify a market-wide "rise."

## Primary-source register (12 documents)

1. [Agent Skills specification](https://agentskills.io/specification) — common package shape, progressive disclosure, and validation.
2. [Anthropic: Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — staged loading, availability, safety, and surface limits.
3. [OpenAI: Build skills](https://learn.chatgpt.com/docs/build-skills) — Codex/ChatGPT trigger and context behavior, local discovery, and distribution.
4. [GitHub: Adding agent skills for Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills) — skill directories, scripts, review integration, and installation safety.
5. [obra/superpowers repository](https://github.com/obra/superpowers) — public workflow catalog and host-distribution claims.
6. [Superpowers release notes](https://github.com/obra/superpowers/blob/main/RELEASE-NOTES.md) — post-cutoff mutable-branch inspection; not used as in-window maintenance evidence.
7. [Superpowers `brainstorming` source](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md) — framing candidate.
8. [Superpowers `test-driven-development` source](https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md) — implementation candidate.
9. [Superpowers `systematic-debugging` source](https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md) — debugging candidate.
10. [Superpowers `verification-before-completion` source](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md) — review/verification candidate.
11. [OpenAI `openai-docs` source](https://github.com/openai/skills/blob/main/skills/.curated/openai-docs/SKILL.md) — domain candidate.
12. [Anthropic public skills repository](https://github.com/anthropics/skills) — owner-maintained domain and technical-skill catalog.
