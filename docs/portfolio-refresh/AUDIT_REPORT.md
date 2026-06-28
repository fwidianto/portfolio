# Portfolio Audit Report

Date: 2026-06-28  
Branch: `portfolio-refresh-plan`  
Scope: Current public portfolio web app and refresh guidance files

## 1. Executive Summary

The portfolio now has a much stronger public narrative than the pre-refresh version. The homepage, project pages, and docs generally support the intended positioning: Fauzan as a Data and Business Analytics professional with operations experience, ERP understanding, dashboard/reporting capability, and AI-assisted workflow exposure.

The main remaining issues are not structural failures. They are mostly about clarity, consistency, and public-facing precision:

- The current repository still contains legacy paths and mixed project structures that can confuse the story.
- A few links and URLs still imply the old root GitHub Pages location rather than the repo-path site.
- Some project areas, especially the AI ERP dashboard repository, contain broad technical detail and data-model depth that should stay clearly public-safe and sanitized.
- The portfolio would benefit from a tighter proof-of-work narrative with explicit outcomes, scope boundaries, and a cleaner project inventory.

## 2. Current Portfolio Structure

Observed public-facing structure:

- `index.html`
- `README.md`
- `CSS/main.css`
- `CSS/project.css`
- `Assets/`
- `Projects/`
  - `Odoo-ERP-Analytics.html`
  - `Business-Reporting-Automation.html`
  - `PersonalOS-AI-Handoff.html`
  - `WebScrapping.html`
  - `Investment Dashboard.html`
  - `AI-ERP-IntelligenceDashboard/`
  - `portfolio-app/`
  - `hs-code-automation/`
- `docs/portfolio-refresh/`
  - `ROADMAP.md`
  - `README.md`
  - `ANALYTICS_SETUP.md`
  - `PORTFOLIO_REFRESH_PLAN.md`
  - `PUBLIC_CONTENT_BOUNDARIES.md`
  - `CODEX_HANDOFF.md`

Notes:

- The static homepage is the main recruiter-facing entry point.
- The `Projects/AI-ERP-IntelligenceDashboard` and `Projects/portfolio-app` folders introduce a second, more application-like product story inside the same repository.
- The refresh docs are coherent, but several source files referenced in the latest guidance are not present in this checkout.

## 3. Content Gaps

1. The homepage states the positioning clearly, but it still reads more like a good summary than a strong proof-of-work page.
2. The experience timeline is concise and safe, but it does not quantify impact, scale, or decision outcomes.
3. The skills section is credible, but it is still broad. It could be tightened around the strongest, most provable tools.
4. Project cards describe tools and use cases, but most do not explain concrete business results, operational scale, or before/after value.
5. The homepage does not clearly distinguish between core portfolio proof and supporting or legacy project artifacts.
6. `README.md` is recruiter-safe, but it still mirrors the site at a high level instead of turning the portfolio into a sharper public pitch.

## 4. Project Documentation Gaps

1. The requested `SOURCE_PROFILE.md`, `SOURCE_EXPERIENCE.md`, `SOURCE_PROJECTS.md`, `CONTENT_IMPLEMENTATION_NOTES.md`, `PROJECT_TEMPLATE.md`, `UI_UX_DIRECTION.md`, and `CODEX_WORKFLOW.md` files are not present in this checkout.
2. There is no single inventory that maps each featured project to:
   - its public-safe description
   - its repository/page location
   - its intended recruiter value
   - its privacy boundaries
3. The docs describe the preferred positioning well, but the top-level public pages do not yet explain the story with the same level of precision.
4. The AI ERP dashboard content is richly documented, but the public-safe/synthetic boundary should be stated more prominently in the application-facing materials.
5. The repository has multiple documentation entry points, which makes the source of truth a little harder to discover quickly.

## 5. UI/UX Gaps

