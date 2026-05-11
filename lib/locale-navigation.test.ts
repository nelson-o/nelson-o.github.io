import { describe, expect, it } from "vitest";

import { getLocaleHrefForPath } from "@/lib/locale-navigation";

describe("getLocaleHrefForPath", () => {
  it("preserves non-article paths when changing locale", () => {
    expect(getLocaleHrefForPath("/en/profile", "zh-tw")).toBe("/zh-tw/profile");
    expect(getLocaleHrefForPath("/zh-tw", "en")).toBe("/en");
  });

  it("uses the target section page for article paths by default to avoid untranslated article 404s", () => {
    expect(
      getLocaleHrefForPath(
        "/en/ideas/260505-compute-power-to-productivity",
        "zh-tw",
      ),
    ).toBe("/zh-tw/ideas");
  });

  it("preserves article paths when the caller confirms the target article exists", () => {
    expect(
      getLocaleHrefForPath(
        "/en/ideas/260505-compute-power-to-productivity",
        "zh-tw",
        { preserveArticlePath: true },
      ),
    ).toBe("/zh-tw/ideas/260505-compute-power-to-productivity");
  });
});
