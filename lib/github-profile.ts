export type GitHubProfile = { bio: string | null; location: string | null };

export async function getGitHubProfile(): Promise<GitHubProfile> {
  try {
    const res = await fetch("https://api.github.com/users/nelson-o", {
      next: { revalidate: false },
    });
    if (!res.ok) return { bio: null, location: null };
    const data = await res.json();
    return { bio: data.bio ?? null, location: data.location ?? null };
  } catch {
    return { bio: null, location: null };
  }
}
