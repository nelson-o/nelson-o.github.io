import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import LocaleGatewayPage from "@/app/page";

describe("LocaleGatewayPage", () => {
  it("renders the theme toggle so the root page keeps the dark mode control", () => {
    const markup = renderToStaticMarkup(createElement(LocaleGatewayPage));

    expect(markup).toContain("theme-toggle");
    expect(markup).not.toContain('data-ready="false"');
  });
});
