import { describe, expect, it } from "vitest";
import { reviewBacklog, type ReviewIssue } from "./agent-task-review";
const issue = (overrides: Partial<ReviewIssue> = {}): ReviewIssue => ({
  number: 1, created_at: "2026-01-01", labels: [{ name: "agent:backlog" }],
  body: "## Goal\nImprove docs\n## Acceptance Criteria\n- Links resolve\n## Scope Budget\nOne file\n## Spec\nOptional", ...overrides,
});
describe("backlog review", () => {
  it("proposes human review without claiming readiness", () => {
    expect(reviewBacklog([issue()])[0].reasons[0]).toContain("not approved for execution");
  });
  it("excludes PRs and non-backlog issues", () => {
    expect(reviewBacklog([issue({ pull_request: {} }), issue({ labels: [] })])).toEqual([]);
  });
  it("flags each blocker and conflicting state", () => {
    const labels = ["agent:backlog", "agent:wip", "agent:blocked", "agent:needs-human", "agent:spec-required"].map(name => ({ name }));
    expect(reviewBacklog([issue({ labels })])[0].reasons).toHaveLength(4);
  });
  it("does not treat template comments or empty bullets as evidence", () => {
    const body = "## Goal\n<!-- fill this -->\n## Acceptance Criteria\n- <!-- result -->\n## Scope Budget\n";
    expect(reviewBacklog([issue({ body })])[0].reasons).toEqual(["Fill Goal", "Fill Acceptance Criteria", "Fill Scope Budget"]);
  });
  it("handles null bodies and plain headings", () => {
    expect(reviewBacklog([issue({ body: null })])[0].reasons).toHaveLength(3);
    expect(reviewBacklog([issue({ body: "Goal\nDocs\nAcceptance Criteria\nLinks\nScope Budget\nOne file" })])[0].reasons[0]).toContain("Candidate");
  });
  it("orders oldest first with deterministic ties", () => {
    expect(reviewBacklog([issue({ number: 3 }), issue({ number: 2, created_at: "2025-01-01" }), issue()]).map(x => x.number)).toEqual([2, 1, 3]);
  });
});
