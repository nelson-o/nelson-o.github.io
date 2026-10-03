import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { SiteSectionLinks } from "@/components/ui/site-section-links";
import { getDictionary, locales, sections } from "@/lib/i18n";

const route = vi.hoisted(() => ({ pathname: "/en" as string | null }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

describe("current section links", () => {
  for (const locale of locales) {
    const render = () => renderToStaticMarkup(createElement(SiteSectionLinks, {
      locale, labels: getDictionary(locale).navigation,
    }));

    it.each(sections)(`${locale}: marks %s indexes and descendants with distinct current states`, (section) => {
      for (const suffix of ["", "/", "/example/", "/nested/example/"]) {
        route.pathname = `/${locale}/${section}${suffix}`;
        const markup = render();
        expect(markup.match(/aria-current=/g)).toHaveLength(1);
        const link = markup.match(new RegExp(`<a\\b[^>]*href="/${locale}/${section}"[^>]*>`))?.[0];
        expect(link).toContain(`aria-current="${suffix.length > 1 ? "location" : "page"}"`);
        expect(markup).toContain(getDictionary(locale).navigation[section]);
      }
    });

    it(`${locale}: leaves unrelated routes and similar prefixes unmarked`, () => {
      for (const path of ["", "/", "/footprint", "/profile", "/systems-extra", "/ideas-extra/post"]) {
        route.pathname = `/${locale}${path}`;
        expect(render()).not.toContain("aria-current");
      }
      route.pathname = null;
      expect(render()).not.toContain("aria-current");
      route.pathname = "/other-locale/systems";
      expect(render()).not.toContain("aria-current");
    });
  }
});
