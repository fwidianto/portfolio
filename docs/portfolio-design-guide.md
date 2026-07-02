# Portfolio Design Guide

Last updated: 2026-07-02  
Status: Approved baseline  
Applies to: Homepage, project pages, portfolio navigation, visual design, project case studies, and future portfolio updates

---

## 1. Purpose

This guide defines the visual, structural, content, and confidentiality rules for Fauzan Widianto's portfolio website.

The goal is to make the portfolio feel like one consistent professional website, not a collection of unrelated experiments or unfinished project pages.

Before editing the homepage or any project page, this guide must be read first.

For every meaningful portfolio update, the relevant project plan and change log should also be reviewed and updated.

---

## 2. Portfolio Identity

The portfolio presents Fauzan Widianto as a:

**Business Systems & Operations Analytics professional**

The portfolio should communicate the ability to connect:

- Business operations
- ERP systems
- Operational data
- Dashboard and reporting workflows
- Profitability review
- Process visibility
- Cross-functional coordination
- Practical automation
- Modern analytics workflows

The portfolio should not present Fauzan primarily as a software developer, AI engineer, or experimental project builder.

The strongest positioning is:

> Fauzan understands business processes, ERP systems, operational reporting problems, and data logic, then turns them into practical visibility for better management decisions.

---

## 3. Desired Portfolio Feeling

The portfolio should feel:

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

The portfolio should not feel:

- Too dark
- Too flashy
- Too developer-like
- Too experimental
- Too scattered
- Too AI-heavy
- Like a SaaS product landing page
- Like disconnected project demos with different design systems

---

## 4. Design Source of Truth

The homepage is the visual source of truth.

Project pages may introduce additional case-study sections, but they must remain visually aligned with the homepage's style.

The homepage design direction is:

- Warm off-white background
- Dark teal accent
- Clean typography
- Rounded white cards
- Soft borders
- Soft shadows
- Spacious layout
- Business analytics tone
- Calm consultant-style presentation

Project pages must not create a completely different visual identity.

---

## 5. Core Color Palette

Use the homepage warm consultant analytics palette as the default design system.

```css
:root {
  --bg: #fbfaf7;
  --bg-soft: #f6f2ea;
  --surface: #ffffff;
  --surface-2: #f3f0e9;
  --text: #1f2933;
  --muted: #6b7280;
  --accent: #1f4d5a;
  --accent-dark: #173b45;
  --accent-2: #7c6f57;
  --border: rgba(31, 41, 51, 0.12);
  --shadow-soft: 0 18px 45px rgba(31, 41, 51, 0.08);
  --shadow-card: 0 10px 28px rgba(31, 41, 51, 0.07);
}
```

### Color Usage Rules

| Element | Preferred Style |
|---|---|
| Main page background | `--bg` or warm off-white gradient |
| Soft section background | `--bg-soft` |
| Cards | `--surface` |
| Secondary cards / placeholder blocks | `--surface-2` |
| Main text | `--text` |
| Supporting text | `--muted` |
| Main accent | `--accent` |
| Primary buttons | `--accent` |
| Button hover | `--accent-dark` |
| Borders | `--border` |
| Shadows | `--shadow-card` or `--shadow-soft` |

Avoid introducing new dominant blues, purples, neon colors, or unrelated gradients unless there is a clear reason and the result still matches the homepage.

---

## 6. Dark Section Rules

Dark sections are allowed, but they must be used carefully.

Dark sections should not be the default page style.

Use dark sections only for:

- Architecture diagram emphasis
- Mock dashboard preview
- Code or technical explanation
- Small contrast blocks
- Screenshot frame / browser-style preview

Do not use dark backgrounds for every section or every card.

The default body of project pages should stay light, warm, readable, and aligned with the homepage.

---

## 7. Typography Rules

Use the same typography direction as the homepage.

### Font

Use Inter as the primary font.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Heading Style

Headings should be:

- Clear
- Confident
- Business-oriented
- Not overly clever
- Not too technical unless the section requires it

Main headings should explain business value, not only technology.

Good examples:

- `Turning ERP Transactions into Management-Ready Visibility`
- `From Business Questions to Validated Analytics Logic`
- `How Data Moves from ERP Transactions into Reviewable Outputs`

Avoid headings like:

- `AI-Powered ERP Data Intelligence Engine`
- `Advanced PostgreSQL Analytics System`
- `Next-Generation Automation Platform`

Unless the page is specifically about a technical build, business clarity should come first.

---

## 8. Layout and Spacing Rules

