import { spawnSync } from "node:child_process";

// Dummy IDs only. Playwright routes the production hostname to the local export
// and fulfills provider requests with fixtures; no real consent/analytics is sent.
const fixtureEnv = {
  ...process.env,
  NEXT_PUBLIC_COOKIEBOT_ID: "11111111-1111-1111-1111-111111111111",
  NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-TEST123",
  NEXT_PUBLIC_PRIVACY_CONTACT: "privacy@example.org",
  NEXT_PUBLIC_PRIVACY_REVIEWED: "true",
  E2E_PRIVACY_CONFIGURED: "1",
  E2E_TARGET: "preview",
  E2E_PREVIEW_PORT: "4327",
};
function run(args: string[], env = process.env) {
  const result = spawnSync("bun", args, { env, stdio: "inherit" });
  return result.status ?? 1;
}
let status = 1;
try {
  status = run(["run", "build"], fixtureEnv);
  if (status === 0) status = run(["run", "test:e2e", "e2e/privacy-enabled.spec.ts", "--project=chromium", "--workers=2"], fixtureEnv);
} finally {
  // Never leave a deployable out/ tree containing the fixture configuration.
  const restored = run(["run", "build"]);
  if (restored !== 0) status = restored;
}
process.exitCode = status;
