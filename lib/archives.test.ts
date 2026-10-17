import { describe, expect, it } from "vitest";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { getArchive, getArchivePaths, getArchiveMetadata } from "./archives";
import { taxonomyRoot, writeTaxonomyEntry } from "./mdx/content-taxonomy-fixture";
import { getLocaleSitemapEntries } from "./sitemap";
import { locales } from "./i18n";

describe("published archives", () => {
  it("excludes drafts and unused taxonomy and orders series from the beginning", () => {
    const root = taxonomyRoot();
    try {
      const newest = writeTaxonomyEntry(root, "z-last", "tags: [agents]\nseries: agentic-delivery");
      writeFileSync(newest, readFileSync(newest, "utf8").replace("2026-01-01", "2026-02-01"));
      writeTaxonomyEntry(root, "a-first", "tags: [agents]\nseries: agentic-delivery");
      writeTaxonomyEntry(root, "draft", "published: false\ntags: [devices]\nseries: device-frontend");
      expect(getArchivePaths("en", root)).toEqual(["/posts", "/topics", "/series", "/topics/agents", "/series/agentic-delivery"]);
      expect(getArchive("en", "posts", undefined, root)?.entries.map((entry) => entry.slug)).toEqual(["z-last", "a-first"]);
      expect(getArchive("en", "topics", undefined, root)?.groups[0].count).toBe(2);
      expect(getArchive("en", "series", "agentic-delivery", root)?.entries.map((entry) => entry.slug)).toEqual(["a-first", "z-last"]);
      expect(getArchive("en", "topics", "devices", root)).toBeNull();
      expect(getArchive("en", "series", "device-frontend", root)).toBeNull();
      expect(getArchive("en", "topics", "unknown", root)).toBeNull();
      expect(getArchivePaths("ja", root)).toEqual(["/posts", "/topics", "/series"]);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  it.each(locales)("includes every %s archive in sitemap and only existing hreflang routes", (locale) => {
    const urls = getLocaleSitemapEntries(locale).map((entry) => entry.url);
    for (const path of getArchivePaths(locale)) {
      expect(urls).toContain(`https://nelson-o.github.io/${locale}${path}/`);
      const [, kind, id] = path.split("/");
      const metadata = getArchiveMetadata(locale, kind as "posts" | "topics" | "series", id);
      expect(metadata.alternates?.canonical).toBe(`/${locale}${path}`);
      expect(metadata.alternates?.languages).toHaveProperty("en", `/en${path}`);
    }
  });
});
