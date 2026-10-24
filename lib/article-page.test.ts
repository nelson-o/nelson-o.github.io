import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { ArticlePage } from "@/components/layout/article-page";
import { getDictionary } from "@/lib/i18n";
import type { ContentEntry } from "@/lib/mdx/content";
import { getEntryBySlug } from "@/lib/mdx/content";

vi.mock("@/components/ui/giscus-comments", () => ({
  GiscusComments: () => null,
}));

describe("ArticlePage", () => {
  it("renders the deterministic cover in the post view", async () => {
    const entry = getEntryBySlug("en", "ideas", "260505-compute-power-to-productivity");

    expect(entry).not.toBeNull();

    const page = await ArticlePage({
      entry: entry!,
      dictionary: getDictionary("en"),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain('src="/covers/fallback-agents.light-1200.webp"');
    expect(markup).toContain('srcSet="/covers/fallback-agents.light-160.webp 160w');
    expect(markup).toContain('/covers/fallback-agents.light-640.webp 640w');
    expect(markup).toContain('fetchPriority="high"');
    expect(markup).toContain('loading="eager"');
    expect(markup).toContain('decoding="async"');
    expect(markup).toContain('alt=""');
    expect(markup).toContain("From compute power to productivity");
  });

  it("renders compact llm context for digest posts with provenance", async () => {
    const entry = {
      slug: "llm-context",
      locale: "en",
      section: "digests",
      title: "LLM Context",
      date: "2026-05-10",
      summary: "Testing digest provenance.",
      published: true,
      featured: false,
      content: "Body",
      llm: {
        model: "GPT-5.5",
        context: "Condensed from an LLM-assisted discussion about static-export content architecture.",
      },
    } satisfies ContentEntry;

    const page = await ArticlePage({
      entry,
      dictionary: getDictionary("en"),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain("LLM context");
    expect(markup).toContain("GPT-5.5");
    expect(markup).toContain(
      "Condensed from an LLM-assisted discussion about static-export content architecture.",
    );
  });

  it("does not render llm context for non-digest posts", async () => {
    const entry = {
      slug: "idea-context",
      locale: "en",
      section: "ideas",
      title: "Idea Context",
      date: "2026-05-10",
      summary: "Testing non-digest provenance.",
      published: true,
      featured: false,
      content: "Body",
      llm: {
        model: "GPT-5.5",
        context: "This metadata should stay hidden outside digests.",
      },
    } satisfies ContentEntry;

    const page = await ArticlePage({
      entry,
      dictionary: getDictionary("en"),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).not.toContain("LLM context");
    expect(markup).not.toContain("This metadata should stay hidden outside digests.");
  });
});


describe("article table of contents", () => {
  it.each([0, 2, 3])("shows a TOC only from three headings (%i)", async (count) => {
    const entry = getEntryBySlug("en", "ideas", "260505-compute-power-to-productivity")!;
    const page = await ArticlePage({
      entry: { ...entry, content: Array.from({ length: count }, (_, index) => `## Section ${index}`).join("\n\n") },
      dictionary: getDictionary("en"),
    });
    const markup = renderToStaticMarkup(page);
    expect(markup.includes("data-article-toc")).toBe(count >= 3);
    if (count >= 3) {
      expect(markup).toContain('aria-label="On this page"');
      expect(markup).toContain('href="#article-section-2"');
      expect(markup).not.toContain("<details open");
    }
  });
});
