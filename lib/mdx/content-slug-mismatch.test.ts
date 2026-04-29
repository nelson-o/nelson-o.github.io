import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getPublishedEntriesForSection } from "@/lib/mdx/content";

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

describe("content validation", () => {
  it("rejects localized entries when slugs do not match across locales", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    writeLocalizedEntry(
      root,
      "en",
      "systems",
      "shared-slug.mdx",
      `---
title: Shared Slug
date: 2025-02-04
summary: English entry
---

English`,
    );

    writeLocalizedEntry(
      root,
      "zh-tw",
      "systems",
      "different-slug.mdx",
      `---
title: 不同 slug
date: 2025-02-04
summary: Chinese entry
translationKey: shared-slug
---

Chinese`,
    );

    expect(() => getPublishedEntriesForSection("en", "systems", root)).toThrowError(/slug/i);
  });
});
