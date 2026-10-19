import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteSidebarLayout } from "@/components/layout/site-sidebar";
import { locales } from "@/lib/i18n";
import { getSidebarCopy } from "@/lib/i18n-sidebar";
import { getTagCounts, getSeries } from "@/lib/mdx/content-taxonomy";

describe("site sidebar", () => {
  it.each(locales)("renders localized published collections after content in %s", (locale) => {
    const markup = renderToStaticMarkup(createElement(SiteSidebarLayout, { locale }, "content first"));
    const copy = getSidebarCopy(locale);
    expect(markup.indexOf("content first")).toBeLessThan(markup.indexOf("<aside"));
    expect(markup).not.toContain("<main");
    expect(markup.match(/<h2\b/g)).toHaveLength(3);
    for (const text of [copy.about, copy.topics, copy.series, copy.learnMore, copy.moreTopics, copy.allSeries]) expect(markup).toContain(text);
    const topics = getTagCounts(locale);
    for (const { id, count } of topics.slice(0, 4)) {
      expect(markup).toMatch(new RegExp(`href="/${locale}/topics/${id}/?"`));
      expect(markup).toContain(`(${count})`);
    }
    for (const { id } of topics.slice(4)) expect(markup).not.toMatch(new RegExp(`href="/${locale}/topics/${id}/?"`));
    for (const { id, count } of getSeries(locale)) {
      expect(markup).toMatch(new RegExp(`href="/${locale}/series/${id}/?"`));
      expect(markup).toContain(`${count} ${copy.posts}`);
    }
    expect(markup).toMatch(new RegExp(`href="/${locale}/profile/?"`));
    expect(markup).not.toContain(`/${locale}/digests/`);
  });
});
