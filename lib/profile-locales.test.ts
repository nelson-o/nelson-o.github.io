import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { generateStaticParams as aliasParams } from "@/app/[locale]/profile/page";
import { Profile2026Footer } from "@/components/layout/profile-2026/footer";
import { Profile2026Header } from "@/components/layout/profile-2026/header";
import { locales } from "@/lib/i18n";
import { getProfile } from "@/lib/profile";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import { getProfile2026Labels } from "@/lib/profile-2026-labels";
import {
  getProfileLocales, getProfileSiteLocale, hasProfileEdition, profileLanguageNames,
  profileLocales, profileOnlyLocales,
} from "@/lib/profile-locales";
import { getProfileMetadata } from "@/lib/profile-versions";

vi.mock("next/navigation", () => ({
  usePathname: () => "/ko/profile/2026/",
  useRouter: () => ({ push: () => {} }),
}));

function leaves(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(leaves);
  return Object.values(value as object).flatMap(leaves);
}

describe("profile-only locales", () => {
  it("adds ko, th, vi and de to 2026 without widening 2025 or the alias", () => {
    expect(profileOnlyLocales).toEqual(["ko", "th", "vi", "de"]);
    expect(getProfileLocales("2026")).toEqual(profileLocales);
    expect(getProfileLocales("2025")).toEqual(locales);
    for (const locale of profileOnlyLocales) {
      expect(hasProfileEdition(locale, "2026")).toBe(true);
      expect(hasProfileEdition(locale, "2025")).toBe(false);
    }
    expect(aliasParams()).toEqual(locales.map((locale) => ({ locale })));
  });

  it.each(profileOnlyLocales)("keeps %s preview metadata localized, noindexed and cross-linked", (locale) => {
    const metadata = getProfileMetadata(locale, "2026");
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates?.canonical).toBe(`/${locale}/profile/2026`);
    expect(metadata.description).toBe(getProfile2026Labels(locale).profilePage.description);
    expect(metadata.description).not.toBe(getProfile2026Labels("en").profilePage.description);
    expect(Object.keys(metadata.alternates?.languages ?? {})).toEqual([
      "en", "zh-TW", "zh-CN", "ja", "ko", "th", "vi", "de", "x-default",
    ]);
  });

  it("does not advertise profile-only languages from 2025", () => {
    expect(Object.keys(getProfileMetadata("en", "2025").alternates?.languages ?? {})).toEqual([
      "en", "zh-TW", "zh-CN", "ja", "x-default",
    ]);
  });

  it.each(profileOnlyLocales)("translates every %s copy string and label", (locale) => {
    const english = new Set(leaves(profile2026Copy.en));
    const copy = leaves(profile2026Copy[locale]);
    expect(copy).toHaveLength(leaves(profile2026Copy.en).length);
    for (const text of copy) {
      expect(text.trim()).not.toBe("");
      expect(english.has(text)).toBe(false);
    }
    const labels = getProfile2026Labels(locale);
    for (const text of leaves(labels)) expect(text.trim()).not.toBe("");
    expect(labels.settingsPanel.buttonLabel).not.toBe(getProfile2026Labels("en").settingsPanel.buttonLabel);
    expect(profileLanguageNames[locale]).not.toBe("");
  });

  it.each(profileOnlyLocales)("translates the %s profile summary instead of reusing English", (locale) => {
    const english = getProfile("en", undefined, "2026");
    const profile = getProfile(locale, undefined, "2026");
    expect(profile.summary).not.toBe(english.summary);
    expect(profile.capabilities.map(({ title }) => title)).not.toEqual(english.capabilities.map(({ title }) => title));
  });

  it.each(profileOnlyLocales)("links %s to the English site and lists every profile language", (locale) => {
    expect(getProfileSiteLocale(locale)).toBe("en");
    const copy = profile2026Copy[locale];
    const profile = getProfile(locale, undefined, "2026");
    const header = renderToStaticMarkup(Profile2026Header({ locale, dictionary: getProfile2026Labels(locale), copy }));
    const footer = renderToStaticMarkup(Profile2026Footer({ locale, profile, copy, dictionary: getProfile2026Labels(locale) }));
    expect(header).toMatch(/href="\/en\/?"/);
    expect(footer).toMatch(/href="\/en\/?"/);
    expect(`${header}${footer}`).not.toMatch(new RegExp(`href="/${locale}/?"`));
    // Settings live at the foot of the page (#84), not in the header.
    expect(header).not.toContain("theme-toggle");
    for (const target of profileLocales) expect(footer).toContain(`<option value="${target}"`);
    expect(footer).not.toContain("disabled");
  });
});
