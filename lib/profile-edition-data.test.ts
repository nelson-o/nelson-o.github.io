import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getProfile } from "@/lib/profile";

describe("edition data isolation", () => {
  it("does not change 2025 when 2026 changes and rejects missing 2026 translations", () => {
    const root = mkdtempSync(join(tmpdir(), "profile-edition-"));
    try {
      mkdirSync(join(root, "data", "profile", "2026"), { recursive: true });
      const original = join(process.cwd(), "data", "profile", "nelson.json5");
      cpSync(original, join(root, "data", "profile", "nelson.json5"));
      writeFileSync(join(root, "data", "profile", "2026", "nelson.json5"),
        readFileSync(join(process.cwd(), "data", "profile", "2026", "nelson.json5"), "utf8").replace("Principal Web Architect", "Changed edition title"));
      expect(getProfile("en", root, "2025").basics.title).toBe("Principal Web Architect");
      expect(getProfile("en", root, "2026").basics.title).toBe("Changed edition title");
      expect(() => getProfile("ja", root, "2026")).toThrow("Profile source not found");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each([["project category", "category: 'platform',"], ["capability icon", "icon: 'platform',"]])("requires a %s in 2026 but not in 2025", (_, field) => {
    const root = mkdtempSync(join(tmpdir(), "profile-edition-"));
    try {
      mkdirSync(join(root, "data", "profile", "2026"), { recursive: true });
      cpSync(join(process.cwd(), "data", "profile", "nelson.json5"), join(root, "data", "profile", "nelson.json5"));
      writeFileSync(join(root, "data", "profile", "2026", "nelson.json5"),
        readFileSync(join(process.cwd(), "data", "profile", "2026", "nelson.json5"), "utf8").replace(field, ""));
      expect(getProfile("en", root, "2025").projects.length).toBeGreaterThan(0);
      expect(() => getProfile("en", root, "2026")).toThrow(field.split(":")[0]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
