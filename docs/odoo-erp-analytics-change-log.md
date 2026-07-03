# Odoo ERP Analytics Change Log

Last updated: 2026-07-03  
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

## 2026-07-03 - How the Project Was Built Section Added

### Changed Sections
- How the Project Was Built
- Technical architecture explanation
- Inline page CSS
- Page refresh / cache-busting

### Reason
- Added a business-readable but more technical section explaining how the Odoo ERP Analytics project was built.
- Explained development problems found during the project, including non-straightforward ERP relationships, standard-reporting gaps, source-of-truth validation, and public-safe evidence requirements.
- Added a compact technical architecture layer explanation covering ERP source data, SQL / validation logic, business-rule mapping, dashboard / review views, and public-safe portfolio evidence.
- Clarified that AI-assisted iteration supported speed, while business-rule validation and final logic remained human-led.
- Refreshed the case-study CSS query string to help GitHub Pages serve the latest version.

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
- No real operational data was added.
- No confidential data was added.
- No fake metrics or audited impact claims were added.
- The section was placed after Architecture / Data Flow and before Output Evidence.
- The tone is intentionally more technical than the homepage, but still business-readable and public-safe.

---

## 2026-07-03 - Review Signals Section Added

### Changed Sections
- Review Signals / Exception Insights
- Public-safe dashboard visuals
- Inline page CSS
- Page refresh / cache-busting

### Reason
- Added a new portfolio section showing how the Odoo analytics dashboard groups filtered ERP rows into review signals.
- Made the case study feel more analytical and management-oriented.
- Added public-safe previews for Sales Order Review Signals and Material / Procurement Review Signals.
- Explained the review categories without exposing confidential operational data.
- Refreshed the CSS query string to help GitHub Pages serve the latest page version.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`
- `Assets/odoo-review-signals-sales-order-public-safe.svg`
- `Assets/odoo-review-signals-material-procurement-public-safe.svg`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real operational data was added.
- No confidential data was added.
- No audited business impact or fake improvement metrics were claimed.
- Screenshot values are public-safe, sanitized, or recreated for portfolio explanation.
- SVG recreations were used because the connector supports text file commits safely, while direct PNG upload is not supported in this workflow.
- The section is intended to show dashboard thinking: moving from raw ERP records to operational attention signals.

---

## 2026-07-02 - Liveliness Polish Added

### Changed Sections
- Business Context
- Visual Proof
- Output Evidence
- Inline page CSS
- Page refresh / cache-busting

### Reason
- Added a small story-flow strip to make the project feel more like a guided journey.
- Added a concise key learning callout to make the case study feel more human and reflective.
- Added visual guide chips below the dashboard previews so readers know what to look for.
- Added subtle hover polish for visual frames without making the page flashy or SaaS-like.
- Refreshed the CSS query string to help GitHub Pages serve the latest page version.

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
- No new screenshots or visuals were added.
- No real operational data was added.
- No confidential data was added.
- No fake metrics or unverified improvement numbers were added.
- The goal was to make the page feel more lively, guided, and human while preserving the warm business-focused style.

---

## 2026-07-02 - Inline CSS Cleanup

### Changed Sections
- Inline page CSS
- Page refresh / cache-busting

### Reason
- Removed unused old page-specific CSS left from earlier refactor phases.
- Reduced maintenance noise in the Odoo case study page.
- Kept active case-study, visual proof, output evidence, architecture, business value, and responsive styles intact.
- Refreshed the CSS query string to help GitHub Pages serve the latest page version.

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
- No content was changed.
- No screenshots or visuals were added or removed.
- No real operational data was added.
- No confidential data was added.
- The next step should be a final live-page visual review.

---

## 2026-07-02 - Case Study Copy Tightened

### Changed Sections
- Business Context
- Approach / Workflow
- Dashboard Modules
- Skills Demonstrated
- Page refresh / cache-busting

### Reason
- Reduced text heaviness after adding public-safe visuals.
- Made the page easier to scan for recruiters and business readers.
- Preserved the business systems analytics positioning.
- Kept the content public-safe and avoided unverified impact claims.

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
- No new screenshots or visuals were added.
- No real operational data was added.
- No confidential data was added.
- No fake metrics or unverified improvement numbers were added.
- The next step should be CSS cleanup if the page looks good after this pass.

---

## 2026-07-02 - Public-Safe Dashboard Visuals Added

### Changed Sections
- Visual Proof
- Output Evidence
- Page refresh / cache-busting

### Reason
- Replaced the Visual Proof placeholder with a public-safe Sales Order Traceability dashboard screenshot.
- Added a supporting public-safe Material & Amount Order Tracking dashboard preview to Output Evidence.
- Reduced text heaviness by adding visual proof while avoiding confidential data and unverified impact claims.
- Refreshed the CSS query string to help GitHub Pages serve the latest page version.

### Files Edited
- `Projects/Odoo-ERP-Analytics.html`
- `docs/odoo-erp-analytics-change-log.md`
- `Assets/odoo-so-traceability-public-safe.svg`
- `Assets/odoo-material-amount-tracking-public-safe.svg`

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- No real operational data was added.
- No confidential data was added.
- No fake metrics or unverified impact numbers were added.
- Visuals are sanitized or recreated for portfolio explanation.
