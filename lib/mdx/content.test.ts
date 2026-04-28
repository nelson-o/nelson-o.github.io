import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  getAllEntriesForSection,
  getEntryBySlug,
  getLatestEntries,
  getPublishedEntriesForSection,
  getStaticArticleParams,
  getStaticLocaleParams,
  getStaticSlugsForSection,
} from "@/lib/mdx/content";

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
    expect(getEntryBySlug("zh-tw", "systems", "platform-surfaces", root)?.title).toBe("平台介面");
    expect(getStaticLocaleParams()).toEqual([{ locale: "en" }, { locale: "zh-tw" }]);
    expect(getStaticSlugsForSection("en", "systems", root)).toEqual([{ slug: "platform-surfaces" }]);
    expect(getStaticArticleParams(root)).toContainEqual({
      locale: "zh-tw",
      section: "systems",
      slug: "platform-surfaces",
    });
  });

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

  it("rejects unsupported locales in localized content roots", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    writeLocalizedEntry(
      root,
      "ja",
      "systems",
      "unsupported.mdx",
      `---
title: Unsupported
date: 2025-02-04
summary: Unsupported locale
---

Unsupported`,
    );

    expect(() => getPublishedEntriesForSection("en", "systems", root)).toThrowError(/locale/i);
  });

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
