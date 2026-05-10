import React from "react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getTopicSocialPreviewImageUrl, getTopicSocialPreviewImages, sections } from "@/lib/i18n";
import {
  getOgHeroImageSrcSet,
  ogHeroImageSizes,
  OgHeroImage,
  ogHeroImageWidths,
} from "@/components/ui/og-hero-image";

describe("OgHeroImage", () => {
  it("derives responsive WebP variants from an OG PNG path", () => {
    expect(getOgHeroImageSrcSet("/og/ideas1.png")).toBe(
      "/og/heroes/ideas1-640.webp 640w, /og/heroes/ideas1-960.webp 960w, /og/heroes/ideas1-1200.webp 1200w, /og/heroes/ideas1-1600.webp 1600w",
    );
  });

  it("renders WebP sources with a PNG fallback and high-priority loading hints", () => {
    const markup = renderToStaticMarkup(
      React.createElement(OgHeroImage, {
        className: "hero",
        src: "/og/ideas1.png",
        alt: "",
      }),
    );

    expect(markup).toContain("<picture>");
    expect(markup).toContain('type="image/webp"');
    expect(markup).toContain(`sizes="${ogHeroImageSizes}"`);
    expect(markup).toContain('srcSet="/og/heroes/ideas1-640.webp 640w');
    expect(markup).toContain('src="/og/ideas1.png"');
    expect(markup).toContain('loading="eager"');
    expect(markup).toContain('fetchPriority="high"');
    expect(markup).toContain('decoding="async"');
  });

  it("has responsive WebP hero assets for every topic preview image", () => {
    for (const section of sections) {
      const images = [getTopicSocialPreviewImageUrl(section), ...getTopicSocialPreviewImages(section)];

      for (const image of images) {
        const fileName = image.slice("/og/".length, -".png".length);

        for (const width of ogHeroImageWidths) {
          expect(existsSync(join(process.cwd(), "public", "og", "heroes", `${fileName}-${width}.webp`))).toBe(
            true,
          );
        }
      }
    }
  });
});
