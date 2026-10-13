export function getExportCandidatePaths(pathname: string): string[] {
  const decodedPath = (() => {
    try {
      return decodeURIComponent(pathname);
    } catch {
      return null;
    }
  })();
  // Decode before validating: encoded separators can otherwise escape out/ when joined.
  if (decodedPath === null || decodedPath.includes("\0") || decodedPath.includes("\\") ||
      decodedPath.split("/").some((segment) => segment === "." || segment === "..")) {
    return [];
  }
  const normalizedPath = decodedPath === "/" ? "" : decodedPath.replace(/^\/+|\/+$/g, "");

  if (normalizedPath === "") {
    return ["index.html"];
  }

  if (normalizedPath.includes(".")) {
    return [normalizedPath];
  }

  return [`${normalizedPath}/index.html`, `${normalizedPath}.html`];
}
