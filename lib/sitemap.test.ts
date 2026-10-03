import { describe, expect, it } from "vitest";

import {
  buildSitemapIndexXml,
  buildUrlSetXml,
  getLocaleSitemapEntries,
  getSitemapIndexEntries,
} from "@/lib/sitemap";

import { profileLocales, profileOnlyLocales } from "@/lib/profile-locales";

describe("sitemap helpers", () => {
  it("builds a locale-first sitemap index", () => {
    expect(getSitemapIndexEntries()).toEqual([
      { url: "https://nelson-o.github.io/sitemaps/en.xml" },
      { url: "https://nelson-o.github.io/sitemaps/zh-tw.xml" },
      { url: "https://nelson-o.github.io/sitemaps/zh-cn.xml" },
      { url: "https://nelson-o.github.io/sitemaps/ja.xml" },
      ...profileOnlyLocales.map((locale) => ({ url: `https://nelson-o.github.io/sitemaps/${locale}.xml` })),
    ]);
  });

  it("lists each profile-only alias exactly once and excludes unavailable pages", () => {
    const allUrls = profileLocales.flatMap(getLocaleSitemapEntries).map(({ url }) => url);
    for (const locale of profileOnlyLocales) {
      const url = `https://nelson-o.github.io/${locale}/profile/`;
      expect(getLocaleSitemapEntries(locale)).toEqual([{ url }]);
      expect(allUrls.filter((entry) => entry === url)).toHaveLength(1);
      expect(allUrls).not.toContain(`${url}2025/`);
      expect(allUrls).not.toContain(`${url}2026/`);
      expect(allUrls.filter((entry) => entry === `https://nelson-o.github.io/${locale}/privacy/`)).toHaveLength(1);
    }
  });

  it("returns default-locale static pages before articles", () => {
    const entries = getLocaleSitemapEntries("en");
    const urls = entries.map((entry) => entry.url);

    expect(urls.slice(0, 9)).toEqual([
      "https://nelson-o.github.io/",
      "https://nelson-o.github.io/en/",
      "https://nelson-o.github.io/en/profile/",
      "https://nelson-o.github.io/en/profile/2025/",
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

    expect(urls.slice(0, 8)).toEqual([
      "https://nelson-o.github.io/zh-tw/",
      "https://nelson-o.github.io/zh-tw/profile/",
      "https://nelson-o.github.io/zh-tw/profile/2025/",
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
