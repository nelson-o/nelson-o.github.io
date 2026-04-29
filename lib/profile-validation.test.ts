import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadProfileSource } from "@/lib/profile";

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

describe("profile source validation", () => {
  it("rejects missing critical fields", () => {
    const root = mkdtempSync(join(tmpdir(), "profile-data-"));
    tempDirs.push(root);

    writeProfile(
      root,
      `{
        basics: { name: 'Nelson Lin', location: 'Taipei, Taiwan', github: 'https://github.com/nelson-o' },
        summary: 'Missing title should fail.',
        capabilities: [],
        experience: [],
        projects: [],
        activities: { talks: [], certifications: [], sideProjects: [], hackathons: [] },
      }`,
    );

    expect(() => loadProfileSource(root)).toThrowError(/title/i);
  });
});
