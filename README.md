# Fauzan Widianto Portfolio

Personal portfolio website for business systems, operations insight, dashboard/reporting workflows, automation, ERP process understanding, and AI-assisted delivery.

## Live Site

Visit the portfolio at [fwidianto.github.io/portofolio](https://fwidianto.github.io/portofolio/).

## Positioning

This portfolio is written for recruiters and collaborators looking for a business-first analytics and systems profile: Data Analyst, Business Analyst, BI Analyst, Operations Analyst, Commercial Analyst, Digital Transformation Analyst, or analytics-adjacent AI workflow roles.

The current portfolio direction is **Business Systems Designer**: understand the operational problem, structure the business logic, use technology to make the system visible, and communicate evidence clearly.

Focus areas:

- Data analysis and business insight
- Dashboard, BI, and management reporting
- Operations, profitability, and commercial analysis
- ERP process understanding through Odoo and SAP-related work
- Profitability analysis and business control
- Reporting automation with SQL, Python, spreadsheets, and scripts
- AI-assisted delivery with Codex and OpenHands

## Featured Projects

- [Odoo ERP Analytics Platform](Projects/Odoo-ERP-Analytics.html)
  - SQL analytics layer on Odoo PostgreSQL data that turns ERP activity into reporting, traceability, and profitability review inputs.
- [AI ERP Intelligence Dashboard](Projects/AI-ERP-IntelligenceDashboard/index.html)
  - Flask-based analytics dashboard demo with sample ERP-style data, SQL query support, and table browsing.
- [Business Reporting Automation](Projects/Business-Reporting-Automation.html)
  - Excel, Google Sheets, Apps Script, VBA, UiPath, and Looker Studio workflows for reporting automation.
- [PersonalOS / AI Handoff Workflow](Projects/PersonalOS-AI-Handoff.html)
  - Private Markdown-based knowledge and workflow system for planning, documentation, and AI handoffs.
- [HS Code Trade Compliance Automation](Projects/WebScrapping.html)
  - Browser automation for tariff and licensing research with structured Excel and JSON outputs.
- [Investment Analytics Dashboard](Projects/Investment%20Dashboard.html)
  - Market monitoring and allocation tracking using Google Sheets, Looker Studio, and TradingView.

## Project Inventory

| Category | Items | Notes |
| --- | --- | --- |
| Recruiter-facing case studies | Odoo ERP Analytics Platform, Business Reporting Automation, PersonalOS / AI Handoff Workflow, HS Code Trade Compliance Automation, Investment Analytics Dashboard | Public-safe pages that explain the business problem, tools, and analytical value. |
| Live demo | AI ERP Intelligence Dashboard | External PythonAnywhere demo with sample ERP-style data, dashboard views, and SQL browsing. |
| Supporting artifacts | `Projects/portfolio-app`, `Projects/AI-ERP-IntelligenceDashboard/docs`, `Projects/hs-code-automation` | Supporting code, docs, and helper material. These are secondary to the recruiter-facing case studies. |

## Project Structure

```text
portofolio/
|-- index.html
|-- README.md
|-- Assets/
|-- CSS/
|   |-- main.css
|   `-- project.css
|-- Projects/
|   |-- Odoo-ERP-Analytics.html        # recruiter-facing case study
|   |-- Business-Reporting-Automation.html
|   |-- PersonalOS-AI-Handoff.html
|   |-- WebScrapping.html
|   |-- Investment Dashboard.html
|   |-- AI-ERP-IntelligenceDashboard/  # public demo support
|   |   `-- index.html
|   |-- portfolio-app/                 # supporting Flask app
|   `-- hs-code-automation/            # supporting source folder
`-- docs/
    |-- README.md                     # active documentation entry point
    |-- core/                         # philosophy, workflow, vision, principles
    |-- homepage/                     # homepage experience concepts
    |-- case-studies/                 # case-study source documents
    |-- design/                       # visitor psychology and IA direction
    `-- portfolio-refresh/            # historical refresh implementation records
```

## Local Preview

Open `index.html` directly in a browser, or run a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

The site is static and GitHub Pages friendly. No build step is required.

## Documentation

The active documentation architecture starts at [docs/README.md](docs/README.md).

Historical refresh implementation records remain in [docs/portfolio-refresh/](docs/portfolio-refresh/README.md).

## Analytics Setup

Analytics and search verification placeholders are documented in [docs/portfolio-refresh/ANALYTICS_SETUP.md](docs/portfolio-refresh/ANALYTICS_SETUP.md). The snippets stay disabled until real IDs are provided.
