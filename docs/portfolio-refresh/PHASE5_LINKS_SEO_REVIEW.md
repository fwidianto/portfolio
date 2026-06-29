# Phase 5 Links, SEO, and Public-Safety Review

Date: 2026-06-29
Branch: `portfolio-refresh-plan`
Scope: Internal links, external links, CV path, SEO metadata, Open Graph/Twitter metadata, analytics/search placeholders, robots/sitemap, and public-safety verification.

## 1. Executive Summary

Phase 5 is approved with minor follow-up items.

The portfolio links are consistent, the CV file exists at the expected path, homepage SEO metadata is present and aligned with the approved Data & Business Analytics positioning, and analytics/search placeholders remain commented out. The only concrete fix required in this phase was the site discovery layer: `robots.txt` and `sitemap.xml` needed to use the repo-path site base `https://fwidianto.github.io/portofolio/` instead of the root GitHub Pages base.

No public-safety issue was found in the reviewed pages.

## 2. Files Reviewed

- `index.html`
- `README.md`
- `robots.txt`
- `sitemap.xml`
- `Projects/Odoo-ERP-Analytics.html`
- `Projects/Business-Reporting-Automation.html`
- `Projects/PersonalOS-AI-Handoff.html`
- `Projects/WebScrapping.html`
- `Projects/Investment Dashboard.html`
- `Projects/AI-ERP-IntelligenceDashboard/index.html`
- `Projects/AI-ERP-IntelligenceDashboard/docs/README.md`
- `Projects/AI-ERP-IntelligenceDashboard/docs/data_dictionary.md`
- `Projects/AI-ERP-IntelligenceDashboard/docs/index.html`
- `Projects/portfolio-app/templates/*.html`

## 3. Links Checked

### Internal links

Pass.

Checked:

- navigation links
- project card links
- project detail page links
- back/home links
- dropdown links
- anchor links
- CSS paths
- image paths
- favicon paths
- CV path

### External links

Pass.

Checked:

- GitHub profile link
- LinkedIn profile link
- AI ERP demo link
- Odoo analytics repository link
- HS Code repository link
- other public repository/demo links referenced in README and project pages

All reviewed external links that open in a new tab include `rel="noopener noreferrer"`.

## 4. CV Check Result

Pass.

- CV file exists at `Assets/Fauzan_Widianto_CV.pdf`.
- Homepage download link points to the same file path.
- README references the live site and project inventory correctly.

No alternate CV file was found in the repo that would be a better public candidate.

## 5. SEO Metadata Check Result

Pass.

The homepage contains:

- title
- meta description
- author
- robots
- canonical URL
- JSON-LD/schema

The metadata uses the approved broad positioning:

> Data & Business Analytics professional with operations insight, dashboard/reporting, ERP process understanding, automation, and AI-assisted workflow exposure.

The page does not over-position Fauzan as a pure developer, senior data scientist, AI expert, or ERP consultant only.

## 6. Open Graph / Twitter Check Result

Pass.

The homepage contains:

- Open Graph title
- Open Graph description
- Open Graph image
- Open Graph URL
- Twitter card
- Twitter title
- Twitter description
- Twitter image

The image path used in metadata points to the existing public asset:

- `Assets/Profile Picture.jpeg`

## 7. Analytics/Search Placeholder Check Result

Pass.

Confirmed:

- Google Analytics 4 placeholder remains commented out.
- Microsoft Clarity placeholder remains commented out.
- Google Search Console verification placeholder remains commented out.
- Bing Webmaster Tools verification placeholder remains commented out.
- No fake active IDs are running.
- No real IDs were invented.

The comments are explicit enough for later activation when real IDs are provided.

## 8. robots.txt / sitemap.xml Result

Pass after fix.

Issues found:

- `robots.txt` pointed to the wrong sitemap base.
- `sitemap.xml` used the root GitHub Pages base and did not list the main public portfolio pages.

Fix applied:

- Updated `robots.txt` to point to `https://fwidianto.github.io/portofolio/sitemap.xml`.
- Updated `sitemap.xml` to use the repo-path canonical base and include the main public portfolio URLs:
  - homepage
  - Odoo ERP Analytics
  - AI ERP Intelligence Dashboard
  - Business Reporting Automation
  - PersonalOS / AI Handoff
  - HS Code Trade Compliance Automation
  - Investment Analytics Dashboard

## 9. Public-Safety Check Result

Pass.

Confirmed the reviewed public pages do not expose:

- private PersonalOS raw notes
- job application tracker details
- salary details
- family, health, or personal reflection content
- internal ERP records
- customer names
- supplier names
- invoice/order details
- credentials
- tokens
- private URLs
- confidential company information
- real analytics/tracking IDs

The AI ERP supporting docs continue to use public-safe sample/demo framing, and the PersonalOS page keeps the boundary explicit.

## 10. Fixes Applied

1. Updated `robots.txt` to point to the correct repo-path sitemap.
2. Updated `sitemap.xml` to use the correct canonical base and include the public portfolio pages expected to work after merge.

## 11. Issues Intentionally Left for Later

1. The AI ERP demo remains an external redirect target, so the live destination cannot be fully verified from the repository alone.
2. `Projects/AI-ERP-IntelligenceDashboard` still contains technical supporting material that is public-safe but more technical than the recruiter-facing pages.
3. The investment dashboard embeds an external Google Data Studio report; that dependency should continue to be monitored separately from the static portfolio pages.

## 12. Recommendation

Phase 5 approved with minor follow-up items.

The portfolio is ready for final review before merge, with the discovery-layer fix now aligned to the repo-path site base and the remaining risks limited to external demo dependencies rather than repository link or metadata problems.
