import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  getAllEntriesForSection,
  getPublishedEntriesForSection,
  getStaticSlugsForSection,
} from "@/lib/mdx/content";

const tempDirs: string[] = [];

function writeEntry(root: string, section: string, filename: string, source: string) {
  const sectionDir = join(root, section);
  mkdirSync(sectionDir, { recursive: true });
  writeFileSync(join(sectionDir, filename), source);
}

describe("content collections", () => {
  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();

      if (dir) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  it("sorts published content newest first and hides unpublished entries", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    writeEntry(
      root,
      "systems",
      "alpha.mdx",
      `---
title: Alpha
date: 2024-01-01
summary: Oldest published note
published: true
---

Alpha`,
    );

    writeEntry(
      root,
      "systems",
      "bravo.mdx",
      `---
title: Bravo
date: 2025-02-04
summary: Newer published note
---

Bravo`,
    );

    writeEntry(
      root,
      "systems",
      "draft.mdx",
      `---
title: Draft
date: 2026-03-01
summary: Draft note
published: false
---

Draft`,
    );

    const published = getPublishedEntriesForSection("systems", root);

    expect(published.map((entry) => entry.slug)).toEqual(["bravo", "alpha"]);
    expect(getStaticSlugsForSection("systems", root)).toEqual([
      { slug: "bravo" },
      { slug: "alpha" },
    ]);
  });

  it("throws when required frontmatter is missing", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    writeEntry(
      root,
      "ideas",
      "broken.mdx",
      `---
title: Broken
date: 2026-03-01
---

Missing summary`,
    );

    expect(() => getAllEntriesForSection("ideas", root)).toThrowError(/summary/i);
  });
});
