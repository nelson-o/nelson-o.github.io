# Privacy operations and activation

Status: integration implemented; optional services remain disabled until the owner
completes the configuration and review below. This is an engineering control and
operational record, not a legal certification. Operator: Nelson Lin, an individual
in Taiwan. No advertising is included.

## Release gate

Set these **public repository variables** for the production build only:

| Variable | Required value |
| --- | --- |
| `NEXT_PUBLIC_COOKIEBOT_ID` | Owner's Cookiebot domain-group UUID |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Owner's GA4 web stream ID (`G-…`) |
| `NEXT_PUBLIC_PRIVACY_CONTACT` | Monitored public privacy-request email |
| `NEXT_PUBLIC_PRIVACY_REVIEWED` | `true` only after the review and live setup below |

The application requires the review flag, valid contact, CMP ID, production
hostname, a functioning CMP, and a verifiable consent choice. GA additionally
requires its measurement ID. Never put credentials, API secrets, access tokens,
or deletion API keys into these variables. Configuration changes require rebuilding.
Development and localhost exports never load the CMP, GA or embedded comments.
The external GitHub Discussions link remains available.

## Owner setup (not completed by the code change)

1. Establish the monitored privacy email and confirm controller identity/contact
   details. Review the localized notices with someone qualified for the applicable
   jurisdictions. Replace the pending activation/transfer language with the actual
   approved terms, safeguards and retention details before setting the review flag.
2. Create one GA4 property and web stream for `https://nelson-o.github.io` under the
   owner's Google account. Disable enhanced measurement, especially history page
   views and automatic outbound clicks: the application emits these explicitly.
   Turn off Google Signals, ads personalization, user-provided data collection,
   optional account data sharing, and Google Ads linking. Do not enable User-ID.
   Set user/event retention to two months; turn activity-based resetting off.
   Standard aggregated reports have a different lifetime; do not promise that all
   analytics information is deleted after two months.
3. Create the Cookiebot domain group. Confirm its scanned page count and price
   before purchasing. Use worldwide strict opt-in with equally prominent Accept,
   Reject and Customize controls, no preselected optional categories, no consent
   wall, and a permanent withdrawal/settings control. Configure 180-day consent
   duration. Disable bulk/cross-domain consent and advertising/marketing purposes.
4. In Cookiebot, describe **Statistics** as GA4 page visits and destination hostnames;
   describe **Preferences** as permission to connect external Giscus/GitHub comments.
   Necessary theme/language choices remain independent. Do not categorize comments
   as necessary or include them in statistics. Acceptance of preferences alone does
   not mount the embed: the application also requires a Load comments click.
5. Enable and review EN, ZH-HANT, ZH, JA, KO, TH, VI and DE banner text and localized
   privacy links. The integration supplies `data-culture`, uses manual blocking and
   disables Cookiebot's automatic Google Consent Mode adapter. Application code
   owns tag loading and keeps all advertising consent denied.
6. Finish the provider scan, review classifications, export a dated configuration
   snapshot and sample consent evidence. Record the processor/controller roles,
   contractual entity, DPA version, transfer mechanism, subprocessors, consent-log
   retention and deletion process. Do not infer these from a CMP's marketing claim.
7. Complete the applicability and rights review below. Only then set the variables,
   rebuild, and verify a real consenting production visit using GA4 DebugView or
   Realtime. Verify rejection, renewal and withdrawal against the real CMP as well.
   Never enable debug mode globally. Live provider verification is distinct from
   mocked automated tests and remains an activation prerequisite.

## Data inventory and review findings

| Surface | Data / storage | Trigger / purpose | Retention / control |
| --- | --- | --- | --- |
| GitHub Pages/CDN | Network and delivery/security metadata, including IP | Every visit; deliver and secure the site | GitHub policy; owner cannot erase hosting logs with JS |
| GitHub profile API | Public profile information; optional build credential | Build time only; site content | Static export until rebuilt; not a visitor API request |
| Fonts, icons, profile images | Same-origin asset requests | Rendering | Locally hosted; retained font/icon licenses |
| Theme/language/dismissed suggestion | Browser localStorage | User-requested display preferences | Until browser data is cleared |
| Cookiebot/Usercentrics | Consent identifier, choices, time and technical connection data | Consent administration, when configured | Provider terms/log retention must be recorded at activation |
| `nelson-consent-version` | Version, timestamp, statistics/preferences booleans | Validate CMP choice; not an analytics identifier | 180 days; invalidated by consent-version change |
| GA4 | Browser/session identifiers, browser/device data, visited public path, outbound hostname | Statistics consent only | Host-only `_ga*` cookies: 180 days without update; GA user/events: two months; aggregate reporting separate |
| Giscus browser session | `giscus-session` localStorage, when signed in | Comment authentication after activation | Until sign-out or clearing browser data; not cleared by analytics withdrawal |
| Giscus/GitHub | IP/browser/page data; GitHub account and public comments if used | Separate consent plus explicit Load comments | Provider policy; remove public content through GitHub |
| Privacy requests | Email, verification and request correspondence | Respond to applicable rights | Restrict access; delete unnecessary copies after resolution, retain only justified compliance evidence |

Source audit found no raw iframe/script/remote-image embeds in published MDX.
External article references are hyperlinks. The legacy profile avatar now uses the
existing local image. The GitHub public-profile API fetch remains build-time only.
Repeat the browser network/storage audit whenever a dependency or embed changes.
The CMP itself necessarily makes requests before optional-service consent; a claim
of "no third-party requests" applies only to an unconfigured build, not an active CMP.

