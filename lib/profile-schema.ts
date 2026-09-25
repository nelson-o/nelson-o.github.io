import { z } from "zod";

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

export const profileProjectCategories = ["platform", "developer-tools", "observability"] as const;
export type ProfileProjectCategory = (typeof profileProjectCategories)[number];

const profileProjectSchema = z.object({
  name: z.string().min(1),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
  category: z.enum(profileProjectCategories).optional(),
});

export const profileSourceSchema = z.object({
  basics: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    location: z.string().min(1),
    avatarUrl: z.string().url(),
    github: z.string().url().optional(),
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

// 2026 cards take their label and artwork from the category, so that edition requires it.
export const profile2026SourceSchema = profileSourceSchema.extend({
  projects: z.array(profileProjectSchema.required({ category: true })),
});

export type ProfileSource = z.infer<typeof profileSourceSchema>;
export type ProfileRole = z.infer<typeof profileExperienceSchema> & {
  periodLabel: string;
};
