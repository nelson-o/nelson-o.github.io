import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getPublishedEntriesForSection, getStaticSlugsForSection } from "@/lib/mdx/content";

const tempDirs: string[] = [];

function writeLocalizedEntry(
  root: string,
  locale: string,
  section: string,
  filename: string,
  source: string,
) {
  const sectionDir = join(root, locale, section);
  mkdirSync(sectionDir, { recursive: true });
  writeFileSync(join(sectionDir, filename), source);
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("content sorting", () => {
  it("sorts published content newest first and hides unpublished entries", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    writeLocalizedEntry(
      root,
      "en",
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

    writeLocalizedEntry(
      root,
      "en",
      "systems",
      "bravo.mdx",
      `---
title: Bravo
date: 2025-02-04
summary: Newer published note
---

Bravo`,
    );

    writeLocalizedEntry(
      root,
      "en",
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

    const published = getPublishedEntriesForSection("en", "systems", root);

    expect(published.map((entry) => entry.slug)).toEqual(["bravo", "alpha"]);
    expect(getStaticSlugsForSection("en", "systems", root)).toEqual([
      { slug: "bravo" },
      { slug: "alpha" },
    ]);
  });
});
