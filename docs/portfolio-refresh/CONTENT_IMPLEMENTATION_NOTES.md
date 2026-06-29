# Portfolio Refresh: Content Implementation Notes

## Purpose

This file translates the PersonalOS source material into practical guidance for improving the portfolio web application.

Use alongside:

- `docs/portfolio-refresh/ROADMAP.md`
- `docs/portfolio-refresh/SOURCE_PROFILE.md`
- `docs/portfolio-refresh/SOURCE_EXPERIENCE.md`
- `docs/portfolio-refresh/SOURCE_PROJECTS.md`

---

## Main Portfolio Objective

Improve the portfolio so recruiters and collaborators can quickly understand Fauzan as a business operations, analytics, ERP systems, automation, and AI-assisted workflow professional.

The portfolio should make the answer clear within 30 seconds:

> Fauzan understands business operations and uses data, ERP systems, dashboards, automation, and AI-assisted tools to improve visibility and decision making.

---

## Homepage Structure Recommendation

### 1. Hero Section

Goal: immediate positioning.

Recommended elements:

- Title: `Business Systems & Operations Analytics`
- Subtitle: practical analytics and automation for ERP, operations, dashboards, and decision support
- CTA buttons:
  - View Projects
  - Download CV
  - Contact / LinkedIn

Avoid making the hero too technical. The first impression should be business + analytics + systems.

---

### 2. Proof of Work / Featured Projects

Goal: quickly show credibility through projects.

Recommended order:

1. Odoo ERP Analytics Platform
2. AI ERP Intelligence Dashboard
3. Business Reporting Automation
4. PersonalOS / AI Handoff Workflow
5. MCU Vault or HS Code Automation
6. Investment Analytics Dashboard

Each card should show:

- problem
- tools
- business value
- link to project detail page or GitHub/live demo

---

### 3. Skills / Capability Areas

Group skills by business meaning, not only by tools.

Recommended grouping:

#### Business & Operations

- Cost control
- Profitability analysis
- Business process improvement
- Procurement and inventory analysis
- Operational performance monitoring

#### Analytics & BI

- SQL
- Dashboard design
- KPI development
- Data validation
- Reporting automation
- Looker Studio

#### ERP & Business Systems

- Odoo 16
- SAP ECC6
- ERP migration support
- Business process mapping
- Data governance

#### Automation & AI-Assisted Workflows

- Python
- VBA
- Google Apps Script
- UiPath
- ChatGPT
- Codex
- AI-assisted development

---

### 4. Experience Timeline

Goal: show career progression without overwhelming visitors.

Recommended simplified timeline:

1. Mechanical Engineering foundation — Universitas Indonesia
2. Cost control and business analysis — PT Traktor Nusantara
3. Service profitability and pricing — PT Traktor Nusantara
4. Manufacturing business operations — PT Cibuni Teknik Sejahtera
5. Operations leadership support, ERP ownership, and analytics — current role

Use short bullets and link to CV for detail.

---

### 5. About Section

Goal: explain the unusual but valuable bridge identity.

Suggested angle:

- Started from engineering and operations
- Built foundation in cost control, profitability, and business reporting
- Expanded into ERP systems, dashboards, automation, and AI-assisted tools
- Now focused on business systems and operations analytics

---

## Project Page Template

Each project detail page should use this structure:

```markdown
# Project Name

## Summary
Short 2-3 sentence explanation.

## Problem
What problem existed?

## Role
What was Fauzan's role?

## Tools
What tools were used?

## Workflow / Architecture
How did the solution work?

## Key Features
What can it do?

## Business Value
Why does it matter?

## Screenshots / Demo
Use sanitized screenshots only.

## Limitations / Confidentiality
What cannot be shown publicly?
```

---

## Public Writing Rules

### Do

- Use practical, business-oriented language.
- Emphasize visibility, decision support, process improvement, and analytics.
- Be honest about AI-assisted development.
- Show projects as evidence of learning and execution.
- Mention confidentiality boundaries when needed.
- Use sanitized or sample data for public demos.

### Do Not

- Over-position as a pure software engineer.
- Over-position as a senior data scientist.
- Publish internal ERP data, screenshots, customer names, supplier names, or sensitive financial data.
- Include private PersonalOS content.
- Make unsupported claims about business impact.
- Present planned projects as completed.

---

## Recommended Portfolio Navigation

Simple navigation is enough:

- Home
- Projects
- Experience
- CV
- Contact

If the site becomes larger later, add:

- Writing / Notes
- Case Studies
- CareerOS / PersonalOS Concept

For now, avoid overbuilding.

---

## Recruiter Reading Experience

Recruiters should not need to understand every technical detail.

The site should answer:

1. What kind of professional is he?
2. What problems can he solve?
3. What projects prove it?
4. What tools can he use?
5. Is he suitable for analyst, BI, operations analytics, or business systems roles?

---

## Strongest Portfolio Message

The strongest portfolio message is not "I can code."

The strongest message is:

> I understand operational business problems and can turn them into structured analytics, dashboards, automation workflows, and decision-support systems using modern tools and AI-assisted development.

---

## Suggested Next Implementation Tasks

1. Update homepage hero copy using `SOURCE_PROFILE.md`.
2. Update project cards using `SOURCE_PROJECTS.md`.
3. Improve experience timeline using `SOURCE_EXPERIENCE.md`.
4. Create or revise Odoo ERP Analytics project detail page.
5. Create public-safe PersonalOS / AI Handoff project page.
6. Review all public pages for overstatement and confidentiality risk.
7. Test locally before PR.

---

## Codex Prompt Seed

Use this prompt when handing the next phase to Codex:

```text
You are working on the `fwidianto/portofolio` repository on branch `portfolio-refresh-plan`.

Use these files as source of truth:
- docs/portfolio-refresh/ROADMAP.md
- docs/portfolio-refresh/SOURCE_PROFILE.md
- docs/portfolio-refresh/SOURCE_EXPERIENCE.md
- docs/portfolio-refresh/SOURCE_PROJECTS.md
- docs/portfolio-refresh/CONTENT_IMPLEMENTATION_NOTES.md

Goal: improve the public portfolio content and structure without over-positioning Fauzan as a pure software developer and without exposing private or confidential information.

Focus first on homepage copy, project cards, and experience timeline. Keep the site static, lightweight, and GitHub Pages friendly. Do not merge to main. Do not publish private PersonalOS content.
```
