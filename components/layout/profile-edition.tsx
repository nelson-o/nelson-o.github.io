import React from "react";

import { ProfilePage } from "@/components/layout/profile-page";
import { Profile2026 } from "@/components/layout/profile-2026";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getGitHubProfile } from "@/lib/github-profile";
import { getProfile } from "@/lib/profile";
import type { ProfileVersion } from "@/lib/profile-versions";

export async function ProfileEdition({ locale, version }: { locale: Locale; version: ProfileVersion }) {
  const dictionary = getDictionary(locale);
  const profile = getProfile(locale, undefined, version);
  if (version === "2026") {
    return <Profile2026 locale={locale} profile={profile} />;
  }
  const { location } = await getGitHubProfile();
  return SiteShell({
    locale,
    dictionary,
    children: <ProfilePage profile={profile} dictionary={dictionary} location={location ?? "Taiwan"} />,
  });
}
