import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const port = Number(process.env.PORT || 8080);
const distDir = join(process.cwd(), "dist");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function resolveAsset(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const safePath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = join(distDir, safePath);

  if (existsSync(requestedPath) && statSync(requestedPath).isFile()) {
    return requestedPath;
  }

  return join(distDir, "index.html");
}

createServer((request, response) => {
  const assetPath = resolveAsset(request.url || "/");
  const extension = extname(assetPath);

  response.setHeader("Content-Type", mimeTypes[extension] || "application/octet-stream");

  createReadStream(assetPath)
    .on("error", () => {
      response.statusCode = 500;
      response.end("Server error");
    })
    .pipe(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`ClarityX listening on port ${port}`);
});
