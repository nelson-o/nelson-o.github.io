import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { getEntryBySlug } from "@/lib/mdx/content";
import { getAdjacentEntries, getEntriesByTag, getRelatedEntries, getSeries, getTagCounts } from "@/lib/mdx/content-taxonomy";
import { taxonomyRoot, writeTaxonomyEntry } from "@/lib/mdx/content-taxonomy-fixture";

const roots: string[] = [];
afterEach(() => roots.splice(0).forEach((path) => rmSync(path, { recursive: true, force: true })));
function fixture() {
  const root = taxonomyRoot(); roots.push(root);
  writeTaxonomyEntry(root, "b", "tags: [agents, delivery]\nseries: agentic-delivery");
  writeTaxonomyEntry(root, "a", "tags: [agents]\nseries: agentic-delivery", "en", "systems");
  writeTaxonomyEntry(root, "c", "tags: [agents, delivery]\nseries: agentic-delivery");
  writeTaxonomyEntry(root, "draft", "published: false\ntags: [agents, teams]\nseries: agentic-delivery");
  writeTaxonomyEntry(root, "draft-series", "published: false\ntags: [devices]\nseries: device-frontend");
  writeTaxonomyEntry(root, "plain");
  writeTaxonomyEntry(root, "localized", "tags: [teams]", "ja");
  return root;
}

describe("published taxonomy queries", () => {
  it("counts only published tags in the requested locale, ordered by popularity then id", () => {
    const root = fixture();
    expect(getTagCounts("en", root)).toEqual([
      { id: "agents", label: "AI agents", count: 3 },
      { id: "delivery", label: "Delivery and CI", count: 2 },
    ]);
    expect(getTagCounts("ja", root)).toEqual([{ id: "teams", label: "チームとリーダーシップ", count: 1 }]);
    expect(getTagCounts("zh-tw", root)).toEqual([]);
  });

  it("orders tagged posts newest first with deterministic slug ties", () => {
    const root = taxonomyRoot(); roots.push(root);
    for (const [slug, date] of [["z", "2026-02-01"], ["b", "2026-01-01"], ["a", "2026-01-01"]]) {
      // Override the fixture date without duplicate YAML keys.
      const path = writeTaxonomyEntry(root, slug, "tags: [agents]\nseries: agentic-delivery");
      const source = readFileSync(path, "utf8").replace("2026-01-01", date);
      writeFileSync(path, source);
    }
    expect(getEntriesByTag("en", "agents", root).map((e) => e.slug)).toEqual(["z", "a", "b"]);
    expect(getSeries("en", root)[0].entries.map((e) => e.slug)).toEqual(["a", "b", "z"]);
  });

  it("groups series across sections in date/slug reading order, excluding drafts and empty series", () => {
    const root = fixture();
    const result = getSeries("en", root);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "agentic-delivery", label: "Agentic delivery", count: 3 });
    expect(result[0].entries.map((e) => e.slug)).toEqual(["a", "b", "c"]);
    expect(getSeries("ja", root)).toEqual([]);
  });

  it("ranks related posts by tag overlap, excludes self/drafts, and respects limits", () => {
    const root = fixture();
    const entry = getEntryBySlug("en", "ideas", "b", root)!;
    expect(getRelatedEntries(entry, 3, root).map((e) => e.slug)).toEqual(["c", "a"]);
    expect(getRelatedEntries(entry, 1, root).map((e) => e.slug)).toEqual(["c"]);
    expect(getRelatedEntries(entry, 0, root)).toEqual([]);
    expect(getRelatedEntries(getEntryBySlug("en", "ideas", "plain", root)!, 3, root)).toEqual([]);
  });

  it("uses series neighbors, falls back to section order, and returns null at boundaries", () => {
    const root = fixture();
    const entry = getEntryBySlug("en", "ideas", "b", root)!;
    const neighbors = getAdjacentEntries(entry, root);
    expect(neighbors.previous?.slug).toBe("a");
    expect(neighbors.next?.slug).toBe("c");
    expect(getAdjacentEntries(getEntryBySlug("en", "systems", "a", root)!, root).previous).toBeNull();
    expect(getAdjacentEntries(getEntryBySlug("en", "ideas", "c", root)!, root).next).toBeNull();
    const plain = getAdjacentEntries(getEntryBySlug("en", "ideas", "plain", root)!, root);
    expect(plain.previous?.slug).toBe("c");
    expect(plain.next).toBeNull();
    const draft = getEntryBySlug("en", "ideas", "draft", root)!;
    expect(getAdjacentEntries(draft, root)).toEqual({ previous: null, next: null });
    expect(getRelatedEntries(draft, 3, root)).toEqual([]);
  });
});