Use generous spacing and clear section rhythm.

Every section should have one clear purpose.

Avoid stacking many similar cards without a visual break.

Preferred rhythm for project pages:

```text
Hero / summary
Problem narrative
Visual proof
Workflow
Architecture / system logic
Output evidence
Before vs after
Skills demonstrated
Confidentiality note
Links
```

Sections should not feel like a long report.

A reader should be able to scan the page and understand the story without reading every paragraph.

---

## 9. Card and Component Rules

Cards should follow the homepage style:

- White or warm light background
- Rounded corners
- Soft border
- Soft shadow
- Clean heading
- Muted supporting text
- Calm hover effect if needed

Preferred card style:

```css
.case-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: var(--shadow-card);
  padding: 28px;
}
```

Hover effects should be subtle.

Allowed:

```css
transform: translateY(-3px);
box-shadow: var(--shadow-soft);
```

Avoid:

- Aggressive animation
- Neon glow
- Heavy dark shadows
- Excessive gradients
- Cards that look unrelated to the homepage

---

## 10. Button Rules

Buttons should match the homepage.

Primary button:

- Dark teal background
- White text
- Pill shape
- Calm hover state

Secondary button:

- White or translucent background
- Border
- Dark text
- Soft hover

Preferred style:

```css
.btn-primary {
  background: var(--accent);
  color: #ffffff;
  border-radius: 999px;
}

.btn-primary:hover {
  background: var(--accent-dark);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 999px;
}
```

---

## 11. Navigation Rules

Navigation should remain consistent across homepage and project pages.

The current public project navigation should show:

- Odoo ERP Analytics
- AI ERP Dashboard
- Investment Dashboard

Temporarily hidden until ready to republish:

- Business Reporting Automation
- PersonalOS / AI Handoff
- HS Code Automation

Hidden projects should not appear in public navigation, homepage project cards, or public project inventory unless intentionally restored.

Do not delete hidden project files unless explicitly agreed. They may remain in the repository for future development.

---

## 12. Project Visibility Rules

The portfolio should be curated, not exhaustive.

Only show projects that support the current professional positioning.

A project should be public-facing only if it is:

- Relevant to the target career direction
- Clear enough for recruiters or hiring managers
- Not confusing or overly experimental
- Safe from confidentiality issues
- Visually presentable
- Connected to the broader portfolio story

Projects that are unfinished, too personal, or not aligned should be hidden or grouped under internal/private work until ready.

---

## 13. Standard Project Page Structure

All project pages should gradually follow the same case-study structure.

The exact layout may vary, but the reader should always understand:

- What problem existed
- Why the project mattered
- What role Fauzan played
- What was built or improved
- What process or system was involved
- What tools were used
- What business value the project supports
- What skills the project demonstrates
- What is public-safe and what is intentionally not shown

### Recommended Case Study Structure

```text
1. Hero / Project Summary
2. Project Snapshot
3. Problem / Context
4. Approach / Workflow
5. System or Process Diagram
6. Output / Evidence
7. Business Value
8. Skills Demonstrated
9. Confidentiality / Notes
10. Links
```

---

## 14. Odoo ERP Analytics Page Rules

The Odoo ERP Analytics page is the flagship project page.

It should demonstrate:

- ERP process understanding
- Business operations thinking
- Data source validation
- SQL and reporting logic
- Dashboard design
- Operational traceability
- Profitability and management review support
- Cross-functional business visibility

The page should not be positioned as only a technical SQL dashboard.

The stronger story is:

> Understanding a messy ERP business flow, identifying reporting gaps, mapping the transaction logic, and building a management visibility layer.

### Odoo Page Hero Direction

The Odoo page hero should be light like the homepage.

It should not use a full dark SaaS-style hero as the default direction.

Preferred hero style:

- Warm light background
- Dark teal accent
- Large clear heading
- Short business-focused subtitle
- White project snapshot card
- Calm tag pills

Preferred hero tags:

```text
Business Operations
ERP Analytics
PostgreSQL / SQL
Dashboard & Reporting
Process Visibility
```

Avoid making AI one of the main hero tags unless the project itself is primarily about AI.

---

## 15. Odoo Page Visual Evidence Plan

The Odoo page should include visual proof.

For the next version, include:

1. Sanitized screenshot
2. Architecture diagram
3. Screenshot or static mockup of a reporting table

Later, add:

4. Mock dashboard preview

### Visual Evidence Rules

Visuals must be public-safe.

Screenshots must hide or remove:

