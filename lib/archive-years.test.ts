import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArchivePage } from "@/components/layout/archive-page";
import { getArchive } from "@/lib/archives";
import { getArchiveYearsCopy } from "@/lib/i18n-archive-years";

const base = getArchive("en", "posts")!;
const entry = base.entries[0];
describe("Posts year navigation", () => {
  it.each([{ dates: [] }, { dates: ["2024"] }, { dates: ["2026", "2026", "2024", "2016"] }])("links only present years in entry order: %j", ({ dates }) => {
    const entries = dates.map((year, index) => ({ ...entry, date: `${year}-01-01`, slug: `entry-${index}`, title: `Fixture ${index}` }));
    const html = renderToStaticMarkup(createElement(ArchivePage, { locale: "en", kind: "posts", archive: { ...base, entries } }));
    expect([...html.matchAll(/href="#archive-year-(\d+)"/g)].map((match) => match[1])).toEqual([...new Set(dates)]);
    expect((html.match(/data-entry-row=""/g) ?? []).length).toBe(entries.length);
    expect([...html.matchAll(/aria-label="(Fixture \d+)"/g)].map((match) => match[1])).toEqual(entries.map((item) => item.title));
    expect(html.includes('data-archive-years=""')).toBe(entries.length > 0);
    for (const year of new Set(dates)) expect(html).toMatch(new RegExp(`id="archive-year-${year}"[^>]+tabindex="-1"`));
  });
  it.each(["en", "zh-tw", "zh-cn", "ja"] as const)("labels navigation in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(ArchivePage, { locale, kind: "posts", archive: base }));
    expect(html).toContain(`id="archive-years-label">${getArchiveYearsCopy(locale)}</p>`);
  });
  it.each(["topics", "series"] as const)("leaves %s without year navigation or focus targets", (kind) => {
    const html = renderToStaticMarkup(createElement(ArchivePage, { locale: "en", kind, archive: base }));
    expect(html).not.toContain("data-archive-years");
    expect(html).not.toContain('tabindex="-1"');
  });
});
