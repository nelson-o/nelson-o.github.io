import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Profile2026Experience } from "@/components/layout/profile-2026/experience";
import { getProfile } from "@/lib/profile";
import { employerMarks, markBox, markDisplaySize } from "@/lib/profile-2026-assets";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import { profileLocales } from "@/lib/profile-locales";

const publicFile = (src: string) => readFileSync(new URL(`../public${src}`, import.meta.url));

function intrinsicSize(src: string) {
  const file = publicFile(src);
  if (src.endsWith(".png")) return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
  const [, , width, height] = file.toString("utf8").match(/viewBox="([^"]+)"/)![1].split(/\s+/).map(Number);
  return { width: Math.round(width), height: Math.round(height) };
}

const roles = (locale: (typeof profileLocales)[number]) => {
  const profile = getProfile(locale, undefined, "2026");
  return [...profile.selectedExperience, ...profile.groupedExperience.roles];
};

describe("2026 employer marks (#86)", () => {
  it.each(Object.entries(employerMarks))("%s declares its file's intrinsic size", (_, mark) => {
    expect(intrinsicSize(mark.src)).toEqual({ width: mark.width, height: mark.height });
  });

  it("sizes every mark to about the same area inside the shared box, keeping its proportions", () => {
    for (const mark of Object.values(employerMarks)) {
      const size = markDisplaySize(mark);
      expect(size.width).toBeLessThanOrEqual(markBox.width);
      expect(size.height).toBeLessThanOrEqual(markBox.height);
      // Whole-pixel rounding only; object-fit: contain means the image itself is never stretched.
      expect(Math.abs(size.width / size.height / (mark.width / mark.height) - 1)).toBeLessThan(0.05);
      // Only a mark capped by the box edge falls short of the target area.
      const capped = size.width === markBox.width || size.height === markBox.height;
      if (!capped) expect(Math.abs(size.width * size.height - markBox.area)).toBeLessThan(markBox.area * 0.06);
    }
  });

  it("ships SVG marks with no script, event handler or external reference", () => {
    for (const { src } of Object.values(employerMarks).filter(({ src }) => src.endsWith(".svg"))) {
      expect(publicFile(src).toString("utf8")).not.toMatch(/<script|<foreignObject|\son[a-z]+\s*=|href="(?!#)/i);
    }
  });

  it.each(profileLocales)("maps real %s employers and leaves only unverifiable ones as text", (locale) => {
    const companies = new Set(roles(locale).map(({ company }) => company));
    for (const company of Object.keys(employerMarks)) expect(companies).toContain(company);
    // Every employer has a mark (#86). A text-only employer is a decision, not a fallback.
    expect([...companies].filter((company) => !employerMarks[company])).toEqual([]);
  });

  it.each(profileLocales)("shows only the starting year in %s and reserves no empty mark column", (locale) => {
    const profile = getProfile(locale, undefined, "2026");
    const markup = renderToStaticMarkup(Profile2026Experience({ profile, copy: profile2026Copy[locale] }));
    // Timeline rows only; the approach panel beside them has its own list.
    const items = markup.match(/<li[^>]*>.*?<\/li>/g)!.filter((item) => item.includes("period"));
    expect(items).toHaveLength(roles(locale).length);
    for (const item of items) {
      const period = item.match(/<p class="[^"]*period[^"]*">(.*?)<\/p>/)![1];
      expect(period).toMatch(/^<time dateTime="\d{4}(-\d{2})?">\d{4}<\/time>$/);
      expect(item.includes("brand")).toBe(!item.includes('data-mark="none"'));
    }
  });
});
