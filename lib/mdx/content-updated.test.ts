import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseEntryFromFile } from "@/lib/mdx/content-frontmatter";
import { getAllEntriesForSection } from "@/lib/mdx/content";
import { getSeries } from "@/lib/mdx/content-taxonomy";
import { buildArticleMetadata } from "@/lib/mdx/article-metadata";
import { ArticleHeader } from "@/components/layout/article-header";
import { getDictionary, locales, type Locale } from "@/lib/i18n";
import { getArticleHeaderCopy } from "@/lib/i18n-article-header";

const roots: string[] = [];
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));

function fixture(updated = "", locale: Locale = "en", date = "2026-05-07") {
  const root = mkdtempSync(join(tmpdir(), "content-updated-"));
  roots.push(root);
  const dir = join(root, locale, "ideas");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "sample.mdx");
  writeFileSync(file, `---\ntitle: Sample\ndate: ${date}\nsummary: Date fixture\n${updated}\n---\nBody`);
  return { root, file, entry: () => parseEntryFromFile(file, locale, "ideas", root) };
}

describe("explicitly authored update dates", () => {
  it.each([undefined, "2026-05-07", "2026-11-08"])("preserves publication for update %s", (updated) => {
    const { entry } = fixture(updated ? `updated: "${updated}"` : "");
    expect(entry()).toMatchObject({ date: "2026-05-07", updated });
    const metadata = buildArticleMetadata(entry(), "en", getDictionary("en"));
    expect(metadata.openGraph).toMatchObject({ publishedTime: "2026-05-07", modifiedTime: updated ?? "2026-05-07" });
  });

  it.each([
    '"2026-05-06"', '"2026-02-30"', '"2026-13-01"', '"2026-11-31"',
    '"2026-5-08"', '"tomorrow"', '""', '"2026-11-08T12:00:00Z"',
    '2026-11-08', 'null', '123',
  ])("rejects invalid, unquoted or earlier updated: %s", (value) => {
    expect(fixture(`updated: ${value}`).entry).toThrow();
  });

  it("validates leap days and requires a comparable publication date", () => {
    expect(fixture('updated: "2028-02-29"').entry().updated).toBe("2028-02-29");
    expect(fixture('updated: "2027-02-29"').entry).toThrow();
    expect(fixture('updated: "2028-02-29"', "en", "not-a-date").entry).toThrow();
  });

  it.each(locales)("renders localized dates in %s without inventing updates", (locale) => {
    const copy = getArticleHeaderCopy(locale);
    for (const updated of [undefined, "2026-05-07", "2026-11-08"]) {
      const entry = fixture(updated ? `updated: "${updated}"` : "", locale).entry();
      const html = renderToStaticMarkup(React.createElement(ArticleHeader, { entry }));
      expect(html).toContain(`${copy.published} <time dateTime="2026-05-07">2026-05-07</time>`);
      if (updated === "2026-11-08") {
        expect(html).toContain(`${copy.updated} <time dateTime="2026-11-08">2026-11-08</time>`);
      } else expect(html).not.toContain("data-article-updated");
    }
  });

  it("keeps archive and series order tied to publication, not update dates", () => {
    const { root, file } = fixture('updated: "2026-11-08"\nseries: agentic-delivery');
    writeFileSync(file.replace("sample.mdx", "newer.mdx"),
      '---\ntitle: Newer\ndate: 2026-05-08\nsummary: Date fixture\nseries: agentic-delivery\n---\nBody');
    expect(getAllEntriesForSection("en", "ideas", root).map((entry) => entry.slug)).toEqual(["newer", "sample"]);
    expect(getSeries("en", root)[0].entries.map((entry) => entry.slug)).toEqual(["sample", "newer"]);
  });

  it("lets translated editions record independent dates or no update", () => {
    const { root } = fixture('updated: "2026-11-08"');
    for (const [locale, updated] of [["ja", 'updated: "2026-11-09"'], ["zh-tw", ""]] as const) {
      const dir = join(root, locale, "ideas");
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "sample.mdx"), `---\ntitle: Translation\ndate: 2026-05-07\nsummary: Fixture\n${updated}\n---\nBody`);
    }
    expect(getAllEntriesForSection("en", "ideas", root)[0].updated).toBe("2026-11-08");
    expect(getAllEntriesForSection("ja", "ideas", root)[0].updated).toBe("2026-11-09");
    expect(getAllEntriesForSection("zh-tw", "ideas", root)[0].updated).toBeUndefined();
  });
});
