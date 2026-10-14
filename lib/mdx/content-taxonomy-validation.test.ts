import { rmSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { join } from "node:path";
import { resolveCoverSourcePath } from "@/lib/mdx/content-cover";
import { locales } from "@/lib/i18n";
import { tags, series } from "@/lib/taxonomy";
import { parseEntryFromFile } from "@/lib/mdx/content-frontmatter";
import { assertLocalizedContentIntegrity } from "@/lib/mdx/content-fs";
import { taxonomyRoot, writeTaxonomyEntry } from "@/lib/mdx/content-taxonomy-fixture";

const roots: string[] = [];
function root() { const path = taxonomyRoot(); roots.push(path); return path; }
afterEach(() => roots.splice(0).forEach((path) => rmSync(path, { recursive: true, force: true })));

describe("approved D6 frontmatter", () => {
  it("keeps old entries valid and parses registered metadata", () => {
    const dir = root();
    const plain = parseEntryFromFile(writeTaxonomyEntry(dir, "plain"), "en", "ideas", dir);
    expect(plain.tags).toBeUndefined();
    expect(plain.series).toBeUndefined();
    for (const cover of ["./cover.webp", "/images/cover.webp"]) {
      const path = writeTaxonomyEntry(dir, "tagged", `tags: [agents, code-review]\nseries: agentic-delivery\ncover: ${cover}`);
      expect(parseEntryFromFile(path, "en", "ideas", dir)).toMatchObject({
        tags: ["agents", "code-review"], series: "agentic-delivery", cover,
      });
    }
  });

  it.each([
    "tags: [unknown]", "tags: [constructor]", "tags: []", "tags: [agents, agents]",
    "tags: [agents, teams, devices, delivery]", "tags: agents", "tags: [Agents]",
    "series: unknown", "series: toString", "series: {id: agentic-delivery, order: 1}",
    "cover: ./../secret.webp", "cover: /../secret.webp", "cover: ./%2e%2e/secret.webp",
    "cover: ./cover.webp?x=1", "cover: ./a//b.webp", "cover: ./",
    "cover: https://example.com/cover.webp", "cover: //example.com/cover.webp", "cover: ''",
  ])("rejects invalid metadata: %s", (metadata) => {
    const dir = root();
    const path = writeTaxonomyEntry(dir, "invalid", metadata);
    expect(() => parseEntryFromFile(path, "en", "ideas", dir)).toThrow();
  });

  it("resolves nested relative covers beside the MDX source and root covers under public", () => {
    const dir = root();
    const path = writeTaxonomyEntry(dir, "nested/post", "cover: ./images/cover.webp");
    const entry = parseEntryFromFile(path, "en", "ideas", dir);
    expect(resolveCoverSourcePath(entry, dir, "/public")).toBe(join(dir, "en/ideas/nested/images/cover.webp"));
    expect(resolveCoverSourcePath({ ...entry, cover: "/images/cover.webp" }, dir, "/public")).toBe("/public/images/cover.webp");
    expect(resolveCoverSourcePath({ ...entry, cover: undefined }, dir)).toBeNull();
    expect(() => resolveCoverSourcePath({ ...entry, cover: "./../escape.webp" }, dir)).toThrow();
  });

  it("provides localized labels for every kebab-case registry id", () => {
    for (const registry of [tags, series]) {
      for (const [id, labels] of Object.entries(registry)) {
        expect(id).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
        for (const locale of locales) expect(labels[locale].length).toBeGreaterThan(0);
      }
    }
  });
});

describe("translation taxonomy integrity", () => {
  it("allows matching taxonomy, different covers and missing draft translations", () => {
    const dir = root();
    for (const locale of locales) {
      writeTaxonomyEntry(dir, "same", `tags: [agents, delivery]\nseries: agentic-delivery\ncover: ./${locale}.webp`, locale);
    }
    writeTaxonomyEntry(dir, "draft", "published: false\ntags: [teams]");
    expect(() => assertLocalizedContentIntegrity(parseEntryFromFile, dir)).not.toThrow();
  });

  it.each(["tags: [teams]", "tags: [delivery, agents]", "tags: [agents, delivery]\nseries: device-frontend", ""]) (
    "rejects translation disagreement including drafts: %s", (metadata) => {
      const dir = root();
      writeTaxonomyEntry(dir, "nested/same", "tags: [agents, delivery]\nseries: agentic-delivery");
      writeTaxonomyEntry(dir, "nested/same", `${metadata}\npublished: false`, "ja");
      expect(() => assertLocalizedContentIntegrity(parseEntryFromFile, dir)).toThrow(/Taxonomy mismatch.*nested\/same.*en.*ja/);
    },
  );
});
