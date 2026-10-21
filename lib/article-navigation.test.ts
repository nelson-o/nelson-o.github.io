import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleNavigation } from "@/components/ui/article-navigation";
import { locales } from "@/lib/i18n";
import { getArticleNavigationCopy } from "@/lib/i18n-article-navigation";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";
import { getSeries } from "@/lib/mdx/content-taxonomy";

const render = (entry: Parameters<typeof ArticleNavigation>[0]["entry"]) => renderToStaticMarkup(createElement(ArticleNavigation, { entry }));
describe("article navigation", () => {
  it.each(locales)("renders localized %s series boundaries and up to three lazy related rows", (locale) => {
    const series = getSeries(locale).find((item) => item.id === "agentic-delivery")!;
    const first = render(series.entries[0]);
    const last = render(series.entries.at(-1)!);
    const copy = getArticleNavigationCopy(locale);
    expect(first).toContain(copy.series);
    expect(first).not.toContain('rel="prev"');
    expect(first).toContain('rel="next"');
    expect(last).toContain('rel="prev"');
    expect(last).not.toContain('rel="next"');
    expect(first).toContain(copy.related);
    expect(first.match(/data-entry-row=""/g)).toHaveLength(3);
    expect(first).not.toContain('loading="eager"');
    if (locale !== "en") expect(first).not.toContain('href="/en/');
  });

  it("uses section labels for non-series entries and omits unrelated suggestions without tags", () => {
    const entry = getPublishedEntriesForSection("en", "ideas").find((item) => !item.series)!;
    const html = render({ ...entry, tags: undefined });
    expect(html).toContain("Continue in this section");
    expect(html).not.toContain("data-article-related");
  });

  it("does not expose navigation on an unpublished draft", () => {
    const entry = getPublishedEntriesForSection("en", "ideas")[0];
    expect(render({ ...entry, published: false })).toBe("");
  });
});
