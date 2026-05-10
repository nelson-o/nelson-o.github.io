import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { parseEntryFromFile } from "@/lib/mdx/content-frontmatter";

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("content frontmatter parsing", () => {
  it("parses optional authors from article frontmatter", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    const sectionDir = join(root, "en", "ideas");
    mkdirSync(join(sectionDir, "agentic-ui"), { recursive: true });
    const filePath = join(sectionDir, "agentic-ui", "co-author-test.mdx");

    writeFileSync(
      filePath,
      `---
title: Co-author Test
date: 2026-05-07
summary: Testing article authors.
authors:
  - name: Nelson Lin
    url: https://nelson-o.github.io/en/profile/
  - name: Co Author
    url: https://example.com/profile
---

Body`,
    );

    const entry = parseEntryFromFile(filePath, "en", "ideas", root);

    expect(entry.authors).toEqual([
      { name: "Nelson Lin", url: "https://nelson-o.github.io/en/profile/" },
      { name: "Co Author", url: "https://example.com/profile" },
    ]);
  });

  it("parses optional llm provenance from digest frontmatter", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    const sectionDir = join(root, "en", "digests");
    mkdirSync(sectionDir, { recursive: true });
    const filePath = join(sectionDir, "llm-context.mdx");

    writeFileSync(
      filePath,
      `---
title: LLM Context
date: 2026-05-10
summary: Testing optional LLM provenance.
llm:
  model: GPT-5.5
  context: Condensed from an LLM-assisted discussion about static-export content architecture.
---

Body`,
    );

    const entry = parseEntryFromFile(filePath, "en", "digests", root);

    expect(entry.llm).toEqual({
      model: "GPT-5.5",
      context: "Condensed from an LLM-assisted discussion about static-export content architecture.",
    });
  });

  it("parses optional date and interaction inside llm provenance", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    const sectionDir = join(root, "en", "digests");
    mkdirSync(sectionDir, { recursive: true });
    const filePath = join(sectionDir, "llm-context-full.mdx");

    writeFileSync(
      filePath,
      `---
title: Full LLM Context
date: 2026-05-10
summary: Testing optional LLM provenance fields.
llm:
  model: GPT-5.5
  context: Condensed from an LLM-assisted discussion about static-export content architecture.
  date: 2026-05-10
  interaction: synthesis
---

Body`,
    );

    const entry = parseEntryFromFile(filePath, "en", "digests", root);

    expect(entry.llm).toEqual({
      model: "GPT-5.5",
      context: "Condensed from an LLM-assisted discussion about static-export content architecture.",
      date: "2026-05-10",
      interaction: "synthesis",
    });
  });
});
