import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Profile2026Approach } from "@/components/layout/profile-2026/approach";
import { profile2026Copy } from "@/lib/profile-2026-copy";

describe("2026 approach", () => {
  it.each(["en", "zh-tw", "zh-cn", "ja"] as const)("renders accessible localized content for %s", (locale) => {
    const copy = profile2026Copy[locale];
    const markup = renderToStaticMarkup(React.createElement(Profile2026Approach, { copy }));
    expect(markup).toContain(`aria-label="${copy.approach}"`);
    expect(markup).toContain("<blockquote>");
    expect(markup).toContain("NELSON</figcaption>");
    for (const text of [...copy.approachQuote, ...copy.approachMotto, ...copy.approachStats]) expect(markup).toContain(text);
    for (const value of ["15+", "10+", "4", "∞"]) expect(markup).toContain(`<dd>${value}</dd>`);
  });
});
