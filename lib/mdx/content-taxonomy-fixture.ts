import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export function taxonomyRoot() {
  return mkdtempSync(join(tmpdir(), "content-taxonomy-"));
}

export function writeTaxonomyEntry(root: string, slug: string, metadata = "", locale = "en", section = "ideas") {
  const path = join(root, locale, section, `${slug}.mdx`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `---\ntitle: ${slug}\ndate: 2026-01-01\nsummary: Test\n${metadata}\n---\nBody`);
  return path;
}
