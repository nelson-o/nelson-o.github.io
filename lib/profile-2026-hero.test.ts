import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Profile2026Hero } from "@/components/layout/profile-2026/hero";
import { getProfile } from "@/lib/profile";
import { profile2026Copy } from "@/lib/profile-2026-copy";

describe("2026 localized hero", () => {
  it.each([
    ["en", "en", "Ideas to Impact"],
    ["zh-tw", "zh", "從想法到影響"],
    ["zh-cn", "zh", "从想法到影响"],
    ["ja", "ja", "発想からインパクトへ"],
  ] as const)("renders %s artwork and accessible copy", (locale, asset, tagline) => {
    const markup = renderToStaticMarkup(React.createElement(Profile2026Hero, { locale, profile: getProfile(locale, undefined, "2026") }));
    expect(markup).toContain(`src="/profile/2026/hero/tagline.${asset}.webp"`);
    expect(markup).toContain(`alt="${tagline}"`);
    expect(markup.includes("<video")).toBe(locale === "en");
    if (locale === "en") {
      expect(markup).toContain('data-playing="false"');
      expect(markup).not.toContain('src="/profile/2026/hero/tagline.en.webm"');
    }
    expect(markup).toContain('src="/profile/2026/hero/portrait.dark.webp"');
    expect(markup).toContain(profile2026Copy[locale].since);
    for (const topic of profile2026Copy[locale].heroTopics) expect(markup).toContain(`<li>${topic}</li>`);
    expect(markup).toContain('href="#contact"');
    expect(markup).toContain('href="#experience"');
    expect(markup.match(/<h1\b/g)).toHaveLength(1);
  });
});
