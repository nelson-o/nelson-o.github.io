import { afterEach, describe, expect, it, vi } from "vitest";

import { getGitHubProfile } from "@/lib/github-profile";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("getGitHubProfile", () => {
  it.each(["headers", "body"])("falls back after five seconds when response %s stall", async (stage) => {
    vi.useFakeTimers();
    let signal: AbortSignal;
    vi.stubGlobal("fetch", vi.fn((_url, options) => {
      signal = options.signal;
      const pending = new Promise<Response>((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      });
      return stage === "headers" ? pending : Promise.resolve({ ok: true, json: () => pending });
    }));

    const result = getGitHubProfile();
    const settled = vi.fn();
    void result.then(settled);
    await vi.advanceTimersByTimeAsync(4_999);
    expect(settled).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toEqual({ bio: null, location: null });
    expect(signal!.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears the deadline when a response completes before it", async () => {
    vi.useFakeTimers();
    let signal: AbortSignal;
    vi.stubGlobal("fetch", vi.fn((_url, options) => {
      signal = options.signal;
      return new Promise((resolve) => setTimeout(() => resolve(new Response(
        JSON.stringify({ bio: "Engineer", location: "Taiwan" }),
      )), 4_000));
    }));

    const result = getGitHubProfile();
    await vi.advanceTimersByTimeAsync(4_000);
    await expect(result).resolves.toEqual({ bio: "Engineer", location: "Taiwan" });
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(5_000);
    expect(signal!.aborted).toBe(false);
  });

  it("reads public profile fields without a token", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      bio: "Frontend engineer",
      location: "Taiwan",
    })));
    vi.stubGlobal("fetch", fetch);
    vi.stubEnv("GITHUB_TOKEN", "");

    await expect(getGitHubProfile()).resolves.toEqual({ bio: "Frontend engineer", location: "Taiwan" });
    expect(fetch).toHaveBeenCalledWith("https://api.github.com/users/nelson-o", { headers: {}, signal: expect.any(AbortSignal) });
  });

  it("uses an optional token and normalizes absent fields", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetch);
    vi.stubEnv("GITHUB_TOKEN", "test-token");

    await expect(getGitHubProfile()).resolves.toEqual({ bio: null, location: null });
    expect(fetch).toHaveBeenCalledWith("https://api.github.com/users/nelson-o", {
      headers: { Authorization: "Bearer test-token" },
      signal: expect.any(AbortSignal),
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
