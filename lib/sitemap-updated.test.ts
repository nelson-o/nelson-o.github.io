import { afterEach, describe, expect, it, vi } from "vitest";
import * as content from "@/lib/mdx/content";
import { locales } from "@/lib/i18n";
import { buildUrlSetXml, getLocaleSitemapEntries } from "@/lib/sitemap";

afterEach(() => vi.restoreAllMocks());

describe("sitemap authored update dates", () => {
  it.each(locales)("uses only the %s edition's explicit update, retaining publication fallback", (locale) => {
    const original = content.getPublishedEntriesForSection;
    const fixture = original(locale, "ideas")[0];
    expect(fixture).toBeDefined();
    vi.spyOn(content, "getPublishedEntriesForSection").mockImplementation((requestedLocale, section) => {
      if (section !== "ideas") return original(requestedLocale, section);
      return [
        { ...fixture, locale: requestedLocale, slug: "revised", date: "2026-01-01", updated: requestedLocale === locale ? "2026-02-02" : undefined },
        { ...fixture, locale: requestedLocale, slug: "original", date: "2026-01-03", updated: undefined },
        { ...fixture, locale: requestedLocale, slug: "same-day", date: "2026-01-04", updated: "2026-01-04" },
      ];
    });
    for (const requestedLocale of locales) {
      const entries = getLocaleSitemapEntries(requestedLocale);
      const article = (slug: string) => entries.find(({ url }) => url === `https://nelson-o.github.io/${requestedLocale}/ideas/${slug}/`)!;
      expect(article("revised").lastModified).toBe(requestedLocale === locale ? "2026-02-02" : "2026-01-01");
      expect(article("original").lastModified).toBe("2026-01-03");
      expect(article("same-day").lastModified).toBe("2026-01-04");
      expect(buildUrlSetXml([article("revised")])).toContain(`<lastmod>${requestedLocale === locale ? "2026-02-02" : "2026-01-01"}</lastmod>`);
    }
  });
});
