import { defineConfig, devices } from "@playwright/test";

type E2ETarget = "preview" | "prod";

const target = (process.env.E2E_TARGET ?? "preview") as E2ETarget;

const targets: Record<E2ETarget, { baseURL: string; webServer?: Parameters<typeof defineConfig>[0]["webServer"] }> = {
  preview: {
    baseURL: "http://localhost:4321",
    webServer: {
      command: "bun run preview",
      url: "http://localhost:4321",
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  },
  prod: {
    baseURL: "https://nelson-o.github.io",
  },
};

const { baseURL, webServer } = targets[target];

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { outputFolder: "e2e/playwright-report", open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
  ...(webServer ? { webServer } : {}),
});
