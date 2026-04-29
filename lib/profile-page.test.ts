import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ProfilePage from "@/app/[locale]/profile/page";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/lib/i18n";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    prefetch: () => {},
    refresh: () => {},
    back: () => {},
    forward: () => {},
  }),
}));

describe("profile route", () => {
  it("renders the profile page content for a localized route", async () => {
    const page = await ProfilePage({
      params: Promise.resolve({ locale: "en" }),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain("Selected Experience");
    expect(markup).toContain("AI Agent Spec Pipeline");
    expect(markup).toContain('href="https://github.com/nelson-o"');
    expect(markup).toContain(">GitHub<");
    expect(markup).not.toContain("mailto:");
    expect(markup).not.toContain("nelson211145@gmail.com");
  });

  it("uses the shell title as the localized profile link", () => {
    const markup = renderToStaticMarkup(
      createElement(
        SiteShell,
        {
          locale: "en",
          dictionary: getDictionary("en"),
          children: createElement("main", null, "content"),
        },
      ),
    );

    expect(markup).toContain('href="/en/profile"');
    expect(markup).not.toContain(">Profile<");
  });
});
