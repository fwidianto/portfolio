# Odoo ERP Analytics Change Log

Last updated: 2026-07-02  
Status: Active  
Related guide: `docs/portfolio-design-guide.md`  
Related plan: `docs/odoo-erp-analytics-page-plan.md`  
Applies to: `Projects/Odoo-ERP-Analytics.html`

---

## Purpose

This file records meaningful updates to the Odoo ERP Analytics case study page. Every future update to `Projects/Odoo-ERP-Analytics.html` should be logged here after reviewing the portfolio design guide and the Odoo page plan.

---

## Change Log Template

```markdown
## YYYY-MM-DD - Short Update Name

### Changed Sections
- Section name

### Reason
- Why the change was made

### Files Edited
- File path

### Design Guide Checked
- Yes / No

### Page Plan Checked
- Yes / No

### Confidentiality Checked
- Yes / No

### Notes
- Any limitation, issue, or next improvement
```

---

## 2026-07-02 - Dashboard Modules Refactored to Shared Case Cards

### Changed Sections
- Dashboard Modules / What the System Supports

### Reason
- Converted the dashboard modules section into the shared case-study card structure.
- Made the section more consistent with the homepage-aligned Odoo page direction.
- Reduced reliance on old page-specific module styling.
- Kept the modules focused on operational review needs rather than technical features only.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real screenshot or reporting table was added.
- No confidential data was added.
- The next refactor should focus on Before vs After or Skills Demonstrated.

---

## 2026-07-02 - Output Evidence Table Width Improved

### Changed Sections
- Output Evidence
- Public-safe sample reporting table

### Reason
- Improved the Output Evidence table width so order references do not stack or wrap awkwardly.
- Added section-specific table width rules while keeping the table horizontally scrollable on smaller screens.
- Preserved the existing public-safe sample data and page design.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real screenshot or real operational data was added.
- No section outside Output Evidence was refactored.
- The HTML file should be verified after each future update.

---

## 2026-07-02 - Output Evidence HTML Refresh Trigger

### Changed Sections
- Output Evidence
- GitHub Pages refresh

### Reason
- The repository already contained the Output Evidence section, but the live GitHub Pages page still showed the previous version.
- The previous rebuild trigger only changed documentation, not the actual Odoo HTML file.
- Added a harmless version comment to `Projects/Odoo-ERP-Analytics.html` to force the deployed HTML page to refresh.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No visible page content or design was changed.
- No real screenshot or real operational data was added.
- The goal of this update is deployment refresh, not visual refactor.
- After deployment refresh, the live page should show Output Evidence between Architecture / Data Flow and Dashboard Modules.

---

## 2026-07-02 - Pages Rebuild Triggered for Output Evidence

### Changed Sections
- Deployment / GitHub Pages refresh

### Reason
- The repository already contained the `Output Evidence` section, but the live GitHub Pages view still showed the previous version.
- Added this documentation-only update to trigger a new GitHub Pages rebuild without changing visible page content or design.

### Files Edited
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No visible Odoo page content was changed in this update.
- `Projects/Odoo-ERP-Analytics.html` already contains `id="output-evidence"` on the main branch.
- After GitHub Pages refreshes, the live page should show Output Evidence between Architecture / Data Flow and Dashboard Modules.

---

## 2026-07-02 - Output Evidence Sample Table Added

### Changed Sections
- Output Evidence
- Public-safe sample reporting table

### Reason
- Added a public-safe sample table to show the kind of reporting output produced by the Odoo analytics project.
- Provided concrete evidence of operational visibility without exposing real business data.
- Created a bridge between the architecture explanation and the dashboard modules section.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real screenshot was added.
- All sample rows are anonymized and recreated for portfolio explanation.
- The next refactor should focus on Dashboard Modules / What the System Supports.

---

## 2026-07-02 - Architecture Redesigned as Distinct Pipeline

### Changed Sections
- Architecture / Data Flow

### Reason
- The previous architecture layout looked too similar to the Approach / Workflow card grid.
- Redesigned the section as a three-stage pipeline so it reads more like a system/data-flow diagram.
- Improved distinction between workflow thinking and data architecture.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real screenshot or reporting table was added.
- The section remains public-safe.
- Pipeline styling was implemented in the Odoo page for this focused section update.
- The next refactor should focus on Output Evidence: public-safe sample table or reporting table preview.

---

## 2026-07-02 - Architecture Shared CSS Readability Fix

### Changed Sections
- Architecture / Data Flow
- Shared architecture CSS

### Reason
- The live page still showed the old compressed 6-column architecture layout.
- Moved the readability fix into `CSS/case-study.css` so the shared architecture component itself is roomier and responsive.
- Added cache-busting to force the updated CSS to load.

