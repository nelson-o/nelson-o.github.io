import { describe, expect, it } from "vitest";

import { locales, sections } from "@/lib/i18n";
import { getSectionDirectory, readSectionFiles } from "@/lib/mdx/content-fs";

const REFERENCE_LOCALE = "en" as const;
const CHECKED_LOCALES = locales.filter((l) => l !== REFERENCE_LOCALE);

// Articles known to not yet exist in all locales. Remove entries here once
// a translation is added — the test will remind you if an entry is stale.
const KNOWN_GAPS: Record<string, string[]> = {
  "ideas/agentic-ui/260425-agent-generated-ui-quality.mdx": CHECKED_LOCALES,
};

describe("content locale parity", () => {
  for (const section of sections) {
    for (const targetLocale of CHECKED_LOCALES) {
      it(`${targetLocale}/${section} is not missing any ${REFERENCE_LOCALE} articles`, () => {
        const refDir = getSectionDirectory(REFERENCE_LOCALE, section);
        const refPaths = readSectionFiles(REFERENCE_LOCALE, section).map(
          (f) => f.slice(refDir.length + 1).replace(/\\/g, "/"),
        );

        const targetDir = getSectionDirectory(targetLocale, section);
        const targetPaths = new Set(
          readSectionFiles(targetLocale, section).map(
            (f) => f.slice(targetDir.length + 1).replace(/\\/g, "/"),
          ),
        );

        const unexpectedMissing: string[] = [];
        const unnecessaryExemptions: string[] = [];

        for (const path of refPaths) {
          const key = `${section}/${path}`;
          const isExempted = KNOWN_GAPS[key]?.includes(targetLocale);
          const isMissing = !targetPaths.has(path);

          if (isMissing && !isExempted) {
            unexpectedMissing.push(key);
          }

          if (!isMissing && isExempted) {
            unnecessaryExemptions.push(key);
          }
        }

        expect(
          unexpectedMissing,
          `New gap: add to KNOWN_GAPS or add the translation`,
        ).toEqual([]);

        expect(
          unnecessaryExemptions,
          `Translation exists — remove from KNOWN_GAPS`,
        ).toEqual([]);
      });
    }
  }
});
