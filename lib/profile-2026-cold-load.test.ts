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

  it("preloads the portrait from an async script that resolves the theme, not from system-matched links", () => {
    // #132: a media-matched <link> would fetch the system theme's portrait even when a stored or
    // ?theme= preference shows the other one. lib/theme.test.ts covers which portrait the script picks.
    const script = hero.match(/<script async="" src="data:text\/javascript,([^"]*)"><\/script>/);
    expect(script).not.toBeNull();
    const code = decodeURIComponent(script![1]);
    for (const theme of ["light", "dark"]) expect(code).toContain(`/profile/2026/hero/portrait.${theme}.webp`);
    expect(hero).not.toContain('rel="preload"');
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
    expect(readFileSync(path.join(process.cwd(), "components", "layout", "site-shell.tsx"), "utf8")).toContain("/fonts/unica-one/font.css");
  });
});
