import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArchivePage } from "@/components/layout/archive-page";
import { getArchive } from "@/lib/archives";
import { getLatestEntries } from "@/lib/mdx/content";

const entry = getLatestEntries("en", 1)[0];
describe("archive year groups", () => {
  it.each(["posts", "topics", "series"] as const)("preserves %s order across and within years", (kind) => {
    const entries = [
      { ...entry, slug: "first", title: "First", date: "2024-01-01" },
      { ...entry, slug: "second", title: "Second", date: "2025-01-01" },
      { ...entry, slug: "third", title: "Third", date: "2025-06-01" },
    ];
    if (kind !== "series") entries.reverse();
    const archive = { ...getArchive("en", "posts")!, entries };
    const html = renderToStaticMarkup(createElement(ArchivePage, { locale: "en", kind, archive }));
    const years = [...html.matchAll(/id="archive-year-(\d+)"/g)].map((match) => match[1]);
    expect(years).toEqual(kind === "series" ? ["2024", "2025"] : ["2025", "2024"]);
    const labels = [...html.matchAll(/aria-label="(First|Second|Third)"/g)].map((match) => match[1]);
    expect(labels).toEqual(entries.map((item) => item.title));
    expect(html.match(/data-entry-row=""/g)).toHaveLength(3);
    expect(html).toContain("<aside");
    expect(html.match(/loading="eager"/g)).toHaveLength(2);
    expect(html).not.toContain("<main");
  });
});
