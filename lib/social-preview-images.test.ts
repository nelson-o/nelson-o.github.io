import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { getSocialPreviewImageUrl, getTopicSocialPreviewImages, getTopicSocialPreviewImageUrl, sections } from "@/lib/i18n";
import { getProfileSocialPreviewImageUrl, profileVersions } from "@/lib/profile-versions";

// Every link-preview image the metadata references must ship in the static export.
const referenced = [
  getSocialPreviewImageUrl(),
  ...profileVersions.map(getProfileSocialPreviewImageUrl),
  ...sections.flatMap((section) => [getTopicSocialPreviewImageUrl(section), ...getTopicSocialPreviewImages(section)]),
];

describe("social preview images", () => {
  it.each([...new Set(referenced)])("%s exists under public/", (url) => {
    expect(existsSync(path.join(process.cwd(), "public", url))).toBe(true);
  });
});
