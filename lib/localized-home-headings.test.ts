import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LocalizedHomePage } from "@/components/layout/localized-home-page";
import { PageHeader } from "@/components/layout/page-header";
import { getDictionary, locales } from "@/lib/i18n";
import { getLatestEntries } from "@/lib/mdx/content";

describe("homepage heading hierarchy", () => {
  it("keeps standalone page headers at level one by default", () => {
    const markup = renderToStaticMarkup(createElement(PageHeader, {
      eyebrow: "Section",
      title: "Page title",
      description: "Page description",
    }));

    expect(markup).toMatch(/<h1\b[^>]*>Page title<\/h1>/);
    expect(markup).not.toContain("<h2");
  });

  it.each(locales)("uses one page title and a level-two latest-writing heading in %s", (locale) => {
    const dictionary = getDictionary(locale);
    const latestEntries = getLatestEntries(locale);
    const markup = renderToStaticMarkup(createElement(LocalizedHomePage, {
      locale,
      dictionary,
      latestEntries,
    }));
    const headings = [...markup.matchAll(/<(h[1-6])\b[^>]*>(.*?)<\/\1>/g)];

    expect(headings.filter(([, tag]) => tag === "h1")).toHaveLength(1);
    expect(headings[0][2]).toBe(dictionary.home.title);
    const latestWritingIndex = headings.findIndex(([, , title]) => title === dictionary.home.latestWritingTitle);
    expect(latestWritingIndex).toBeGreaterThan(0);
    expect(headings[latestWritingIndex][1]).toBe("h2");
    const articleHeadings = headings.slice(latestWritingIndex + 1);
    expect(articleHeadings).toHaveLength(latestEntries.length);
    expect(articleHeadings.every(([, tag]) => tag === "h3")).toBe(true);
  });
});
