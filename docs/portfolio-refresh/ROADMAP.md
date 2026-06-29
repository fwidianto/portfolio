# Portfolio Web App Refresh Roadmap

Repository: `fwidianto/portofolio`  
Working branch: `portfolio-refresh-plan`  
Target branch: `main`

## Core Rule

Do not push or merge to `main` until the portfolio refresh is complete, reviewed, and approved.

All planning, development, commits, and testing for this refresh should happen on:

```text
portfolio-refresh-plan
```

## Project Sources

Read `docs/portfolio-refresh/SOURCES.md` first before making portfolio content, structure, UI, or implementation changes.

Official source files for this refresh:

1. `docs/portfolio-refresh/SOURCES.md` — source index and reading order.
2. `docs/portfolio-refresh/ROADMAP.md` — project direction, phases, and acceptance criteria.
3. `docs/portfolio-refresh/SOURCE_PROFILE.md` — professional profile and public-safe positioning copy.
4. `docs/portfolio-refresh/SOURCE_EXPERIENCE.md` — career narrative, education, and timeline source.
5. `docs/portfolio-refresh/SOURCE_PROJECTS.md` — project inventory and public-safe project content.
6. `docs/portfolio-refresh/CONTENT_IMPLEMENTATION_NOTES.md` — implementation guidance and Codex prompt seed.
7. `docs/portfolio-refresh/PROJECT_TEMPLATE.md` — standard project documentation structure.
8. `docs/portfolio-refresh/UI_UX_DIRECTION.md` — modern UI/UX direction and acceptance criteria.
9. `docs/portfolio-refresh/CODEX_WORKFLOW.md` — safe Codex workflow and implementation rules.

These files were distilled from `fwidianto/personal-OS`, PersonalOS canonical knowledge-base files, ChatGPT memory, and the existing portfolio roadmap. They should be treated as the working source layer for this public portfolio refresh.

Do not publish private PersonalOS raw notes, job application details, internal ERP records, sensitive company data, credentials, tokens, private URLs, or customer/supplier/employee names from internal systems.

## Portfolio Objective

Improve the portfolio web application so recruiters and collaborators can quickly understand Fauzan Widianto as a data and business analytics-oriented professional with operations experience, business insight capability, dashboard/reporting background, and AI-assisted workflow exposure.

The portfolio should show what he can do through clear project documentation, modern UI/UX, public-safe proof of work, and honest positioning.

## Portfolio Positioning

The portfolio should position Fauzan as:

> A Data & Business Analytics professional with operations experience, business insight focus, dashboard/reporting capability, ERP process understanding, and AI-assisted workflow exposure.

The portfolio should emphasize:

- Data analysis and business insights
- Dashboard and reporting workflows
- Operations and business process understanding
- ERP/reporting experience from Odoo, SAP, and related operational systems
- Profitability, cost, procurement, inventory, sales, and service-process analysis
- Automation and workflow improvement
- AI-assisted workflows using tools such as ChatGPT, Codex, and OpenHands
- Practical business problem solving

The portfolio should not over-position him as:

- Pure software developer
- Full-stack engineer
- Senior data scientist
- ERP consultant only
- AI expert without business grounding

## Target Roles

The portfolio should support applications for analyst-related roles such as:

- Data Analyst
- Business Analyst
- BI Analyst
- Operations Analyst
- Business Operations Analyst
- Commercial Analyst
- Strategy Analyst
- Digital Transformation Analyst
- Automation Analyst
- AI workflow / analytics-adjacent roles

## Phase 0 - Planning Alignment

### Goal

Update the planning layer so future portfolio work stays consistent and does not drift.

### Tasks

- Update positioning from a narrow business systems/operations analytics identity to broader data/business analytics positioning.
- Add `PROJECT_TEMPLATE.md` for standardized project documentation.
- Add `UI_UX_DIRECTION.md` for modern visual and UX guidance.
- Add `CODEX_WORKFLOW.md` for safe Codex implementation rules.
- Update `SOURCES.md` so new guidance files are included in the reading order.
- Preserve confidentiality rules.

### Acceptance Criteria

- Roadmap reflects the updated positioning.
- Project template exists.
- UI/UX direction exists.
- Codex workflow guide exists.
- Source index references all guidance files.
- No website UI/code changes are made in this phase.

## Phase 1 - Current Portfolio Audit

### Goal

Understand the current state before making major implementation changes.

### Tasks

- Review current homepage.
- Review project cards and project sections.
- Review project pages if they exist.
- Review README.
- Review CV, GitHub, LinkedIn, demo, and contact links.
- Identify outdated, inaccurate, weak, incomplete, or risky content.
- Identify UI/UX issues on desktop and mobile.
- Produce a gap report grouped by content, UI/UX, project documentation, links, and confidentiality.

### Acceptance Criteria

- There is a clear list of what needs fixing.
- No large implementation changes are made yet.
- Gaps are grouped by priority.
- Confidentiality risks are flagged.

