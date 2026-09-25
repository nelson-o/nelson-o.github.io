import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Profile2026Projects } from "@/components/layout/profile-2026/projects";
import { getProfile } from "@/lib/profile";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import { getProfile2026Labels } from "@/lib/profile-2026-labels";
import { profileLocales } from "@/lib/profile-locales";
import { profileProjectCategories } from "@/lib/profile-schema";

const cards = (markup: string) => [...markup.matchAll(/data-art="([^"]+)"><span[^>]*>([^<]+)<\/span><h3>([^<]+)<\/h3>/g)]
  .map(([, art, label, name]) => ({ art, label, name }));

describe("2026 project cards", () => {
  it.each(profileLocales)("take label and artwork from each project's category in %s", (locale) => {
    const profile = getProfile(locale, undefined, "2026");
    const copy = profile2026Copy[locale];
    // Reversing the list must carry each label and artwork with its project, not its position.
    const reversed = { ...profile, projects: [...profile.projects].reverse() };
    const markup = renderToStaticMarkup(React.createElement(Profile2026Projects,
      { profile: reversed, copy, dictionary: getProfile2026Labels(locale) }));
    expect(cards(markup)).toEqual(reversed.projects.map(({ category, name }) =>
      ({ art: category, label: copy.categories[category!], name })));
  });

  it("gives every category artwork in both themes", () => {
    const css = readFileSync("components/layout/profile-2026/projects.module.css", "utf8");
    // platform uses the base waves artwork; the others override it per theme.
    for (const category of profileProjectCategories.filter((category) => category !== "platform")) {
      expect(css.match(new RegExp(`\\[data-art="${category}"\\]`, "g"))).toHaveLength(2);
    }
  });
});
