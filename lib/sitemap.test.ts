import { describe, expect, it } from "vitest";

import {
  buildSitemapIndexXml,
  buildUrlSetXml,
  getLocaleSitemapEntries,
  getSitemapIndexEntries,
} from "@/lib/sitemap";

describe("sitemap helpers", () => {
  it("builds a locale-first sitemap index", () => {
    expect(getSitemapIndexEntries()).toEqual([
      { url: "https://nelson-o.github.io/sitemaps/en.xml" },
      { url: "https://nelson-o.github.io/sitemaps/zh-tw.xml" },
      { url: "https://nelson-o.github.io/sitemaps/zh-cn.xml" },
    ]);
  });

  it("returns default-locale static pages before articles", () => {
    const entries = getLocaleSitemapEntries("en");
    const urls = entries.map((entry) => entry.url);

    expect(urls.slice(0, 8)).toEqual([
      "https://nelson-o.github.io/",
      "https://nelson-o.github.io/en/",
      "https://nelson-o.github.io/en/profile/",
      "https://nelson-o.github.io/en/footprint/",
      "https://nelson-o.github.io/en/systems/",
      "https://nelson-o.github.io/en/work/",
      "https://nelson-o.github.io/en/ideas/",
      "https://nelson-o.github.io/en/digests/",
    ]);
    expect(urls).toContain("https://nelson-o.github.io/en/systems/platform-surfaces/");
  });

  it("returns locale-specific static pages without the root gateway for non-default locales", () => {
    const urls = getLocaleSitemapEntries("zh-tw").map((entry) => entry.url);

    expect(urls.slice(0, 7)).toEqual([
      "https://nelson-o.github.io/zh-tw/",
      "https://nelson-o.github.io/zh-tw/profile/",
      "https://nelson-o.github.io/zh-tw/footprint/",
      "https://nelson-o.github.io/zh-tw/systems/",
      "https://nelson-o.github.io/zh-tw/work/",
      "https://nelson-o.github.io/zh-tw/ideas/",
      "https://nelson-o.github.io/zh-tw/digests/",
    ]);
    expect(urls).not.toContain("https://nelson-o.github.io/");
    expect(urls).toContain("https://nelson-o.github.io/zh-tw/systems/platform-surfaces/");
  });

  it("serializes deterministic sitemap XML with escaped values", () => {
    expect(
      buildSitemapIndexXml([
        { url: "https://nelson-o.github.io/sitemaps/en.xml?x=1&y=2" },
      ]),
    ).toContain("<loc>https://nelson-o.github.io/sitemaps/en.xml?x=1&amp;y=2</loc>");

    expect(
      buildUrlSetXml([
        {
          url: "https://nelson-o.github.io/en/ideas/a&b/",
          lastModified: "2026-05-10",
        },
      ]),
    ).toContain("<lastmod>2026-05-10</lastmod>");
  });
});
