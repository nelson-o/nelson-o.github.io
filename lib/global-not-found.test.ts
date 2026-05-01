import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import GlobalNotFound from "@/app/global-not-found";
import { themeStorageKey } from "@/lib/theme";

describe("GlobalNotFound", () => {
  it("includes the theme bootstrap because it does not render through the root layout", () => {
    const markup = renderToStaticMarkup(createElement(GlobalNotFound));

    expect(markup).toContain(themeStorageKey);
    expect(markup).toContain("document.documentElement");
    expect(markup).toContain("theme-dark");
    expect(markup).toContain("Page not found");
  });
});
