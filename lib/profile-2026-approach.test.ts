import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Profile2026Approach } from "@/components/layout/profile-2026/approach";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import { profileLocales } from "@/lib/profile-locales";

describe("2026 approach", () => {
  it.each(profileLocales)("renders accessible localized content for %s", (locale) => {
    const copy = profile2026Copy[locale];
    const markup = renderToStaticMarkup(React.createElement(Profile2026Approach, { copy }));
    expect(markup).toContain(`aria-label="${copy.approach}"`);
    expect(markup).toContain("<blockquote>");
    for (const text of [...copy.approachQuote, ...copy.approachMotto]) expect(markup).toContain(text);
  });

  // docs/profile-2026.md omits the mockup's metrics and quote attribution (#99).
  it("renders no unverified metrics or attribution", () => {
    const markup = renderToStaticMarkup(React.createElement(Profile2026Approach, { copy: profile2026Copy.en }));
    expect(markup).not.toContain("<figcaption");
    expect(markup).not.toContain("NELSON");
    expect(markup).not.toContain("<dl");
    for (const value of ["15+", "10+", "∞"]) expect(markup).not.toContain(value);
  });
});
