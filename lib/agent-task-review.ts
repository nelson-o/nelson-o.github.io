export type ReviewIssue = {
  number: number;
  body: string | null;
  created_at: string;
  labels: { name: string }[];
  pull_request?: unknown;
};

export function reviewBacklog(issues: ReviewIssue[]) {
  return issues.filter((issue) => !issue.pull_request &&
    issue.labels.some(({ name }) => name === "agent:backlog"))
    .sort((a, b) => a.created_at.localeCompare(b.created_at) || a.number - b.number)
    .map((issue) => {
      const labels = issue.labels.map(({ name }) => name);
      const reasons: string[] = [];
      if (labels.some((label) => ["agent:todo", "agent:wip", "agent:done"].includes(label))) {
        reasons.push("Resolve conflicting lifecycle labels");
      }
      for (const flag of ["agent:blocked", "agent:needs-human", "agent:spec-required"]) {
        if (labels.includes(flag)) reasons.push(`Resolve ${flag}`);
      }
      const body = (issue.body ?? "").replace(/<!--[\s\S]*?-->/g, "");
      const sections = new Map<string, string[]>();
      let current = "";
      for (const line of body.split("\n")) {
        const heading = line.trim().replace(/^#{1,6}\s+/, "");
        if (/^#{1,6}\s/.test(line.trim()) ||
          ["Goal", "Acceptance Criteria", "Scope Budget", "Spec", "Constraints"].includes(heading)) {
          current = heading.toLowerCase();
          if (!sections.has(current)) sections.set(current, []);
        } else {
          sections.get(current)?.push(line);
        }
      }
      for (const section of ["Goal", "Acceptance Criteria", "Scope Budget"]) {
        const content = sections.get(section.toLowerCase())?.join("\n");
        if (!content?.replace(/[-*\s]/g, "")) reasons.push(`Fill ${section}`);
      }
      return { number: issue.number, reasons: reasons.length ? reasons :
        ["Candidate for human review of scope, risk, evidence and spec; not approved for execution"] };
    });
}
