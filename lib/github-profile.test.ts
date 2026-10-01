import { afterEach, describe, expect, it, vi } from "vitest";

import { getGitHubProfile } from "@/lib/github-profile";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("getGitHubProfile", () => {
  it("reads public profile fields without a token", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      bio: "Frontend engineer",
      location: "Taiwan",
    })));
    vi.stubGlobal("fetch", fetch);
    vi.stubEnv("GITHUB_TOKEN", "");

    await expect(getGitHubProfile()).resolves.toEqual({ bio: "Frontend engineer", location: "Taiwan" });
    expect(fetch).toHaveBeenCalledWith("https://api.github.com/users/nelson-o", { headers: {} });
  });

  it("uses an optional token and normalizes absent fields", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetch);
    vi.stubEnv("GITHUB_TOKEN", "test-token");

    await expect(getGitHubProfile()).resolves.toEqual({ bio: null, location: null });
    expect(fetch).toHaveBeenCalledWith("https://api.github.com/users/nelson-o", {
      headers: { Authorization: "Bearer test-token" },
    });
  });

  it("returns fallback fields for an unsuccessful response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    await expect(getGitHubProfile()).resolves.toEqual({ bio: null, location: null });
  });

  it("returns fallback fields when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network unavailable")));

    await expect(getGitHubProfile()).resolves.toEqual({ bio: null, location: null });
  });

  it("returns fallback fields when the response is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not JSON")));

    await expect(getGitHubProfile()).resolves.toEqual({ bio: null, location: null });
  });
});