1. The homepage is clean and readable, but the first screen still carries a lot of text for a fast recruiter scan.
2. Project cards are visually consistent enough, but some cards rely on placeholder imagery while others use real images, which makes the section feel mixed.
3. Long project descriptions can make the featured projects section feel dense on smaller screens.
4. The repository includes both static pages and app-style folders, which creates a slightly inconsistent visual and structural experience.
5. The portfolio uses a solid dark theme, but the visual hierarchy could still be sharpened around the hero, project cards, and CTA buttons.
6. The mobile layout appears functional in static checks, but it still warrants a final visual pass for long text blocks and dropdown behavior.

## 6. Link, CV, GitHub, LinkedIn, and Demo Issues

1. The CV download link is present on the homepage and appears correctly wired.
2. GitHub and LinkedIn links are present and use external-link handling correctly.
3. The AI ERP demo link points to the PythonAnywhere public demo and is intentionally external.
4. The HS Code repository link on `Projects/WebScrapping.html` now points to the current repository path under `fwidianto/portofolio`.
5. The Odoo analytics page intentionally links to `dashboard-odoo`, which appears to be a separate repository rather than this portfolio repo.
6. The AI ERP dashboard redirect page and documentation intentionally link to `AI-Projects`, which also appears to be a separate repository.
7. The homepage metadata still points to `https://fwidianto.github.io`, while the live portfolio currently resolves at `https://fwidianto.github.io/portofolio/`. That mismatch should be reviewed before relying on the root URL in public metadata.

## 7. Confidentiality and Public-Safety Risks

1. `Projects/PersonalOS-AI-Handoff.html` is written safely, but it should continue to avoid any private notes, trackers, or personal reflections.
2. `Projects/Odoo-ERP-Analytics.html` is public-safe in its current wording, but it must not expand into real customer, supplier, invoice, purchase order, or sales order data.
3. The AI ERP Intelligence Dashboard folder contains table names, CSVs, and detail views that resemble real ERP records. Even if the content is sample or sanitized, it should continue to be treated as public-safety sensitive.
4. Public docs correctly warn against credentials, tokens, database names, server names, and private ERP records. Those warnings should remain in place.
5. The repository should not drift back into a pure software-engineering or full-stack narrative. The correct story is analytics, operations, ERP reporting, automation, and AI-assisted delivery.

## 8. Priority Fix List

1. Align all public URLs so the homepage, README, metadata, and live site all point to the same canonical portfolio location.
2. Add a simple project inventory table that maps each featured project to its purpose, repo/page, and public-safe boundary.
3. Add outcome-oriented phrasing to project pages where possible, especially for business reporting and ERP analytics.
4. Keep strengthening the business-first positioning in hero, skills, and experience sections.
5. Review the AI ERP dashboard docs and data files again for any overly detailed or sensitive-looking tables, fields, or examples.
6. Reduce the confusion from legacy subprojects by clearly labeling which folders are supporting artifacts versus public portfolio pages.
7. Tighten the featured projects section so the top four proof points are obvious within a few seconds.
8. Keep the analytics placeholders disabled until real IDs are available.
9. Add a final browser-based mobile pass for project pages and dropdown behavior.
10. If the root GitHub Pages URL is not intended to host this portfolio, update the public metadata and README so they do not advertise the wrong entry point.

## 9. Recommended Implementation Phases After This Audit

### Phase 1: URL and story alignment

- Fix canonical homepage URLs and README live-site references.
- Add or refine the project inventory section.
- Make the public story consistent across homepage, README, and project pages.

### Phase 2: Outcome-focused content refinement

- Add more explicit business-value language.
- Tighten project summaries.
- Improve the experience and skills wording only where it strengthens credibility.

### Phase 3: Final visual pass

- Review card spacing, mobile readability, and dropdown behavior in a browser.
- Normalize any placeholder vs. image treatment.
- Keep the site lightweight and static.

### Phase 4: Optional public metadata polish

- Review SEO metadata once the URL strategy is confirmed.
- Keep analytics disabled until real IDs are ready.
- Do not introduce new private or data-sensitive content.

## 10. Notes for Future Work

- The repository is in a good state for a recruiter-facing analytics portfolio.
- The biggest remaining risk is not broken code; it is confusing public positioning or inconsistent URLs.
- The current audit supports continuing with small, controlled refinements rather than any major redesign.
