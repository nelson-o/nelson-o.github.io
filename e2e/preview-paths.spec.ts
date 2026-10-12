import { expect, test } from "@playwright/test";

test.describe("static preview path containment", () => {
  test.skip(process.env.E2E_TARGET === "prod", "Tests the local preview server only");

  test("rejects encoded traversal and keeps serving the export", async ({ request }) => {
    for (const path of ["/..%2fpackage.json", "/%2e%2e%2fpackage.json", "/..%5cpackage.json", "/image%00.png"]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(404);
      expect(await response.text(), path).not.toContain('"name": "nelson-o.github.io"');
    }

    const page = await request.get("/en/");
    expect(page.status()).toBe(200);
    const html = await page.text();
    const chunk = html.match(/src="([^\"]*\/_next\/static\/chunks\/app\/[^\"]+\.js)"/);
    expect(chunk, "page contains a locale chunk").not.toBeNull();
    const script = await request.get(chunk![1]);
    expect(script.status()).toBe(200);
    expect(script.headers()["content-type"]).toContain("javascript");
  });
});
