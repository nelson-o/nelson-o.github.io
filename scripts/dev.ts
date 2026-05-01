import { existsSync, rmSync } from "node:fs";
import { spawn } from "node:child_process";

if (existsSync(".next")) {
  rmSync(".next", { recursive: true, force: true });
}

const child = spawn("bun", ["x", "next", "dev", "--turbo"], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
