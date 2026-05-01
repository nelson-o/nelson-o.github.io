import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getProfile } from "@/lib/profile";

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

describe("profile roles", () => {
  it("separates featured roles from grouped history and sorts newest first", () => {
    const root = mkdtempSync(join(tmpdir(), "profile-data-"));
    tempDirs.push(root);

    writeProfile(
      root,
      `{
        basics: { name: 'Nelson Lin', title: 'Senior Software Engineer / Principal Web Architect', location: 'Taipei, Taiwan', avatarUrl: 'https://github.com/nelson-o.png?size=256', github: 'https://github.com/nelson-o' },
        summary: 'Platform-focused frontend and full-stack engineer.',
        capabilities: [{ title: 'Platform Architecture', highlights: ['Shared SDK design', 'Release governance'] }],
        experience: [
          { company: 'momoshop.tw', title: 'Senior Software Engineer / Principal Web Architect (Enterprise)', location: 'Global Teams', start: '2025-01', end: null, featured: true, summary: 'Leading enterprise web architecture.', highlights: ['Modernized Next.js SSR delivery'], stack: ['Next.js', 'TypeScript'] },
          { company: 'foodpanda', title: 'Project Tech Lead / Senior Frontend Engineer', location: 'Berlin / Singapore / Taipei', start: '2022-03', end: '2023-12', featured: true, summary: 'Led cross-regional frontend initiatives.', highlights: ['Drove Nx migration'], stack: ['React 17', 'Nx'] },
          { company: 'Lilee Systems', title: 'Senior Software Developer', location: 'Taipei / San Jose', start: '2017-09', end: '2019-07', featured: false, summary: 'Improved production web systems.', highlights: ['Strengthened CI/CD practices'], stack: ['Angular', 'Docker'] },
        ],
        projects: [{ name: 'AI Agent Spec Pipeline', summary: 'Versioned spec-driven CI agent system.', highlights: ['State tracking', 'Usage visibility'] }],
        activities: { talks: [], certifications: [], sideProjects: [], hackathons: [] },
      }`,
    );

    const profile = getProfile("en", root);

    expect(profile.selectedExperience.map((role) => role.company)).toEqual(["momoshop.tw", "foodpanda"]);
    expect(profile.groupedExperience.roles.map((role) => role.company)).toEqual(["Lilee Systems"]);
    expect(profile.selectedExperience[0]?.periodLabel).toBe("25/01");
    expect(profile.selectedExperience[1]?.periodLabel).toBe("22/03");
    expect(profile.groupedExperience.roles[0]?.periodLabel).toBe("17/09");
  });
});