## Applicable-law assessment: owner review required

- **Taiwan:** assess PDPA duties for the actual public/professional website and analytics
  activity, including notice, lawful collection/use, rights, security and overseas
  processing. Do not assume Article 51's personal/household exception applies merely
  because the operator is an individual.
- **EU/EEA:** document Article 3 targeting/monitoring analysis. Mere accessibility is
  not sufficient for targeting, but behavioral monitoring can bring an overseas
  operator within scope. Review ePrivacy rules, lawful bases, notices, processor
  terms, rights procedures and international transfers. Assess Article 27 representative
  requirements and any exception on the actual facts; do not invent a representative.
- **UK:** assess UK GDPR territorial scope/representation and PECR separately. This
  implementation opts in worldwide and does not rely on a statistical-use exception.
- **Other jurisdictions:** reassess if targeting, monetization, profiling, sensitive
  data, children or business scale changes. Do not claim universal compliance.
- Record the actual Google/Usercentrics/GitHub entities, transfers and safeguards
  applicable to the owner's contracts. Consent to analytics does not by itself
  establish a lawful international-transfer mechanism. Resolve this before activation.

## Access, deletion and complaints

Use the monitored email, not public GitHub issues. Record receipt and applicable
jurisdiction, acknowledge, and request only proportionate identity/record-matching
information. Where GDPR applies, normally respond within one month; document and
notify any permitted extension within that month. Taiwan PDPA generally provides
15 days for access/copies (extendable by 15) and 30 days for correction/deletion or
cessation (extendable by 30), with written reasons for extensions. Verify the current
applicable rules for each request and use the shorter applicable deadline.

Explain what can be located. The site has no user accounts; without an existing GA
browser identifier an analytics record may not be identifiable. Do not collect extra
identifiers merely to identify all visitors. If the requester voluntarily provides
an existing identifier, use Google's supported User Deletion process through an
owner-controlled tool; never expose deletion credentials in the site. Follow up on
provider completion and limitations. Public discussion content is managed via GitHub;
withdrawing consent or deleting cookies does not remove prior comments or analytics.
Explain relevant authority complaint channels in responses. Limit request-mailbox
access and retain only necessary, justified evidence of the response.

## Consent evidence, renewal and withdrawal

Cookiebot holds consent evidence; export/retrieve records through its owner console
using the consent identifier when available. Keep a dated copy of banner wording,
purposes, category mapping, notice version, test results and provider configurations.
The browser's version receipt is a local enforcement aid, not the sole legal proof.
A material purpose/provider change requires updating `consentVersion` in code,
notices and CMP text, and using the provider's renewal feature. The application
rejects mismatched, future-dated and 180-day-old receipts. Cross-tab changes are
observed. If browser storage is unavailable, optional services fail closed.

Withdrawal disables the tag, clears accessible `_ga*` cookies and reloads to stop
SDK activity; preferences revocation unmounts comments. Already sent requests cannot
be recalled. Third-party cookies and provider-side records cannot be deleted by
same-origin JavaScript. Separately follow the rights workflow for past records.

## Verification and maintenance

- `bun run test`, `bun run typecheck`, `bun run lint`, `bun run build`.
- `bun run test:e2e:preview -- e2e/privacy.spec.ts --project=chromium` checks exported
  notices, disabled defaults and local assets.
- `bun run test:e2e:privacy` builds a dummy configured export, tests the real app using
  mocked CMP/GA/Giscus on a locally routed production hostname, and restores the
  normal export in `finally`. It makes no live consent records or analytics hits.
- Test real CMP category mapping, wording/translations, 180-day expiry, log access,
  withdrawal and GA settings before activation. Automated mocks do not certify a
  provider dashboard or real Google ingestion. Recheck after provider upgrades.
- Disable collection by clearing the review flag and rebuilding. Do not use a
  missing-ID warning to send events elsewhere. No fallback provider exists.

## Sources reviewed

- [EDPB territorial scope](https://www.edpb.europa.eu/documents/guideline/guidelines-32018-on-the-territorial-scope-of-the-gdpr-article-3-version-adopted_en)
- [EDPB cookie-banner report](https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf)
- [Taiwan PDPA](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=I0050021)
- [ICO storage/access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/)
- [Google privacy controls](https://support.google.com/analytics/answer/6004245?hl=en)
- [Google retention](https://support.google.com/analytics/answer/7667196?hl=en)
- [Google business data responsibility](https://business.safety.google/privacy/)
- [Cookiebot SDK](https://www.cookiebot.com/en/developer/)
- [Cookiebot supported languages](https://support.cookiebot.com/hc/en-us/articles/360004259374-What-languages-are-available-for-the-cookie-banner)
- [Cookiebot privacy policy](https://www.cookiebot.com/en/privacy-policy/)
- [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
- [Giscus privacy policy](https://github.com/giscus/giscus/blob/main/PRIVACY-POLICY.md)

Last engineering review: 2026-09-28. Account-specific legal/contractual review: pending.

## File-quality exception

The vendored Font Awesome stylesheet and upstream licenses are preserved verbatim,
including minification and upstream line lengths. They are third-party assets, not
hand-maintained CSS modules. Verify all referenced fonts exist; update as one pinned
upstream version. Privacy copy lives in `data/privacy/` locale JSON files, following the existing
eight-language profile-data pattern. This scoped content-location exception avoids
expanding the four-language MDX article model for standalone legal pages.
