# Agentic-Era Developer Role Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a four-locale `ideas` article explaining how abundant agent-generated code shifts developers toward complexity governance and a gated delivery workflow.

**Architecture:** Create one MDX entry at the same slug in English, Traditional Chinese, Simplified Chinese, and Japanese. Keep every locale unpublished through drafting, translation, polishing, and proofreading; switch all four to published only after explicit user approval and successful static-export verification.

**Tech Stack:** Next.js App Router static export, localized MDX content, Bun, Vitest, TypeScript.

## Global Constraints

- Preserve static export and GitHub Pages compatibility.
- Use the shared slug and `translationKey` `260727-developer-role-after-code-abundance` in every locale.
- Use the publication date `2026-07-27` in every locale.
- Keep `published: false` in every locale until explicit final publication approval.
- Preserve the same argument, section progression, workflow, and anchor claims across all locales.
- Adapt phrasing naturally for each locale; do not translate mechanically or add locale-specific claims.
- Keep human comprehension and machine adaptability complementary rather than oppositional.
- Treat automated checks as evidence, not as a substitute for design judgment and review.
- Do not repeat the existing posts' detailed treatments of agent runtimes, compute economics, or reviewer context reconstruction.
- Do not modify the pre-existing `next-env.d.ts` worktree change.
- Run `bun run test`, `bun run typecheck`, and `bun run build` before claiming the content or its routes are complete.

## File Map

- Create `content/en/ideas/260727-developer-role-after-code-abundance.mdx`: canonical English argument and source for locale parity review.
- Create `content/zh-tw/ideas/260727-developer-role-after-code-abundance.mdx`: Traditional Chinese adaptation using Taiwan engineering terminology and the repo's existing mixed-language style where useful.
- Create `content/zh-cn/ideas/260727-developer-role-after-code-abundance.mdx`: Simplified Chinese adaptation with terminology and grammar natural to that locale.
- Create `content/ja/ideas/260727-developer-role-after-code-abundance.mdx`: Japanese adaptation with natural technical prose rather than sentence-level literal translation.

No application code, routing code, configuration, dependency, or parity-exemption file should change.

---

### Task 1: Write the Four-Locale Unpublished Draft

**Files:**
- Create: `content/en/ideas/260727-developer-role-after-code-abundance.mdx`
- Create: `content/zh-tw/ideas/260727-developer-role-after-code-abundance.mdx`
- Create: `content/zh-cn/ideas/260727-developer-role-after-code-abundance.mdx`
- Create: `content/ja/ideas/260727-developer-role-after-code-abundance.mdx`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-27-agentic-era-developer-role-design.md` as the approved argument and structure.
- Produces: Four parseable, locale-aligned MDX drafts at one shared route slug, all excluded from production export by `published: false`.

- [ ] **Step 1: Create the English draft with exact frontmatter**

Use this frontmatter:

```yaml
---
title: The Developer's Role After Code Becomes Abundant
date: 2026-07-27
summary: As agents make code abundant, developers must shift from producing changes toward governing complexity through design gates, bounded review, revision, and verification.
published: false
translationKey: 260727-developer-role-after-code-abundance
---
```

Write the article in first-person-informed but generally applicable engineering prose. Use these sections in order:

```markdown
## The bottleneck moved
## Code matters differently now
## Cheap code can create expensive complexity
## Passing checks does not make a change good
## The developer becomes the quality gate
## A gated workflow for agentic development
## Prevent slop before it becomes architecture
## What changes for senior developers and engineering leads
## The new definition of engineering leverage
```

Include these three anchor claims verbatim:

```markdown
> When code becomes abundant, controlling complexity becomes the engineering work.

> Generation cost approaches zero; ownership cost does not.

> Verification asks whether the change works. Review asks whether this is the change we should own.
```

Include the workflow as a fenced `text` block:

```text
intent
  -> design gate
  -> bounded agent task
  -> small reviewable change
  -> human review and revision
  -> validation and verification
  -> merge
  -> production feedback