## Phase 2 - Project Structure and Detail Pages

### Goal

Make all major projects follow a consistent structure and clearly prove job-relevant capabilities.

### Priority Projects

1. Odoo ERP Analytics Platform
2. AI ERP Intelligence Dashboard
3. Business Reporting Automation
4. PersonalOS / AI Handoff Workflow
5. HS Code Trade Compliance Automation
6. Investment Analytics Dashboard
7. MCU Vault
8. Other experimental projects only if public-safe and useful

### Tasks

- Apply `PROJECT_TEMPLATE.md` to priority projects.
- Rewrite project cards using problem, tools, and value.
- Add or improve project detail pages.
- Make project descriptions recruiter-friendly.
- Separate completed projects from planned or experimental projects.
- Use public-safe screenshots, mock data, sample data, or generalized descriptions only.

### Acceptance Criteria

- Each major project explains problem, role, tools, approach, features, value, and relevant roles.
- Project cards are scannable.
- Project pages support analyst, BI, operations, automation, and AI workflow positioning.
- No confidential data or private PersonalOS content is published.

## Phase 3 - Homepage Content Refresh

### Goal

Make the homepage explain Fauzan clearly within 30 seconds.

### Recommended Sections

1. Hero
2. Capability Snapshot
3. Featured Projects
4. Selected Experience
5. Tools & Skills
6. About / Working Style
7. Contact CTA

### Tasks

- Rewrite hero section with updated positioning.
- Add clear capability areas.
- Improve featured project previews.
- Add concise experience story.
- Improve CTA buttons.
- Ensure the homepage links to CV, GitHub, LinkedIn, and contact.

### Acceptance Criteria

- A recruiter can understand the profile within 30 seconds.
- Homepage supports analyst-related roles.
- Wording is honest, confident, and not overclaimed.
- Homepage aligns with project detail pages and README.

## Phase 4 - Modern UI/UX Refresh

### Goal

Make the portfolio look modern, clean, professional, and easy to scan.

### Design Direction

- Modern analytics portfolio
- Clean card-based layout
- Strong typography
- Good spacing
- Responsive mobile-first design
- Professional accent color
- Easy navigation
- Dashboard-inspired but not overly technical
- Lightweight and maintainable implementation

### Tasks

- Improve layout hierarchy.
- Improve project cards.
- Improve mobile layout.
- Improve typography and spacing.
- Improve buttons and navigation.
- Ensure project detail pages are readable.
- Avoid unnecessary heavy frameworks unless approved.

### Acceptance Criteria

- Site looks professional on desktop and mobile.
- Project cards are easy to scan.
- UI feels modern but not overdesigned.
- No unnecessary dependency or framework is added.

## Phase 5 - Links, CV, SEO, and Tracking Preparation

### Goal

Prepare the portfolio for job hunting and public sharing.

### Tasks

- Check CV download link.
- Check GitHub links.
- Check LinkedIn link.
- Check project demo links.
- Add or improve SEO metadata.
- Add Open Graph preview metadata.
- Add analytics placeholders if needed.
- Document where to insert GA4, Microsoft Clarity, Search Console, or Bing Webmaster IDs.
- Do not add real tracking IDs unless provided by the user.

### Acceptance Criteria

- Links work.
- CV is downloadable.
- Metadata is clean.
- Tracking placeholders do not contain real private IDs unless provided.
- Site is ready to share with recruiters.

## Phase 6 - Final Review Before Merge

### Goal

Review everything before merging to `main`.

### Tasks

- Review full git diff against `main`.
- Check homepage.
- Check project pages.
- Check README.
- Check mobile layout.
- Check links.
- Check public-safe wording.
- Check for credentials, tokens, private URLs, and confidential information.
- Run local preview.
- Prepare PR from `portfolio-refresh-plan` to `main`.

### Acceptance Criteria

- Content is accurate.
- UI is polished enough.
- No confidential data is exposed.
- Site works locally.
- User approves before merge.

## Phase 7 - Merge and Live Verification

### Goal

Safely publish the refreshed portfolio.

### Tasks

- Merge only after approval.
- Confirm GitHub Pages deployment.
- Open live site.
- Check homepage.
- Check project pages.
- Check CV download.
- Check links.
- Check mobile view.
- Confirm analytics/search setup if configured.

### Acceptance Criteria

- Live portfolio works.
- No broken links.
- No obvious layout issues.
- Portfolio is ready for job hunting.

## Prompt Rule for Future Codex Work

Future Codex prompts should reference this file as the source of truth:

```text
Read `docs/portfolio-refresh/SOURCES.md` first.
Use the linked portfolio refresh source files as the project source of truth.
Continue only on the current phase.
Stay on branch `portfolio-refresh-plan`.
Do not switch to `main`.
Do not push to `main`.
Do not merge.
Commit and push only to `portfolio-refresh-plan` unless explicitly instructed otherwise.
Do not publish private PersonalOS content, internal ERP data, credentials, tokens, private URLs, job application details, or confidential company information.
```
