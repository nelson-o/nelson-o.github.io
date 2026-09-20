import { afterEach, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
const directories: string[] = [];
afterEach(() => directories.splice(0).forEach(path => rmSync(path, { recursive: true, force: true })));
function run(runner: string, extra: Record<string, string> = {}) {
  const cwd = mkdtempSync(join(tmpdir(), "agent-adapter-")); directories.push(cwd);
  mkdirSync(join(cwd, ".agent-runtime")); mkdirSync(join(cwd, "bin"));
  writeFileSync(join(cwd, ".agent-runtime/prompt.md"), "Policy\nIssue\nSpec\n");
  const binary = `#!/bin/bash
printf '%s\\n' "$@" > args.txt
cat > received.txt
if [ "\${FAKE_EXIT:-0}" != 0 ]; then exit "$FAKE_EXIT"; fi
if [ "\${FAKE_EMPTY:-}" = 1 ]; then exit 0; fi
if [ "\${0##*/}" = codex ]; then printf 'final' > .agent-runtime/final.md; else printf 'final'; fi
`;
  for (const name of ["codex", "claude"]) writeFileSync(join(cwd, "bin", name), binary, { mode: 0o755 });
  writeFileSync(join(cwd, "bin/timeout"), '#!/bin/bash\nprintf "%s" "$1" > timeout.txt\nshift\nexec "$@"\n', { mode: 0o755 });
  const result = spawnSync("bash", [resolve("scripts/run-agent-task.sh")], { cwd, encoding: "utf8", env: {
    NODE_ENV: "test", PATH: `${cwd}/bin:${process.env.PATH}`, GITHUB_WORKSPACE: cwd, AGENT_RUNNER: runner,
    AGENT_TIMEOUT_MINUTES: "40", ANTHROPIC_API_KEY: "fake", ...extra,
  } });
  return { ...result, read: (path: string) => readFileSync(join(cwd, path), "utf8") };
}
for (const runner of ["codex", "claude"]) {
  it(`${runner} receives the same prompt and preserves final output`, () => {
    const result = run(runner, { MODEL: "model with spaces", EFFORT: "high" });
    expect(result.status).toBe(0);
    expect(result.read("received.txt")).toBe("Policy\nIssue\nSpec\n");
    expect(result.read(".agent-runtime/final.md")).toBe("final");
    expect(result.read("args.txt")).toContain("--model\nmodel with spaces\n");
    expect(result.read("timeout.txt")).toBe("40m");
  });
  it(`${runner} propagates runner failure and rejects empty output`, () => {
    expect(run(runner, { FAKE_EXIT: "7" }).status).toBe(7);
    expect(run(runner, { FAKE_EMPTY: "1" }).status).toBe(1);
  });
}
it("rejects invalid runner, timeout and missing Claude credential", () => {
  expect(run("unknown").status).toBe(1);
  for (const time of ["0", "51", "1000000000000000000000", "x"]) {
    expect(run("claude", { AGENT_TIMEOUT_MINUTES: time }).status).toBe(1);
  }
  expect(run("claude", { ANTHROPIC_API_KEY: "" }).status).not.toBe(0);
});
it("omits optional arguments and keeps Codex as default", () => {
  const result = run("");
  expect(result.read("args.txt")).not.toContain("--model");
  expect(result.read("args.txt")).toContain("--output-last-message");
});
