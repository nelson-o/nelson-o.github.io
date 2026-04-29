import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getLatestEntries } from "@/lib/mdx/content";

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

describe("content latest entries", () => {
  it("keeps latest entries within a locale only", () => {
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
summary: English alpha
---

Alpha`,
    );

    writeLocalizedEntry(
      root,
      "en",
      "ideas",
      "beta.mdx",
      `---
title: Beta
date: 2025-01-01
summary: English beta
---

Beta`,
    );

    writeLocalizedEntry(
      root,
      "zh-tw",
      "systems",
      "alpha.mdx",
      `---
title: Alpha 中文
date: 2024-01-01
summary: 中文 alpha
---

Alpha zh`,
    );

    expect(getLatestEntries("en", 4, root).map((entry) => entry.slug)).toEqual(["beta", "alpha"]);
    expect(getLatestEntries("zh-tw", 4, root).map((entry) => entry.slug)).toEqual(["alpha"]);
  });
});
