import { defineConfig, devices } from "@playwright/test";

type E2ETarget = "preview" | "prod";

const target = (process.env.E2E_TARGET ?? "preview") as E2ETarget;
const previewPort = process.env.E2E_PREVIEW_PORT ?? "4321";
const previewBaseURL = `http://localhost:${previewPort}`;

const targets: Record<E2ETarget, { baseURL: string; webServer?: Parameters<typeof defineConfig>[0]["webServer"] }> = {
  preview: {
    baseURL: previewBaseURL,
    webServer: {
      command: `PORT=${previewPort} bun run preview`,
      url: previewBaseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  },
  prod: {
    baseURL: "https://nelson-o.github.io",
  },
};

const { baseURL: defaultBaseURL, webServer } = targets[target];
const baseURL = process.env.E2E_BASE_URL ?? defaultBaseURL;

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
