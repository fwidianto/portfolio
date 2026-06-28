# Phase 2 Execution Plan

Date: 2026-06-28  
Base branch: `portfolio-refresh-plan`  
Do not merge to `main` without review.

## Purpose

This file converts the Phase 1 audit into an actionable Phase 2 plan.

Phase 2 should improve project structure and public-facing proof of work without introducing a broad redesign or exposing private material.

## Audit Review Decision

The Phase 1 audit is accepted as directionally useful.

The valid audit findings are:

1. Public URLs and metadata need alignment.
2. Project inventory should be clearer.
3. Project cards and pages need stronger outcome-oriented wording.
4. The homepage should make the top proof points easier to scan.
5. AI ERP and ERP-related materials should keep public-safe boundaries explicit.
6. Legacy/supporting project folders should be labeled more clearly.
7. Mobile readability and dropdown behavior need a later visual pass.

One audit finding is considered resolved or stale:

- The audit says several refresh guidance files are missing. The current branch now contains those files, including `PROJECT_TEMPLATE.md`, `UI_UX_DIRECTION.md`, and `CODEX_WORKFLOW.md`.

## Phase 2 Scope

Phase 2 should focus on content and structure, not a full visual redesign.

Allowed changes:

- Improve project cards.
- Add or refine project detail pages.
- Add a project inventory table or section.
- Improve README public pitch.
- Align public URLs and canonical references.
- Strengthen outcome-oriented wording where public-safe.
- Add public-safety notes where needed.
- Clarify which folders are portfolio pages, demos, or supporting artifacts.

Avoid for now:

- Major CSS redesign.
- Heavy framework changes.
- New analytics/tracking scripts with real IDs.
- Publishing private notes or internal data.
- Over-positioning Fauzan as a pure software developer, senior data scientist, or full-stack engineer.

## Priority Fixes Accepted From Audit

### P0 - URL and Source Alignment

- Review homepage metadata and README live-site references.
- Confirm whether the canonical portfolio URL is the root URL or `/portofolio/` path.
- Do not assume root deployment unless verified.

### P1 - Project Inventory

Add a compact public project inventory that maps each featured project to:

- project name
- project page or repo/demo link
- purpose
- primary capability demonstrated
- public-safety boundary

### P1 - Project Card and Page Structure

Use `PROJECT_TEMPLATE.md` to standardize major projects.

Priority projects:

1. Odoo ERP Analytics Platform
2. AI ERP Intelligence Dashboard
3. Business Reporting Automation
4. PersonalOS / AI Handoff Workflow
5. HS Code Trade Compliance Automation
6. Investment Analytics Dashboard
7. MCU Vault, if useful and public-safe

### P1 - Outcome-Oriented Wording

Improve public wording to answer:

- What problem was solved?
- What data/workflow was involved?
- What analytical or business value was created?
- What capability does this prove for analyst-related roles?

Use careful language if exact numbers or internal data cannot be public.

### P2 - Public Safety Boundaries

Keep explicit boundaries on:

- ERP analytics project
- AI ERP dashboard project
- PersonalOS / AI Handoff project

Use generalized wording, sanitized data, or sample-data references.

### P2 - Supporting Artifact Clarity

Clarify which folders or pages are:

- recruiter-facing portfolio pages
- live demos
- supporting artifacts
- legacy or experimental materials

## Branch Sync Note

`portfolio-refresh-plan` has diverged from `main`.

Before implementation, Codex should update the local branch carefully:

```bash
git fetch origin
git checkout portfolio-refresh-plan
git status
git merge origin/main
```

If conflicts appear, stop and report them instead of guessing.

Do not overwrite `docs/portfolio-refresh/` guidance files.

## Recommended Codex Settings

Model: GPT-5.5 or best available Codex-capable model  
Reasoning: High  
Estimated usage: Medium to Heavy  
Why: Phase 2 involves public-facing content judgment, project structure, link consistency, and confidentiality boundaries. It is more judgment-heavy than the Phase 1 audit.

## Codex Prompt for Phase 2

```text
Recommended Codex Settings
Model: GPT-5.5 or best available Codex-capable model
Reasoning: High
Estimated usage: Medium to Heavy
Why: This task requires content judgment, project structure consistency, link review, and careful public-safety handling.

Read `docs/portfolio-refresh/SOURCES.md` first.
Then read:
1. `docs/portfolio-refresh/ROADMAP.md`
2. `docs/portfolio-refresh/AUDIT_REPORT.md`
3. `docs/portfolio-refresh/PHASE2_EXECUTION_PLAN.md`
4. `docs/portfolio-refresh/PROJECT_TEMPLATE.md`
5. `docs/portfolio-refresh/UI_UX_DIRECTION.md`
6. `docs/portfolio-refresh/CODEX_WORKFLOW.md`
7. `docs/portfolio-refresh/SOURCE_PROFILE.md`
8. `docs/portfolio-refresh/SOURCE_EXPERIENCE.md`
9. `docs/portfolio-refresh/SOURCE_PROJECTS.md`
10. `docs/portfolio-refresh/CONTENT_IMPLEMENTATION_NOTES.md`

Stay on branch `portfolio-refresh-plan`.
Do not switch to `main`.
Do not merge to `main`.
Do not make a major visual redesign yet.

Before editing, run:
- `git fetch origin`
- `git checkout portfolio-refresh-plan`
- `git status`
- `git merge origin/main`

If the merge creates conflicts, stop and report the conflict files instead of guessing.
If there are no conflicts, continue.

Task:
Implement Phase 2: Project Structure and Detail Pages.

Scope:
1. Align homepage, README, metadata, and live-site references around the correct public portfolio URL.
2. Add a compact public project inventory table or section.
3. Improve project cards using problem, tools, and value.
4. Standardize major project pages using `PROJECT_TEMPLATE.md`.
5. Add clearer public-safety notes for ERP, AI ERP, and PersonalOS-related pages.
6. Clarify which folders/pages are recruiter-facing portfolio pages, demos, supporting artifacts, or experimental materials.
7. Keep wording focused on Data & Business Analytics, business insights, dashboards/reporting, operations/process understanding, automation, and AI-assisted workflow exposure.

Do not:
- publish private PersonalOS raw notes
- expose internal ERP records or sensitive company details
- add real analytics/tracking IDs
- over-position Fauzan as a pure software developer, senior data scientist, full-stack engineer, ERP consultant only, or AI expert
- perform major CSS redesign in this task

After changes, summarize:
- files changed
- what was improved
- project pages updated
- links or URLs changed
- public-safety checks performed
- any remaining risks or follow-up items
```

## Acceptance Criteria

Phase 2 is complete when:

- Project inventory exists or the project section clearly functions as one.
- Major projects use consistent structure.
- Project cards are easier to scan.
- Project pages explain problem, role, tools, approach, value, and public boundaries.
- Homepage/README/metadata do not confuse the live portfolio URL.
- No private or confidential content is exposed.
- Changes remain easy to review.
