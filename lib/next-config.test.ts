import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";
import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

describe("next config", () => {
  it("keeps static export settings for production builds", () => {
    const config = nextConfig(PHASE_PRODUCTION_BUILD);

    expect(config.output).toBe("export");
    expect(config.trailingSlash).toBe(true);
    expect(config.images?.unoptimized).toBe(true);
  });

  it("does not enforce export param gating in next dev", () => {
    const config = nextConfig(PHASE_DEVELOPMENT_SERVER);

    expect(config.output).toBeUndefined();
    expect(config.trailingSlash).toBe(true);
    expect(config.images?.unoptimized).toBe(true);
  });
});
