import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getProfile, loadProfileSource } from "@/lib/profile";

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

function writeProfile(root: string, source: string) {
  const directory = join(root, "data", "profile");
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "nelson.json5"), source);
}

describe("profile data", () => {
  it("parses JSON5 source and separates featured roles from grouped history", () => {
    const root = mkdtempSync(join(tmpdir(), "profile-data-"));
    tempDirs.push(root);

    writeProfile(
      root,
      `{
        basics: {
          name: 'Nelson Lin',
          title: 'Senior Software Engineer / Principal Web Architect',
          location: 'Taipei, Taiwan',
          email: 'nelson211145@gmail.com',
        },
        summary: 'Platform-focused frontend and full-stack engineer.',
        capabilities: [
          {
            title: 'Platform Architecture',
            highlights: ['Shared SDK design', 'Release governance'],
          },
        ],
        experience: [
          {
            company: 'momoshop.tw',
            title: 'Senior Software Engineer / Principal Web Architect (Enterprise)',
            location: 'Global Teams',
            start: '2025-01',
            end: null,
            featured: true,
            summary: 'Leading enterprise web architecture.',
            highlights: ['Modernized Next.js SSR delivery'],
            stack: ['Next.js', 'TypeScript'],
          },
          {
            company: 'foodpanda',
            title: 'Project Tech Lead / Senior Frontend Engineer',
            location: 'Berlin / Singapore / Taipei',
            start: '2022-03',
            end: '2023-12',
            featured: true,
            summary: 'Led cross-regional frontend initiatives.',
            highlights: ['Drove Nx migration'],
            stack: ['React 17', 'Nx'],
          },
          {
            company: 'Lilee Systems',
            title: 'Senior Software Developer',
            location: 'Taipei / San Jose',
            start: '2017-09',
            end: '2019-07',
            featured: false,
            summary: 'Improved production web systems.',
            highlights: ['Strengthened CI/CD practices'],
            stack: ['Angular', 'Docker'],
          },
        ],
        projects: [
          {
            name: 'AI Agent Spec Pipeline',
            summary: 'Versioned spec-driven CI agent system.',
            highlights: ['State tracking', 'Usage visibility'],
          },
        ],
        activities: {
          talks: [
            {
              label: 'INP - Responsiveness Measurements and Improvements',
              date: '2024',
            },
          ],
          certifications: [
            {
              label: 'AWS Certified Developer - Associate',
              date: '2022',
            },
          ],
          sideProjects: [
            {
              label: 'pd-toolkit',
              date: '2023',
            },
          ],
          hackathons: [
            {
              label: 'Delivery Hero Global Hackathon',
              date: '2023',
            },
          ],
        },
      }`,
    );

    const source = loadProfileSource(root);
    const profile = getProfile("en", root);

    expect(source.basics.name).toBe("Nelson Lin");
    expect(profile.selectedExperience.map((role) => role.company)).toEqual(["momoshop.tw", "foodpanda"]);
    expect(profile.groupedExperience.roles.map((role) => role.company)).toEqual(["Lilee Systems"]);
    expect(profile.projects[0]?.name).toBe("AI Agent Spec Pipeline");
  });

  it("rejects missing critical fields", () => {
    const root = mkdtempSync(join(tmpdir(), "profile-data-"));
    tempDirs.push(root);

    writeProfile(
      root,
      `{
        basics: {
          name: 'Nelson Lin',
          title: 'Senior Software Engineer',
          location: 'Taipei, Taiwan',
        },
        summary: 'Missing email should fail.',
        capabilities: [],
        experience: [],
        projects: [],
        activities: {
          talks: [],
          certifications: [],
          sideProjects: [],
          hackathons: [],
        },
      }`,
    );

    expect(() => loadProfileSource(root)).toThrowError(/email/i);
  });
});
