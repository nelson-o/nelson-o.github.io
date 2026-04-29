import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import JSON5 from "json5";

import type { Locale } from "@/lib/i18n";
import { profileSourceSchema, type ProfileRole, type ProfileSource } from "@/lib/profile-schema";

export type Profile = {
  basics: ProfileSource["basics"];
  summary: string;
  capabilities: ProfileSource["capabilities"];
  selectedExperience: ProfileRole[];
  groupedExperience: {
    roles: ProfileRole[];
  };
  projects: ProfileSource["projects"];
  activities: ProfileSource["activities"];
};

function getProfilePath(root = process.cwd()) {
  return join(root, "data", "profile", "nelson.json5");
}

function formatPeriod(start: string, end: string | null) {
  return `${start} - ${end ?? "Present"}`;
}

function toProfileRole(role: ProfileSource["experience"][number]): ProfileRole {
  return {
    ...role,
    periodLabel: formatPeriod(role.start, role.end),
  };
}

function sortRolesNewestFirst<T extends { start: string }>(roles: T[]) {
  return [...roles].sort((left, right) => right.start.localeCompare(left.start));
}

export function loadProfileSource(root?: string) {
  const profilePath = getProfilePath(root);

  if (!existsSync(profilePath)) {
    throw new Error(`Profile source not found at ${profilePath}`);
  }

  const source = readFileSync(profilePath, "utf8");

  return profileSourceSchema.parse(JSON5.parse(source));
}

export function getProfile(_locale: Locale, root?: string): Profile {
  const source = loadProfileSource(root);
  const featured = sortRolesNewestFirst(source.experience.filter((role) => role.featured)).map(toProfileRole);
  const grouped = sortRolesNewestFirst(source.experience.filter((role) => !role.featured)).map(toProfileRole);

  return {
    basics: source.basics,
    summary: source.summary,
    capabilities: source.capabilities,
    selectedExperience: featured,
    groupedExperience: {
      roles: grouped,
    },
    projects: source.projects,
    activities: source.activities,
  };
}
