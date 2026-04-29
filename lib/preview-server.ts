export function getExportCandidatePaths(pathname: string): string[] {
  const decodedPath = (() => {
    try {
      return decodeURIComponent(pathname);
    } catch {
      return pathname;
    }
  })();
  const normalizedPath = decodedPath === "/" ? "" : decodedPath.replace(/^\/+|\/+$/g, "");

  if (normalizedPath === "") {
    return ["index.html"];
  }

  if (normalizedPath.includes(".")) {
    return [normalizedPath];
  }

  return [`${normalizedPath}/index.html`, `${normalizedPath}.html`];
}
