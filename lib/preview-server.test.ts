import { describe, expect, it } from "vitest";

import { getExportCandidatePaths } from "@/lib/preview-server";

describe("getExportCandidatePaths", () => {
  it("maps the root path to the exported index file", () => {
    expect(getExportCandidatePaths("/")).toEqual(["index.html"]);
  });

  it("maps route paths to trailing-slash export files first", () => {
    expect(getExportCandidatePaths("/dev-mode")).toEqual([
      "dev-mode/index.html",
      "dev-mode.html",
    ]);
  });

  it("keeps direct asset paths intact", () => {
    expect(getExportCandidatePaths("/dev-mode/city.png")).toEqual(["dev-mode/city.png"]);
  });
});
