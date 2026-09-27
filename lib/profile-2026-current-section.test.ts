import { describe, expect, it } from "vitest";

import { currentSection, type SectionBox } from "@/lib/profile-2026-current-section";

const viewport = { width: 1000, height: 1000 }; // reading point: (500, 400)
const box = (id: string, top: number, bottom: number, left = 0, right = 1000): SectionBox => ({ id, top, bottom, left, right });

describe("2026 current section (#87)", () => {
  it("picks the section under the reading line", () => {
    expect(currentSection([box("about", -900, 100), box("experience", 100, 900)], viewport, false)).toBe("experience");
  });

  it("prefers the innermost section when they nest and both span the centre (mobile talks)", () => {
    expect(currentSection([box("projects", -500, 900), box("talks", 200, 900)], viewport, false)).toBe("talks");
  });

  it("keeps the outer section when the nested one is a side column away from the centre (desktop talks)", () => {
    expect(currentSection([box("projects", 0, 900), box("talks", 0, 900, 760, 1000)], viewport, false)).toBe("projects");
  });

  it("falls back to the last section above the line in a gap, and to none above the first", () => {
    const boxes = [box("about", -900, 300), box("experience", 500, 1500)];
    expect(currentSection(boxes, viewport, false)).toBe("about");
    expect(currentSection([box("about", 450, 900)], viewport, false)).toBeNull();
  });

  it("makes the last section current at the end of the page", () => {
    expect(currentSection([box("projects", -900, 700), box("contact", 700, 950)], viewport, true)).toBe("contact");
    expect(currentSection([], viewport, true)).toBeNull();
  });
});
