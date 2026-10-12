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
    expect(getExportCandidatePaths("/images/version..2.svg")).toEqual(["images/version..2.svg"]);
  });

  it.each([
    "/../package.json", "/..%2fpackage.json", "/%2e%2e%2fpackage.json",
    "/en/%2e%2e%2f%2e%2e%2fpackage.json", "/./index.html",
    "/..%5cpackage.json", "/images\\photo.png", "/image%00.png", "/%ZZ",
  ])("rejects unsafe or malformed paths: %s", (pathname) => {
    expect(getExportCandidatePaths(pathname)).toEqual([]);
  });

  it("decodes encoded route segments before resolving chunk paths", () => {
    expect(
      getExportCandidatePaths("/_next/static/chunks/app/%5Blocale%5D/page-c89c98c75fa7661b.js"),
    ).toEqual(["_next/static/chunks/app/[locale]/page-c89c98c75fa7661b.js"]);
  });
});
