import { describe, expect, it } from "vitest";

import { buildArticleMetadata } from "@/lib/mdx/article-metadata";
import { getDictionary, locales } from "@/lib/i18n";
import { getEntryBySlug } from "@/lib/mdx/content";

describe("buildArticleMetadata", () => {
  it("builds canonical article metadata for social sharing", () => {
    const entry = getEntryBySlug(
      "en",
      "ideas",
      "260505-compute-power-to-productivity",
    );

    expect(entry).not.toBeNull();

    const metadata = buildArticleMetadata(entry!, "en", getDictionary("en"), locales);

    expect(metadata.title).toBe("From compute power to productivity | Nelson Lin");
    expect(metadata.description).toBe(
      "A framework for measuring how AI tokens, turns, and threads convert into engineering outcomes.",
    );
    expect(metadata.alternates?.canonical).toBe("/en/ideas/260505-compute-power-to-productivity");
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      title: "From compute power to productivity | Nelson Lin",
      description:
        "A framework for measuring how AI tokens, turns, and threads convert into engineering outcomes.",
      url: "/en/ideas/260505-compute-power-to-productivity",
      publishedTime: "2026-05-05",
      modifiedTime: "2026-05-05",
      section: getDictionary("en").articleSectionLabels.ideas,
      siteName: "Nelson Lin",
      locale: "en",
    });
    expect(metadata.openGraph?.alternateLocale).toContain("zh-TW");
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/icon.svg",
        alt: "From compute power to productivity | Nelson Lin",
      },
    ]);
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title: "From compute power to productivity | Nelson Lin",
      description:
        "A framework for measuring how AI tokens, turns, and threads convert into engineering outcomes.",
      images: [
        {
          url: "/icon.svg",
          alt: "From compute power to productivity | Nelson Lin",
        },
      ],
    });
  });
});
