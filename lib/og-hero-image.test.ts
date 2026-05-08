import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  getOgHeroImageSrcSet,
  ogHeroImageSizes,
  OgHeroImage,
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
});