```

Close with the idea that engineering leverage is the ability to prevent, shape, and safely own complexity—not the volume of generated code.

- [ ] **Step 2: Create the Traditional Chinese draft with exact frontmatter**

Use this frontmatter:

```yaml
---
title: 當程式碼變得充裕，開發者的角色是什麼？
date: 2026-07-27
summary: 當 agent 讓程式碼大量生成，開發者的重心必須從產生變更轉向治理複雜度，並透過設計關卡、受限審查、修正與驗證來守住品質。
published: false
translationKey: 260727-developer-role-after-code-abundance
---
```

Use these headings in order:

```markdown
## 瓶頸已經轉移
## 程式碼的重要性正在改變
## 便宜的程式碼可能帶來昂貴的複雜度
## 通過檢查不代表變更足夠好
## 開發者成為品質關卡
## Agentic 開發的分階段關卡
## 在 slop 變成架構之前擋下它
## Senior developer 與 engineering lead 的工作如何改變
## 工程槓桿的新定義
```

Retain established repo terms such as `agent`, `review`, `validation`, `verification`, `pull request`, and `main` when the English term is clearer to the intended Taiwan engineering audience. Preserve the English draft's distinctions between readability, machine operability, qualitative review, and mechanical evidence.

- [ ] **Step 3: Create the Simplified Chinese draft with exact frontmatter**

Use this frontmatter:

```yaml
---
title: 当代码变得充裕，开发者的角色是什么？
date: 2026-07-27
summary: 当 agent 让代码大量生成，开发者的重心必须从产生变更转向治理复杂度，并通过设计关卡、受限审查、修正与验证守住质量。
published: false
translationKey: 260727-developer-role-after-code-abundance
---
```

Use these headings in order:

```markdown
## 瓶颈已经转移
## 代码的重要性正在改变
## 便宜的代码可能带来昂贵的复杂度
## 通过检查不代表变更足够好
## 开发者成为质量关卡
## Agentic 开发的分阶段关卡
## 在 slop 变成架构之前挡住它
## Senior developer 与 engineering lead 的工作如何改变
## 工程杠杆的新定义
```

Adapt the Traditional Chinese argument into natural Simplified Chinese terminology and sentence structure. Do not perform character substitution alone. Preserve every major claim and the same workflow order.

- [ ] **Step 4: Create the Japanese draft with exact frontmatter**

Use this frontmatter:

```yaml
---
title: コードが潤沢になった後、開発者の役割はどう変わるか
date: 2026-07-27
summary: エージェントがコードを大量に生成する時代には、開発者の重心は変更の生産から、設計ゲート・限定されたレビュー・修正・検証による複雑性の統治へ移る。
published: false
translationKey: 260727-developer-role-after-code-abundance
---
```

Use these headings in order:

```markdown
## ボトルネックは移動した
## コードの重要性は変わりつつある
## 安いコードは高価な複雑性を生む
## チェック通過だけでは良い変更にならない
## 開発者が品質ゲートになる
## エージェント開発のゲート付きワークフロー
## スロップがアーキテクチャになる前に止める
## シニア開発者とエンジニアリングリードに起きる変化
## エンジニアリングレバレッジの新しい定義
```

Write coherent Japanese paragraphs that preserve the argument rather than mirroring English syntax. Keep common engineering terms in Japanese or English according to the repo's established Japanese content style.

- [ ] **Step 5: Check structural and frontmatter parity**

Run:

```bash
for locale in en zh-tw zh-cn ja; do
  rg -n '^(title|date|summary|published|translationKey):|^## ' "content/$locale/ideas/260727-developer-role-after-code-abundance.mdx"
