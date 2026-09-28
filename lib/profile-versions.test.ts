import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import AliasRoute from "@/app/[locale]/profile/page";
import VersionRoute, { generateStaticParams } from "@/app/[locale]/profile/[version]/page";
import { locales } from "@/lib/i18n";
import { getProfile } from "@/lib/profile";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import { profileLocales } from "@/lib/profile-locales";
import { getLocaleHrefForPath } from "@/lib/locale-navigation";
import {
  activeProfileVersion, getProfileCanonicalPath, getProfileMetadata,
  getProfileSitemapPaths, isProfilePreview,
} from "@/lib/profile-versions";

vi.mock("@/lib/github-profile", () => ({ getGitHubProfile: async () => ({ location: "Taiwan", bio: null }) }));
vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("404"); },
  usePathname: () => "/en/profile/2025/",
  useRouter: () => ({ push: () => {} }),
}));

describe("profile editions", () => {
  it("exports 2025 for site locales and 2026 for every profile locale", () => {
    expect(generateStaticParams()).toEqual([
      ...locales.flatMap((locale) => [{ locale, version: "2025" }, { locale, version: "2026" }]),
      ...["ko", "th", "vi", "de"].map((locale) => ({ locale, version: "2026" })),
    ]);
  });

  // #62 promoted 2026; reverting activeProfileVersion to "2025" is the rollback.
  it.each(profileLocales)("renders the alias and the active 2026 edition from identical code in %s", async (locale) => {
    const alias = renderToStaticMarkup(await AliasRoute({ params: Promise.resolve({ locale }) }));
    const edition = renderToStaticMarkup(await VersionRoute({ params: Promise.resolve({ locale, version: "2026" }) }));
    expect(activeProfileVersion).toBe("2026");
    expect(alias).toBe(edition);
    expect(alias.match(/<main\b/g)).toHaveLength(1);
    expect(alias).not.toContain("http-equiv=\"refresh\"");
  });

  it.each(profileLocales)("renders an independent localized 2026 preview in %s", async (locale) => {
    const markup = renderToStaticMarkup(await VersionRoute({ params: Promise.resolve({ locale, version: "2026" }) }));
    expect(markup.match(/<main\b/g)).toHaveLength(1);
    expect(markup).toContain('id="profile-headline"');
    expect(markup).toContain('id="projects"');
    const footerAsset = ({ "zh-tw": "zh", "zh-cn": "zh" } as Record<string, string>)[locale] ?? locale;
    expect(markup).toContain(`src="/profile/2026/contact/signature.${footerAsset}.webp"`);
    expect(markup).toContain(`alt="${profile2026Copy[locale].manifesto.join(" ")}"`);
    expect(markup).toMatch(/<h2 id="contact-heading"><img /);
    expect(markup).not.toContain(profile2026Copy[locale].preview);
    expect(markup).not.toContain(profile2026Copy[locale].stable);
    expect(markup).not.toContain("<dd>15+</dd>");
    expect(markup).not.toContain("Open to opportunities");
    expect(markup).not.toContain('href="#"');
  });

  it("rejects unsupported locales and years", async () => {
    await expect(VersionRoute({ params: Promise.resolve({ locale: "en", version: "2024" }) })).rejects.toThrow("404");
    await expect(VersionRoute({ params: Promise.resolve({ locale: "xx", version: "2026" }) })).rejects.toThrow("404");
    await expect(VersionRoute({ params: Promise.resolve({ locale: "ko", version: "2025" }) })).rejects.toThrow("404");
    await expect(AliasRoute({ params: Promise.resolve({ locale: "xx" }) })).rejects.toThrow("404");
  });

  it("keeps canonical and indexing decisions aligned with promotion and rollback", () => {
    for (const active of ["2025", "2026", "2025"] as const) {
      expect(getProfileCanonicalPath(active, active)).toBe("/profile");
      expect(isProfilePreview("2026", active)).toBe(active === "2025");
      expect(getProfileSitemapPaths(active)).toEqual(active === "2025" ? ["/profile"] : ["/profile", "/profile/2025"]);
    }
    // With 2026 active: 2026 owns the alias; 2025 stays indexed at its year URL.
    expect(getProfileMetadata("en", "2026").alternates?.canonical).toBe("/en/profile");
    expect(getProfileMetadata("en", "2026").robots).toEqual({ index: true, follow: true });
    expect(getProfileMetadata("en", "2026").alternates?.languages).toMatchObject({
      ja: "/ja/profile", "zh-CN": "/zh-cn/profile", ko: "/ko/profile",
    });
    expect(getProfileMetadata("en", "2025").alternates?.canonical).toBe("/en/profile/2025");
    expect(getProfileMetadata("en", "2025").robots).toEqual({ index: true, follow: true });
  });

  it.each(profileLocales)("titles the 2026 edition nelson.26 in %s", (locale) => {
    const metadata = getProfileMetadata(locale, "2026");
    expect(metadata.title).toBe("nelson.26");
    expect(metadata.openGraph?.title).toBe("nelson.26");
  });

  it("restates full link-preview metadata for 2025 with the site card", () => {
    const { openGraph, twitter, title } = getProfileMetadata("en", "2025");
    const image = { url: "/og/default.png", alt: title };
    expect(openGraph).toMatchObject({ type: "website", siteName: "Nelson Lin", images: [image] });
    expect(twitter).toMatchObject({ card: "summary_large_image", images: [image] });
  });

  it.each(profileLocales)("gives 2026 in %s its headline card while the title stays nelson.26", (locale) => {
    const { openGraph, twitter, title } = getProfileMetadata(locale, "2026");
    const image = { url: `/og/profile-2026.${locale}.jpg`, alt: profile2026Copy[locale].headline.join(" ") };
    expect(title).toBe("nelson.26");
    expect(openGraph).toMatchObject({ type: "website", title: "nelson.26", images: [image] });
    expect(twitter).toMatchObject({ card: "summary_large_image", images: [image] });
  });

  it("keeps the localized 2025 title", () => {
    expect(getProfileMetadata("en", "2025").title).toBe("Profile 2025 | Nelson Lin");
    expect(getProfileMetadata("zh-tw", "2025").title).not.toContain("nelson.");
  });

  it.each(profileLocales)("preserves the year when switching from %s", (locale) => {
    for (const target of profileLocales) {
      expect(getLocaleHrefForPath(`/${locale}/profile/2026/`, target)).toBe(`/${target}/profile/2026/`);
    }
  });

  it("keeps localized factual fields aligned", () => {
    const profiles = profileLocales.map((locale) => getProfile(locale, undefined, "2026"));
    const facts = (profile: typeof profiles[number]) => ({
      roles: [...profile.selectedExperience, ...profile.groupedExperience.roles].map(({ company, start, end, featured, stack, highlights }) => ({ company, start, end, featured, stack, highlights: highlights.length })),
      name: profile.basics.name, avatar: profile.basics.avatarUrl,
      github: profile.basics.github, linkedin: profile.basics.linkedin,
      capabilities: profile.capabilities.map(({ highlights, icon }) => ({ highlights: highlights.length, icon })),
      activities: Object.values(profile.activities).map((entries) => entries.map(({ date }) => date)),
      projects: profile.projects.map(({ highlights, category }) => ({ highlights: highlights.length, category })),
    });
    for (const profile of profiles) expect(facts(profile)).toEqual(facts(profiles[0]));
  });
});
