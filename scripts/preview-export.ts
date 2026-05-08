import { createReadStream, existsSync } from "node:fs";
import { createServer, type ServerResponse } from "node:http";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { getExportCandidatePaths } from "../lib/preview-server";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const exportDir = join(scriptDir, "..", "out");
const port = Number.parseInt(process.env.PORT ?? "4321", 10);

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

if (!existsSync(exportDir)) {
  console.error("Missing out/ export. Run `bun run build` first.");
  process.exit(1);
}

function sendFile(filePath: string, statusCode: number, response: ServerResponse) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", contentTypes[extname(filePath)] ?? "application/octet-stream");
  createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  const candidatePaths = getExportCandidatePaths(url.pathname);

  for (const candidatePath of candidatePaths) {
    const filePath = join(exportDir, candidatePath);

    if (existsSync(filePath)) {
      sendFile(filePath, 200, response);
      return;
    }
  }

  const notFoundFile = join(exportDir, "404.html");

  if (existsSync(notFoundFile)) {
    sendFile(notFoundFile, 404, response);
    return;
  }

  response.statusCode = 404;
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.end("Not found");
});

server.listen(port, () => {
  console.log(`Previewing static export at http://localhost:${port}`);
});
