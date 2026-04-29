import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getPublishedEntriesForSection, getStaticArticleParams, getStaticLocaleParams } from "@/lib/mdx/content";

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

describe("content static params", () => {
  it("returns locale-specific entries and static params", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    writeLocalizedEntry(
      root,
      "en",
      "systems",
      "platform-surfaces.mdx",
      `---
title: Platform Surfaces
date: 2025-02-04
summary: English systems note
---

English`,
    );

    writeLocalizedEntry(
      root,
      "zh-tw",
      "systems",
      "platform-surfaces.mdx",
      `---
title: 平台介面
date: 2025-02-04
summary: 中文系統筆記
---

Chinese`,
    );

    writeLocalizedEntry(
      root,
      "zh-tw",
      "systems",
      "draft-only.mdx",
      `---
title: 草稿
date: 2025-03-01
summary: 不應發布
published: false
---

Draft`,
    );

    expect(getPublishedEntriesForSection("en", "systems", root).map((entry) => entry.slug)).toEqual([
      "platform-surfaces",
    ]);
    expect(
      getPublishedEntriesForSection("zh-tw", "systems", root).map((entry) => entry.slug),
    ).toEqual(["platform-surfaces"]);
    expect(getStaticLocaleParams()).toEqual([{ locale: "en" }, { locale: "zh-tw" }]);
    expect(getStaticArticleParams(root)).toContainEqual({
      locale: "zh-tw",
      section: "systems",
      slug: "platform-surfaces",
    });
  });
});
