import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getAllEntriesForSection } from "@/lib/mdx/content";

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
  it("throws when required frontmatter is missing", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    writeLocalizedEntry(
      root,
      "en",
      "ideas",
      "broken.mdx",
      `---
title: Broken
date: 2026-03-01
---

Missing summary`,
    );

    expect(() => getAllEntriesForSection("en", "ideas", root)).toThrowError(/summary/i);
  });
});
