import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getAllEntriesForSection, getPublishedEntriesForSection, getStaticArticleParams } from "./content";

let root: string;
let section: string;

function writeEntry(slug: string, title = "Initial title", published = true) {
  writeFileSync(join(section, `${slug}.mdx`), `---\ntitle: ${title}\ndate: 2026-01-01\nsummary: Fixture\npublished: ${published}\n---\n\n${title} body`);
}

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "development");
  root = mkdtempSync(join(tmpdir(), "content-development-"));
  section = join(root, "en", "systems");
  mkdirSync(section, { recursive: true });
  writeEntry("first");
});

afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(root, { recursive: true, force: true });
});

describe("development content refresh", () => {
  it("reads edited metadata, body and publication state on the next query", () => {
    expect(getPublishedEntriesForSection("en", "systems", root)[0].title).toBe("Initial title");
    writeEntry("first", "Updated title", false);
    expect(getAllEntriesForSection("en", "systems", root)[0]).toMatchObject({
      title: "Updated title", content: "\nUpdated title body", published: false,
    });
    expect(getPublishedEntriesForSection("en", "systems", root)).toEqual([]);
  });

  it("refreshes static params when a draft is added or a file is deleted", () => {
    expect(getStaticArticleParams(root)).toHaveLength(1);
    writeEntry("second", "New draft", false);
    rmSync(join(section, "first.mdx"));
    expect(getStaticArticleParams(root)).toEqual([
      { locale: "en", section: "systems", slug: "second" },
    ]);
  });

  it("revalidates other locales after an initial successful read", () => {
    getAllEntriesForSection("en", "systems", root);
    const otherSection = join(root, "ja", "systems");
    mkdirSync(otherSection, { recursive: true });
    writeFileSync(join(otherSection, "invalid.mdx"), "---\ntitle: Missing required fields\n---\n");
    expect(() => getAllEntriesForSection("en", "systems", root)).toThrow();
    rmSync(join(otherSection, "invalid.mdx"));
    expect(getAllEntriesForSection("en", "systems", root)).toHaveLength(1);
  });

  it("retains immutable build caching outside development", () => {
    vi.stubEnv("NODE_ENV", "production");
    const first = getAllEntriesForSection("en", "systems", root);
    writeEntry("first", "Changed after build read");
    expect(getAllEntriesForSection("en", "systems", root)).toBe(first);
    expect(first[0].title).toBe("Initial title");
  });
});
