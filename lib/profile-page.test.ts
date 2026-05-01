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

    expect(markup).toContain("Delivery Record Across the AI Wave");
    expect(markup).toContain("AI Agent Spec Pipeline");
    expect(markup).toContain('src="https://github.com/nelson-o.png?size=256"');
    expect(markup).toContain('alt="Nelson Lin avatar"');
    expect(markup).toContain('href="https://github.com/nelson-o"');
    expect(markup).toContain(">GitHub<");
    expect(markup).toContain('href="https://www.linkedin.com/in/nelsonlin/"');
    expect(markup).toContain(">LinkedIn<");
    expect(markup).toContain("<svg");
    expect(markup).not.toContain("mailto:");
    expect(markup).not.toContain("nelson211145@gmail.com");
    expect(markup).not.toContain("prior experience");
  });

  it("uses the shell title as the localized profile link", async () => {
    const shell = await SiteShell({
      locale: "en",
      dictionary: getDictionary("en"),
      children: createElement("main", null, "content"),
    });
    const markup = renderToStaticMarkup(shell);

    expect(markup).toContain('href="/en/profile"');
    expect(markup).toContain(">Nelson Lin<");
    expect(markup).toContain('aria-label="Nelson Lin"');
    expect(markup).not.toContain(">Profile<");
  });
});