done
```

Expected: every file has five frontmatter fields, nine second-level headings, `published: false`, the date `2026-07-27`, and the shared translation key.

- [ ] **Step 6: Run focused content tests**

Run:

```bash
bun run test -- lib/mdx/content-parity.test.ts lib/mdx/content-frontmatter.test.ts lib/mdx/content-slug-mismatch.test.ts
```

Expected: all selected Vitest tests pass with no new locale gap or slug mismatch.

- [ ] **Step 7: Commit the unpublished multilingual draft**

```bash
git add content/en/ideas/260727-developer-role-after-code-abundance.mdx content/zh-tw/ideas/260727-developer-role-after-code-abundance.mdx content/zh-cn/ideas/260727-developer-role-after-code-abundance.mdx content/ja/ideas/260727-developer-role-after-code-abundance.mdx
git commit -m "content: draft agentic-era developer role article"
```

### Task 2: Review and Revise the Argument Across Locales

**Files:**
- Modify: `content/en/ideas/260727-developer-role-after-code-abundance.mdx`
- Modify: `content/zh-tw/ideas/260727-developer-role-after-code-abundance.mdx`
- Modify: `content/zh-cn/ideas/260727-developer-role-after-code-abundance.mdx`
- Modify: `content/ja/ideas/260727-developer-role-after-code-abundance.mdx`

**Interfaces:**
- Consumes: The four unpublished drafts from Task 1 and user feedback on the draft.
- Produces: Four argument-complete drafts ready for prose polishing, still marked `published: false`.

- [ ] **Step 1: Review the English draft against the approved design**

For each design requirement, mark whether the English draft contains a concrete paragraph that establishes it:

```text
code abundance moves the bottleneck to complexity governance
machine adaptability complements human comprehension
cheap generation does not reduce ownership cost
passing checks cannot justify unnecessary design
developer responsibility exceeds orchestration
design -> bounded generation -> review/revision -> final verification
senior developer and engineering lead actions
leverage means safely owned complexity, not code volume
```

Revise any missing or repeated argument. Keep all nine sections and avoid expanding into agent runtime architecture, compute-budget metrics, or multi-repository review context.

- [ ] **Step 2: Apply user feedback to the English source argument**

Make each requested change in the English draft first. Preserve the core distinction:

```text
automated evidence may run early and often
final acceptance follows qualitative review and revision
```

Do not change `published: false`.

- [ ] **Step 3: Propagate semantic changes to all localized drafts**

For every English paragraph added, removed, or materially changed, revise the corresponding Traditional Chinese, Simplified Chinese, and Japanese passage. Confirm that no locale gains or loses a major claim, workflow step, or audience-specific recommendation.

- [ ] **Step 4: Run focused content tests after revision**

Run:

```bash
bun run test -- lib/mdx/content-parity.test.ts lib/mdx/content-frontmatter.test.ts lib/mdx/content-slug-mismatch.test.ts
```

Expected: all selected tests pass.

- [ ] **Step 5: Commit the argument revision**

```bash
git add content/en/ideas/260727-developer-role-after-code-abundance.mdx content/zh-tw/ideas/260727-developer-role-after-code-abundance.mdx content/zh-cn/ideas/260727-developer-role-after-code-abundance.mdx content/ja/ideas/260727-developer-role-after-code-abundance.mdx
git commit -m "content: revise agentic developer role argument"
```

### Task 3: Polish and Proofread Without Publishing

**Files:**
- Modify: `content/en/ideas/260727-developer-role-after-code-abundance.mdx`
- Modify: `content/zh-tw/ideas/260727-developer-role-after-code-abundance.mdx`
- Modify: `content/zh-cn/ideas/260727-developer-role-after-code-abundance.mdx`
- Modify: `content/ja/ideas/260727-developer-role-after-code-abundance.mdx`

**Interfaces:**
- Consumes: User-approved argument-complete drafts from Task 2.
- Produces: Four proofread, route-valid publication candidates that remain unpublished pending explicit approval.

- [ ] **Step 1: Polish the English progression**

Read the article continuously and revise for these exact issues:

- The opening states the bottleneck shift within the first three paragraphs.
- Each section advances the argument rather than restating abundance or complexity.
- The three anchor claims have supporting reasoning before or after them.
- The workflow section connects design, review, revision, verification, and production feedback.
- The closing synthesizes the argument without introducing a new claim.

- [ ] **Step 2: Proofread the English MDX**

Check contractions, apostrophes, heading capitalization, list parallelism, fenced-block balance, and consistent use of `agent`, `developer`, `validation`, `verification`, `review`, and `complexity`.

- [ ] **Step 3: Polish and proofread each localized version**

For each locale, check natural sentence structure, consistent technical terminology, matching section order, matching workflow steps, and the absence of untranslated English sentences. Keep intentionally retained engineering terms consistent with nearby articles in that locale.

- [ ] **Step 4: Confirm all files remain unpublished**

Run:

```bash
rg -n '^published:' content/{en,zh-tw,zh-cn,ja}/ideas/260727-developer-role-after-code-abundance.mdx
```

Expected: four results, all exactly `published: false`.

- [ ] **Step 5: Run the full content verification gate**

Run in order:

```bash
bun run test
bun run typecheck
bun run build
```

Expected: tests pass, TypeScript reports no errors, and Next.js completes the static export successfully.

- [ ] **Step 6: Commit the polished unpublished candidates**

```bash
git add content/en/ideas/260727-developer-role-after-code-abundance.mdx content/zh-tw/ideas/260727-developer-role-after-code-abundance.mdx content/zh-cn/ideas/260727-developer-role-after-code-abundance.mdx content/ja/ideas/260727-developer-role-after-code-abundance.mdx
git commit -m "content: polish agentic developer role translations"
```

### Task 4: Final Approval and Publication Gate

**Files:**
- Modify: `content/en/ideas/260727-developer-role-after-code-abundance.mdx`
- Modify: `content/zh-tw/ideas/260727-developer-role-after-code-abundance.mdx`
- Modify: `content/zh-cn/ideas/260727-developer-role-after-code-abundance.mdx`
- Modify: `content/ja/ideas/260727-developer-role-after-code-abundance.mdx`

**Interfaces:**
- Consumes: Four verified publication candidates and explicit user approval to publish.
- Produces: Four published static routes at `/<locale>/ideas/260727-developer-role-after-code-abundance/`.

- [ ] **Step 1: Present the final four-locale article for explicit approval**

Report the exact verification commands and results from Task 3. Do not edit publication state until the user explicitly authorizes publication.

- [ ] **Step 2: Change all four publication flags together**

In each locale file, change exactly:

```yaml
published: false
```

to:

```yaml
published: true
```

- [ ] **Step 3: Run the required post-publication verification**

Run in order:

```bash
bun run test
bun run typecheck
bun run build
```

Expected: all checks pass and the build emits the four localized article routes.

- [ ] **Step 4: Confirm the exported routes exist**

Run:

```bash
for locale in en zh-tw zh-cn ja; do
  test -f "out/$locale/ideas/260727-developer-role-after-code-abundance/index.html"
done
```

Expected: exit status `0` with all four `index.html` files present.

- [ ] **Step 5: Commit publication**

```bash
git add content/en/ideas/260727-developer-role-after-code-abundance.mdx content/zh-tw/ideas/260727-developer-role-after-code-abundance.mdx content/zh-cn/ideas/260727-developer-role-after-code-abundance.mdx content/ja/ideas/260727-developer-role-after-code-abundance.mdx
git commit -m "content: publish agentic developer role article"
```
