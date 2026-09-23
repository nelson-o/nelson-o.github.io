import React from "react";

import { ProfilePage } from "@/components/layout/profile-page";
import { Profile2026 } from "@/components/layout/profile-2026";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getGitHubProfile } from "@/lib/github-profile";
import { getProfile } from "@/lib/profile";
import type { ProfileLocale } from "@/lib/profile-locales";
import type { ProfileVersion } from "@/lib/profile-versions";

export async function ProfileEdition({ locale, version }: { locale: ProfileLocale; version: ProfileVersion }) {
  const profile = getProfile(locale, undefined, version);
  if (version === "2026") {
    return <Profile2026 locale={locale} profile={profile} />;
  }
  if (!isLocale(locale)) throw new Error(`Profile ${version} is not available in ${locale}`);
  const dictionary = getDictionary(locale);
  const { location } = await getGitHubProfile();
  return SiteShell({
    locale,
    dictionary,
    children: <ProfilePage profile={profile} dictionary={dictionary} location={location ?? "Taiwan"} />,
  });
}
