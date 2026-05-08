import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { ArticlePage } from "@/components/layout/article-page";
import { getDictionary, getTopicSocialPreviewImageUrl } from "@/lib/i18n";
import { getEntryBySlug } from "@/lib/mdx/content";

vi.mock("@/components/ui/giscus-comments", () => ({
  GiscusComments: () => null,
}));

describe("ArticlePage", () => {
  it("renders the section preview image in the post view", async () => {
    const entry = getEntryBySlug("en", "ideas", "260505-compute-power-to-productivity");

    expect(entry).not.toBeNull();

    const page = await ArticlePage({
      entry: entry!,
      dictionary: getDictionary("en"),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain(
      `src="${getTopicSocialPreviewImageUrl("ideas", "260505-compute-power-to-productivity")}"`,
    );
    expect(markup).toContain('srcSet="/og/heroes/ideas1-640.webp 640w');
    expect(markup).toContain('fetchPriority="high"');
    expect(markup).toContain('loading="eager"');
    expect(markup).toContain('decoding="async"');
    expect(markup).toContain('alt=""');
    expect(markup).toContain("From compute power to productivity");
  });
});