- Customer names
- Supplier names
- Real order numbers
- Real invoice numbers
- Real payment details
- Real profitability figures
- Real pricing
- Real margins
- Internal remarks
- Database/server details

Mock visuals are allowed and preferred when real screenshots are risky.

---

## 16. Odoo Architecture Diagram Content

The architecture diagram should explain how ERP data becomes decision-support visibility.

Recommended structure:

```text
Odoo ERP Source
↓
PostgreSQL / SQL Extraction
↓
Business Logic & Validation Layer
↓
Analytics Views / Dashboard Data
↓
Dashboard + Excel Export
↓
Management Review / Operational Follow-up
```

Detailed version:

| Layer | Content |
|---|---|
| Odoo ERP Source | Sales orders, internal orders, purchase orders, manufacturing orders, stock movement, invoices, payments |
| SQL Extraction | Read-only queries, company filter, canceled-state exclusion, reference mapping |
| Business Logic & Validation | Source classification, SO/IO/JO relationship checks, status logic, exception handling, profitability signals |
| Analytics Views | Sales Order View, Internal Order View, Material Tracking, Invoice & Payment View |
| Dashboard & Export | Web dashboard, searchable tables, filters, Excel export |
| Decision Support | Management review, operational follow-up, issue investigation, cross-functional coordination |

The diagram should be understandable to non-technical business readers.

---

## 17. Odoo Public-Safe Sample Table

The Odoo page may include a fictional or sanitized sample reporting table.

Example columns:

| Column | Purpose |
|---|---|
| Order Ref | Fictional reference only |
| Source Type | Shows fulfillment source |
| Delivery | Shows delivery progress |
| Invoicing | Shows invoice status |
| Payment | Shows payment status |
| Profitability Signal | Shows review category |
| Review Note | Shows operational follow-up |

Example rows:

| Order Ref | Source Type | Delivery | Invoicing | Payment | Profitability Signal | Review Note |
|---|---|---|---|---|---|---|
| SO-24-0142 | From Stock | Delivered | Fully Invoiced | Paid | Healthy | Routine order, no exception follow-up. |
| SO-24-0179 | Manufacturing | In Progress | Pending | Not Due | Watchlist | Production and delivery progress under monitoring. |
| SO-24-0208 | Internal Order | Partially Ready | Partial | Outstanding | Needs Review | Linked procurement and invoice follow-up required. |
| SO-24-0241 | Purchase | Waiting Material | Not Invoiced | Not Due | Supplier Follow-up | Material availability affects delivery readiness. |
| IO-24-0086 | Internal Order | Delivery Pending | N/A | N/A | Operational Follow-up | Check stock movement and fulfillment status. |

This table must be clearly labeled as public-safe, fictional, illustrative, or sanitized.

---

## 18. AI Positioning Rule

AI should be positioned as workflow support, not the main professional identity.

The portfolio should embrace modern AI-supported work, but not overstate or overemphasize AI.

Preferred positioning:

- AI-supported workflow
- Modern analytics workflow
- AI-assisted documentation and iteration
- Human-led validation with AI-supported execution
- Workflow acceleration
- AI-supported development tools

Avoid overusing:

- AI-powered
- AI-first
- AI agent
- Fully automated AI system
- AI as the main headline
- AI as the primary value proposition

Good example:

> Used AI-supported development tools to speed up iteration, documentation, and implementation, while keeping business-rule validation and final review human-led.

Avoid:

> Built an AI-powered ERP analytics engine.

The main identity should remain:

> Business systems, operations analytics, ERP understanding, reporting, profitability review, process visibility, and decision support.

AI supports that identity. AI should not replace it.

---

## 19. Content Tone Rules

The writing should be:

- Clear
- Professional
- Human
- Business-first
- Evidence-based
- Practical
- Honest

Avoid:

- Overclaiming
- Buzzwords
- Too much technical jargon
- Too much AI language
- Long dense paragraphs
- Claims that cannot be supported
- Making the project sound larger than it is

Preferred language:

- "Supports management review"
- "Improves operational visibility"
- "Helps trace transaction flow"
- "Builds a reusable reporting structure"
- "Clarifies source-of-truth logic"
- "Uses public-safe examples"
- "Human review remains important"

Avoid language like:

- "Revolutionary"
- "Fully automated"
- "Enterprise-grade" unless proven
- "AI-powered decision engine"
- "Guaranteed business impact"
- "Production-grade system" unless accurate

---

## 20. Confidentiality Rules

This portfolio must never expose confidential company information.

Never publish:

- Customer names
- Supplier names
- Employee names unless public and appropriate
- Real sales order numbers
- Real internal order numbers
- Real invoice numbers
- Real payment records
- Real profitability figures
- Real prices
- Real margins
- Real cost structures
- Real database credentials
- Server details
- Private URLs
- Internal-only business rules that should not be public
- Screenshots containing sensitive operational data

When showing ERP or reporting work, use:

- Mock data
- Sanitized screenshots
- Fictional references
- Blurred values
- Simplified diagrams
- Public-safe architecture descriptions

Every project page should include a confidentiality note when the project is based on real company work.

Suggested wording:

> This case study explains the project structure and thinking without exposing customer names, supplier names, order numbers, invoice values, profitability figures, database credentials, server details, or confidential operational records.

---

## 21. Shared CSS Direction

The portfolio should gradually move toward shared case-study CSS.

Current state:

- Homepage uses `CSS/main.css`
- Detail pages use `CSS/project.css`
- Some project pages may include page-specific CSS

Future direction:

```text
CSS/main.css
CSS/project.css
CSS/case-study.css
```

### Proposed Role of `CSS/case-study.css`

This file should eventually contain reusable styles for:

- Case study hero
- Project snapshot card
- Section headers
- Feature cards
- Architecture diagrams
- Sample tables
- Screenshot frames
- Before/after comparisons
- Confidentiality notes
- Case study CTAs

Page-specific CSS should be minimized over time.

Do not keep creating isolated styling systems for each project page.

---

## 22. Visual Consistency Checklist

Before publishing a page update, check:

- Does the page still feel like the homepage?
- Does it use the warm palette?
- Are cards mostly white/light, not dark by default?
- Are shadows soft?
- Are borders subtle?
- Are buttons consistent?
- Is the accent color dark teal?
- Is the typography consistent?
- Is the page readable on mobile?
- Does the page avoid excessive text blocks?
- Does the page avoid looking like a separate SaaS landing page?

---

## 23. Project Page Content Checklist

Before publishing a project page update, check:

- Is the problem clear?
- Is Fauzan's role clear?
- Is the business value clear?
- Are tools mentioned without becoming the main story?
- Is the workflow understandable?
- Is there visual evidence?
- Are screenshots safe?
- Is the writing honest and not exaggerated?
- Is AI positioned carefully?
- Does the project support the current job-search positioning?

---

## 24. Update Workflow

Before editing any portfolio page:

1. Read this file: `docs/portfolio-design-guide.md`
2. Read the relevant project page plan
3. Identify the exact section to update
4. Confirm whether the update is visual, content, structure, or navigation
5. Check whether the update affects shared CSS
6. Edit only the agreed section unless broader changes are approved
7. Check design consistency with homepage
8. Check confidentiality
9. Update the relevant change log
10. Review the page after GitHub Pages refreshes

---

## 25. Change Log Requirement

Each major project page should have a change log.

For the Odoo page, use:

```text
docs/odoo-erp-analytics-change-log.md
```

Every meaningful update should record:

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

### Confidentiality Checked
- Yes / No

### Notes
- Any concern, limitation, or next improvement
```

---

## 26. Current Portfolio Direction

Current visible project priority:

1. Odoo ERP Analytics
2. AI ERP Dashboard
3. Investment Dashboard

Current hidden projects:

1. PersonalOS / AI Handoff
2. Business Reporting Automation
3. HS Code Automation

Odoo ERP Analytics is the flagship business systems analytics case study.

AI ERP Dashboard is a public-safe demo supporting the analytics capability story.

Investment Dashboard should follow the same structural case-study rules over time, while still reflecting personal financial markets interest.

---

## 27. Future Improvement Priorities

### Near-Term

- Rewrite Odoo page plan before more implementation
- Align Odoo page hero with homepage light style
- Add sanitized screenshot
- Add architecture diagram
- Add sample table or table screenshot
- Reduce dark SaaS styling
- Create Odoo-specific page plan markdown
- Create Odoo change log markdown

### Medium-Term

- Create `CSS/case-study.css`
- Move reusable project-page styles into shared CSS
- Standardize project page structure
- Improve Investment Dashboard page using same structure
- Review AI ERP Dashboard positioning

### Long-Term

- Revisit hidden projects when they are ready
- Add stronger visual proof to each project
- Improve portfolio storytelling for recruiters
- Maintain consistent project documentation discipline

---

## 28. Final Principle

The portfolio should always answer this question:

> Can this person understand business operations, structure messy data, validate the process logic, and create practical visibility for better decisions?

Every design, content, and project-page decision should support that answer.