### Files Edited
- `CSS/case-study.css`
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real screenshot or reporting table was added.
- The main goal was to fix the actual live layout, not create a new section.
- After GitHub Pages refreshes, the architecture should appear as a 3-column grid on wide screens and a stacked layout on smaller screens.

---

## 2026-07-02 - Architecture Diagram Readability Improved

### Changed Sections
- Architecture / Data Flow

### Reason
- Improved readability and spacing of the architecture section.
- Reduced text density and made the six-step flow easier to scan.
- Improved responsiveness and visual breathing room, especially for smaller screens.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real screenshot or reporting table was added.
- The content remains public-safe.
- The main goal of this update is readability, not adding new sections.
- Next refactor should focus on Output Evidence: public-safe sample table or reporting table preview.

---

## 2026-07-02 - Architecture Diagram Section Added

### Changed Sections
- Architecture / Data Flow
- Existing flow map

### Reason
- Converted the temporary flow map into the planned architecture diagram section.
- Made the ERP-to-dashboard logic clearer for business and analytics readers.
- Used shared case-study architecture components for better visual consistency.
- Separated process workflow from system/data architecture.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real screenshot or reporting table was added.
- The architecture remains public-safe and simplified.
- Next refactor should focus on Dashboard Modules / What the System Supports.

---

## 2026-07-02 - Approach Workflow Refactored to Shared Case Study Cards

### Changed Sections
- Approach / Workflow

### Reason
- Converted the workflow explanation into the shared case-study structure.
- Reduced old page-specific process-card styling.
- Made the section more consistent with the homepage-aligned Odoo page direction.
- Kept AI positioned as workflow support rather than the main project identity.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real screenshot, architecture diagram, or reporting table was added.
- The existing flow map was preserved for that phase.
- Next refactor was to replace the flow map with the planned Architecture Diagram section.

---

## 2026-07-02 - Problem Context and Visual Proof Placeholder Refactored

### Changed Sections
- Problem / Context
- Visual Proof placeholder

### Reason
- Improved the business problem narrative using the shared case-study structure.
- Added a controlled placeholder for future sanitized visual evidence.
- Prepared the page for screenshot insertion without exposing sensitive business data.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real screenshot was added in this update.
- The placeholder should be replaced later with a sanitized dashboard screenshot or mock visual.
- Next refactor was to focus on the Approach / Workflow section.

---

## 2026-07-02 - Hero and Snapshot Refactored to Light Case Study Style

### Changed Sections
- Hero / Project Summary
- Project Snapshot

### Reason
- Aligned the Odoo page first screen with the homepage and shared case-study design system.
- Replaced the dark SaaS-style hero with a light, warm, business-focused case-study hero.
- Moved AI away from the main hero tags and positioned it only as workflow support.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- Lower sections were intentionally left mostly unchanged for later refactor phases.

---

## 2026-07-02 - Shared CSS Linked on Odoo Page

### Changed Sections
- HTML head / stylesheet links only

### Reason
- Linked the shared case-study stylesheet into the Odoo ERP Analytics page before starting visual refactor work.
- Prepared the page to use reusable case-study components in future updates.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- The live page did not visually change much at this step because existing page-specific CSS still controlled most Odoo sections.

---

## 2026-07-02 - Shared Case Study CSS Created

### Changed Sections
- Shared styling foundation
- Case study reusable components

### Reason
- Created a reusable CSS foundation before refactoring the Odoo project page again.
- Supported the approved direction that project pages should gradually follow the same case-study structure and visual language.

### Files Edited
- `CSS/case-study.css`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- This update did not change the live Odoo HTML page.

---

## 2026-07-02 - Planning Baseline Created

### Changed Sections
- Documentation only

### Reason
- Created a formal page plan and change log before continuing Odoo project page edits.
- Established that future updates should follow the portfolio design guide and Odoo page plan.

### Files Edited
- `docs/portfolio-design-guide.md`
- `docs/odoo-erp-analytics-page-plan.md`
- `docs/odoo-erp-analytics-change-log.md`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- This entry records the documentation baseline.

---

## 2026-07-02 - Pre-Guide Hero and Structure Experiment

### Changed Sections
- Hero / Project Summary
- Project Snapshot
- Problem / Context
- Approach / Workflow
- Flow Map
- Dashboard Modules
- Before vs After
- Skills Demonstrated
- Confidentiality / CTA

### Reason
- The Odoo page was initially redesigned into a stronger case-study structure before this formal guide and plan were created.
- The update improved the story structure, but the visual direction became too dark and SaaS-like compared with the homepage.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`

### Design Guide Checked
- No, because the guide did not exist yet.

### Page Plan Checked
- No, because the page plan did not exist yet.

### Confidentiality Checked
- Yes

### Notes
- Keep useful structure and copy ideas from this version.
- Do not continue using the dark hero as the final direction.
