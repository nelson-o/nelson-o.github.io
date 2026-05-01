import { describe, expect, it } from "vitest";

import { dynamicParams } from "@/app/[locale]/[section]/[...slug]/page";

describe("article catch-all route", () => {
  it("rejects article paths that were not generated for static export", () => {
    expect(dynamicParams).toBe(false);
  });
});
