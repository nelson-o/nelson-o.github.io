import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import SectionPage, { generateMetadata } from "@/app/[locale]/(site)/[section]/page";
import { EntryRow } from "@/components/ui/entry-row";
import { getDictionary, locales, sections } from "@/lib/i18n";
import { getLandingTabsCopy } from "@/lib/i18n-landing-tabs";
import * as content from "@/lib/mdx/content";

const entry = content.getLatestEntries("en", 1)[0];
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("section index rows", () => {
  for (const locale of locales) for (const section of sections) {
    it(`${locale}/${section} uses approved headings and preserves metadata`, async () => {
      const params = Promise.resolve({ locale, section });
      const markup = renderToStaticMarkup(await SectionPage({ params }));
      expect(markup).toContain(`>${getLandingTabsCopy(locale)[section]}</h1>`);
      expect(markup).not.toContain("<aside");
      const metadata = await generateMetadata({ params });
      expect(metadata.title).toBe(`${getDictionary(locale).sectionPages[section].eyebrow} | ${getDictionary(locale).site.title}`);
      expect(metadata.description).toBe(getDictionary(locale).sectionPages[section].description);
    });
  }

  it.each(["production", "development"])("groups years and preserves %s filtering and draft indication", async (mode) => {
    vi.stubEnv("NODE_ENV", mode);
    const published = [
      { ...entry, date: "2026-03-01", title: "Newest", published: true },
      { ...entry, date: "2025-04-01", title: "Older", slug: "older", published: true },
    ];
    const draft = { ...entry, date: "2026-01-01", title: "Unpublished", slug: "draft", published: false };
    const all = vi.spyOn(content, "getAllEntriesForSection").mockReturnValue([published[0], draft, published[1]]);
    const publicOnly = vi.spyOn(content, "getPublishedEntriesForSection").mockReturnValue(published);
    const markup = renderToStaticMarkup(await SectionPage({ params: Promise.resolve({ locale: "en", section: "systems" }) }));
    expect(markup.match(/<h2\b/g)).toHaveLength(2);
    expect(markup.indexOf('id="year-2026"')).toBeLessThan(markup.indexOf('id="year-2025"'));
    expect(markup.indexOf('aria-label="Newest"')).toBeLessThan(markup.indexOf('id="year-2025"'));
    expect(markup.indexOf('aria-label="Older"')).toBeGreaterThan(markup.indexOf('id="year-2025"'));
    expect(markup).not.toMatch(/>#[^<]+</);
    expect(markup.includes('aria-label="Unpublished (Draft)"')).toBe(mode === "development");
    expect(markup.includes(">Draft</span>")).toBe(mode === "development");
    expect(mode === "development" ? all : publicOnly).toHaveBeenCalledWith("en", "systems");
    expect(mode === "development" ? publicOnly : all).not.toHaveBeenCalled();
  });

  it("keeps landing chips by default while allowing chip-free rows", () => {
    const render = (showTags?: boolean) => renderToStaticMarkup(createElement(EntryRow, { entry, locale: "en", showTags }));
    expect(render()).toMatch(/>#[^<]+</);
    expect(render(false)).not.toMatch(/>#[^<]+</);
    expect(render()).not.toContain(">Draft</span>");
  });
});
