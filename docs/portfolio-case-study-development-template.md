# Portfolio Case Study Development Template

Last updated: 2026-07-03  
Status: Active working template  
Created from: Odoo ERP Analytics case study development  
Applies to: Future project pages, case-study pages, visual proof sections, and homepage project presentation decisions

---

## 1. Purpose

This document captures the development pattern that worked well on the Odoo ERP Analytics portfolio page.

The goal is to use the Odoo page as a repeatable template for future portfolio pages: not perfect, not over-engineered, but clear, credible, visual, public-safe, and easy for recruiters or business readers to understand.

This template should be reviewed before developing or redesigning the next project page.

---

## 2. Core conclusion from the Odoo page development

The strongest portfolio page is not only a page that says:

```text
I built a dashboard.
```

The stronger message is:

```text
I understood a messy business process, mapped how the data moves through the system, validated the business logic, and turned the work into practical management visibility.
```

For future pages, the focus should stay on business understanding first, then technical implementation second.

---

## 3. What made the Odoo page direction better

The page started to feel stronger after these changes:

1. The text became shorter and more meaningful.
2. The page stopped feeling like a long report.
3. Visual proof was added through public-safe dashboard previews.
4. A small story flow was added to guide the reader.
5. A personal learning callout made the project feel more human.
6. Review Signals made the page more analytical and management-oriented.
7. Confidentiality was protected without weakening the project story.
8. The page presented thinking, not just output.

The most important improvement was moving from:

```text
Here is the data.
```

into:

```text
Here is what needs attention.
```

That is the level future pages should aim for.

---

## 4. Recommended page structure for future case studies

Use this structure as the default starting point.

```text
1. Hero / Project Summary
2. Project Snapshot
3. Business Context / Problem
4. Public-Safe Visual Proof
5. Approach / Workflow
6. Architecture / Data Flow
7. Output Evidence
8. Insight / Review Signal / Exception Layer
9. Dashboard Modules / What the System Supports
10. Business Value / Before vs After
11. Skills Demonstrated
12. Confidentiality / Public-Safe Note
13. Links / CTA
```

Not every page needs every section, but future pages should preserve this logic:

```text
Context -> Proof -> Process -> Logic -> Evidence -> Insight -> Value -> Skills -> CTA
```

---

## 5. Page tone and positioning

The page should feel:

- Warm
- Calm
- Structured
- Professional
- Analytical
- Business-focused
- Practical
- Credible
- Human
- Clear to recruiters and business users

The page should not feel:

- Too dark
- Too flashy
- Too developer-like
- Too experimental
- Too AI-heavy
- Like a SaaS landing page
- Like a raw technical demo

Preferred positioning:

```text
Business Systems & Operations Analytics
```

Avoid presenting the work primarily as software development. The strongest positioning is the ability to connect business process, ERP systems, data logic, dashboard design, and management review.

---

## 6. Visual proof rule

Future pages should include visual proof when possible, but only in a public-safe way.

Good visual proof examples:

- Sanitized dashboard screenshot
- Recreated public-safe dashboard visual
- Sample reporting table
- Data-flow diagram
- Review signal / exception insight panel
- Before vs after workflow illustration
- Small business-rule explanation visual

Avoid:

- Real customer names
- Real supplier names
- Real order numbers
- Real invoice or payment details
- Real profitability values
- Real pricing, margins, or cost details
- Internal remarks
- Credentials, URLs, tokens, database names, or server details

Preferred wording:

```text
Public-safe dashboard preview. Displayed values are sanitized or recreated for portfolio explanation.
```

Avoid wording that sounds fake or weak, such as:

```text
This is fake data.
```

Better wording:

```text
Values and labels are sanitized or recreated for portfolio explanation and do not expose confidential operational data.
```

---

## 7. Insight layer pattern

One of the best improvements from the Odoo page was adding a layer that explains what the dashboard helps detect.

For future pages, consider adding an insight section such as:

- Review Signals
- Exception Insights
- Operational Attention Signals
- Management Review Indicators
- Risk / Follow-up Indicators
- Data Quality Signals
- Process Bottleneck Signals

The purpose is to show that the work does not only display data. It helps users understand what needs attention.

Example structure:

```text
Section label:
REVIEW SIGNALS / EXCEPTION INSIGHTS

Heading:
From records to review signals

Lead:
The dashboard groups filtered rows into simple review indicators so users can distinguish normal records from items that may need operational, financial, procurement, or process follow-up.
```

Then show:

1. One or two public-safe visuals.
2. Guide chips explaining what to look for.
3. Small explanation cards defining the categories.
4. A caption protecting confidentiality.

---

## 8. Review Signal category pattern

The Odoo page used these categories:

| Category | Meaning |
| --- | --- |
| Healthy | No immediate follow-up detected from the exposed dashboard fields. |
| Watchlist | Normal in-progress or context rows that should be monitored until complete. |
| Needs Review | Rows with delayed, unclear, mismatched, or variance-related signals. |
| Supplier Follow-up | Procurement or receipt progress that may need supplier-side follow-up. |
| Operational Follow-up | Fulfillment, manufacturing, source path, or internal process follow-up. |

For future pages, adjust the category names based on the project, but keep the same principle:

```text
Use simple business-readable labels that explain what the reader should pay attention to.
```

---

## 9. Writing pattern that worked

