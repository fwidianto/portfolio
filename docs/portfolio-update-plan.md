# Portfolio Update Plan

## Branch

- `portfolio-refresh-plan`

## Goal

Refresh the public portfolio so it presents Fauzan Widianto as an operations, data, and business analyst who also uses AI-assisted coding, SQL, Python, automation, ERP data, and dashboards to solve business problems.

## Current Issues Found

- The homepage already has a solid foundation, but the positioning still leans toward a generic "ERP analyst" profile instead of a sharper data/BI/operations-analytics story.
- The current hero and about copy do not explicitly highlight AI-assisted development using Codex/OpenHands.
- The homepage project cards emphasize general portfolio items, but they do not yet clearly connect to GitHub portfolio projects or the business problems solved.
- The site has a clean static layout, but the content hierarchy could better prioritize the current professional narrative:
  - data / BI / operations analytics
  - ERP analytics and Odoo dashboard work
  - profitability analysis and reporting
  - automation and operational insight
  - AI-assisted development workflow
- Some project-page language is quite technical and long-form, which is useful for detail but should be balanced with tighter recruiter-facing summaries on the homepage.
- The site remains lightweight, which is good, so the update should avoid adding unnecessary complexity or new dependencies.

## Proposed Content Updates

- Rewrite the hero copy to make the role clear in the first screen:
  - operations/data/business analyst positioning first
  - AI-assisted coding as a supporting workflow
  - SQL, Python, automation, ERP data, and dashboards as core tools
- Update the about section to emphasize practical business analysis:
  - profitability analysis
  - operational reporting
  - ERP analytics
  - data-driven decision support
  - business process improvement
- Add or revise a short workflow section describing how AI-assisted development fits into the work process.
- Reframe featured projects so they better match the current brand:
  - ERP analytics and Odoo dashboard work
  - business reporting / profitability analysis
  - automation and reporting pipelines
  - GitHub portfolio projects
- Tighten project descriptions so they state:
  - the business problem
  - the method or tool stack
  - the value delivered
- Update metadata text where needed so search/snippet copy matches the current positioning.

## Proposed UI / Layout Improvements

- Keep the page structure simple and maintainable.
- Preserve the existing static HTML/CSS approach.
- Improve content hierarchy by making the homepage sections easier to scan:
  - hero
  - about
  - experience
  - skills
  - featured projects
  - workflow / how I work
  - contact
- Keep the visual style professional and restrained rather than flashy.
- Use concise labels and clearer project tags.
- If needed, adjust spacing and card sizing so longer business-focused descriptions remain readable on desktop and mobile.

## Files Likely to Edit

- `index.html`
- `CSS/main.css`
- `Projects/Investment Dashboard.html`
- `Projects/WebScrapping.html`
- `Projects/AI-ERP-IntelligenceDashboard/*` if any summary or link text needs alignment
- `README.md` if the public-facing project summary should match the updated portfolio positioning

## Risks / Notes

- Public portfolio copy needs to stay accurate and should not overstate impact or technical ownership.
- Avoid claiming metrics that are not documented.
- Keep the site static and lightweight; do not introduce a framework or build system.
- Preserve existing project links and GitHub Pages behavior.
- Re-check the live preview after edits because small HTML/CSS changes can shift the layout on mobile.

## Next Step

- Update the homepage copy and layout first.
- Then verify the project pages and fix any wording or formatting that undermines the new positioning.
- Run local checks and review the diff before creating the required local commit.
