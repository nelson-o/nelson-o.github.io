# Social Distribution Roadmap

This document captures a future direction for distributing site posts to developer-facing channels. It is an internal roadmap, not an implementation commitment.

The site should remain a static export. Any distribution automation should run outside the Next.js runtime, most likely through Bun scripts and GitHub Actions. Do not add API routes, server-dependent runtime behavior, or client-side publishing logic to support this work.

## Goals

- Keep MDX posts as the source of truth.
- Turn published posts into platform-specific distribution assets.
- Prefer reviewed draft artifacts before publishing generated content.
- Add platform publishing incrementally through isolated adapters.
- Track what has already been published so automation can be rerun safely.

## Automation Tiers

### Auto-post

These channels can support simple link posts when API access and credentials are available.

- LinkedIn organization posts
- X.com
- Bluesky
- Mastodon, including developer-focused instances such as Fosstodon and Hachyderm

LinkedIn organization posts are the best first target. They can be generated from an English MDX entry's title, summary, and canonical URL after production deploy and e2e checks pass.

### Draft Packages

These channels should start with generated draft packages instead of direct publishing. They are sensitive to community tone, platform rules, or manual editorial workflows.

- LinkedIn Articles
- Hacker News
- Lobsters
- Reddit developer communities
- dev.to
- Hashnode
- Medium
- GitHub Discussions
- Discord and Slack developer communities
- Product Hunt, Peerlist, and Indie Hackers when a post ties to a project, tool, or launch

Draft packages should include platform-specific titles, summaries, body copy, tags, target URL, and notes about the intended audience. Generated drafts should be reviewed in a pull request before publication.

### Media Packages

These channels need richer assets and should remain draft-first until the production workflow is mature.

- YouTube Shorts
- TikTok
- YouTube long-form videos
- Twitch or YouTube Live sessions

Media packages can include short scripts, scene lists, captions, thumbnail prompts, titles, descriptions, and source article links. Upload automation should be deferred until credential handling, review flow, rendering, and platform API limits are understood.

## Future Capabilities

- Generate platform-specific summaries from MDX frontmatter and article body.
- Publish LinkedIn organization posts after GitHub Pages deployment and production e2e checks pass.
- Generate LinkedIn Article draft packages for manual publishing in LinkedIn's editor.
- Generate X, Bluesky, and Mastodon variants with platform-specific length and tone constraints.
- Generate short-form video scripts, captions, thumbnail prompts, titles, and descriptions.
- Track publish state per platform, including source slug, target URL, external post ID, timestamp, and status.
- Add a review queue so generated distribution artifacts can be approved before publishing.
- Add analytics later for clicks, views, engagement, and repost decisions.

## Guardrails

- Keep the public site compatible with static export.
- Do not add API routes or server-only site runtime behavior.
- Store platform credentials only in GitHub Actions secrets or another external secret store.
- Prefer draft pull requests for generated copy, article drafts, and media packages.
- Avoid blind cross-posting. Developer communities expect channel-specific context and a non-promotional tone.
- Confirm each platform's API access, app approval requirements, quotas, and terms before adding a publishing adapter.
- Make publishing idempotent so reruns do not duplicate posts.

## First Implementation Candidate

The first practical step is LinkedIn organization post automation:

1. Detect newly published English MDX entries.
2. Build a clean canonical URL such as `https://nelson-o.github.io/en/<section>/<slug>/`.
3. Generate post text from title, summary, and URL.
4. Publish only after deploy and production e2e checks pass.
5. Record the LinkedIn post URN and source slug in a durable state file.
6. Update state through a reviewed pull request or another auditable workflow.

LinkedIn Article sync should start as a draft-package generator, not automatic publishing. The first useful output is a LinkedIn-ready title, body draft, canonical link, and optional cover-image prompt for manual use in LinkedIn's Article editor.
