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

## 2026-07-03 - Logic Translation Board Clean HTML Rewrite

### Changed Sections
- How the Project Was Built
- Inline page CSS

### Reason
- Replaced the CSS-hacked translation board with real HTML markup.
- Improved readability and maintainability.
- Made the board visually cleaner and more logical.
- Kept the Build Journey unchanged.
- Kept the section public-safe and business-readable.

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
- No confidential operational data was added.
- No real customer, supplier, order, invoice, payment, cost, margin, database, credential, or server data was added.
- No fake metrics or audited impact claims were added.
- The board now uses real visible HTML text instead of pseudo-content.
- Mobile stacks each row vertically to avoid overflow.
- This is a maintainability cleanup, not a full page redesign.

---

## 2026-07-03 - Logic Map Replaced with Translation Board

### Changed Sections
- How the Project Was Built
- Shared case-study CSS

### Reason
- The previous architecture map looked dynamic but did not clearly explain the business logic.
- Replaced it with a Logic Translation Board that shows how ERP records become business meaning and review outputs.
- Kept the section visual, but made it clearer and more business-readable.
- Preserved the Build Journey because it still explains the project development flow well.

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
- No confidential operational data was added.
- No private business records or real operational values were added.
- No fake metrics or audited impact claims were added.
- The translation board uses four public-safe example rows to explain the logic transformation.
- Mobile stacks each row vertically to avoid overflow.
- This is a meaning-clarity fix, not a full page redesign.

---

## 2026-07-03 - Logic Map Relationship Polish

### Changed Sections
- How the Project Was Built
- Shared case-study CSS

### Reason
- The previous multi-direction architecture map looked dynamic, but the arrows did not clearly explain the relationship between nodes.
- Reworked the map into a clearer relationship layout: ERP Sources → SQL & Validation → Business Rules → Review Views → Public-Safe Portfolio.
- Added a meaningful feedback loop showing that review signals refine business rules and source checks.
- Kept the design visual and compact while making the logic easier to understand.

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
- No confidential operational data was added.
- No private business records or real operational values were added.
- No fake metrics or audited impact claims were added.
- The mobile version stacks the same relationships vertically to avoid overflow.
- This polish is a relationship-clarity fix, not a page redesign.

---

## 2026-07-03 - Built Section Redesigned as Journey and Dynamic Architecture Map

### Changed Sections
- How the Project Was Built
- Inline page CSS

### Reason
- Replaced the stacked presentation with a more visual journey + architecture layout.
- Reduced text heaviness.
- Made the section more memorable and dynamic.
- Redesigned the architecture explanation to use symbols, lighter wording, and interconnected relationships instead of a rigid static stack.
- Kept the section public-safe and business-readable.

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
- No confidential operational data was added.
- No private business records or real operational values were added.
- No fake metrics or audited impact claims were added.
- The redesign focuses on clearer storytelling and lighter visual explanation.
- The architecture map uses multi-directional connectors on wider screens; connectors are simplified on smaller screens to avoid mobile overflow.

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
