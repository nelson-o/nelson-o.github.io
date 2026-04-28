import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import JSON5 from "json5";
import { z } from "zod";

import type { Locale } from "@/lib/i18n";

const profileActivityEntrySchema = z.object({
  label: z.string().min(1),
  date: z.string().min(1),
});

const profileCapabilitySchema = z.object({
  title: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
});

const profileExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  start: z.string().min(1),
  end: z.string().nullable(),
  featured: z.boolean().default(false),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string().min(1)).default([]),
});

const profileProjectSchema = z.object({
  name: z.string().min(1),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
});

const profileSourceSchema = z.object({
  basics: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    location: z.string().min(1),
    email: z.string().email(),
    linkedin: z.string().url().optional(),
  }),
  summary: z.string().min(1),
  capabilities: z.array(profileCapabilitySchema),
  experience: z.array(profileExperienceSchema),
  projects: z.array(profileProjectSchema),
  activities: z.object({
    talks: z.array(profileActivityEntrySchema),
    certifications: z.array(profileActivityEntrySchema),
    sideProjects: z.array(profileActivityEntrySchema),
    hackathons: z.array(profileActivityEntrySchema),
  }),
});

export type ProfileSource = z.infer<typeof profileSourceSchema>;
export type ProfileRole = z.infer<typeof profileExperienceSchema> & {
  periodLabel: string;
};
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

function toProfileRole(role: z.infer<typeof profileExperienceSchema>): ProfileRole {
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
