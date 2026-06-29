# Codex Workflow Guide for Portfolio Refresh

## Purpose

Use this guide whenever Codex works on the portfolio refresh.

Codex should act as the implementation assistant, not the strategy owner. Strategic decisions should come from the portfolio-refresh source files and user-approved plans.

## Required Reading Order

Before making changes, read:

1. `docs/portfolio-refresh/SOURCES.md`
2. `docs/portfolio-refresh/ROADMAP.md`
3. `docs/portfolio-refresh/SOURCE_PROFILE.md`
4. `docs/portfolio-refresh/SOURCE_EXPERIENCE.md`
5. `docs/portfolio-refresh/SOURCE_PROJECTS.md`
6. `docs/portfolio-refresh/CONTENT_IMPLEMENTATION_NOTES.md`
7. `docs/portfolio-refresh/PROJECT_TEMPLATE.md`
8. `docs/portfolio-refresh/UI_UX_DIRECTION.md`

## Branch Rule

Work only on:

```text
portfolio-refresh-plan
```

Do not push or merge directly to `main` unless explicitly instructed and reviewed.

## Positioning Rule

Position Fauzan as a Data & Business Analytics professional with operations experience, dashboard/reporting capability, business insight focus, ERP process understanding, and AI-assisted workflow exposure.

Do not over-position him as:

- Pure software developer
- Full-stack engineer
- Senior data scientist
- ERP consultant only
- AI expert without business grounding

## Content Rules

Use recruiter-friendly language.

Emphasize:

- data analysis
- business insights
- dashboards
- reporting workflows
- operations analysis
- ERP process understanding
- automation
- AI-assisted workflows
- practical business problem solving

Avoid:

- unsupported impact claims
- exaggerated technical seniority
- confidential company details
- private raw notes
- internal business records
- real internal-party names
- secrets or private links

## Project Rules

Each major project should follow `PROJECT_TEMPLATE.md`.

Each project card should include:

- one-line value summary
- relevant tags
- 2-3 proof bullets
- safe links

Each project detail page should include:

- overview
- problem
- role
- tools
- workflow
- key features
- business or analytical value
- what it demonstrates
- relevant roles
- screenshots/demo if public-safe
- confidentiality note

## UI/UX Rules

Improve clarity before decoration.

The design should be:

- modern
- clean
- professional
- responsive
- easy to scan
- card-based where appropriate
- suitable for recruiters

Do not add unnecessary frameworks or complex dependencies unless approved.

## Recommended Work Pattern

For each task:

1. Read the relevant source files.
2. Summarize intended changes.
3. Make focused edits.
4. Avoid unrelated refactors.
5. Run local checks if available.
6. Provide a concise change summary.
7. List files changed.
8. Mention any risks or follow-up items.

## Definition of Done

A task is done only when:

- changes match the roadmap
- content follows the updated positioning
- project structure is consistent
- UI remains responsive
- links are not broken
- no confidential information is exposed
- changes are easy to review

## First Implementation Task Recommendation

After Phase 0 planning files are updated, the next Codex task should be Phase 1: audit the current portfolio against the source files and produce a gap report.

Do not begin a full redesign until the audit has been reviewed.