Good copy is short, specific, and business-readable.

Prefer:

```text
The dashboard groups filtered ERP rows into simple review signals so users can distinguish normal records from items that may need delivery, invoice, procurement, source relationship, or material follow-up.
```

Avoid:

```text
This dashboard provides an advanced AI-powered analytics engine with complex data intelligence capabilities.
```

Good section copy should answer:

- What problem existed?
- What was hard about it?
- What did the project change?
- What can the reader see now?
- Why does this matter for management or operational review?

---

## 10. Design implementation pattern

When editing a page, follow this order:

1. Read the design guide.
2. Read the relevant page plan.
3. Read the changelog.
4. Read the current HTML and CSS.
5. Make one focused change at a time.
6. Add a harmless version comment for traceability.
7. Update the CSS cache string when needed.
8. Update the changelog.
9. Verify the final HTML from `main`.
10. Report honestly what changed and what was not done.

Good HTML version comment example:

```html
<!-- review-signals-version: 20260703-v1 -->
```

Good inline CSS version comment example:

```css
/* review-signals-section-version: 20260703-v1 */
```

Good cache-busting pattern:

```html
<link rel="stylesheet" href="../CSS/case-study.css?v=YYYYMMDD-feature-name">
```

---

## 11. CSS and layout pattern

Use existing shared case-study classes first:

- `case-section`
- `case-section--soft`
- `case-container`
- `case-section-header`
- `case-eyebrow`
- `case-subheading`
- `case-lead`
- `case-card`
- `case-grid`
- `case-visual-frame`
- `case-browser-bar`
- `case-browser-dot`
- `case-visual-content`
- `case-caption`
- `case-visual-guide`
- `case-guide-chip`

Add new page-specific classes only when necessary.

Good examples from the Odoo page:

- `review-signals-grid`
- `review-signal-visual-card`
- `review-signal-explainer-grid`
- `review-signals-note`

Keep responsive behavior simple:

```text
Desktop: two or three columns when useful.
Tablet/mobile: stack into one column.
```

---

## 12. Changelog pattern

Every meaningful page update should be logged.

Use this pattern:

```markdown
## YYYY-MM-DD - Update Name

### Changed Sections
- Section name

### Reason
- Why the change was made

### Files Edited
- File path

### Design Guide Checked
- Yes

### Page Plan Checked
- Yes

### Confidentiality Checked
- Yes

### Notes
- What was not changed
- Any limitation
- Any future follow-up
```

Changelog notes should be honest. If an SVG recreation is used instead of a PNG screenshot, say it clearly.

---

## 13. Confidentiality rule

It is acceptable for a portfolio page to use public-safe screenshots or recreated visuals.

It is not necessary to prove private company data publicly.

The correct goal is:

```text
Present the logic and workflow clearly while protecting confidential data.
```

Do not claim the public viewer can validate the raw data. The reader should understand the thinking, structure, and business relevance.

Safe statement:

```text
This public-safe preview shows how the dashboard groups operational records into review indicators. Values and labels are sanitized or recreated for portfolio explanation.
```

Unsafe statement:

```text
This dashboard has been fully validated with real company data and achieved X% improvement.
```

Unless impact numbers are approved, public-safe, and evidence-backed, do not use them.

---

## 14. Development recap from the Odoo case study

The final Odoo direction included:

- Light, warm case-study design aligned with the homepage.
- Business-first hero and project snapshot.
- Business Context section explaining visibility problem.
- Public-safe dashboard preview.
- Approach / Workflow section showing how the problem was solved.
- Architecture / Data Flow section explaining ERP-to-dashboard logic.
- Output Evidence section with a recreated review-ready reporting table.
- Review Signals / Exception Insights section showing operational attention logic.
- Dashboard Modules section showing what the system supports.
- Business Value section showing before vs after.
- Skills Demonstrated section.
- Public-safe confidentiality / CTA section.

This should be the model for future project pages.

---

## 15. Homepage implication

The homepage should now point more clearly toward this kind of positioning.

When returning to homepage development, review whether the homepage communicates:

- Business Systems & Operations Analytics
- ERP process understanding
- Dashboard and reporting workflow
- Practical operational visibility
- Public-safe project evidence
- AI-assisted delivery, but not AI as the main identity
- The Odoo page as a flagship example

Possible homepage next steps:

1. Make the Odoo case study more prominent in the Projects section.
2. Update homepage wording so it matches the stronger case-study positioning.
3. Add a short “how I work” flow that mirrors the case-study logic.
4. Make the project cards less generic and more business-outcome oriented.
5. Ensure the homepage does not feel disconnected from the improved Odoo page.

---

## 16. Future development checklist

Before editing a new page, check:

- Does the page have a clear business problem?
- Does it show visual proof?
- Does it explain the workflow?
- Does it show how the data/process logic works?
- Does it include an output or evidence section?
- Does it show an insight layer, not only raw dashboard output?
- Does it explain business value without fake metrics?
- Does it protect confidential data?
- Does it feel aligned with the homepage?
- Does it support Fauzan's positioning as a Business Systems & Operations Analytics professional?

---

## 17. Current decision

The Odoo case study is not perfect, but it is good enough to become the working standard for future page development.

Next focus:

```text
Return to the homepage and make sure the homepage now supports the improved project-page direction.
```
