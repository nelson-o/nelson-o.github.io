import { describe, expect, it } from "vitest";

import { captureDefaults, captureFileName, captureUrl, normalizeRoute, parseCaptureArgs } from "@/lib/capture-options";

const parse = (...argv: string[]) => parseCaptureArgs(argv, "/tmp/captures", "/repo/out");

describe("parseCaptureArgs", () => {
  it("defaults to the profile in both themes at desktop and phone widths", () => {
    expect(parse()).toEqual({ ...captureDefaults, outDir: "/tmp/captures", exportDir: "/repo/out", baseUrl: null });
  });

  it("accepts repeated, comma-separated and = forms", () => {
    const options = parse("--route", "/ja/profile/,/en/", "--route=/de/profile", "--width", "1280", "--width=390,768");
    expect(options.routes).toEqual(["/ja/profile/", "/en/", "/de/profile/"]);
    expect(options.widths).toEqual([1280, 390, 768]);
  });

  it("expands both and removes duplicate themes", () => {
    expect(parse("--theme", "dark").themes).toEqual(["dark"]);
    expect(parse("--theme", "both", "--theme", "light").themes).toEqual(["light", "dark"]);
  });

  it("takes the last scale, out, dir and base, trimming the base's trailing slash", () => {
    const options = parse("--scale", "1", "--out", "/a", "--dir", "/b", "--base", "https://nelson-o.github.io/");
    expect(options).toMatchObject({ scale: 1, outDir: "/a", exportDir: "/b", baseUrl: "https://nelson-o.github.io" });
  });

  it("rejects unknown flags, missing values and bad numbers or themes", () => {
    expect(() => parse("--fullpage")).toThrow("Unknown argument: --fullpage");
    expect(() => parse("--route")).toThrow("Missing value for --route");
    expect(() => parse("--width", "wide")).toThrow("--width must be a positive number");
    expect(() => parse("--theme", "sepia")).toThrow("--theme must be light, dark or both");
  });
});

describe("capture helpers", () => {
  it("normalizes routes to the exported trailing-slash form", () => {
    expect(normalizeRoute("en/profile")).toBe("/en/profile/");
    expect(normalizeRoute("/")).toBe("/");
    expect(normalizeRoute("/en/profile?lang=ja")).toBe("/en/profile/?lang=ja");
  });

  it("forces the theme through the unsaved ?theme= override, keeping other query params", () => {
    expect(captureUrl("http://localhost:4000", "/en/profile/?lang=ja", "dark")).toBe(
      "http://localhost:4000/en/profile/?lang=ja&theme=dark",
    );
  });

  it("names files by route, theme and width", () => {
    expect(captureFileName("/en/profile/2025/", "light", 390)).toBe("en-profile-2025-light-390.png");
    expect(captureFileName("/", "dark", 1280)).toBe("home-dark-1280.png");
  });
});
