import { readFileSync } from "node:fs";
import path from "node:path";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Profile2026Hero } from "@/components/layout/profile-2026/hero";
import { getProfile } from "@/lib/profile";

// #129: the cold load fetches one portrait, early, and nothing the 2026 page doesn't use.
describe("2026 cold-load resources", () => {
  const hero = renderToStaticMarkup(React.createElement(Profile2026Hero, { locale: "en", profile: getProfile("en", undefined, "2026") }));

  it.each(["light", "dark"])("preloads the %s portrait only when the system theme matches", (theme) => {
    expect(hero).toContain(`<link rel="preload" as="image" href="/profile/2026/hero/portrait.${theme}.webp" media="(prefers-color-scheme: ${theme})" fetchPriority="high"/>`);
  });

  it("keeps both portrait images lazy so the hidden theme is never fetched", () => {
    const portraits = hero.match(/<img[^>]*portrait\.(light|dark)\.webp[^>]*>/g) ?? [];
    expect(portraits).toHaveLength(2);
    for (const img of portraits) expect(img).toMatch(/loading="lazy"/);
  });

  it("does not load the Unica One stylesheet site-wide", () => {
    // The site shell loads it for the pages that use it; the root layout must not.
    const layout = readFileSync(path.join(process.cwd(), "app", "layout.tsx"), "utf8");
    expect(layout).not.toContain("fonts.googleapis.com");
    expect(readFileSync(path.join(process.cwd(), "components", "layout", "site-shell.tsx"), "utf8")).toContain("family=Unica+One");
  });
});
