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
});
