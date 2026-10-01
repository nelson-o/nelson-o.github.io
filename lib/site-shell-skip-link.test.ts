import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary, locales } from "@/lib/i18n";

vi.mock("@/lib/github-profile", () => ({
  getGitHubProfile: async () => ({ location: null, bio: null }),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/en/systems",
  useRouter: () => ({ push: vi.fn() }),
}));

const labels = {
  en: "Skip to content",
  "zh-tw": "跳至主要內容",
  "zh-cn": "跳至主要内容",
  ja: "本文へ移動",
};

describe("site-shell skip navigation", () => {
  it.each(locales)("renders the %s skip link with its existing content target", async (locale) => {
    const shell = await SiteShell({
      locale,
      dictionary: getDictionary(locale),
      children: createElement("p", null, "Content"),
    });
    const markup = renderToStaticMarkup(shell);
    expect(markup).toMatch(new RegExp(`<a href="#main-content"[^>]*>${labels[locale]}</a>`));
    expect(markup).toContain('<main id="main-content">');
  });
});
