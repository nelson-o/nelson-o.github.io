import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import AliasRoute from "@/app/[locale]/profile/page";
import VersionRoute, { generateStaticParams } from "@/app/[locale]/profile/[version]/page";
import { locales } from "@/lib/i18n";
import { getProfile } from "@/lib/profile";
import { profile2026Copy } from "@/lib/profile-2026-copy";
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
  it("exports both explicit editions for every locale", () => {
    expect(generateStaticParams()).toEqual(locales.flatMap((locale) => [
      { locale, version: "2025" }, { locale, version: "2026" },
    ]));
  });

  it.each(locales)("renders the alias and 2025 from identical code in %s", async (locale) => {
    const alias = renderToStaticMarkup(await AliasRoute({ params: Promise.resolve({ locale }) }));
    const edition = renderToStaticMarkup(await VersionRoute({ params: Promise.resolve({ locale, version: "2025" }) }));
    expect(activeProfileVersion).toBe("2025");
    expect(alias).toBe(edition);
    expect(alias.match(/<main\b/g)).toHaveLength(1);
    expect(alias).not.toContain("http-equiv=\"refresh\"");
  });

  it.each(locales)("renders an independent localized 2026 preview in %s", async (locale) => {
    const markup = renderToStaticMarkup(await VersionRoute({ params: Promise.resolve({ locale, version: "2026" }) }));
    expect(markup.match(/<main\b/g)).toHaveLength(1);
    expect(markup).toContain('id="profile-headline"');
    expect(markup).toContain('id="projects"');
    const footerAsset = { en: "en", "zh-tw": "zh", "zh-cn": "zh", ja: "jp" }[locale];
    expect(markup).toContain(`src="/profile/2026/signature.${footerAsset}.webp"`);
    expect(markup).toContain(`alt="${profile2026Copy[locale].manifesto.join(" ")}"`);
    expect(markup).toMatch(/<h2 id="contact-heading"><img /);
    expect(markup).not.toContain(profile2026Copy[locale].preview);
    expect(markup).not.toContain(profile2026Copy[locale].stable);
    expect(markup).toContain("<dd>15+</dd>");
    expect(markup).not.toContain("Open to opportunities");
    expect(markup).not.toContain('href="#"');
  });

  it("rejects unsupported locales and years", async () => {
    await expect(VersionRoute({ params: Promise.resolve({ locale: "en", version: "2024" }) })).rejects.toThrow("404");
    await expect(VersionRoute({ params: Promise.resolve({ locale: "xx", version: "2026" }) })).rejects.toThrow("404");
  });

  it("keeps canonical and indexing decisions aligned with promotion and rollback", () => {
    for (const active of ["2025", "2026", "2025"] as const) {
      expect(getProfileCanonicalPath(active, active)).toBe("/profile");
      expect(isProfilePreview("2026", active)).toBe(active === "2025");
      expect(getProfileSitemapPaths(active)).toEqual(active === "2025" ? ["/profile"] : ["/profile", "/profile/2025"]);
    }
    expect(getProfileMetadata("en", "2025").alternates?.canonical).toBe("/en/profile");
    expect(getProfileMetadata("en", "2026").robots).toEqual({ index: false, follow: true });
    expect(getProfileMetadata("en", "2026").alternates?.languages).toMatchObject({
      ja: "/ja/profile/2026", "zh-CN": "/zh-cn/profile/2026",
    });
  });

  it.each(locales)("preserves the year when switching from %s", (locale) => {
    for (const target of locales) {
      expect(getLocaleHrefForPath(`/${locale}/profile/2026/`, target)).toBe(`/${target}/profile/2026/`);
    }
  });

  it("keeps localized factual fields aligned", () => {
    const profiles = locales.map((locale) => getProfile(locale, undefined, "2026"));
    const facts = (profile: typeof profiles[number]) => ({
      roles: [...profile.selectedExperience, ...profile.groupedExperience.roles].map(({ company, start, end, featured, stack, highlights }) => ({ company, start, end, featured, stack, highlights: highlights.length })),
      name: profile.basics.name, avatar: profile.basics.avatarUrl,
      github: profile.basics.github, linkedin: profile.basics.linkedin,
      capabilities: profile.capabilities.map(({ highlights }) => highlights.length),
      activities: Object.values(profile.activities).map((entries) => entries.map(({ date }) => date)),
      projects: profile.projects.map(({ highlights }) => highlights.length),
    });
    for (const profile of profiles) expect(facts(profile)).toEqual(facts(profiles[0]));
  });
});
