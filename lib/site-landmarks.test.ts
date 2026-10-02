import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import SectionPage from "@/app/[locale]/(site)/[section]/page";
import { FootprintPage } from "@/components/layout/footprint-page";
import { LocalizedHomePage } from "@/components/layout/localized-home-page";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary, locales } from "@/lib/i18n";
import { getLatestEntries } from "@/lib/mdx/content";
import { getProfile } from "@/lib/profile";

// Decorative client artwork does not own a landmark.
vi.mock("@/components/ui/topic-visual", () => ({ TopicVisual: () => null }));
vi.mock("@/lib/github-profile", () => ({ getGitHubProfile: async () => ({ bio: null, location: null }) }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn() }),
  notFound: () => { throw new Error("Unexpected missing route"); },
}));

describe("site content landmarks", () => {
  for (const locale of locales) {
    it.each(["home", "section", "footprint"])(`gives ${locale} %s one main landmark owned by the shell`, async (kind) => {
      const dictionary = getDictionary(locale);
      const children = kind === "home"
        ? createElement(LocalizedHomePage, { locale, dictionary, latestEntries: getLatestEntries(locale) })
        : kind === "footprint"
          ? createElement(FootprintPage, { dictionary, profile: getProfile(locale) })
          : await SectionPage({ params: Promise.resolve({ locale, section: "systems" }) });
      const markup = renderToStaticMarkup(await SiteShell({ locale, dictionary, children }));
      expect(markup.match(/<main\b/g)).toHaveLength(1);
      expect(markup).toContain('<main id="main-content">');
      expect(markup).toContain('href="#main-content"');
      expect(markup.match(/<h1\b/g)).toHaveLength(1);
    });
  }
});
