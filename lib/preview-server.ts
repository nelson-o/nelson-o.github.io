export function getExportCandidatePaths(pathname: string): string[] {
  const normalizedPath = pathname === "/" ? "" : pathname.replace(/^\/+|\/+$/g, "");

  if (normalizedPath === "") {
    return ["index.html"];
  }

  if (normalizedPath.includes(".")) {
    return [normalizedPath];
  }

  return [`${normalizedPath}/index.html`, `${normalizedPath}.html`];
}
