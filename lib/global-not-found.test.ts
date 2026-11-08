import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import GlobalNotFound from "@/app/global-not-found";
import { themeStorageKey } from "@/lib/theme";
import { getNotFoundCopy, getNotFoundLocale } from "@/lib/i18n-not-found";
import { locales } from "@/lib/i18n";

describe("GlobalNotFound", () => {
  it("includes the theme bootstrap because it does not render through the root layout", () => {
    const markup = renderToStaticMarkup(createElement(GlobalNotFound));

    expect(markup).toContain(themeStorageKey);
    expect(markup).toContain("document.documentElement");
    expect(markup).toContain("theme-dark");
    expect(markup).toContain("Page not found");
  });

  it("exports an English no-JavaScript fallback with only supported locale destinations", () => {
    const markup = renderToStaticMarkup(createElement(GlobalNotFound));
    expect(markup).toContain('<html lang="en"');
    expect(markup.match(/<main/g)).toHaveLength(1);
    for (const locale of locales) expect(markup).toContain(`href="/${locale}/"`);
    expect(markup).toContain('href="/en/systems"');
    expect(markup).not.toContain('href="/ko');
  });

  it.each(locales)("resolves %s nested missing routes and provides all localized recovery labels", (locale) => {
    expect(getNotFoundLocale(`/${locale}/systems/missing/`)).toBe(locale);
    const copy = getNotFoundCopy(locale);
    expect(Object.values(copy).every((value) => value.trim().length > 0)).toBe(true);
  });

  it("reuses site normalization without accepting arbitrary prefixes", () => {
    expect(getNotFoundLocale("/ZH_TW/missing/")).toBe("zh-tw");
    for (const path of ["/", "/missing/", "/ko/missing/", "/zh-tw-extra/missing/", "/%6aa/missing/", "//ja/missing/"]) {
      expect(getNotFoundLocale(path)).toBe("en");
    }
  });
});
