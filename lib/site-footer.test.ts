import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/site-footer";
import { getDictionary, locales } from "@/lib/i18n";
import { getSiteFooterCopy } from "@/lib/i18n-site-footer";

describe("site footer", () => {
  it.each(locales)("provides localized static navigation and existing social destinations in %s", (locale) => {
    const html = renderToStaticMarkup(React.createElement(SiteFooter, { locale, dictionary: getDictionary(locale) }));
    const copy = getSiteFooterCopy(locale);
    expect(html).toContain('id="contact"');
    expect(html).toContain(copy.tagline);
    expect(html).toContain(`© ${new Date().getFullYear()} ${getDictionary(locale).site.title}`);
    expect(html).toContain(`aria-label="${copy.top}"`);
    for (const route of ["profile", "work", "posts", "ideas", "footprint"]) {
      expect(html).toContain(`href="/${locale}/${route}"`);
    }
    expect(html).toContain(`href="/${locale}/feed.xml"`);
    expect(html).toContain('href="#top"');
    expect(html).toContain('href="#contact"');
    expect(html).toContain('href="https://github.com/nelson-o"');
    expect(html).toContain('href="https://www.linkedin.com/in/nelsonlin/"');
  });
});
