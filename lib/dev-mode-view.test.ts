import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DevModeView } from "@/components/dev-mode-view";

describe("DevModeView", () => {
  it("renders the city image and a back link home", () => {
    const markup = renderToStaticMarkup(createElement(DevModeView));

    expect(markup).toContain('href="/"');
    expect(markup).toContain("Back to home");
    expect(markup).toContain('src="/dev-mode/city.png"');
    expect(markup).toContain('alt="City view"');
  });
});
