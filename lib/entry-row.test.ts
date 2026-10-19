import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EntryRow } from "@/components/ui/entry-row";
import { LocalizedHomePage } from "@/components/layout/localized-home-page";
import { getDictionary } from "@/lib/i18n";
import { getLatestEntries } from "@/lib/mdx/content";

const entry = getLatestEntries("en", 1)[0];

describe("landing entry rows", () => {
  it("keeps untagged legacy entries usable with one title-named link", () => {
    const markup = renderToStaticMarkup(createElement(EntryRow, {
      entry: { ...entry, tags: undefined }, locale: "en",
    }));
    expect(markup.match(/<a\b/g)).toHaveLength(1);
    expect(markup).toContain(`aria-label="${entry.title}"`);
    expect(markup).toContain(`dateTime="${entry.date}"`);
    expect(markup).toContain('loading="lazy"');
    expect(markup).not.toContain("undefined");
  });

  it("caps the landing list at ten entries and links to the full archive", () => {
    const entries = Array.from({ length: 11 }, (_, i) => ({ ...entry, slug: `entry-${i}`, title: `Entry ${i}` }));
    const markup = renderToStaticMarkup(createElement(LocalizedHomePage, {
      latestEntries: entries, locale: "en", dictionary: getDictionary("en"),
    }));
    expect(markup.match(/data-entry-row=""/g)).toHaveLength(10);
    expect(markup).not.toContain('aria-label="Entry 10"');
    expect(markup).toMatch(/href="\/en\/posts\/?"/);
    expect(markup.match(/loading="eager"/g)).toHaveLength(2); // Light and dark fallback variants.
  });
});
