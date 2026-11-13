import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SeriesPath } from "@/components/layout/series-path";
import { getArchive } from "./archives";
import { getArticleSeries } from "./article-header";
import { getAdjacentEntries } from "./mdx/content-taxonomy";
import { taxonomyRoot, writeTaxonomyEntry } from "./mdx/content-taxonomy-fixture";
import { locales } from "./i18n";
import { getArticleHeaderCopy } from "./i18n-article-header";
import { getSeriesPathCopy } from "./i18n-series-path";

const render = (locale: typeof locales[number], entries: NonNullable<ReturnType<typeof getArchive>>["entries"]) =>
  renderToStaticMarkup(React.createElement(SeriesPath, { locale, entries }));

describe("series learning path", () => {
  it.each(locales)("renders a localized ordered list and start link without JavaScript in %s", (locale) => {
    const entries = getArchive(locale, "series", "agentic-delivery")!.entries;
    const html = render(locale, entries);
    expect(html).toContain("<ol");
    expect(html.match(/<li>/g)).toHaveLength(entries.length);
    expect(html).toContain(getSeriesPathCopy(locale).start);
    entries.forEach((entry, index) => {
      expect(html).toContain(getArticleHeaderCopy(locale).part(index + 1, entries.length));
      expect(html).toContain(`href="/${locale}/${entry.section}/${entry.slug}"`);
    });
    expect(html).not.toContain("archive-year-");
  });

  it("preserves cross-year, cross-section and same-date order with article navigation and locale availability", () => {
    const root = taxonomyRoot();
    try {
      const earlier = writeTaxonomyEntry(root, "z-early", "series: agentic-delivery");
      writeFileSync(earlier, readFileSync(earlier, "utf8").replace("2026-01-01", "2025-01-01"));
      writeTaxonomyEntry(root, "a-tie", "series: agentic-delivery", "en", "systems");
      writeTaxonomyEntry(root, "a-tie", "series: agentic-delivery", "en", "ideas");
      writeTaxonomyEntry(root, "b-tie", "series: agentic-delivery");
      writeTaxonomyEntry(root, "draft", "series: agentic-delivery\npublished: false");
      writeTaxonomyEntry(root, "single", "series: agentic-delivery", "ja");
      const entries = getArchive("en", "series", "agentic-delivery", root)!.entries;
      expect(entries.map(({ section, slug }) => `${section}/${slug}`)).toEqual([
        "ideas/z-early", "ideas/a-tie", "systems/a-tie", "ideas/b-tie",
      ]);
      const html = render("en", entries);
      expect(html).not.toContain("draft");
      expect(html.indexOf('href="/en/ideas/z-early"')).toBeLessThan(html.indexOf('href="/en/systems/a-tie"'));
      entries.forEach((entry, index) => {
        expect(getArticleSeries(entry, root)).toMatchObject({ part: index + 1, total: entries.length });
        expect(getAdjacentEntries(entry, root)).toEqual({ previous: entries[index - 1] ?? null, next: entries[index + 1] ?? null });
      });
      const single = getArchive("ja", "series", "agentic-delivery", root)!.entries;
      expect(single).toHaveLength(1);
      expect(render("ja", single)).toContain(getArticleHeaderCopy("ja").part(1, 1));
      expect(getArchive("zh-tw", "series", "agentic-delivery", root)).toBeNull();
      expect(render("en", [])).toBe("");
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
