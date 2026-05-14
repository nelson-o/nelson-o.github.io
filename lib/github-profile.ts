export type GitHubProfile = { bio: string | null; location: string | null };

export async function getGitHubProfile(): Promise<GitHubProfile> {
  try {
    const headers: HeadersInit = {};
    const token = process.env.GITHUB_TOKEN;
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch("https://api.github.com/users/nelson-o", { headers });
    if (!res.ok) return { bio: null, location: null };
    const data = await res.json();
    return { bio: data.bio ?? null, location: data.location ?? null };
  } catch {
    return { bio: null, location: null };
  }
}
