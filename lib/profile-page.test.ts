import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProfilePage from "@/app/[locale]/profile/page";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/lib/i18n";

describe("profile route", () => {
  it("renders the profile page content for a localized route", async () => {
    const page = await ProfilePage({
      params: Promise.resolve({ locale: "en" }),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain("Selected Experience");
    expect(markup).toContain("AI Agent Spec Pipeline");
  });

  it("adds profile to primary navigation", () => {
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

    expect(markup).toContain(">Profile<");
  });
});
