import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import LocaleGatewayPage from "@/app/page";

vi.mock("@/components/layout/site-shell", () => ({
  SiteShell: ({ children }: { children: React.ReactNode }) =>
    createElement(
      "div",
      null,
      createElement("button", { className: "theme-toggle", type: "button" }, "Settings"),
      children,
    ),
}));

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

describe("LocaleGatewayPage", () => {
  it("renders the theme toggle so the root page keeps the dark mode control", () => {
    const markup = renderToStaticMarkup(createElement(LocaleGatewayPage));

    expect(markup).toContain("theme-toggle");
    expect(markup).not.toContain('data-ready="false"');
  });

  it("renders an English fallback link in the static root HTML", () => {
    const markup = renderToStaticMarkup(createElement(LocaleGatewayPage));

    expect(markup).toContain('href="/en/"');
    expect(markup).toContain("Continue to English");
  });

  it("renders a static redirect script before React hydration", () => {
    const markup = renderToStaticMarkup(createElement(LocaleGatewayPage));

    expect(markup).toContain("window.location.replace");
    expect(markup).toContain("navigator.languages");
    expect(markup).toContain("zh-hant");
    expect(markup).toContain("zh-tw");
  });
});
