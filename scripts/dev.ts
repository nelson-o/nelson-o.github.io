import { spawn } from "node:child_process";

const child = spawn("bun", ["x", "next", "dev", "--turbo"], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
