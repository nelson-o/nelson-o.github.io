import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const baseConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    globalNotFound: true,
  },
  images: {
    unoptimized: true,
  },
};

export default function nextConfig(phase: string): NextConfig {
  return {
    ...baseConfig,
    output: phase === PHASE_DEVELOPMENT_SERVER ? undefined : "export",
  };
}
