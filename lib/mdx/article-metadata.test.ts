import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { buildArticleMetadata } from "@/lib/mdx/article-metadata";
import { getDictionary, getTopicSocialPreviewImageUrl, locales } from "@/lib/i18n";
import { getEntryBySlug } from "@/lib/mdx/content";
import { parseEntryFromFile } from "@/lib/mdx/content-frontmatter";

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

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
      "Measure AI productivity by how human judgment, compute, context, and control loops become resolved engineering work.",
    );
    expect(metadata.alternates?.canonical).toBe("/en/ideas/260505-compute-power-to-productivity");
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      title: "From compute power to productivity | Nelson Lin",
      description:
        "Measure AI productivity by how human judgment, compute, context, and control loops become resolved engineering work.",
      url: "/en/ideas/260505-compute-power-to-productivity",
      publishedTime: "2026-05-05",
      modifiedTime: "2026-05-05",
      section: getDictionary("en").articleSectionLabels.ideas,
      siteName: "Nelson Lin",
      locale: "en",
    });
    expect(metadata.openGraph?.alternateLocale).toContain("zh-TW");
    expect(metadata.authors).toEqual([
      {
        name: "Nelson Lin",
        url: "/en/profile/",
      },
    ]);
    expect(metadata.openGraph?.images).toEqual([
      {
        url: getTopicSocialPreviewImageUrl("ideas", "260505-compute-power-to-productivity"),
        alt: "From compute power to productivity | Nelson Lin",
      },
    ]);
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title: "From compute power to productivity | Nelson Lin",
      description:
        "Measure AI productivity by how human judgment, compute, context, and control loops become resolved engineering work.",
      images: [
        {
          url: getTopicSocialPreviewImageUrl("ideas", "260505-compute-power-to-productivity"),
          alt: "From compute power to productivity | Nelson Lin",
        },
      ],
    });
  });

  it("uses explicit authors from frontmatter when present", () => {
    const root = mkdtempSync(join(tmpdir(), "mdx-content-"));
    tempDirs.push(root);

    const sectionDir = join(root, "en", "ideas");
    mkdirSync(join(sectionDir, "agentic-ui"), { recursive: true });
    const filePath = join(sectionDir, "agentic-ui", "authors-test.mdx");

    writeFileSync(
      filePath,
      `---
title: Authors Test
date: 2026-05-07
summary: Testing explicit authors.
authors:
  - name: Nelson Lin
    url: https://nelson-o.github.io/en/profile/
  - name: Co Author
    url: https://example.com/profile
---

Body`,
    );

    const entry = parseEntryFromFile(filePath, "en", "ideas", root);
    const metadata = buildArticleMetadata(entry, "en", getDictionary("en"), locales);

    expect(metadata.authors).toEqual([
      {
        name: "Nelson Lin",
        url: "https://nelson-o.github.io/en/profile/",
      },
      {
        name: "Co Author",
        url: "https://example.com/profile",
      },
    ]);
  });
});
