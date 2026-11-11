import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function install(failures: number, failureCode = 100, sleepCode = 0) {
  const dir = mkdtempSync(join(tmpdir(), "playwright-setup-"));
  try {
    writeFileSync(join(dir, "bunx"), `#!/bin/bash
count=$(cat "$FIXTURE_DIR/count" 2>/dev/null || echo 0)
count=$((count + 1))
echo "$count" > "$FIXTURE_DIR/count"
printf '%s\\n' "$*" >> "$FIXTURE_DIR/commands"
if (( count <= $FAILURES )); then exit "$FAILURE_CODE"; fi
`, { mode: 0o755 });
    writeFileSync(join(dir, "sleep"), `#!/bin/bash
printf '%s\\n' "$*" >> "$FIXTURE_DIR/delays"
exit "$SLEEP_CODE"
`, { mode: 0o755 });
    const result = spawnSync("bash", [resolve("scripts/install-playwright-ci.sh")], {
      env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, FIXTURE_DIR: dir,
        FAILURES: String(failures), FAILURE_CODE: String(failureCode), SLEEP_CODE: String(sleepCode) },
      encoding: "utf8",
    });
    const read = (name: string) => { try { return readFileSync(join(dir, name), "utf8").trim(); } catch { return ""; } };
    return { status: result.status, commands: read("commands").split("\n"), delays: read("delays"), stderr: result.stderr };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

describe("CI browser installation", () => {
  it("stops after immediate success without waiting", () => {
    expect(install(0)).toMatchObject({ status: 0, commands: ["playwright install --with-deps chromium"], delays: "" });
  });
  it("recovers after two failed installs with bounded backoff", () => {
    const result = install(2);
    expect(result.status).toBe(0);
    expect(result.commands).toEqual(Array(3).fill("playwright install --with-deps chromium"));
    expect(result.delays).toBe("20\n40");
  });
  it.each([100, 42])("preserves final failure status %s after exactly three attempts", (code) => {
    const result = install(10, code);
    expect(result.status).toBe(code);
    expect(result.commands).toHaveLength(3);
    expect(result.delays).toBe("20\n40");
    expect(result.stderr).toContain("failed after 3 attempts");
  });
  it("does not continue retrying after interrupted backoff", () => {
    const result = install(10, 100, 130);
    expect(result.status).toBe(130);
    expect(result.commands).toHaveLength(1);
  });
});
