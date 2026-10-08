# Portfolio Analytics — Session Handoff
**Date:** 2026-10-08  
**Repository:** `fwidianto/portfolio`  
**Website:** https://www.fwidianto.com/  
**Purpose:** Continue analytics restoration, traffic monitoring, and a recurring portfolio performance report without reopening settled portfolio design decisions.

## 1. User request and intent

The owner wants to know whether people visit the portfolio and what to improve based on actual visitor behavior. They previously configured Google Analytics and "Microsoft something" before redesigning the portfolio. We identified that service as **Microsoft Clarity**. They requested that the existing integrations be restored directly through ChatGPT/GitHub, then asked whether there is an MCP/ChatGPT plugin to read GA4 and provide **regular reports** covering traffic, engagement, and actionable recommendations. Do not create duplicate analytics accounts or replace existing IDs.

## 2. Confirmed tracking configuration

- **Google Analytics 4 measurement ID:** `G-FL42QH3WV0`
- **Microsoft Clarity project ID:** `xefdu66wh2`
- The historical homepage contains both snippets at Git commit `72e6ce88a638813e0eb58cc63c1fbc8d6bc6297d`.
- The current `Projects/Odoo-ERP-Analytics.html` also contains the same two scripts (previously verified on `main`).
- The original tracking integration was missing from the redesigned homepage before this restoration.
- GA4: `https://www.googletagmanager.com/gtag/js?id=G-FL42QH3WV0` and `gtag('config', 'G-FL42QH3WV0')`.
- Clarity: `https://www.clarity.ms/tag/xefdu66wh2`.

These are client-side public tracking identifiers, not account credentials. Nothing here grants access to GA4 or Clarity dashboards.

## 3. GitHub modification status (IMPORTANT — verify HEAD first)

- Prior verified production release: `082a709b5c576e7c2642929344483b88bf9f8b7d` on `main`.
- Created branch: `maintenance/restore-portfolio-analytics-20261008`.
- Added the original GA4 and Clarity snippets to:
  1. `prototypes/new-portfolio-animation-first/index.html` (authoritative source);
  2. `index.html` (generated production root).
- Two resulting commits:
  - `aded126fac5af579be9c06a58c8f73f83d5f261c` — restore snippets to authoritative source.
  - `45fab549b4b3f8eafc68bbbf3e7cc7a6d623e123` — synchronize tracking in root production HTML.
- At handoff authoring time there had been no independent live-site/browser request verification or GA4 Realtime confirmation. Later verification and deployment status are recorded below; check the current Pages build before claiming production is updated.

## 4. Portfolio architecture and boundaries

- Site hosted as static GitHub Pages with `CNAME` for `www.fwidianto.com`.
- Authoritative HTML: `prototypes/new-portfolio-animation-first/index.html`.
- Generated public homepage: root `index.html`.
- Generator: `scripts/sync-production-html.mjs`.
- Standard workflow: edit authoritative prototype; run `node scripts/sync-production-html.mjs`; then `node scripts/sync-production-html.mjs --check`.
- Current accepted live content: Chapter I Red Dwarf Hero, Chapter II education scenes 01–05 with dossiers, and a shared **Working Experience / Under Development** placeholder for later chapters.
- Old Chapter III–V concepts were deliberately removed. Chapter III is being redesigned from scratch, one real work activity at a time. Initial planned scene is SAP-based service profitability reporting for Traktor Nusantara's 16 listed branches, but that animation is **not** an approved production implementation yet.
- Preserve layout, motion, accessibility, navigation, mobile behavior, reduced motion, page performance, and portfolio design authority. Analytics repair is a small operational change, not a redesign.
- Do not hand-edit generated root `index.html` independently of the source/generator. Keep tracking snippets to one instance per page; do not duplicate the existing Odoo case study tags.
- Do not force-push/rebase/rewrite accepted history.

## 5. MCP / recurring reporting

- Windsor.ai is the reporting source for GA4 property `543592411` (“Fauzan Portfolio”). A connected Windsor.ai account was visible in Codex, but report queries for 2026-10-01–2026-10-07 and the last seven days returned no rows; successful ingestion has not been confirmed by report data.
- Alternative found: **Supermetrics** (GA4 query capability), also not connected.
- No directly suitable Microsoft Clarity connector was confirmed. Clarity can still be viewed in its own dashboard; direct automated reporting from it needs a compatible connection.
- The owner reports that an existing ChatGPT weekly task is enabled for Mondays at 08:00 WIB through Windsor.ai. Do not duplicate or modify it. Codex does not inherit that ChatGPT task's connection or execution history.
- Each report should compare the last seven complete calendar days in Asia/Jakarta with the previous seven: traffic, engagement, session source/medium, channel, device, pages, daily trends, and up to three recommendations grounded in observed data. State ranges, counts, and changes; mark small samples and distinguish missing data from zero activity. If the GA4 query returns no rows, report the data-access/ingestion gap instead of inventing findings.
- Note: Homepage is a long, animated one-page site; GA4 default page_view alone cannot say which chapter was seen. Consider minimal, non-PII custom events for chapter reach, CV clicks, dossier opens only **after base tracking has been verified** and with owner's approval. Avoid raw personal-data capture.

## 6. Immediate continuation checklist

1. Check the current GitHub Pages build and test the owner opt-out on both homepage and Odoo case study with an isolated browser profile.
2. Keep the analytics loader in the authoritative prototype and let `node scripts/sync-production-html.mjs` generate root `index.html`; run its `--check` before deployment.
3. Confirm `?analytics=off` suppresses both GA4 and Clarity requests, and `?analytics=on` restores them. Report dispatch evidence separately from processed GA4/Clarity dashboard ingestion.
4. Leave the existing Monday 08:00 WIB ChatGPT task unchanged; verify its output in that task's own connected environment when available.

## 7. Next-session start prompt

> Read `docs/PORTFOLIO_ANALYTICS_HANDOFF_2026-10-08.md` in `fwidianto/portfolio`. Verify the current Pages deployment, then use a fresh browser profile to check `?analytics=off` and `?analytics=on` on the homepage and Odoo case-study page. Preserve the portfolio design and existing Monday 08:00 WIB ChatGPT analytics task. Distinguish browser request delivery from analytics dashboard ingestion.

## 8. Owner browser opt-out

- `https://www.fwidianto.com/?analytics=off` opts the current browser profile out of both GA4 (`G-FL42QH3WV0`) and Clarity (`xefdu66wh2`); the command is removed from the address bar.
- `https://www.fwidianto.com/?analytics=on` clears the preference and restores tracking; the command is removed from the address bar. With no saved preference, tracking is enabled by default.
- The preference is localStorage scoped to this site and browser profile, shared by the homepage and Odoo case study. Clearing site storage resets to enabled. This is not authentication: other people using the same browser profile can change the setting.
- Verify in DevTools Network with filters `googletagmanager`, `google-analytics`, and `clarity.ms`. Opt-out should produce no matching script or collection requests; opt-in should produce GA4 `page_view` and Clarity `/collect` requests. No request is not equivalent to confirming GA4 processed data.
- Local isolated browser checks passed before deployment on both pages: opt-out persisted across page navigation with no tracker requests; opt-in sent both types of collection requests. Re-run on production after each Pages deployment.
