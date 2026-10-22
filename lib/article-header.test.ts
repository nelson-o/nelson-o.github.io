import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { rmSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { estimateReadingMinutes, getArticleSeries } from "@/lib/article-header";
import { ArticleHeader } from "@/components/layout/article-header";
import { getEntryBySlug } from "@/lib/mdx/content";
import { taxonomyRoot, writeTaxonomyEntry } from "@/lib/mdx/content-taxonomy-fixture";
import { locales } from "@/lib/i18n";
import { getArticleHeaderCopy } from "@/lib/i18n-article-header";

const roots: string[] = [];
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));

describe("article reading estimate", () => {
  it("accounts for Latin words, CJK characters and mixed prose", () => {
    expect(estimateReadingMinutes("word ".repeat(401))).toBe(3);
    expect(estimateReadingMinutes("閱讀".repeat(401))).toBe(3);
    expect(estimateReadingMinutes("word ".repeat(200) + "日本語".repeat(134))).toBe(3);
    expect(estimateReadingMinutes("")).toBe(1);
  });
  it("excludes frontmatter, image URLs, markup and fenced code including Mermaid", () => {
    const filler = "code ".repeat(1000);
    const source = `---\ntitle: ${filler}\n---\n## Hello **world** [link](https://example.org/${filler})\n![image](/${filler})\n<div>Prose</div>\n\n\`\`\`mermaid\n${filler}\n\`\`\`\n~~~js\n${filler}\n~~~`;
    expect(estimateReadingMinutes(source)).toBe(1);
  });
});

describe("article series position", () => {
  it("uses published, locale-specific reading order across sections and handles a single post", () => {
    const root = taxonomyRoot(); roots.push(root);
    for (const [slug, locale, section, extra] of [
      ["a", "en", "systems", ""], ["b", "en", "ideas", ""],
      ["c", "en", "ideas", "published: false"], ["b", "ja", "ideas", ""],
    ] as const) writeTaxonomyEntry(root, slug, `series: agentic-delivery\n${extra}`, locale, section);
    const entry = getEntryBySlug("en", "ideas", "b", root)!;
    expect(getArticleSeries(entry, root)).toMatchObject({ part: 2, total: 2 });
    expect(getArticleSeries(getEntryBySlug("ja", "ideas", "b", root)!, root)).toMatchObject({ part: 1, total: 1 });
    expect(getArticleSeries({ ...entry, published: false }, root)).toBeNull();
    expect(getArticleSeries({ ...entry, series: undefined }, root)).toBeNull();
    expect(getArticleSeries({ ...entry, slug: "missing" }, root)).toBeNull();
  });
});

describe("article header", () => {
  it.each(locales)("renders localized navigation and metadata before the cover in %s", (locale) => {
    const entry = getEntryBySlug(locale, "ideas", "agent-loops")!;
    const markup = renderToStaticMarkup(React.createElement(ArticleHeader, { entry }));
    const copy = getArticleHeaderCopy(locale);
    expect(markup).toMatch(new RegExp(`href="/${locale}/ideas/?"`));
    expect(markup).toContain(`<time dateTime="${entry.date}">${entry.date}</time>`);
    expect(markup).toContain(copy.reading(estimateReadingMinutes(entry.content)));
    expect(markup).toContain(`aria-label="${copy.tags}"`);
    expect(markup).toMatch(new RegExp(`href="/${locale}/topics/agents/?"`));
    expect(markup).toMatch(new RegExp(`href="/${locale}/series/agentic-delivery/?"`));
    expect(markup.indexOf("<h1")).toBeLessThan(markup.indexOf("<picture"));
    expect(markup).toContain('width="1200" height="742" loading="eager" fetchPriority="high"');
  });
  it("omits empty tags and series without manufacturing archive links", () => {
    const entry = { ...getEntryBySlug("en", "ideas", "agent-loops")!, tags: undefined, series: undefined };
    const markup = renderToStaticMarkup(React.createElement(ArticleHeader, { entry }));
    expect(markup).not.toContain("/topics/");
    expect(markup).not.toContain("/series/");
  });
});
