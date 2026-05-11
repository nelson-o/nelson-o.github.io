import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getProfile, loadProfileSource } from "@/lib/profile";

const tempDirs: string[] = [];

function writeProfile(root: string, source: string) {
  const directory = join(root, "data", "profile");
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "nelson.json5"), source);
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("profile source parsing", () => {
  it("parses JSON5 source", () => {
    const root = mkdtempSync(join(tmpdir(), "profile-data-"));
    tempDirs.push(root);

    writeProfile(
      root,
      `{
        basics: { name: 'Nelson Lin', title: 'Senior Software Engineer / Principal Web Architect', location: 'Taipei, Taiwan', avatarUrl: 'https://github.com/nelson-o.png?size=256', github: 'https://github.com/nelson-o' },
        summary: 'Platform-focused frontend and full-stack engineer.',
        capabilities: [{ title: 'Platform Architecture', highlights: ['Shared SDK design', 'Release governance'] }],
        experience: [{ company: 'momoshop.tw', title: 'Senior Software Engineer / Principal Web Architect (Enterprise)', location: 'Global Teams', start: '2025-01', end: null, featured: true, summary: 'Leading enterprise web architecture.', highlights: ['Modernized Next.js SSR delivery'], stack: ['Next.js', 'TypeScript'] }],
        projects: [{ name: 'AI Agent Spec Pipeline', summary: 'Versioned spec-driven CI agent system.', highlights: ['State tracking', 'Usage visibility'] }],
        activities: { talks: [{ label: 'INP - Responsiveness Measurements and Improvements', date: '2024' }], certifications: [{ label: 'AWS Certified Developer - Associate', date: '2022' }], sideProjects: [{ label: 'pd-toolkit', date: '2023' }], hackathons: [{ label: 'Delivery Hero Global Hackathon', date: '2023' }] }
      }`,
    );

    const source = loadProfileSource(root);

    expect(source.basics.name).toBe("Nelson Lin");
    expect(source.basics.avatarUrl).toBe("https://github.com/nelson-o.png?size=256");
    expect(source.basics.github).toBe("https://github.com/nelson-o");
    expect(source.projects[0]?.name).toBe("AI Agent Spec Pipeline");
  });

  it("keeps localized profile structures aligned", () => {
    const english = getProfile("en");
    const zhTw = getProfile("zh-tw");
    const zhCn = getProfile("zh-cn");
    const ja = getProfile("ja");

    const englishRoles = [...english.selectedExperience, ...english.groupedExperience.roles];
    const roleKey = (role: (typeof englishRoles)[number]) => `${role.company}:${role.start}`;

    for (const localized of [zhTw, zhCn, ja]) {
      const localizedRoles = [...localized.selectedExperience, ...localized.groupedExperience.roles];

      expect(localized.selectedExperience.map(roleKey)).toEqual(english.selectedExperience.map(roleKey));
      expect(localized.groupedExperience.roles.map(roleKey)).toEqual(english.groupedExperience.roles.map(roleKey));
      expect(localizedRoles.map(roleKey)).toEqual(englishRoles.map(roleKey));
    }

    for (const profile of [english, zhTw, zhCn, ja]) {
      expect(profile.summary.length).toBeGreaterThan(0);
      expect(profile.selectedExperience.length).toBeGreaterThan(0);
      expect(profile.groupedExperience.roles.length).toBeGreaterThan(0);

      for (const role of [...profile.selectedExperience, ...profile.groupedExperience.roles]) {
        expect(role.summary.length).toBeGreaterThan(0);
        expect(role.highlights.length).toBeGreaterThan(0);
        expect(role.stack.length).toBeGreaterThan(0);
      }
    }
  });
});
