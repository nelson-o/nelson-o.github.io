# Cargo dependency cooldowns: source ledger

Checked November 13, 2026. All four editions remain `published: false`.
This is a rollout review proposal, not an executed Cargo experiment, dependency
upgrade, security audit, or measured reduction in supply-chain risk. Seven days
is an illustrative policy; the package and version in the shell example are
placeholders. No project configuration or dependencies are changed.

| Primary source | Supported claim and boundary |
| --- | --- |
| [Rust 1.100.0 announcement](https://blog.rust-lang.org/2026/11/12/Rust-1.100.0/), November 12, 2026 | Rust 1.100.0 is released on stable; Cargo's minimum-publish-age resolution is stabilized. It is not described as nightly or merely scheduled. |
| [Cargo configuration](https://doc.rust-lang.org/cargo/reference/config.html#registryglobal-min-publish-age), checked November 13 | `registry.global-min-publish-age` defaults to `"0"`; the documented duration syntax includes days. Publish-age settings are respected from Cargo 1.100. Configuration belongs in `.cargo/config.toml`, not `Cargo.toml`. |
| [Cargo resolver: publish age](https://doc.rust-lang.org/cargo/reference/resolver.html#publish-age), checked November 13 | Under `deny`, recently published versions are ignored unless already locked. `allow` with a precise update permits a specific version and required transitive resolution. A cooldown is not retrospective lockfile remediation. |
| [Cargo update](https://doc.rust-lang.org/cargo/commands/cargo-update.html), checked November 13 | `--dry-run` does not write the lockfile; a package-specific update can require changes to transitive dependencies; `--precise` selects the requested version subject to other constraints. No claim that dry-run is offline or has no network activity. |
| [Stabilization PR #17335](https://github.com/rust-lang/cargo/pull/17335), merged August 28, 2026 | Command-scoped `CARGO_RESOLVER_INCOMPATIBLE_PUBLISH_AGE=allow` override and persistence through the lockfile. `cargo install` remains outside the resolver configuration's scope. |
| [Registry index format](https://doc.rust-lang.org/cargo/reference/registry-index.html#json-schema), checked November 13 | `pubtime` is optional. The article asks readers to verify their actual registry, not assume complete metadata or protection for all dependency sources. |
| [RFC 3923](https://rust-lang.github.io/rfcs/3923-cargo-min-publish-age.html), start date February 23, 2026 | Motivation, dependence on discovery by others/tools, lack of a complete security solution, and delayed-fix tradeoff. Used for design rationale, not final configuration syntax: its `registry.min-publish-age` example was removed before stabilization. |

The official stable release announcement confirms status directly. The retrieved
stable Cargo changelog snapshot omitted the stabilization bullet even though the
current configuration and resolver references included it. The
[beta-book changelog's 1.100 entry](https://doc.rust-lang.org/beta/cargo/CHANGELOG.html#cargo-1100-2026-11-12)
corroborates it, but the article relies on the release announcement for stable
status rather than inferring release from a merged PR or a future-dated entry.

The three-case review, recording effective toolchains and configuration, checking
the full exception diff, avoiding persistent overrides, and rehearsing urgent
updates are engineering recommendations. No result, benchmark, personal migration
experience, universal safe duration, or security guarantee is claimed. The four
locale editions use the same commands, source links, status, and limitations.

## Originality and proposal timing

Before writing, inspected main `14999c2ad394f7652f2cba903d90c897a11cbc33`,
recent content and source ledgers, open issues, the latest twelve owner PRs, and
the React Fragment draft at `e9b005a44b9347bfa789202b9345beeda02e189e`.
No Cargo/cooldown article or issue overlap was found. Node runtime images, Python
lazy imports, Vite import maps, TypeScript API integration, and React Fragment
refs have different subjects and remain untouched.

At this check the only open PRs were [#267](https://github.com/nelson-o/nelson-o.github.io/pull/267)
(CI) and [#268](https://github.com/nelson-o/nelson-o.github.io/pull/268) (React).
The latest post PR, #268, was created at November 12, 2026 01:09:42 UTC,
09:09:42 Asia/Taipei. November 13 Asia/Taipei had zero new post PRs; the
three-hour interval had elapsed. No new PR was created by this local recovery.
Any later proposal must refresh main, duplication, the daily count and the actual
creation-time interval immediately before opening its draft PR.

This recovery is based on #267 at
`4f08097fcafabdb40a1507553178c37aadbe98d0`, not on the React draft. It is a
reconstruction of a lost local draft, not a byte-for-byte restoration. A future
stacked PR should name #267 as its base and preserve the separate review and
publication decisions. There is no merge or publication authorization here.
