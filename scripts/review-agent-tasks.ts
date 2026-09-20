import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { reviewBacklog, type ReviewIssue } from "../lib/agent-task-review";

function gh(args: string[]) {
  return execFileSync("gh", args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
}

const identity = gh(["api", "user", "--jq", ".login"]).trim();
if (identity !== "nelson-o") throw new Error("Task review requires nelson-o credentials; configure NELSON_O_REVIEW_TOKEN.");
const repository = process.env.GITHUB_REPOSITORY ?? "nelson-o/nelson-o.github.io";
if (repository !== "nelson-o/nelson-o.github.io") throw new Error("Unexpected repository");
const pages = JSON.parse(gh(["api", `repos/${repository}/issues?state=open&per_page=100`, "--paginate", "--slurp"])) as ReviewIssue[][];
const proposals = reviewBacklog(pages.flat());
const lines = ["# Agent backlog review", "", `Generated: ${new Date().toISOString()}`, "",
  "Advisory snapshot only. Re-read each issue before changing labels or dispatching Agent Task.", "",
  ...proposals.map(({ number, reasons }) => `- [#${number}](https://github.com/${repository}/issues/${number}): ${reasons.join("; ")}.`)];
if (!proposals.length) lines.push("No open backlog candidates.");
const report = `${lines.join("\n")}\n`;
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
else process.stdout.write(report);
