import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { buildFeedXml, getFeedEntries } from "@/lib/feed";
import { locales } from "@/lib/i18n";

describe("RSS feeds", () => {
  it("sorts published posts across sections, escapes XML, and includes taxonomy and canonical URLs", () => {
    const root = mkdtempSync(join(tmpdir(), "feed-"));
    try {
      for (const [section, slug, date, published] of [
        ["ideas", "nested/new", "2026-10-01", true],
        ["systems", "old", "2025-01-02", true],
        ["work", "draft", "2027-01-01", false],
      ] as const) {
        const path = join(root, "en", section, `${slug}.mdx`);
        mkdirSync(join(path, ".."), { recursive: true });
        writeFileSync(path, `---\ntitle: 'A & <B> "quoted"'\nsummary: 'Summary & <text>'\ndate: '${date}'\npublished: ${published}\ntags: [agents]\n---\nBody omitted from feed.\n`);
      }
      expect(getFeedEntries("en", root).map(({ slug }) => slug)).toEqual(["nested/new", "old"]);
      const xml = buildFeedXml("en", root);
      expect(xml).toContain('A &amp; &lt;B&gt; &quot;quoted&quot;');
      expect(xml).toContain('Summary &amp; &lt;text&gt;');
      expect(xml).toContain('<category>agents</category>');
      expect(xml).toContain('<pubDate>Thu, 01 Oct 2026 00:00:00 GMT</pubDate>');
      expect(xml).toContain('https://nelson-o.github.io/en/ideas/nested/new/');
      expect(xml).not.toContain("draft");
      expect(xml).not.toContain("Body omitted");
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  it.each(locales)("generates deterministic localized %s feeds with all published entries", (locale) => {
    const xml = buildFeedXml(locale);
    expect(xml).toBe(buildFeedXml(locale));
    expect(xml.match(/<item>/g)?.length).toBe(getFeedEntries(locale).length);
    expect(xml).toContain(`https://nelson-o.github.io/${locale}/feed.xml`);
    expect(xml).not.toContain("Invalid Date");
  });
});
