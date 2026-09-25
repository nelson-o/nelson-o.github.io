import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Profile2026Capabilities } from "@/components/layout/profile-2026/capabilities";
import { Profile2026Icon } from "@/components/ui/profile-2026-icon";
import { getProfile } from "@/lib/profile";
import { getProfile2026Labels } from "@/lib/profile-2026-labels";
import { profileLocales } from "@/lib/profile-locales";

const iconPath = (markup: string) => markup.match(/<path d="([^"]+)"/)![1];

describe("2026 capabilities", () => {
  it.each(profileLocales)("take each icon from the capability, not its position, in %s", (locale) => {
    const profile = getProfile(locale, undefined, "2026");
    // Reversing the list must carry each icon with its capability.
    const reversed = { ...profile, capabilities: [...profile.capabilities].reverse() };
    const markup = renderToStaticMarkup(React.createElement(Profile2026Capabilities,
      { profile: reversed, dictionary: getProfile2026Labels(locale) }));
    const rendered = [...markup.matchAll(/<path d="([^"]+)"><\/path><\/svg><div><h2>([^<]+)<\/h2>/g)].map(([, path, title]) => ({ path, title }));
    expect(rendered).toEqual(reversed.capabilities.map(({ icon, title }) => ({
      path: iconPath(renderToStaticMarkup(React.createElement(Profile2026Icon, { name: icon! }))),
      title: title.replace(/&/g, "&amp;"),
    })));
  });
});
