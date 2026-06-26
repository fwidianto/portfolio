# Codex Handoff: Portfolio Refresh

## Context

Repository: `fwidianto/portofolio`

Working branch: `portfolio-refresh-plan`

The repo is public and appears to power the public portfolio site at `https://fwidianto.github.io`.

Do not work directly on `main`. Keep changes on a feature branch until reviewed.

## Current problem

The portfolio is functional, but its content is behind the user's latest progress. It currently emphasizes general ERP/business operations work, while the user's current strongest story is:

> Business operations and ERP analytics professional building AI-assisted data systems, SQL reporting layers, automation workflows, and decision-support dashboards from real operational ERP data.

## Important repo safety rules

1. This is a public repository.
2. Do not expose private PersonalOS content.
3. Do not expose real Odoo/company data.
4. Do not include credentials, tokens, database names, server secrets, or internal ERP records.
5. Do not publish job application tracker details.
6. Do not exaggerate software engineering claims.
7. Be honest that some implementation is AI-assisted.
8. Preserve the live site until changes are reviewed.

Read first:

- `docs/portfolio-refresh/README.md`
- `docs/portfolio-refresh/PORTFOLIO_REFRESH_PLAN.md`
- `docs/portfolio-refresh/PUBLIC_CONTENT_BOUNDARIES.md`

## Recommended first implementation scope

Start with Phase 1 only: content refresh without major redesign.

### Files likely to update

- `index.html`
- `README.md`
- Maybe CSS only if existing cards need minor layout support
- Do not delete existing assets unless confirmed

### Phase 1 tasks

1. Update homepage title and meta description.
2. Update JSON-LD structured data.
3. Update hero role and headline.
4. Update About section.
5. Update Professional Experience text.
6. Update skills categories.
7. Replace or expand Featured Projects.
8. Keep layout stable and mobile-safe.
9. Verify links still work.
10. Do not add fake screenshots.

## Suggested homepage copy direction

### Role

Use:

`Business Operations & ERP Analytics Specialist`

### Headline

Use or adapt:

`Turning ERP and operational data into decision-ready analytics`

### Summary

Use or adapt:

`I bridge business operations, ERP systems, SQL-based analytics, automation, and AI-assisted development to build practical reporting and decision-support solutions.`

## Suggested featured projects

Recommended order:

1. Odoo ERP Analytics Platform
2. AI ERP Intelligence Dashboard
3. Business Reporting Automation
4. PersonalOS / AI Handoff Workflow
5. HS Code Trade Compliance Automation
6. Investment Analytics Dashboard

If there is not enough room for six cards, prioritize the first four.

## Project card drafts

### Odoo ERP Analytics Platform

Short description:

`SQL-based analytics layer for Odoo operational data, supporting sales, purchasing, inventory, invoicing, profitability, and traceability reporting.`

Tags:

`Odoo`, `PostgreSQL`, `SQL`, `ERP Analytics`, `Dashboard`

### AI ERP Intelligence Dashboard

Short description:

`Deployed Flask analytics dashboard demonstrating ERP-style data exploration, table browsing, SQL query interface, and decision-support analytics.`

Tags:

`Python`, `Flask`, `SQLite`, `Analytics`, `Dashboard`

### Business Reporting Automation

Short description:

`Reporting automation work using Excel, Google Sheets, Apps Script, VBA, UiPath, and Looker Studio to reduce manual reporting and improve management visibility.`

Tags:

`Excel`, `Apps Script`, `VBA`, `UiPath`, `Looker Studio`

### PersonalOS / AI Handoff Workflow

Short description:

`Private Markdown-based knowledge and workflow system for career planning, project documentation, AI handoff, reusable prompts, and documentation-driven development.`

Tags:

`Markdown`, `AI Workflow`, `Codex`, `Knowledge System`, `Documentation`

### HS Code Trade Compliance Automation

Short description:

`Browser automation and data extraction workflow for trade compliance research, using Playwright and Excel/JSON outputs.`

Tags:

`Python`, `Playwright`, `OpenPyXL`, `Automation`, `Trade Compliance`

### Investment Analytics Dashboard

Short description:

`Personal market and portfolio monitoring dashboard using Google Sheets, Apps Script, Looker Studio, and TradingView widgets.`

Tags:

`Google Sheets`, `Apps Script`, `Looker Studio`, `TradingView`

## Experience wording guidance

### PT Nobi Putra Angkasa

Emphasize:

- VP Operations support
- Odoo 16 ERP ownership/admin support
- SO/PR/PO review
- profitability and compliance review
- operational dashboards
- reporting automation
- cross-functional coordination

### PT Cibuni Teknik Sejahtera

Emphasize:

- project/business operations
- workshop setup
- manpower and operational readiness
- finance and customer coordination
- profitability awareness

### PT Traktor Nusantara

Emphasize:

- cost control
- SAP ECC6 exposure
- maintenance contract profitability
- dashboard development
- inventory mismatch analysis
- AP workflow improvement

## Test checklist

Before handing back:

- [ ] Site opens locally.
- [ ] Navigation works.
- [ ] Project links work or gracefully use placeholders.
- [ ] CV download link works.
- [ ] Mobile layout does not break.
- [ ] No confidential data is added.
- [ ] No private PersonalOS content is copied.
- [ ] README matches homepage positioning.

## Final output expected from Codex

When finished, summarize:

1. Files changed.
2. Key content updates.
3. Anything intentionally left unchanged.
4. Any broken/missing assets or links found.
5. Recommended next phase.
